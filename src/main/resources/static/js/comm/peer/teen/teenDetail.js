/**
 *
 */

document.addEventListener('DOMContentLoaded', function() {

	document.addEventListener('click', function (event) {
		const btn = event.target.closest('.like-button'); // 클릭한 요소 또는 부모 중 .liked가 있는지 확인

		if (!btn) return; // .liked가 아니면 무시

		const replyId = btn.dataset.replyId;
		const boardId = btn.dataset.boardId;
		const isReply = replyId !== undefined;

		const url = isReply ? '/comm/peer/teen/likeReply.do' : '/comm/peer/teen/likeBoard.do';
		const params = new URLSearchParams();

		if (isReply) {
			params.append("replyId", replyId);
			params.append("boardId", boardId);
		} else {
			params.append("boardId", boardId);
		}

		axios.post(url, params)
			.then(response => {
				const result = response.data;

				if (isReply) {
					const likeCntSpan = document.querySelector(`#reply-like-cnt-${replyId}`);
				
					btn.classList.toggle('liked');
					likeCntSpan.textContent = result.likeCnt;
				} else {
					const likeCntSpan = document.querySelector(`#board-like-cnt-${boardId}`);
					btn.classList.toggle('liked');
					likeCntSpan.textContent = result.likeCnt;
				}
			})
			.catch(error => {
				console.error('좋아요 처리 중 오류 발생:', error);
			});
	});



	// 게시글 수정버튼 클릭 시 게시글 수정 페이지로 이동 이벤트
	const boardModifyBtn = document.getElementById('boardModifyBtn');
	if (boardModifyBtn) {
		boardModifyBtn.addEventListener('click', function() {
			const boardContainer = document.querySelector('.boardEtcContainer');
			const boardId = boardContainer?.dataset.boardId;

			if (boardId) {
				// 폼 생성
				const form = document.createElement('form');
				form.method = 'POST';
				form.action = '/comm/peer/teen/teenBoardUpdate.do'; // 컨트롤러 매핑 주소

				// boardId 파라미터 추가
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = 'boardId';
				input.value = boardId;
				form.appendChild(input);

				document.body.appendChild(form);
				form.submit();
			} else {
				showConfirm2("게시글 ID를 불러올 수 없습니다.","",
					() => {
					}
				);
			}
		})
	}

	// 게시글 삭제 버튼 클릭 시 삭제 요청 이벤트. 성공 시 목록으로
	const boardDeleteBtn = document.getElementById('boardDeleteBtn');
	if (boardDeleteBtn) {
		boardDeleteBtn.addEventListener('click', function() {
			const boardId = boardDeleteBtn.closest('.boardEtcContainer').dataset.boardId;
			const data = { boardId, memId };
			fetch('/comm/peer/teen/deleteteenBoard.do', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})
				.then(resp => {

					if (!resp.ok) throw new Error('에러');
					else {

						showConfirm2("성공적으로 삭제되었습니다.","",
							() => {
								window.location.href = "/comm/peer/teen/teenList.do";
							}
						);
					}
				})
				.catch(err => {
					console.log(err);
					showConfirm2("삭제도중 문제가 발생했습니다.","관리자측 문의바랍니다.",
						() => {
						}
					);
				})
		})
	}

	// 게시글에 달린 더보기 버튼 클릭 이벤트. 더보기 박스의 내용물은 jsp 단에서 채워져있음
	const boardEtcBtn = document.getElementById('boardEtcBtn');
	if (boardEtcBtn) {
		boardEtcBtn.addEventListener('click', function() {
			document.querySelector('.boardEtcContainer').classList.toggle('board-etc-open');
		})
	}





	//========================================== 동적요소 바인딩================================= //
	const commentSection = document.querySelector('.comment-section');

	document.addEventListener('submit', submitCreateReply);
	document.addEventListener('input', eventReplyInput);
	document.addEventListener('click', closeEtcBtn);
	document.addEventListener('click', closeBoardEtcContainer);
	commentSection.addEventListener('click', closeReplyBtn);
	commentSection.addEventListener('click', eventReplyToggle);
	commentSection.addEventListener('click', toggleEtcBtn);
	commentSection.addEventListener('click', eventEtcContainerClicked);
	commentSection.addEventListener('click', modifyReplyAct);
	commentSection.addEventListener('click', modifyReplyCancel);
	//========================================== 동적요소 바인딩끝================================= //

	//=====================신고모달 작동 시키는 스크립트=====================//
	const modalOverlay = document.querySelector('#report-modal-overlay');
	const closeModalBtn = modalOverlay.querySelector('.modal-close-btn');
	const reportContentInput = document.querySelector('#report-content-input');
	const errorMsg = document.querySelector('#modal-error-msg');
	const reportConfirmBtn = document.querySelector("#report-confirm-btn");

	const openModal = () => {
		document.body.classList.add('scroll-lock');
		modalOverlay.classList.add('show');
	}
	const closeModal = () => {
		document.body.classList.remove('scroll-lock');
		modalOverlay.classList.remove('show');
		clearReportModal();
	};
	closeModalBtn.addEventListener('click', closeModal);
	modalOverlay.addEventListener('click', function(event) {
		if (event.target === modalOverlay) {
			closeModal();
		}
	});
	reportConfirmBtn.addEventListener("click", () => {
		const reportContent = reportContentInput.value;
		if (!reportContent) {
			errorMsg.textContent = '사유를 입력해주세요';
			return;
		}
		//신고 전송 함수 호출
		confirmReport();
	});

	// 게시글 더보기버튼 -> 신고 버튼 클릭 시 모달 열기전에 이미 신고한 게시글인지 체크하도록 만들어둠
	const boardReportBtn = document.getElementById('boardReportBtn');
	if (boardReportBtn) {
		boardReportBtn.addEventListener('click', async () => {
			if (!memId || memId == 'anonymousUser') {
				showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
					() => {
						sessionStorage.setItem("redirectUrl", location.href);
						location.href = "/login";
					},
					() => {

					}
				);
				return;
			}
			const targetId = boardReportBtn.closest('.boardEtcContainer').dataset.boardId;
			const formData = new FormData();
			formData.append('targetId', targetId);
			formData.append('memId', memId);
			formData.append('targetType', 'G10001');
			// @@@@@@@@@ fetch()로 해당 게시글 신고한적 있는지 체크하고 신고한적 있으면 confirm 이미 신고한 게시물
			const resp = await fetch('/api/report/selectReport', { method: 'POST', body: formData });
			if (resp.status == 200) {
				showConfirm2("이미 신고한 게시글 입니다.","",
					() => {
					}
				);
				return;
			}
	
			setReportModal(targetId, 'G10001');
			openModal();
		})
	}
})

