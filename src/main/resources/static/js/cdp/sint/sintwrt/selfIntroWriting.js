document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('.btn-temp-save').addEventListener('click', function() {
		document.getElementById('siStatus').value = '작성중';
		const form = document.querySelector('.selfintro-write-form');
		form.submit();
	});

	document.querySelector(".btn--danger")?.addEventListener("click", () => {
		const form = document.querySelector('.selfintro-write-form');
		showConfirm("정말 삭제하시겠습니까?", "",
			() => {
				form.action = "/cdp/sint/sintwrt/delete.do";
				form.submit();
			},
			() => {

			}
		);
	});

	/*--미리보기*/
	document.querySelector(".btn-preview").addEventListener("click", () => {
		// 1. form 요소 클론
		const originalForm = document.querySelector("form");
		const clonedForm = originalForm.cloneNode(true); // 깊은 복사

		const originalInputs = originalForm.querySelectorAll("input, textarea");
		const clonedInputs = clonedForm.querySelectorAll("input, textarea");

		clonedInputs.forEach((clonedEl, i) => {
			const originalEl = originalInputs[i];
			if (clonedEl.tagName === "TEXTAREA") {
				clonedEl.innerHTML = originalEl.value; // textarea는 innerHTML에 입력된 내용 반영
				clonedEl.textContent = originalEl.value; // 추가: textContent도 설정
			} else if (clonedEl.type === "checkbox" || clonedEl.type === "radio") {
				clonedEl.checked = originalEl.checked;
			} else {
				clonedEl.setAttribute("value", originalEl.value);
			}
		});

		// 제목 처리
		const titleSection = clonedForm.querySelector(".form-section");
		if (titleSection) {
			const titleInput = titleSection.querySelector('input[name="siTitle"]');
			if (titleInput && titleInput.value.trim()) {
				// 제목을 표시용 div로 변경
				const titleDiv = document.createElement('div');
				titleDiv.className = 'preview-title';
				titleDiv.textContent = titleInput.value;
				titleSection.innerHTML = '';
				titleSection.appendChild(titleDiv);
			} else {
				titleSection.remove();
			}
		}

		// section-title 처리 (기존 코드와 호환)
		const title = clonedForm.querySelector(".section-title");
		if (title) {
			title.remove();
		}

		// 질문 번호 제거
		clonedForm.querySelectorAll(".qa-card__number")?.forEach(e => e.remove());

		// 2. 버튼 그룹 제거
		const btnGroup = clonedForm.querySelector(".btn-group");
		if (btnGroup) {
			btnGroup.remove();
		}

		// form-actions 제거 (새 버튼 구조)
		const formActions = clonedForm.querySelector(".form-actions");
		if (formActions) {
			formActions.remove();
		}

		//글자수 제거
		clonedForm.querySelectorAll(".char-count")?.forEach(e => e.remove());
		clonedForm.querySelectorAll(".char-counter")?.forEach(e => e.remove());

		const xhtmlContent = sanitizeHtmlToXHTML(clonedForm.outerHTML);
		// 3. 스타일 가져오기 (예: /css/cdp/sint/sintwrt/selfIntroWriting.css)
		fetch("/css/cdp/sint/sintwrt/selfIntroWriting.css")
			.then(res => res.text())
			.then(cssContent => {
				// 4. FormData 구성
				const formData = new FormData();
				formData.append("htmlContent", xhtmlContent);  // HTML
				formData.append("cssContent", cssContent);              // CSS

				// 5. 미리보기 요청
				return fetch("/pdf/preview", {
					method: "POST",
					body: formData
				});
			})
			.then(response => {
				if (!response.ok) throw new Error("미리보기 요청 실패");
				return response.blob();
			})
			.then(blob => {
				const url = URL.createObjectURL(blob);
				const pdfUrlWithZoom = url + "#zoom=75";

				const windowWidth = 900;
				const windowHeight = 700;
				const left = (screen.width - windowWidth) / 2;
				const top = (screen.height - windowHeight) / 2;
				const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=no,location=no,status=no`;

				const previewWindow = window.open(pdfUrlWithZoom, "pdfPreview", windowFeatures);
				if (!previewWindow) window.open(pdfUrlWithZoom, "_blank");
			})
			.catch(err => {
				console.error("미리보기 오류:", err);
				showConfirm2("PDF 미리보기 중 오류가 발생했습니다.","",
					() => {
						return;
					}
				);
			});
	});

	//자동완성 기능 추가
	const autoCompleteBtn = document.getElementById('autoCompleteBtn');
	if (autoCompleteBtn) {
		autoCompleteBtn.addEventListener('click', autoCompleteHandler);
	}

});

function sanitizeHtmlToXHTML(html) {
	return html
		.replace(/<input([^>]*?)(?<!\/)>/gi, '<input$1 />')
		.replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />')
		.replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />')
		.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');
}

function countChars(textarea, index) {
	const length = textarea.value.length;
	const counter = document.getElementById("charCount-" + index);
	if (counter) {
		counter.textContent = length;
	}
}

function autoCompleteHandler() {

	//제목 입력 필드 찾기
	const titleInput = document.querySelector('input[name="siTitle"]');

	//제목이 비어 있을 경우에만 자동 완성
	if (titleInput && titleInput.value.trim() == '') {
		titleInput.value = '나의 자기소개서';
	}

	//이미지에 보이는 5개 질문에 대한 샘플 답변을 객체로 정의합니다
	const sampleAnswersArray = [
		`저의 성장 과정에서 가장 큰 영향을 준 경험은 대학교 3학년 때 참여했던 '건축 설계 공모전'입니다. 당시 팀 프로젝트의 리더를 맡았지만, 팀원 간의 의견 충돌로 인해 프로젝트 진행에 어려움을 겪었습니다. 저는 문제를 해결하기 위해 모든 팀원의 의견을 경청하고, 각자의 강점을 살릴 수 있는 역할을 분담했습니다. 그 결과, 팀워크를 회복하고 우수한 성적으로 공모전에서 입상할 수 있었습니다. 이 경험을 통해 저는 소통의 중요성과 리더십을 배웠고, 어떤 어려움이 닥쳐도 협력을 통해 극복할 수 있다는 자신감을 얻었습니다.`,

		`저의 가장 큰 강점은 **책임감과 끈기**입니다. 한번 시작한 일은 끝까지 완수하는 책임감으로 프로젝트를 성공적으로 이끌어왔습니다. 반면, 약점은 새로운 환경에 적응하는 데 시간이 다소 걸리는 점입니다. 이러한 약점을 극복하기 위해, 새로운 팀이나 프로젝트에 투입될 때마다 적극적으로 먼저 다가가 동료들에게 질문하고 의견을 나누며 빠르게 적응하려 노력했습니다. 그 결과, 최근 참여한 팀 프로젝트에서는 초기 적응 기간을 크게 단축하고 능동적으로 참여할 수 있었습니다.`,

		`귀사에 지원한 동기는 '건설 현장의 스마트화'라는 귀사의 비전에 깊이 공감했기 때문입니다. 저는 대학교에서 AI와 데이터 분석을 전공하며 건설 기술에 접목하는 연구를 진행했습니다. 이러한 경험을 바탕으로, 저는 귀사의 스마트 건설 시스템 개발에 기여할 수 있다고 확신합니다. 특히, 데이터 기반의 현장 안전 관리 시스템을 구축하여 작업 효율을 높이고 안전사고를 예방하는 데 제 전문 지식을 활용하겠습니다.`,

		`건설 현장의 안전을 위해 가장 중요하게 생각하는 요소는 **'사전 예방 문화'**라고 생각합니다. 이는 단순히 규정을 준수하는 것을 넘어, 모든 작업자가 잠재적 위험을 미리 인지하고 스스로 안전을 실천하는 문화를 의미합니다. 저는 이러한 문화를 조성하기 위해, AI 기반의 위험 예측 시스템을 도입하여 위험 요소를 실시간으로 분석하고 작업자에게 경고하는 시스템을 개발하고 싶습니다. 이를 통해 안전 수칙이 습관처럼 자리 잡는 현장을 만드는 데 기여하고 싶습니다.`,

		`가장 도전적이었던 프로젝트는 '노후 건물 리모델링 공사'였습니다. 예산과 기간이 매우 한정적이었고, 예상치 못한 문제들이 연이어 발생했습니다. 저는 팀원들과 함께 매일 진행 상황을 공유하고, 주간 회의를 통해 문제 해결을 위한 아이디어를 모았습니다. 특히, 3D 모델링 프로그램을 활용해 시뮬레이션을 진행하여 공정의 비효율적인 부분을 찾아내고 수정함으로써, 최종적으로 프로젝트를 성공적으로 완료했습니다. 이 경험은 저에게 문제 해결 능력과 팀워크의 가치를 가르쳐주었습니다.`
	];


	// 모든 질문 블록을 찾습니다.
	const qaBlocks = document.querySelectorAll('.qa-card');

	// 각 블록에 순서대로 답변을 할당합니다.
	qaBlocks.forEach((block, index) => {
		const answerTextarea = block.querySelector('textarea[name="sicContentList"]');

		// 배열의 인덱스를 사용해 순서대로 답변을 할당합니다.
		if (answerTextarea && sampleAnswersArray[index]) {
			answerTextarea.value = sampleAnswersArray[index];

			// 글자 수 카운트 함수를 호출하여 업데이트합니다.
			countChars(answerTextarea, index);
		}
	});
}

// 초기 렌더링 시 기존 값에 대한 글자 수 세기
window.addEventListener("DOMContentLoaded", () => {
	const textareas = document.querySelectorAll("textarea[name='sicContentList']");
	textareas.forEach((ta, i) => {
		countChars(ta, i);
	});
});