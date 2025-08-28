
/**
 * 이력서 AI 피드백 화면을 위한 자바스크립트
 */
let aiFeedbackData = null;
document.addEventListener('DOMContentLoaded', () => {

	// --- 주요 HTML 요소 가져오기 ---
	const resumeList = document.getElementById('resumeList');
	const requestAiFeedbackBtn = document.getElementById('requestAiFeedback');
	const bg = document.getElementById('modalBg');
	const modal = document.getElementById('confirmModal');
	const btnCancel = document.getElementById('btnCancel');
	const btnConfirm = document.getElementById('btnConfirm');

	let subscriptionInfo = null;
	let originalData = null;

	// --- 이벤트 리스너 연결 ---
	resumeList.addEventListener('change', loadResumeDetail);

	// 'AI 피드백 요청' 버튼 클릭 -> 모달 열기
	requestAiFeedbackBtn.addEventListener('click', () => {
		// --- 사전 조건 검사 ---
		if (!subscriptionInfo || !subscriptionInfo.payId) {
			showConfirm2('유효한 구독 정보가 없습니다.', "AI 피드백을 사용하시려면 이용권을 구매해주세요.",
			    () => {
					return;
			    }
			);
		}
		if (!originalData) {
			showConfirm2('먼저 피드백을 받을 이력서를 선택해주세요.',"", 
			    () => {
					return;
			    }
			);
		}
		if (subscriptionInfo.payResumeCnt <= 0) {
			showConfirm2('이력서 첨삭 횟수를 모두 사용했습니다.',"", 
			    () => {
					return;
			    }
			);
		}

		document.getElementById('resume-count-display').textContent = subscriptionInfo.payResumeCnt;
		// --- 모달 표시 ---
		bg.style.display = 'block';
		modal.style.display = 'block';
		modal.focus();
	});

	// 모달의 '확인' 버튼 클릭 -> 실제 AI 분석 및 횟수 차감 요청
	btnConfirm.addEventListener('click', () => {
		closeModal();
		requestAiFeedback();
	});

	// 모달 닫기 관련 이벤트 리스너
	function closeModal() {
		modal.style.display = 'none';
		bg.style.display = 'none';
	}
	btnCancel.addEventListener('click', closeModal);
	bg.addEventListener('click', closeModal);
	window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.style.display === 'block') closeModal(); });

	//페이지 로드시 구독 상태를 확인하는 함수
	const checkSubscription = () => {
		fetch('/cdp/aifdbck/rsm/checkSubscription.do')
			.then(response => {
				if (!response.ok) {
					throw new Error('구독 정보 확인 중 서버 오류 발생');
				}
				return response.json(); //.json()의 결과는 Promise이므로 return
			})
			.then(data => {
				subscriptionInfo = data;
				if (!subscriptionInfo || !subscriptionInfo.payId) {
					showConfirm2('유효한 구독 정보가 없습니다.', "AI 피드백을 사용하시려면 이용권을 구매해주세요.",
					    () => {
					        
					    }
					);
					
					resumeList.disabled = true;
					requestAiFeedbackBtn.disabled = true;
				}
			})
			.catch(error => {
				showConfirm2("구독 정보를 불러오는 중 오류가 발생했습니다.","페이지를 새로고침해주세요.",
		  			() => {
						return;
		  			}
		  		);
				resumeList.disabled = true;
				requestAiFeedbackBtn.disabled = true;
			})
	}

	//불필요한 문장정리
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

	//이력서 상세 호출
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
					// 1️⃣ 이미지 경로 정리
					data.resumeContent = data.resumeContent.replace(/\\+/g, '/');
					originalData = data;

					document.querySelector('.aifb-title').textContent = data.resumeTitle
						;

					// HTML 내용을 파싱하여 불필요한 요소 제거
					const parser = new DOMParser();
					const doc = parser.parseFromString(data.resumeContent, 'text/html');

					// '필수 입력 정보입니다.' 문구 제거
					const requiredInfo = doc.querySelector('.required-info');
					if (requiredInfo) {
						requiredInfo.remove();
					}

					// 이력서의 HTML 내용을 innerHTML로 삽입
					document.getElementById('questionsWrapper').innerHTML = data.resumeContent;
					document.getElementById('feedbackArea').innerHTML = 'AI의 피드백 내용이 출력될 공간입니다';
				}
			})
			.catch(error => {
				console.error('이력서 불러오기 오류:', error);
				showConfirm2("이력서 데이터를 불러오는 데 실패했습니다.","",
		  			() => {
						return;
		  			}
		  		);
				document.querySelector('.aifb-title').textContent = '오류 발생';
				document.getElementById('questionsWrapper').innerHTML = '데이터를 불러오는 데 실패했습니다.';
			});
	}

	//이력서 ai첨삭 호출
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
				"payId": subscriptionInfo.payId, // 횟수를 차감할 결제 ID
				"html": originalData.resumeContent // 피드백 받을 이력서 내용
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
						.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  							// 볼드 처리
						.replace(/^\*\s?/gm, '')                           // * 제거
						// 상위 소제목(개선할 점 등)은 <h3> 처리
						.replace(/<strong>(개선할 점|더 나은 표현 제안|누락 또는 과장된 부분):?<\/strong>/g, '<h3>$1</h3>')
						// 하위 항목 제목에서 콜론(:) 제거
						.replace(/<strong>([^<]+?):<\/strong>/g, '<strong>$1</strong>')
						// 연속 줄바꿈 제거 → 1줄만 유지
						.replace(/\n{2,}/g, '\n')
					}
					  </div>
					`;

				aiFeedbackData = {
					sections_feedback: [cleanedText], // 배열로 감싸기!
					questions: ["이력서 전체 피드백"] // 제목만 하나 넣기
				};

				feedbackArea.innerHTML = htmlFormatted;
				subscriptionInfo.payResumeCnt--;
				showConfirm2(`AI 피드백이 완료되었습니다. (남은 횟수: ${subscriptionInfo.payResumeCnt}회)`,"", 
				    () => {
						axios.post('/admin/las/aiResumeVisitLog.do')
				    }
				);
				// 화면 표시
				//document.getElementById('feedbackArea').innerHTML = cleanedText.replace(/\n/g, '<br>');
			})
			.catch(error => {
				console.error('AI 피드백 요청 오류:', error);
				feedbackArea.textContent = 'AI 피드백을 불러오는 데 실패했습니다.';
				showConfirm2("AI 피드백을 불러오는 데 실패했습니다.","",
		  			() => {
						return;
		  			}
		  		);
			});
	}

	checkSubscription();
});
//이력서 수정화면으로 이동
function requestProofread() {
	const selectedResumeId = document.getElementById('resumeList').value;
	if (selectedResumeId) {
		window.location.href = `/cdp/rsm/rsm/resumeWriter.do?resumeId=${selectedResumeId}`;
	} else {
		showConfirm2('먼저 이력서를 선택해주세요.',"",
		    () => {
				return;
		    }
		);
	}
}


//jsp 미리보기/다운로드
const previewPdfBtn = document.getElementById("previewPdfBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

previewPdfBtn?.addEventListener("click", previewPdfFromAI);
downloadPdfBtn?.addEventListener("click", downloadPdfFromAI);

function previewPdfFromAI() {
	if (!aiFeedbackData || !aiFeedbackData.sections_feedback) {
		showConfirm2("AI 피드백 결과가 없습니다. 먼저 피드백을 요청하세요.","", 
		    () => {
				return;
		    }
		);
	}

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
			showConfirm2("PDF 미리보기 실패","",
	  			() => {
					return;
	  			}
	  		);
		});
}

function downloadPdfFromAI() {
	if (!aiFeedbackData || !aiFeedbackData.sections_feedback) {
		showConfirm2("AI 피드백 결과가 없습니다.","먼저 피드백을 요청하세요.",
			() => {
				return;
			}
		);
	}

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

// 이력서용 HTML 콘텐츠 생성
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

// 이력서용 CSS 정의
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