// 신고하기 완료 클릭 시. 신고종류(게시글,댓글), 해당기본키값, 신고사유, 첨부파일 모달에서 챙겨옴.
function confirmReport() {
	const targetId = document.getElementById('report-target-id').value;
	const targetType = document.getElementById('report-target-type').value;
	const reportReason = document.getElementById('report-content-input').value;
	const reportFileEl = document.getElementById('report-file');
	const FILE_MAX_M = 1;
	const FILE_MAX_SIZE = FILE_MAX_M * 1024;

	const formData = new FormData();
	if (reportFileEl.files.length > 0) {
		formData.append('reportFile', reportFileEl.files[0]);
	}

	formData.append('targetId', targetId);
	formData.append('targetType', targetType);
	formData.append('reportReason', reportReason);
	formData.append('memId', memId);


	fetch('/api/report/insertReport', {
		method: 'POST',
		body: formData
	})
		.then(resp => {
			if (!resp.ok) throw new Error('신고 전송도중 에러 발생');
			return resp.json();
		})
		.then(result => {
			if (result) {
				showConfirm2("신고 완료","",
					() => {
						// 신고 완료 시 새로고침
						location.reload();
					}
				);
			}
		})
}

function setReportModal(targetId, targetType) {
	const inputId = document.getElementById('report-target-id');
	const inputType = document.getElementById('report-target-type');

	inputId.value = targetId;
	inputType.value = targetType;
}
function clearReportModal() {
	document.getElementById('report-target-id').value = '';
	document.getElementById('report-target-type').value = '';
	document.getElementById('report-content-input').value = '';
	document.getElementById('report-file').value = '';
	document.getElementById('modal-error-msg').value = '';
}

//=====================신고모달 작동 시키는 스크립트 끝=====================//


