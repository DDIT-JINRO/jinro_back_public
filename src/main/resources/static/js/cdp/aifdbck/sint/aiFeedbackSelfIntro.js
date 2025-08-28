/**
 * 자바스크립트 파일로 분리된 AI 피드백 로직입니다.
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

	// 구독 정보를 저장할 전역 변수
	let subscriptionInfo = null;

	// 전역 변수로 AI 피드백 데이터를 저장할 공간
	let originalData = null;

	const selfIntroList = document.getElementById('selfIntroList');
	selfIntroList.addEventListener('change', loadSelfIntroDetail);


	// 'AI 피드백 요청' 버튼 클릭 -> 모달 열기
	if (requestAiFeedbackBtn) {
		requestAiFeedbackBtn.addEventListener('click', () => {
			// --- 사전 조건 검사 ---
			if (!subscriptionInfo || !subscriptionInfo.payId) {
				showConfirm2('유효한 구독 정보가 없습니다.',"AI 피드백을 사용하시려면 이용권을 구매해주세요.", 
				    () => {
				     	return;   
				    }
				);
			}
			if (!originalData) {
				showConfirm2('먼저 피드백을 받을 자기소개서를 선택해주세요.', "",
				    () => {
						return;
				    }
				);
			}
			if (subscriptionInfo.payCoverCnt <= 0) {
				showConfirm2('자기소개서 첨삭 횟수를 모두 사용했습니다.',"", 
				    () => {
						return;
				    }
				);
			}
			document.getElementById('cover-count-display').textContent = subscriptionInfo.payCoverCnt;
			// --- 모달 표시 ---
			bg.style.display = 'block';
			modal.style.display = 'block';
			modal.focus();
		});
	}

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
		fetch('/cdp/aifdbck/sint/checkSubscriptionPI.do')
			.then(response => {
				if (!response.ok) {
					throw new Error('구독 정보 확인 중 서버 오류 발생');
				}
				return response.json();
			})
			.then(data => {
				subscriptionInfo = data;
				// 구독 정보가 없거나 유효하지 않으면 경고창을 띄우고 기능 비활성화
				if (!subscriptionInfo || !subscriptionInfo.payId) {
					showConfirm2('유효한 구독 정보가 없습니다.',"AI 피드백을 사용하시려면 이용권을 구매해주세요.", 
					    () => {
							selfIntroList.disabled = true;
							requestAiFeedbackBtn.disabled = true;
					    }
					);
				}
			})
			.catch(error => {
				console.error(error);
				showConfirm2("구독 정보를 불러오는 중 오류가 발생했습니다.","페이지를 새로고침해주세요.",
					() => {
						return;
					}
				);
				selfIntroList.disabled = true;
				requestAiFeedbackBtn.disabled = true;
			});
	};

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


	//자기소개서 상세 호출
	function loadSelfIntroDetail() {
		const selectedSiId = document.getElementById('selfIntroList').value;

		if (!selectedSiId) {
			document.querySelector('.aifb-title').textContent = '자기소개서 제목';
			document.getElementById('questionsWrapper').innerHTML = '자기소개서 내용이 출력될 공간입니다';
			document.getElementById('feedbackArea').innerHTML = 'AI의 피드백 내용이 출력될 공간입니다';
			return;
		}

		fetch(`/cdp/aifdbck/sint/getSelfIntroDetail.do?siId=${selectedSiId}`)
			.then(response => {
				if (!response.ok) throw new Error('자기소개서 상세 정보 요청 실패');
				return response.json();
			})
			.then(data => {
				if (data) {
					originalData = data;

					document.querySelector('.aifb-title').textContent = data.title;

					// 질문-답변 영역을 렌더링합니다.
					let questionsHtml = '';
					data.questions.forEach((qvo, index) => {
						const cvo = originalData.contents[index];
						questionsHtml += `
                    <div class="qa-block" data-index="${index}">
                        <div class="question-block">
                            <span class="question-number">${index + 1}.</span>
                            <span class="question-text">${qvo.siqContent}</span>
                        </div>
                        <div class="answer-block">
                            <p>${cvo.sicContent}</p>
                            <div class="char-count">
                                글자 수 : <span>${cvo.sicContent.length}</span> / 2000
                            </div>
                        </div>
                    </div>
                `;
					});
					document.getElementById('questionsWrapper').innerHTML = questionsHtml;

					//피드백 영역 초기화
					document.getElementById('feedbackArea').innerHTML = 'AI의 피드백 내용이 출력될 공간입니다';
				}
			})
			.catch(error => {
				console.error('자기소개서 불러오기 오류:', error);
				showConfirm2("자기소개서 데이터를 불러오는 데 실패했습니다.","",
					() => {
						return;
					}
				);
			});
	}

	//자기소개서 ai 첨삭 호출
	function requestAiFeedback() {

		const feedbackArea = document.getElementById('feedbackArea');
		feedbackArea.innerHTML = `
		  <div class="spinner-wrapper">
		    <div class="spinner-border text-primary" role="status" style="display: block;">
		    </div>
		    <div class="text-center mt-2">AI가 피드백을 생성 중입니다...<br>잠시만 기다려주세요.</div>
		  </div>
		`;

		// AI 첨삭을 위한 페이로드를 준비
		const sections = originalData.questions.map((qvo, index) => {
			const cvo = originalData.contents[index];
			return {
				"question_title": qvo.siqContent,
				"original_content": cvo.sicContent,
			};
		});

		// AI 첨삭 요청 (단일 요청으로 변경)
		fetch('/cdp/aifdbck/sint/requestFeedbackPI.do', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				"payId": subscriptionInfo.payId,
				"sections": sections
			})
		})
			.then(response => {
				if (!response.ok) throw new Error('AI 첨삭 요청 실패');
				return response.text();
			})
			.then(aiResponseText => {
				// AI 응답 텍스트를 정리하고 파싱
				const cleanedText = cleanAiResponse(aiResponseText);

				// ---로 구분된 피드백을 파싱
				const sections = cleanedText.split('---').map(section => section.trim()).filter(section => section.length > 0);

				// aiFeedbackData에 저장
				aiFeedbackData = {
					sections_feedback: sections,
					questions: originalData.questions.map(qvo => qvo.siqContent)
				};

				displayAllFeedback();

				// ⭐️ 성공 시 로컬 자소서 횟수 1 차감 후 알림
				subscriptionInfo.payCoverCnt--;
				showConfirm2(`AI 피드백이 완료되었습니다. (남은 횟수: ${subscriptionInfo.payCoverCnt}회)`,"", 
				    () => {
						return;
				    }
				);
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

	function displayAllFeedback() {
		if (!aiFeedbackData) return;
		const feedbackArea = document.getElementById('feedbackArea');

		let feedbackHtml = '';

		// 섹션별 피드백 출력 (핵심 내용만 간결하게)
		if (aiFeedbackData.sections_feedback && aiFeedbackData.sections_feedback.length > 0) {
			aiFeedbackData.sections_feedback.forEach((feedbackText, index) => {
				feedbackHtml += `<div class="feedback-section" id="feedback-section-${index}">`;

				// 질문을 제목으로 출력
				const questionTitle = aiFeedbackData.questions?.[index] || `문항 ${index + 1}`;
				feedbackHtml += `<h4>${index + 1}. ${questionTitle}</h4>`;

				// "[문항 N번 - AI 피드백]" 제거 후 줄바꿈 처리
				const cleanedText = feedbackText.replace(/\[문항 \d+번 - AI 피드백\]/, '').trim();
				feedbackHtml += `<p>${cleanedText.replace(/\n/g, '<br>')}</p>`;

				feedbackHtml += `</div>`;
			});
		} else {
			feedbackHtml += '<p>제공된 피드백이 없습니다.</p>';
		}

		feedbackArea.innerHTML = feedbackHtml;
		feedbackArea.scrollTop = 0;
	}
	function displayFeedback(index, clickedElement) {
		document.querySelectorAll('.qa-block').forEach(el => el.classList.remove('active'));
		clickedElement.classList.add('active');

		const feedbackSection = document.getElementById(`feedback-section-${index}`);
		if (feedbackSection) {
			const feedbackArea = document.getElementById('feedbackArea');
			const offset = feedbackSection.offsetTop - feedbackArea.offsetTop;
			feedbackArea.scrollTop = offset;
		}
	}

	// 페이지 로드 시 구독 확인 실행
	checkSubscription();
});

//자기소개서 수정화면 이동
function requestProofread() {
	const selectedSiId = document.getElementById('selfIntroList').value;
	if (selectedSiId) {
		window.location.href = `/cdp/sint/sintwrt/selfIntroWriting.do?siId=${selectedSiId}`;
	} else {
		showConfirm2('먼저 자기소개서를 선택해주세요.',"", 
		    () => {
				
		    }
		);
	}
}

//pdf 미리보기/ 다운로드
const previewPdfBtn = document.getElementById("previewPdfBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

previewPdfBtn?.addEventListener("click", previewPdfFromAI);
downloadPdfBtn?.addEventListener("click", downloadPdfFromAI);

function previewPdfFromAI() {
	if (!aiFeedbackData || !aiFeedbackData.sections_feedback) {
		showConfirm2("AI 피드백 결과가 없습니다.", "먼저 피드백을 요청하세요.",
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
		showConfirm2("AI 피드백 결과가 없습니다.", "먼저 피드백을 요청하세요.",
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

// HTML 콘텐츠 생성 함수
function generateHtmlFromFeedback(feedbackData) {
	let sectionsHtml = feedbackData.sections_feedback.map((feedback, i) => {
		const question = feedbackData.questions?.[i] || `문항 ${i + 1}`;
		return `
      <div class="section">
        <h2 class="question-title">${i + 1}. ${question}</h2>
        <p class="feedback">${feedback.replace(/\n/g, "<br />")}</p>
      </div>`;
	}).join("");

	return `
    <div class="pdf-feedback">
      <h1>AI 첨삭 피드백</h1>
      ${sectionsHtml}
    </div>
  `;
}

//CSS 내용 정의 함수
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



