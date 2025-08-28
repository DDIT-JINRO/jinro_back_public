let aiFeedbackData = null;
document.addEventListener('DOMContentLoaded', () => {

	const resumeList = document.getElementById('resumeList');
	const requestAiFeedbackBtn = document.getElementById('requestAiFeedback');
	const bg = document.getElementById('modalBg');
	const modal = document.getElementById('confirmModal');
	const btnCancel = document.getElementById('btnCancel');
	const btnConfirm = document.getElementById('btnConfirm');

	let subscriptionInfo = null;
	let originalData = null;

	resumeList.addEventListener('change', loadResumeDetail);

	requestAiFeedbackBtn.addEventListener('click', () => {
		// 구독 정보 확인
		if (!subscriptionInfo || !subscriptionInfo.payId) {
			showConfirm2('유효한 구독 정보가 없습니다.', "AI 피드백을 사용하시려면 이용권을 구매해주세요.", () => {
				// 필요시 UI 처리
			});
			return;
		}

		// 이력서 선택 확인
		if (!originalData) {
			showConfirm2('먼저 피드백을 받을 이력서를 선택해주세요.', "", () => {
				// 필요시 UI 처리
			});
			return;
		}

		// 사용 횟수 확인
		if (subscriptionInfo.payResumeCnt <= 0) {
			showConfirm2('이력서 첨삭 횟수를 모두 사용했습니다.', "", () => {
				// 필요시 UI 처리
			});
			return;
		}

		// 모든 validation 통과 시에만 모달 표시
		document.getElementById('resume-count-display').textContent = subscriptionInfo.payResumeCnt;
		bg.style.display = 'block';
		modal.style.display = 'block';
		modal.focus();
	});

	btnConfirm.addEventListener('click', () => {
		closeModal();
		requestAiFeedback();
	});

	function closeModal() {
		modal.style.display = 'none';
		bg.style.display = 'none';
	}
	btnCancel.addEventListener('click', closeModal);
	bg.addEventListener('click', closeModal);
	window.addEventListener('keydown', (e) => { 
		if (e.key === 'Escape' && modal.style.display === 'block') closeModal(); 
	});

	const checkSubscription = () => {
		fetch('/cdp/aifdbck/rsm/checkSubscription.do')
			.then(response => {
				if (!response.ok) {
					throw new Error('구독 정보 확인 중 서버 오류 발생');
				}
				return response.json();
			})
			.then(data => {
				subscriptionInfo = data;
				if (!subscriptionInfo || !subscriptionInfo.payId) {
					showConfirm2('유효한 구독 정보가 없습니다.', "AI 피드백을 사용하시려면 이용권을 구매해주세요.", () => {
						// 필요시 UI 처리
					});
					
					resumeList.disabled = true;
					requestAiFeedbackBtn.disabled = true;
				}
			})
			.catch(error => {
				showConfirm2("구독 정보를 불러오는 중 오류가 발생했습니다.", "페이지를 새로고침해주세요.", () => {
					// 필요시 UI 처리
				});
				resumeList.disabled = true;
				requestAiFeedbackBtn.disabled = true;
			});
	}

	function cleanAiResponse(text) {
		let cleanedText = text.trim();
		if (cleanedText.startsWith('```json')) {
			cleanedText = cleanedText.substring('```json'.length);
		}

		if (cleanedText.endsWith('```')) {
			cleanedText = cleanedText.substring(0, cleanedText.length - '```'.length);
		}
		return cleanedText.trim();
	}

	function loadResumeDetail() {
		const selectedResumeId = resumeList.value;

		if (!selectedResumeId) {
			document.querySelector('.aifb-title').textContent = '이력서 제목';
			document.getElementById('questionsWrapper').innerHTML = '이력서의 내용이 출력될 공간입니다';
			document.getElementById('feedbackArea').innerHTML = 'AI의 피드백 내용이 출력될 공간입니다';
			return;
		}

		fetch(`/cdp/aifdbck/rsm/getResumeDetail.do?resumeId=${selectedResumeId}`)
			.then(response => {
				if (!response.ok) throw new Error('이력서 상세 정보 요청 실패');
				return response.json();
			})
			.then(data => {
				if (data) {
					data.resumeContent = data.resumeContent.replace(/\\+/g, '/');
					originalData = data;

					document.querySelector('.aifb-title').textContent = data.resumeTitle;

					const parser = new DOMParser();
					const doc = parser.parseFromString(data.resumeContent, 'text/html');

					const requiredInfo = doc.querySelector('.required-info');
					if (requiredInfo) {
						requiredInfo.remove();
					}

					document.getElementById('questionsWrapper').innerHTML = data.resumeContent;
					document.getElementById('feedbackArea').innerHTML = 'AI의 피드백 내용이 출력될 공간입니다';
				}
			})
			.catch(error => {
				console.error('이력서 불러오기 오류:', error);
				showConfirm2("이력서 데이터를 불러오는 데 실패했습니다.", "", () => {
					// 필요시 UI 처리
				});
				document.querySelector('.aifb-title').textContent = '오류 발생';
				document.getElementById('questionsWrapper').innerHTML = '데이터를 불러오는 데 실패했습니다.';
			});
	}

	function requestAiFeedback() {
		const feedbackArea = document.getElementById('feedbackArea');
		feedbackArea.innerHTML = `
		<div class="spinner-wrapper">
			<div class="spinner-border text-primary" role="status" style="display: block;">
			</div>
			<div class="text-center mt-2">AI가 피드백을 생성 중입니다...<br>잠시만 기다려주세요.</div>
		</div>
		`;

		fetch('/cdp/aifdbck/rsm/requestFeedback.do', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				"payId": subscriptionInfo.payId,
				"html": originalData.resumeContent
			})
		})
		.then(response => {
			if (!response.ok) throw new Error('AI 첨삭 요청 실패');
			return response.text();
		})
		.then(aiResponseText => {
			const cleanedText = cleanAiResponse(aiResponseText);

			const htmlFormatted = `
				<div class="feedback-section">
					${cleanedText
						.replace(/^##\s*이력서\s*항목별\s*피드백\s*$/gm, '')
						.replace(/^##\s*이력서\s*피드백\s*$/gm, '')
						.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
						.replace(/^\*\s?/gm, '')
						.replace(/<strong>(개선할 점|더 나은 표현 제안|누락 또는 과장된 부분):?<\/strong>/g, '<h3>$1</h3>')
						.replace(/<strong>([^<]+?):<\/strong>/g, '<strong>$1</strong>')
						.replace(/\n{2,}/g, '\n')
					}
				</div>
			`;

			aiFeedbackData = {
				sections_feedback: [cleanedText],
				questions: ["이력서 전체 피드백"]
			};

			feedbackArea.innerHTML = htmlFormatted;
			subscriptionInfo.payResumeCnt--;
			showConfirm2(`AI 피드백이 완료되었습니다. (남은 횟수: ${subscriptionInfo.payResumeCnt}회)`, "", () => {
				axios.post('/admin/las/aiResumeVisitLog.do');
			});
		})
		.catch(error => {
			console.error('AI 피드백 요청 오류:', error);
			feedbackArea.textContent = 'AI 피드백을 불러오는 데 실패했습니다.';
			showConfirm2("AI 피드백을 불러오는 데 실패했습니다.", "", () => {
				// 필요시 UI 처리
			});
		});
	}

	checkSubscription();
});