//=====================댓글(상위댓글) 만들어서 더해주는 함수===============//
function createParentReply(replyVO, e) {

	const div = document.createElement('div');
	div.classList.add('reply-box');
	const createdTime = new Date(replyVO.replyCreatedAt);
	const createdTimeFormat = `${createdTime.getFullYear()}. ${("0" + (createdTime.getMonth() + 1)).slice(-2)}. ${("0" + (createdTime.getDate())).slice(-2)}. ${("0" + (createdTime.getHours())).slice(-2)}:${("0" + (createdTime.getMinutes())).slice(-2)}`;
	div.id = `reply-${replyVO.boardId}-${replyVO.replyId}`;
	div.innerHTML = `
	<span class="etcBtn">…</span>
	<div class="etc-container">
		<div class="etc-act-btn">수정</div>
		<hr/>
		<div class="etc-act-btn">삭제</div>
	</div>
	<div class="reply-profile">
	  <div class="profile-wrapper user-profile">
	    <img class="profile-img" src="${replyVO.fileProfileStr ? replyVO.fileProfileStr : '/images/defaultProfileImg.png'}" alt="profile"/>
	  </div>
	  <div class="writer-info">
	    <div class="reply-nickname">${replyVO.memNickname}</div>
	    <div class="reply-date">${createdTimeFormat}</div>
	  </div>
	</div>
	  <div class="reply-content">${replyVO.replyContent}</div>
	
	<div class="reply-action-wrapper">
		<button class="reply-child-btn" id="reply-${replyVO.replyId}">
			답글
		</button>
		
		<button class="like-button " data-board-id="${replyVO.boardId}" data-reply-id="${replyVO.replyId}" aria-label="댓글 좋아요 버튼">
			<svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
			</svg>
			<svg class="heart-filled" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
			</svg>
		</button>
		<span class="like-cnt" id="reply-like-cnt-${replyVO.replyId}">0</span>
	</div>	
	`;

	const childReplyContainer = document.createElement('div');
	childReplyContainer.classList.add('reply-child-container');
	childReplyContainer.dataset.parentId = replyVO.replyId;
	childReplyContainer.innerHTML = `
		<form action="/comm/peer/teen/createTeenReply.do" method="post" class="comment-form child-form">
		  <input type="hidden" name="boardId" value="${replyVO.boardId}" />
		  <input type="hidden" name="replyParentId" value="${replyVO.replyId}" />
		  <textarea name="replyContent" maxlength="300" placeholder="댓글을 입력하세요."></textarea>
		  <div class="comment-footer">
		    <span class="char-count">0 / 300</span>
		    <button type="submit" class="btn-submit">등록</button>
		  </div>
		  <br/>
		<div class="closeReplyBtn"><span>답글접기 ▲</span></div>
		</form>
	`;
	
	document.querySelector('.comment-section').prepend(childReplyContainer);
	document.querySelector('.comment-section').prepend(div);
	e.target.querySelector('textarea').value = '';
}
//=====================댓글(상위댓글) 만들어서 더해주는 함수 끝=================//

//=====================답글(대댓글) 만들어서 더해주는 함수 ===================//
function createChildReply(replyVO, e) {
	const childReply = document.createElement('div');
	childReply.classList.add('reply-box');
	childReply.classList.add('reply-child');
	childReply.dataset.replyMem = replyVO.memId;
	childReply.id = `reply-${replyVO.boardId}-${replyVO.replyId}`;

	const createdTime = new Date(replyVO.replyCreatedAt);
	const createdTimeFormat = `${createdTime.getFullYear()}. ${("0" + (createdTime.getMonth() + 1)).slice(-2)}. ${createdTime.getDate()}. ${createdTime.getHours()}:${createdTime.getMinutes()}`;
	childReply.innerHTML = `
		<span class="etcBtn">…</span>
		<div class="etc-container">
			<div class="etc-act-btn">수정</div>
			<hr/>
			<div class="etc-act-btn">삭제</div>
		</div>
		<div class="reply-profile">
		  <div class="profile-wrapper user-profile">
		    <img class="profile-img" src="${replyVO.fileProfileStr ? replyVO.fileProfileStr : '/images/defaultProfileImg.png'}"/>
		  </div>
		  <div class="writer-info">
		    <div class="reply-nickname">${replyVO.memNickname}</div>
		    <div class="reply-date">${createdTimeFormat}</div>
		  </div>
		</div>
		<div class="reply-content">${replyVO.replyContent}</div>
	`;

	e.target.before(childReply);

	const containerEl = e.target.closest('.reply-child-container');
	const childContainer = document.querySelector(`.reply-child-container[data-parent-id="${replyVO.replyParentId}"]`);
	containerEl.style.maxHeight = childContainer.scrollHeight + 'px';
	e.target.querySelector('textarea').value = '';
	const replyChildCntSpan = childContainer.previousElementSibling.querySelector('.child-count');
	let replyChildCnt = replyChildCntSpan.textContent.trim();
	if (replyChildCnt && replyChildCnt != '') {
		replyChildCntSpan.textContent = parseInt(replyChildCnt) + 1;
	} else {
		replyChildCntSpan.textContent = 1;
	}
}
//=====================답글(대댓글) 만들어서 더해주는 함수 끝===================//

