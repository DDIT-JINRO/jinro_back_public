// /js/cdp/imtintrvw/intrvwqestnmn/interviewQuestionWriting.js

function countChars(textarea, index) {
	const length = textarea.value.length;
	const counter = document.getElementById("charCount-" + index);
	if (counter) {
		counter.textContent = length;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	const mainForm = document.querySelector('.selfintro-write-form');
	if (!mainForm) return;

	// 1. 임시저장 버튼 이벤트
	const btnTempSave = mainForm.querySelector('.btn-temp-save');
	if (btnTempSave) {
		btnTempSave.addEventListener('click', function() {
			document.getElementById('idlStatus').value = '작성중';
			mainForm.submit();
		});
	}

	// 2. 삭제 버튼 이벤트
	const btnDelete = mainForm.querySelector(".btn--danger");
	if (btnDelete) {
		btnDelete.addEventListener("click", () => {

			showConfirm("정말 삭제하시겠습니까?","",
				() => {
					mainForm.action = "/cdp/imtintrvw/intrvwqestnmn/delete.do";
					mainForm.submit();
				},
				() => {
					
				}
			);
		});
	}

	// 3. 미리보기 버튼 이벤트
	const btnPreview = mainForm.querySelector(".btn-preview");
	if (btnPreview) {
		btnPreview.addEventListener("click", () => {
			const clonedForm = mainForm.cloneNode(true);

			// 현재 입력된 값을 복제된 폼에 반영
			const originalInputs = mainForm.querySelectorAll("input, textarea");
			const clonedInputs = clonedForm.querySelectorAll("input, textarea");
			clonedInputs.forEach((clonedEl, i) => {
				const originalEl = originalInputs[i];
				if (clonedEl.tagName === "TEXTAREA") {
					clonedEl.innerHTML = originalEl.value;
				} else {
					clonedEl.setAttribute("value", originalEl.value);
				}
			});

			// 미리보기에 불필요한 요소 제거
			const titleSection = clonedForm.querySelector(".form-section");
			if (titleSection) {
				const titleInput = titleSection.querySelector('input[name="idlTitle"]');
				if (titleInput && titleInput.value.trim()) {
					const titleDiv = document.createElement('div');
					titleDiv.className = 'preview-title';
					titleDiv.textContent = titleInput.value;
					titleSection.innerHTML = '';
					titleSection.appendChild(titleDiv);
				} else {
					titleSection.remove();
				}
			}

			clonedForm.querySelector(".form-actions")?.remove();
			clonedForm.querySelectorAll(".char-counter")?.forEach(e => e.remove());
			clonedForm.querySelectorAll(".qa-card__number")?.forEach(e => e.remove());

			const xhtmlContent = sanitizeHtmlToXHTML(clonedForm.outerHTML);

			// 미리보기에 사용할 CSS 파일 경로를 정확히 지정
			fetch("/css/cdp/imtintrvw/intrvwqestnmn/interviewQuestionWriting.css")
				.then(res => res.text())
				.then(cssContent => {
					const formData = new FormData();
					formData.append("htmlContent", xhtmlContent);

					const previewCss = cssContent + `
						@media print {
							.preview-title {
								font-size: 18px !important; font-weight: 600 !important; margin-bottom: 20px !important;
								text-align: center !important; border-bottom: 2px solid #7881f5 !important;
							}
							.qa-card { page-break-inside: avoid; }
						}
					`;
					formData.append("cssContent", previewCss);

					return fetch("/pdf/preview", { method: "POST", body: formData });
				})
				.then(response => {
					if (!response.ok) throw new Error("미리보기 요청에 실패했습니다.");
					return response.blob();
				})
				.then(blob => {
					const url = URL.createObjectURL(blob);
					const windowFeatures = `width=900,height=700,left=${(screen.width - 900) / 2},top=${(screen.height - 700) / 2}`;
					window.open(url + "#zoom=75", "pdfPreview", windowFeatures);
				})
				.catch(err => {
					console.error("미리보기 오류:", err);
					showConfirm2("PDF 미리보기를 생성하는 중 오류가 발생했습니다.","",
						() => {
						}
					);
				});
		});
	}

	const textareas = mainForm.querySelectorAll("textarea[name='idAnswerList']");
	textareas.forEach((ta, i) => {
		countChars(ta, i);
	});

	//자동완성 버튼 이벤트 리스너 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if (autoCompleteBtn) {
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}
});

function autoCompleteHandler() {
	//제목 입력 필드 자동완성
	const titleInput = document.querySelector('input[name="idlTitle"]');
	if (titleInput && titleInput.value.trim() == '새 면접 질문' || titleInput.value.trim() == '') {
		titleInput.value = '나의 모의면접 질문 초안';
	}

	// 답변 입력 필드 자동완성
	const sampleAnswersArray = [
		`경비 및 청소 업무는 시설의 안전과 쾌적한 환경을 유지하는 데 필수적이라고 생각합니다. 따라서 저는 **'책임감과 세심함'**을 가장 중요하게 생각합니다. 맡은 구역에 대한 책임감을 가지고 작은 부분도 놓치지 않는 세심함으로 업무를 수행하겠습니다.`,
		`이전 직장에서 야간 순찰 중 정전이 발생한 적이 있습니다. 당황하지 않고 매뉴얼에 따라 비상 발전기를 가동하고, 입주민들에게 상황을 안내하며 혼란을 최소화했습니다. 이 경험을 통해 어떤 돌발 상황에서도 침착하게 대응하는 능력을 길렀습니다.`,
		`이전 건물에서 경비 업무를 할 때, 순찰 시간을 최적화하기 위해 CCTV 사각지대와 주요 동선을 분석하여 순찰 경로를 재조정했습니다. 그 결과, 순찰 시간을 20% 단축하면서도 보안 수준은 더욱 강화할 수 있었습니다. 이처럼 데이터를 활용하여 효율적인 업무 방식을 찾는 데 강점이 있습니다.`
	];

	const qaBlocks = document.querySelectorAll('.qa-card');
	qaBlocks.forEach((block, index) => {
		const answerTextarea = block.querySelector('textarea[name="idAnswerList"]');

		// 배열의 인덱스를 사용해 순서대로 답변을 할당합니다.
		if (answerTextarea && sampleAnswersArray[index]) {
			answerTextarea.value = sampleAnswersArray[index];

			// 글자 수 카운트 함수를 호출하여 업데이트합니다.
			countChars(answerTextarea, index);
		}
	});
}

function sanitizeHtmlToXHTML(html) {
	return html
		.replace(/<input([^>]*?)(?<!\/)>/gi, '<input$1 />')
		.replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />')
		.replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />')
		.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');
}