function requestProofread() {
	const selectedResumeId = document.getElementById('resumeList').value;
	
	if (!selectedResumeId) {
		showConfirm2('먼저 이력서를 선택해주세요.', "", () => {
			// 필요시 UI 처리
		});
		return;
	}

	window.location.href = `/cdp/rsm/rsm/resumeWriter.do?resumeId=${selectedResumeId}`;
}

const previewPdfBtn = document.getElementById("previewPdfBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

previewPdfBtn?.addEventListener("click", previewPdfFromAI);
downloadPdfBtn?.addEventListener("click", downloadPdfFromAI);

function previewPdfFromAI() {
	if (!aiFeedbackData || !aiFeedbackData.sections_feedback) {
		showConfirm2("AI 피드백 결과가 없습니다. 먼저 피드백을 요청하세요.", "", () => {
			// 필요시 UI 처리
		});
		return;
	}

	// validation 통과 시에만 실행
	const htmlContent = generateHtmlFromFeedback(aiFeedbackData);
	const cssContent = getFeedbackPdfCss();

	const formData = new FormData();
	formData.append("htmlContent", htmlContent);
	formData.append("cssContent", cssContent);

	fetch("/pdf/preview", {
		method: "POST",
		body: formData
	})
	.then(response => {
		if (!response.ok) throw new Error("미리보기 요청 실패");
		return response.blob();
	})
	.then(blob => {
		const url = window.URL.createObjectURL(blob);
		const pdfUrlWithZoom = url + "#zoom=75";
		const width = 900, height = 700;
		const left = (screen.width - width) / 2;
		const top = (screen.height - height) / 2;
		const windowFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`;
		const previewWindow = window.open(pdfUrlWithZoom, "pdfPreview", windowFeatures);
		if (!previewWindow) window.open(pdfUrlWithZoom, "_blank");
	})
	.catch(err => {
		console.error("PDF 미리보기 오류:", err);
		showConfirm2("PDF 미리보기 실패", "", () => {
			// 필요시 UI 처리
		});
	});
}

function downloadPdfFromAI() {
	if (!aiFeedbackData || !aiFeedbackData.sections_feedback) {
		showConfirm2("AI 피드백 결과가 없습니다.", "먼저 피드백을 요청하세요.", () => {
			// 필요시 UI 처리
		});
		return;
	}

	// validation 통과 시에만 실행
	const htmlContent = generateHtmlFromFeedback(aiFeedbackData);
	const cssContent = getFeedbackPdfCss();

	const form = document.createElement("form");
	form.method = "POST";
	form.action = "/pdf/download";
	form.target = "_blank";
	form.style.display = "none";

	const htmlInput = document.createElement("input");
	htmlInput.type = "hidden";
	htmlInput.name = "htmlContent";
	htmlInput.value = htmlContent;

	const cssInput = document.createElement("input");
	cssInput.type = "hidden";
	cssInput.name = "cssContent";
	cssInput.value = cssContent;

	form.appendChild(htmlInput);
	form.appendChild(cssInput);
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function generateHtmlFromFeedback(feedbackData) {
	const sectionsHtml = feedbackData.sections_feedback.map((feedback, i) => {
		const title = feedbackData.questions?.[i] || `항목 ${i + 1}`;
		return `
			<div class="section">
				<h2 class="question-title">${i + 1}. ${title}</h2>
				<p class="feedback">${feedback.replace(/\n/g, "<br />")}</p>
			</div>`;
	}).join("");

	return `
		<div class="pdf-feedback">
			<h1>AI 이력서 피드백</h1>
			${sectionsHtml}
		</div>
	`;
}

function getFeedbackPdfCss() {
	return `
		.pdf-feedback {
			width: 100%;
			font-family: 'NanumGothic', sans-serif;
		}
		.pdf-feedback h1 {
			font-size: 24pt;
			text-align: center;
			margin-bottom: 30px;
		}
		.section {
			margin-bottom: 20px;
		}
		.question-title {
			font-size: 14pt;
			font-weight: bold;
			margin-bottom: 10px;
			border-bottom: 1px solid #aaa;
			padding-bottom: 4px;
		}
		.feedback {
			font-size: 12pt;
			line-height: 1.6;
		}
	`;
}