// 이벤트 함수 1. 답글버튼 토글 ; click
function eventReplyToggle(e) {
	if (!e.target.classList.contains('reply-child-btn')) return;

	const replyId = e.target.id.substring("reply-".length);
	const childContainer = document.querySelector(`.reply-child-container[data-parent-id="${replyId}"]`);
	if (childContainer.classList.toggle('open')) {
		childContainer.style.maxHeight = childContainer.scrollHeight + 'px';
	} else {
		childContainer.style.maxHeight = '0';
	}
}
// 이벤트 함수 2 댓글입력 글자수체크 ; input
function eventReplyInput(e) {
	if (e.target.nodeName != 'TEXTAREA') return;

	const curLength = e.target.value.length;
	const commentFooter = e.target.nextElementSibling;
	const charCountEl = commentFooter.querySelector('.char-count');
	if (charCountEl) {
		const charCountArr = charCountEl.textContent.split(' / ');
		charCountArr[0] = curLength;

		charCountEl.textContent = charCountArr.join(' / ');
	} else if (commentFooter.nodeName == 'SPAN') {
		const charCountArr = commentFooter.textContent.split(' / ');
		charCountArr[0] = curLength;
		commentFooter.textContent = charCountArr.join(' / ');
	}

}

// 이벤트 함수 3 답글닫기 버튼 이벤트 ; click
function closeReplyBtn(e) {
	if (!e.target.closest('.closeReplyBtn')) return;

	const containerEl = e.target.closest('.reply-child-container');
	if (containerEl.classList.contains("open")) {
		if (containerEl.classList.toggle("open")) {
			containerEl.style.maxHeight = childContainer.scrollHeight + 'px';
		} else {
			containerEl.style.maxHeight = '0';
		}
	}
}

// 이벤트 함수 4 댓글,답글 작성 비동기 호출 이벤트 ; submit
function submitCreateReply(e) {
	e.preventDefault();
	if (!e.target.classList.contains('comment-form')) return false;
	const formData = new FormData(e.target);
	fetch(e.target.action, {
		method: "POST",
		headers: {},
		body: formData,
	})
		.then(resp => {
			if (!resp.ok) throw new Error();
			return resp.json();
		})
		.then(data => {
			if (data.replyParentId > 0) {
				createChildReply(data, e);
			} else {
				createParentReply(data, e);
			}
		})
		.catch(err => {
			console.log(err);
		})
}

// 이벤트 함수 5 ...버튼 클릭시 박스 표시
function toggleEtcBtn(e) {
	if (!e.target.classList.contains('etcBtn')) return;

	const etcContainer = e.target.nextElementSibling;
	if (etcContainer) etcContainer.classList.toggle('etc-open');

	const replyModifyCancelBtn = document.getElementById('cancelBtn');
	if (replyModifyCancelBtn) replyModifyCancelBtn.click();
}

// 이벤트 함수 6 ...버튼 바깥 클릭시 박스 제거
function closeEtcBtn(e) {
	if (e.target.classList.contains('etc-container')) return;
	if (!e.target.classList.contains('etcBtn')) {
		const etcContainerList = document.querySelectorAll('.etc-container');
		etcContainerList.forEach(ec => {
			if (ec.classList.contains('etc-open')) ec.classList.remove('etc-open');
		})
	}
}

// 이벤트 함수 7 container 버튼 클릭시
function eventEtcContainerClicked(e) {
	if (!e.target.closest('.etc-container')) return;
	const el = e.target;
	if (!el.textContent.trim()) return;
	console.log(el.textContent.trim());
	if (el.classList.contains('reply-child-container')) return;
	if (!e.target.classList.contains('etc-act-btn')) return;

	const action = el.textContent.trim();
	if (!confirm(`이 댓글을 정말로 ${action} 하시겠습니까?`)) return;
	if (!memId || memId == 'anonymousUser') {
		showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
			() => {
				sessionStorage.setItem("redirectUrl", location.href);
				location.href = "/login";
			},
			() => {

			}
		);
		return;
	}
	const targetReply = el.closest('.reply-box');
	const targetReplyChildBox = targetReply.nextElementSibling;
	const targetReplyId = targetReply.id.split('-')[2];
	const data = { "replyId": targetReplyId };

	if (action == '삭제') {
		fetch('/comm/peer/teen/deleteTeenReply.do', {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then(resp => {
				if (!resp.ok) throw new Error('에라');
				return resp.json();
			})
			.then(result => {
				if (result) {
					if (!targetReply.classList.contains('reply-child')) {
						targetReplyChildBox.remove();
					} else {
						const parentId = targetReply.closest('.reply-child-container').dataset.parentId
						const boardId = document.querySelector('.boardEtcContainer').dataset.boardId;
						const parentReplyEl = document.querySelector(`#reply-${boardId}-${parentId}`);
						const childCntEl = parentReplyEl.querySelector('.child-count');
						let childCnt = childCntEl.textContent.trim();
						childCntEl.textContent = parseInt(childCnt) - 1 > 0 ? parseInt(childCnt) - 1 : '';
					}

					targetReply.remove();
					setTimeout(() => {
						showConfirm2("삭제되었습니다.","",
							() => {
							}
						);
					})
				}
			})
			.catch(err => {
				console.log(err);
			})
	}

	if (action == '신고') {
		(async function() {
			const formData = new FormData();
			formData.append('memId', memId);
			formData.append('targetId', targetReplyId);
			formData.append('targetType', 'G10002');
			const resp = await fetch('/api/report/selectReport', { method: 'POST', body: formData });
			if (resp.status == 200) {
				showConfirm2("이미 신고한 댓글입니다.","",
					() => {
					}
				);
				return;
			}
		
			setReportModal(targetReplyId, 'G10002');
			document.body.classList.add('scroll-lock');
			document.querySelector('#report-modal-overlay').classList.add('show');
		}).apply();
	}

	if (action == '수정') {
		// 열려있는 수정 창들 찾아서 취소버튼 클릭해주기.

		const targetReplyContent = targetReply.querySelector('.reply-content').textContent;
		const modifyForm = `
		<div class="reply-content">
		    <textarea class="reply-modify-input" placeholder="${targetReplyContent.trim()}">${targetReplyContent.trim()}</textarea>
			<span class="char-count" id="char-count">${targetReplyContent.length} / 300</span>
		    <div class="button-group">
		        <button class="modify-btn" id="modifyBtn">등록</button>
		        <button class="cancel-btn" id="cancelBtn">취소</button>
		    </div>
		</div>
		`;
		targetReply.querySelector('.reply-content').innerHTML = modifyForm;
	}
}

// 이벤트 함수 8 boardEtcContainer바깥 클릭시 닫기 ; click
function closeBoardEtcContainer(e) {
	if (e.target.classList.contains('boardEtcContainer')) return;
	if (e.target.id == 'boardEtcBtn') return;
	if (e.target.closest('.boardEtcActionBtn')) return;

	const cont = document.querySelector('.boardEtcContainer');
	if (cont.classList.contains('board-etc-open')) {
		cont.classList.remove('board-etc-open');
	}
}

// 이벤트 함수 9 댓글 수정 완료버튼 클릭 시 fetch ; click

function modifyReplyAct(e) {
	const modifyActEl = e.target;
	if (!modifyActEl || !modifyActEl.classList.contains('modify-btn')) return;
	const targetReply = modifyActEl.closest('.reply-box');
	const targetReplyId = targetReply.id.split('-')[2];
	const modifiedContent = targetReply.querySelector('.reply-modify-input').value;
	const data = {
		"replyId": targetReplyId,
		"replyContent": modifiedContent,
		"memId": memId
	};

	fetch('/prg/std/updateStdReply.do', {
		method: 'POST',
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data)
	})
		.then(resp => {
			if (!resp.ok) throw new Error('에러 발생');
			return resp.json();
		})
		.then(result => {
			if (result) {
				const contentArea = modifyActEl.closest('.reply-content');
				const modifiedContent = contentArea.querySelector('textarea').value.trim();

				contentArea.innerHTML = modifiedContent;
			}
		})
		.catch(err => {
			console.log(err);
		})
}

// 이벤트 함수 10 댓글 수정하다가 취소 클릭 시 ; click
function modifyReplyCancel(e) {
	const modifyCancelEl = e.target;
	if (!modifyCancelEl || !modifyCancelEl.classList.contains('cancel-btn')) return;

	const contentArea = modifyCancelEl.closest('.reply-content')
	const previousContent = contentArea.querySelector('textarea').placeholder.trim();

	contentArea.innerHTML = previousContent;
}

