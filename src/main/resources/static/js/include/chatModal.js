/**
 * 헤더의 채팅 모달을 컨트롤 하기 위한 js
 */
const imageMsgStore = new Map();

document.addEventListener('DOMContentLoaded', function(){
	// 로그인 여부 확인
	if(memId && memId !='anonymousUser'){
		// 소켓 연결
		connectSocket();
		// 플로팅 버튼 클릭시 모달 오픈

		// 입력창, 전송버튼에 이벤트 등록
		const inputEl = document.getElementById('chatMessageInput');
		const sendBtn = document.getElementById('sendMsgBtn');

		sendBtn.addEventListener('click', function () {
		    sendCurrentInput();
		});
		inputEl.addEventListener('keyup', function (e) {
		    if (e.code === 'Enter' && !e.shiftKey) {
		        e.preventDefault();
		        sendCurrentInput();
		    }
		});
		
		const backBtn = document.querySelector('.chat-back-btn');
		if (backBtn) {
		    backBtn.addEventListener('click', function() {
		        history.back();
		    });
		}

		function sendCurrentInput() {
		    const content = inputEl.value.trim();
			const imageInput = document.getElementById('attach-input-img');
			const fileInput = document.getElementById('attach-input-file');

		    inputEl.value = '';
			const fileObj = {};
			if(imageInput.files && imageInput.files.length > 0){
				fileObj.messageType = 'IMAGE';
				fileObj.files = imageInput.files;
				sendMessage(currentChatRoomId, content, fileObj);
				return;
			}
			if(fileInput.files && fileInput.files.length > 0){
				fileObj.messageType = 'FILE';
				fileObj.files = fileInput.files;
				sendMessage(currentChatRoomId, content, fileObj);
				return;
			}

			// 파일 첨부 안한 경우에 메시지도 입력 안했으면 요청안되도록.
		    if (!content) return;
		    sendMessage(currentChatRoomId, content);
		}

	}

	document.getElementById('chatRooms').addEventListener('click',openChatModal);

	const exitBtn = document.getElementById('exitBtn');
	if(exitBtn){
		exitBtn.addEventListener('click',function(){
			const crId =  exitBtn.dataset.crId;
			const data = {memId, crId}
			fetch(`/api/chat/exit`,{
				method:"POST",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify(data),
			})
			.then(resp =>resp.json())
			.then(result =>{
				if(result){
					// 채팅방 구독 해제
					if(chatRoomSubscription){
						chatRoomSubscription.unsubscribe();
						chatRoomSubscription = null;
					}
					document.querySelector(`.chat-room-entry[data-cr-id="${crId}"]`).remove();
					document.getElementById('chat-input').style.display = 'none';
					document.querySelector('.chat-room-meta').style.display = 'none';
					const emptyChatMsg = `
						<p class="chat-room-no-selected">목록에서 채팅방을 선택해주세요</p>
					`;
					document.getElementById('chat-container').innerHTML = emptyChatMsg;

					const roomList = document.querySelectorAll('.chat-room-entry');
					if(roomList.length == 0){
						const emptyRoomListMsg = `
							<p class="chat-room-no-selected">
							입장한 채팅방이 없습니다<br/>
							<a href="/prg/std/stdGroupList.do">스터디그룹 보러가기</a>
							</p>
						`;
						document.getElementById('chatRoomList').innerHTML = emptyRoomListMsg;
					}
				}
			})
			.catch(err =>{
				console.error(err);
			})
		})
	}

	const imgAttachBtn = document.getElementById('chatImgBtn');
	const fileAttachBtn = document.getElementById('chatFileBtn');
	const imgInput = document.getElementById('attach-input-img');
	const fileInput = document.getElementById('attach-input-file');
	const previewBarEl  = document.getElementById('attach-preview-bar');
	const previewListEl = document.getElementById('attachPreviewList');
	const clearAttachBtn = document.getElementById('clearAttachBtn');
	imgAttachBtn.addEventListener('click', function(){
		imgInput.value = '';
		fileInput.value = '';
		imgInput.click();
	})
	fileAttachBtn.addEventListener('click', function(){
		imgInput.value = '';
		fileInput.value = '';
		fileInput.click();
	})

	function renderAttachOverlay() {
	  const imgCount  = (imgInput.files && imgInput.files.length) || 0;
	  const fileCount = (fileInput.files && fileInput.files.length) || 0;

	  if (imgCount === 0 && fileCount === 0) {
	    previewBarEl.style.display = 'none';
	    previewListEl.innerHTML = '';
	    return;
	  }

	  previewBarEl.style.display = 'flex';

	  if (imgCount > 0) {
	    previewListEl.innerHTML =
	      `<span>🖼️ <b>이미지 첨부</b> · ${imgCount}개 선택됨</span>`;
	  } else {
	    previewListEl.innerHTML =
	      `<span>📎 <b>파일 첨부</b> · ${fileCount}개 선택됨</span>`;
	  }
	}


	imgInput.addEventListener('input', () => {
	  if (imgInput.files?.length) {
	    fileInput.value = '';        // 파일 선택 비우기 (파일 모드 종료)
	  }
	  renderAttachOverlay();
	});
	imgInput.addEventListener('change', () => {
	  if (imgInput.files?.length) {
	    fileInput.value = '';
	  }
	  renderAttachOverlay();
	});

	fileInput.addEventListener('input', () => {
	  if (fileInput.files?.length) {
	    imgInput.value = '';         // 이미지 선택 비우기 (이미지 모드 종료)
	  }
	  renderAttachOverlay();
	});
	fileInput.addEventListener('change', () => {
	  if (fileInput.files?.length) {
	    imgInput.value = '';
	  }
	  renderAttachOverlay();
	});

	// "모두 제거" 버튼: 현재 선택만 초기화
	clearAttachBtn.addEventListener('click', () => {
	  imgInput.value = '';
	  fileInput.value = '';
	  renderAttachOverlay();
	});


	// 오버레이 상태
	let imgovMsgId = null;
	let imgovIndex = 0;

	const imgOverlay     = document.getElementById('img-overlay');
	const imgovView      = document.getElementById('imgov-view');
	const imgovNameEl    = document.getElementById('imgov-name');
	const imgovDownEl    = document.getElementById('imgov-download');
	const imgovPrevBtn   = document.getElementById('imgov-prev');
	const imgovNextBtn   = document.getElementById('imgov-next');
	const imgovCloseBtn  = document.getElementById('imgov-close');

	// 썸네일 클릭(위임)
	document.getElementById('chat-container').addEventListener('click', (e) => {
	  const thumb = e.target.closest('.img-thumb-wrap');
	  if (!thumb) return;

	  imgovMsgId = thumb.dataset.msgId;
	  imgovIndex = parseInt(thumb.dataset.index || '0', 10);
	  openImageOverlay();
	});

	function openImageOverlay(){
		const list = imageMsgStore.get(String(imgovMsgId)) || [];
		if (list.length === 0) return;
		renderImageOverlayImage();
		imgOverlay.style.display = 'flex';
	}

	function closeImageOverlay(){
	  imgOverlay.style.display = 'none';
	  imgovMsgId = null;
	  imgovIndex = 0;
	}

	function renderImageOverlayImage(){
	  const list = imageMsgStore.get(String(imgovMsgId)) || [];
	  const cur  = list[imgovIndex];
	  if (!cur) return;
	  imgovView.src = cur.filePath;
	  imgovView.alt = cur.fileOrgName || '';
	  imgovNameEl.textContent = cur.fileOrgName || '';
	  imgovDownEl.href = `/files/download?fileGroupId=${cur.fileGroupId}&seq=${cur.fileSeq}`;

	  // 좌우 버튼 가시성
	  imgovPrevBtn.style.visibility = (imgovIndex > 0) ? 'visible' : 'hidden';
	  imgovNextBtn.style.visibility = (imgovIndex < list.length-1) ? 'visible' : 'hidden';
	}

	// 버튼들
	imgovPrevBtn.addEventListener('click', () => {
	  const list = imageMsgStore.get(String(imgovMsgId)) || [];
	  if (imgovIndex > 0) { imgovIndex--; renderImageOverlayImage(); }
	});
	imgovNextBtn.addEventListener('click', () => {
	  const list = imageMsgStore.get(String(imgovMsgId)) || [];
	  if (imgovIndex < list.length-1) { imgovIndex++; renderImageOverlayImage(); }
	});
	imgovCloseBtn.addEventListener('click', closeImageOverlay);
	// 오버레이 바깥 클릭 닫기
	imgOverlay.addEventListener('click', (e) => {
	  if (e.target === imgOverlay) closeImageOverlay();
	});
	// ESC 닫기
	document.addEventListener('keydown', (e) => {
	  if (e.key === 'Escape' && imgOverlay.style.display === 'flex') closeImageOverlay();
	});

})



document.addEventListener('click', function(e){
	if (window.__chatModalDragging) return; // 드래그 중엔 닫지 않기
	// 모달 바깥쪽 클릭시 모달창 닫기
	if(!e.target.closest('#chat-modal')&&!e.target.closest('#chatRooms')){
		closeChatModal();
	}
})

function cleanInputDatas(){
	// 첨부 input 요소 비우기
	const imgInputEl  = document.getElementById('attach-input-img');
	const fileInputEl = document.getElementById('attach-input-file');
	const previewBarEl = document.getElementById('attach-preview-bar');
	const previewListEl = document.getElementById('attachPreviewList');
	const messageTextarea = document.getElementById('chatMessageInput');

	if (imgInputEl) imgInputEl.value = '';
	if (fileInputEl) fileInputEl.value = '';
	if (previewBarEl) previewBarEl.style.display = 'none';
	if (previewListEl) previewListEl.innerHTML = '';
	if (messageTextarea) messageTextarea.value = '';

}
// 모달 닫기
function closeChatModal(){
	document.body.classList.remove('modal-open');
	cleanInputDatas();
	// 채팅방 목록 비우기
	document.getElementById('chatRoomList').innerHTML = "";
	// 채팅창 영역 비우기
	const emptyRoomMsg = `
		<p class="chat-room-no-selected">목록에서 채팅방을 선택해주세요</p>
	`;
	document.getElementById('chat-container').innerHTML = emptyRoomMsg;
	document.getElementById('chat-modal').style.display = 'none';
	document.getElementById('chat-input').style.display = 'none';
	document.querySelector('.chat-room-meta').style.display = 'none';
	// 보고 있는 채팅방 초기화
	currentChatRoomId = null;

	// 구독중인 특정 채팅방이 있으면 구독 해제
	if(chatRoomSubscription){
		chatRoomSubscription.unsubscribe();
		chatRoomSubscription = null;
	}

	// 구독중인 채팅방별 안일음갯수 구독 해제
	if(unreadDetailSubscription){
		unreadDetailSubscription.unsubscribe();
		unreadDetailSubscription = null;
	}
}

// 모달 열기
async function openChatModal() {
    document.body.classList.add('modal-open');
    if (!memId || memId == 'anonymousUser') {
        showConfirm("로그인 후 이용 가능합니다.", "로그인하시겠습니까?",
            () => {
                sessionStorage.setItem("redirectUrl", location.href);
                location.href = "/login";
            },
            () => {}
        );
    } else {
        axios.post("/admin/las/chatVisitLog.do");
        await printChatRoomList();
        subscribeToUnreadDetail();
        const modal = document.getElementById('chat-modal');
        restoreChatModalState(modal);
        modal.style.display = 'flex';

        if (!history.state || history.state.chatState !== 'list') {
            history.pushState({ chatState: 'list' }, 'Chat List');
        }

        requestAnimationFrame(() => {
            clampIntoViewport(modal);
            if (window.matchMedia("(min-width: 769px)").matches) {
                enableChatModalDragAndResize();
            }
        });
    }
}

function restoreChatModalState(modal) {
  if (!modal) return;
  
  if (window.matchMedia("(max-width: 768px)").matches) {
  // 모바일에서는 CSS 기본값(100%)을 사용하도록 인라인 스타일을 제거
    modal.style.width = '';
    modal.style.height = '';
    modal.style.top = '';
    modal.style.left = '';
    modal.style.right = '';
    modal.style.bottom = '';
    return;
  }

  try {
    const st = JSON.parse(localStorage.getItem('chatModal.state') || '{}');

    // width/height는 무조건 복원
    if (st.width)  modal.style.width  = st.width;
    if (st.height) modal.style.height = st.height;

	// ⬇️ 좌표 복원 규칙: 'auto'나 '0px' 같은 비정상 값은 버리고 CSS 기본 앵커 유지
	const isValidPx = v => typeof v === 'string' && v !== 'auto' && !isNaN(parseFloat(v));
	if (isValidPx(st.left) && isValidPx(st.top)) {
	  modal.style.left   = st.left;
	  modal.style.top    = st.top;
	  modal.style.right  = 'auto';
	  modal.style.bottom = 'auto';
	} else {
	  modal.style.left   = 'auto';
	  modal.style.top    = 'auto';
	  // CSS에 이미 right/bottom 기본값 있음
	}
  } catch(e) {
    // 오류 나면 그냥 CSS 기본값 쓰도록 방치
    modal.style.left = 'auto';
    modal.style.top  = 'auto';
  }
}

function clampIntoViewport(modal) {
  // left/top(px) 좌표계를 쓸 때만 동작 (auto면 스킵)
  const hasLeft = modal.style.left && modal.style.left !== 'auto';
  const hasTop  = modal.style.top  && modal.style.top  !== 'auto';
  if (!hasLeft || !hasTop) return;

  const PAD = 200;

  // ✅ inline 스타일 값을 기준으로 클램프 (rect.left/top은 초기 프레임에서 0이 나올 수 있음)
  const leftNow = parseFloat(modal.style.left) || 0;
  const topNow  = parseFloat(modal.style.top)  || 0;

  // 크기는 rect에서 가져와도 OK (width/height는 신뢰 가능)
  const rect = modal.getBoundingClientRect();
  const maxL = window.innerWidth  - rect.width  - PAD;
  const maxT = window.innerHeight - rect.height - PAD;

  const L = Math.max(PAD, Math.min(leftNow, maxL));
  const T = Math.max(PAD, Math.min(topNow,  maxT));

  modal.style.left   = `${L}px`;
  modal.style.top    = `${T}px`;
  modal.style.right  = 'auto';
  modal.style.bottom = 'auto';
}

// 채팅방 목록 채우기 -> 모달 열때 호출
// 유저가 참여중인 채팅방 목록 불러와서 출력
async function printChatRoomList() {
    const list = document.getElementById("chatRoomList");
    list.innerHTML = "";
    const response = await fetch('/api/chat/rooms')
    const chatRoomList = await response.json();

	const unreadResponse = await fetch('/api/chat/unread');
	const unreadList = await unreadResponse.json();

	const unreadMap = {};
	unreadList.forEach((unreadVO)=>{
		unreadMap[unreadVO.crId] = unreadVO.unreadCnt;
	})

	if (!chatRoomList || chatRoomList.length == 0) {
		const emptyRoomMsg = `
			<p class="chat-room-no-selected">
			입장한 채팅방이 없습니다<br/>
			<a href="/prg/std/stdGroupList.do">스터디그룹 보러가기</a>
			</p>
		`;
		list.innerHTML = emptyRoomMsg;
		return;
	}


	// 안정적 정렬을 위해 원래 인덱스 보관 (서버 정렬 유지용 타이브레이커)
	const indexed = chatRoomList.map((room, idx) => {
	  const unread = unreadMap[room.crId] || 0;
	  // ⚠️ 프로젝트 필드명에 맞게 수정: enteredAt / joinAt / lastEnterAt 등
	  const memJoinedAt = room.memJoinedAt ? new Date(room.memJoinedAt).getTime() : 0;
	  return { room, unread, memJoinedAt, idx };
	});

	// 정렬 규칙: unread 내림차순 -> enteredAt 내림차순 -> 원래 순서(idx) asc
	indexed.sort((a, b) => {
	  if (a.unread !== b.unread) return b.unread - a.unread;
	  if (a.enteredAt !== b.enteredAt) return b.enteredAt - a.enteredAt;
	  return a.idx - b.idx;
	});

	// DOM 빌드: 리플로우 최소화를 위해 fragment 사용
	const frag = document.createDocumentFragment();

	indexed.forEach(({ room, unread }) => {
	  const wrapper = document.createElement("div");
	  wrapper.classList.add("chat-room-entry");
	  wrapper.dataset.crId = room.crId;

	  // 왼쪽: 채팅방 제목
	  const title = document.createElement("span");
	  title.textContent = room.crTitle;
	  title.classList.add("chat-room-title");

	  // 오른쪽: 읽지 않은 메시지 수 뱃지
	  const badge = document.createElement("span");
	  badge.classList.add("chat-unread-badge");
	  if (unread > 0) {
	    badge.style.display = "inline-block";
	    badge.textContent = String(unread);
	    // 접근성/툴팁용
	    badge.title = `읽지 않은 메시지 ${unread}건`;
	  } else {
	    badge.style.display = "none";
	    badge.textContent = "0";
	  }

	  wrapper.appendChild(title);
	  wrapper.appendChild(badge);
	  wrapper.onclick = () => printFetchMessages(wrapper);

	  frag.appendChild(wrapper);
	});

	list.appendChild(frag);
	// 채팅방 새로 개설한 사람 오픈해주기 위한 이벤트
	const newCrId = localStorage.getItem('newCrId');
	if(newCrId){
		const targetChatRoom = document.querySelector(`.chat-room-entry[data-cr-id="${newCrId}"]`);
		if(targetChatRoom){
			targetChatRoom.click();
		}
		localStorage.removeItem('newCrId');
	}
}

// 참여중인 채팅방 별 안읽은 갯수 받아오기 구독 -> 모달 열때 호출
function subscribeToUnreadDetail() {
    if (stompClient) {
        unreadDetailSubscription = stompClient.subscribe(`/sub/chat/unread/detail/${memId}`, (message) => {
			const data = JSON.parse(message.body);

			if(data.length >= 1){
				data.forEach(unreadVO =>{
					const crId = unreadVO.crId;
					const unreadCnt = unreadVO.unreadCnt;
					unreadCounts[crId] = unreadCnt;
					showUnreadBadge(crId);
				})
			}
        });
    }
}

// 채팅방 채팅 불러와서 채우기 -> 채팅방 목록 클릭했을 때 호출
async function printFetchMessages(el) {
    cleanInputDatas();

    document.getElementById('chat-modal').classList.add('mobile-show-chat');

    const crId = el.dataset.crId;
    document.getElementById('exitBtn').dataset.crId = crId;
    const chatTitle = el.querySelector('.chat-room-title').textContent;
    document.getElementById('chat-room-title').textContent = chatTitle;
    document.querySelector('.chat-room-meta').style.display = 'flex';

    const activeRoom = document.querySelectorAll('.chat-room-entry.active');
    if (activeRoom.length > 0) {
        activeRoom.forEach(room => room.classList.remove('active'));
    }
    el.classList.add('active');

    currentChatRoomId = crId;
    unreadCounts[crId] = 0;
    await removeUnreadBadge(crId);

    const resp = await fetch('/api/chat/totalUnread');
    const data = await resp.json();
    updateFloatingBadge(data.unreadCnt);

    if (chatRoomSubscription) {
        chatRoomSubscription.unsubscribe();
    }

    const container = document.getElementById('chat-container');
    container.innerHTML = "";

    const chatInput = document.getElementById('chat-input');

    fetch(`/api/chat/message/list?crId=${crId}`)
        .then(resp => resp.json())
        .then(data => {
            chatInput.style.display = 'flex';
            data.forEach(msgVO => appendMessage(msgVO));
        });

    const sub = stompClient.subscribe(`/sub/chat/room/${crId}`, (message) => {
        const msg = JSON.parse(message.body);
        if (currentChatRoomId === crId) {
            appendMessage(msg);
        }
    });
    chatRoomSubscription = sub;

    // ✅ History 상태 추가: 채팅방에 들어왔음을 기록
    history.pushState({ chatState: 'room' }, 'Chat Room');
}

// 소켓 연결 함수
function connectSocket() {
    const socket = new SockJS('/ws-stomp');
    stompClient = Stomp.over(socket);

	stompClient.debug = () => {};	// 콘솔 출력안되게 덮어쓰기
    stompClient.connect({}, (frame) => {
		// 연결된 직후 최초 전체 안읽음 갯수 받아오기
		fetch('/api/chat/totalUnread')
		.then(resp =>{
			if(!resp.ok) throw new Error('에러 발생');
			return resp.json();
		})
		.then(data =>{
			updateFloatingBadge(data.unreadCnt);
		})
		.catch(err=>{
			console.error(err);
		})

		// 플로팅 뱃지에 전체 안읽음 갯수를 세팅하기 위한 구독
		stompClient.subscribe(`/sub/chat/unread/summary/${memId}`, (message) => {
		    const { unreadCnt } = JSON.parse(message.body);
		    updateFloatingBadge(unreadCnt);
		});
    });
}


// 메시지 전송
function sendMessage(roomId, content, fileObj) {
	content = content.replace(/\n/g, '<br/>');

	if(fileObj && fileObj.files && fileObj.files.length>0){
		const msg = new FormData();
		msg.append('crId', roomId);
		msg.append('message', content);
		msg.append('memId', memId);
		msg.append('messageType', fileObj.messageType);

		for(let i=0; i<fileObj.files.length; i++){
			msg.append('files', fileObj.files[i]);
		}

		fetch(`/chat/message/upload`,{
			method : 'POST',
			headers : {},
			body : msg
		})
		.then(resp =>{
			if(!resp.ok) throw new Error('업로드 메시지 전송 실패')
				// 전송완료후 비우기
			cleanInputDatas();
		})
		.catch(err =>{
			console.error("파일채팅중 err : ", err);
		})
	}else{
	    const msg = {
	        crId: roomId,
	        message: content,
	        memId: memId, // 전역에서 선언된 로그인된 사용자 ID
	    };
	    stompClient.send("/pub/chat/message", {}, JSON.stringify(msg));
	}
}

// 첨부파일 있는 경우 사이즈를 표시해주기 위한 함수
function formatBytes(size) {
	if (size == null || size === 0) return '';
	const k = 1024, sizes = ['B','KB','MB','GB','TB'];
	let idx = 0;
	while(size > k){
		if(idx == 4) break;
		idx++;
		size /= k;
	}
	return `${size.toFixed(1)}${sizes[idx]}`
}

// 첨부파일에 대응하도록 파일메시지 만들어주기. appendMessage에서 호출됨
function buildFileItemsHTML(fileGroupId, files){
  return (files || []).map((f, idx) => {
    const seq   = f.fileSeq;
    const name  = f.fileOrgName;
    const size  = f.fileSize;
    const sizeLabel = size != null ? formatBytes(+size) : '';
    const ext   = f.fileExt;
    const href  = `/files/download?fileGroupId=${fileGroupId}&seq=${seq}`;

	let printName = name;
	if(name.length > 14){
		printName = name.slice(0,8)+"…"+name.slice(name.lastIndexOf('.'));
	}

    return `
      <div class="file-item" data-ext="${ext}" title="${escapeHtml(name)}">
        <div class="file-icon">${ext}</div>
        <div class="file-meta">
          <div class="file-name" title="${escapeHtml(name)}">${escapeHtml(printName)}</div>
          ${sizeLabel ? `<div class="file-size">${sizeLabel}</div>` : ''}
        </div>
        <a class="file-download-btn" href="${href}" download>다운로드</a>
      </div>
    `;
  }).join('');
}

// 파일이름에 특수기호 들어가버린경우 치환
function escapeHtml(s='') {
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

// 메시지 출력 -> messageType에 따라 분기처리.
function appendMessage(msgVO) {
    const container = document.getElementById('chat-container');
    const isMine = msgVO.memId == memId;

	const timeObj = new Date(msgVO.sentAt);
	const timeStr = `${(""+timeObj.getFullYear()).slice(-2)}. ${("0"+(timeObj.getMonth()+1)).slice(-2)}. ${("0"+(timeObj.getDate())).slice(-2)}. ${("0"+(timeObj.getHours())).slice(-2)}:${("0"+(timeObj.getMinutes())).slice(-2)}`;

	// 입장/퇴장 시스템 메시지 분기
	if (msgVO.messageType == 'enter' || msgVO.messageType == 'exit') {
	    const text = msgVO.messageType == 'enter'
	        ? `${msgVO.memNickname}님이 채팅방에 입장했습니다.`
	        : `${msgVO.memNickname}님이 채팅방에서 나갔습니다.`;

	    const systemHTML = `
	      <div class="message-box system">
	        <div class="system-message">${text}</div>
			<div class="chat-time system-time">${timeStr}</div>
	      </div>
	    `;
	    container.insertAdjacentHTML('beforeend', systemHTML);
		const messageEl = container.lastElementChild;
		hookMediaAutoScroll(container, messageEl);
	    scrollToBottom(container);
	    return;  // 여기서 끝내고 일반 메시지 렌더링은 건너뜀
	}

	if(msgVO.messageType == 'IMAGE'){
		const imgFile = msgVO.fileDetailList;
		// 나중에 불러오기 위해 전역변수 Map에다가 저장
		imageMsgStore.set(String(msgVO.msgId), imgFile);

		const first = imgFile[0];
		const moreN = imgFile.length - 1;

		const thumbHTML = `
		  <div class="img-thumb-wrap" data-msg-id="${escapeHtml(String(msgVO.msgId))}" data-index="0">
		    <img src="${first.filePath}" alt="${first.fileOrgName}">
		    ${moreN > 0 ? `<span class="img-more-badge">+${moreN}</span>` : ''}
		  </div>
		`;
		const chatHTML = `
		  <div class="message-box ${isMine ? 'mine' : 'other'}">
		    <div class="chat-meta">
		      ${isMine ? `<span class="chat-nickname">${msgVO.memNickname ?? ''}</span>` : '' }
		      <div class="profile-wrapper chat-profile">
		        <img class="profile-img" src="${msgVO.fileProfileStr ? msgVO.fileProfileStr : '/images/defaultProfileImg.png'}" />
		      </div>
		      ${isMine ? '' : `<span class="chat-nickname">${msgVO.memNickname ?? ''}</span>` }
		    </div>

		    <div class="chat-message ${isMine ? 'mine' : 'other'}">
		      ${msgVO.message ? `<div class="text-part" style="margin-bottom:6px;">${msgVO.message}</div>` : ''}
		      ${thumbHTML}
		    </div>

		    <div class="chat-time">${timeStr}</div>
		  </div>`;
		container.insertAdjacentHTML('beforeend', chatHTML);
		const messageEl = container.lastElementChild;
		hookMediaAutoScroll(container, messageEl);
		scrollToBottom(container);
		return;
	}

	if(msgVO.messageType == 'FILE'){
		const files = msgVO.fileDetailList;
		const filesHTML = buildFileItemsHTML(msgVO.fileGroupId, files);

		const chatHTML = `
		  <div class="message-box ${isMine ? 'mine' : 'other'}">
		    <div class="chat-meta">
		      ${isMine ? `<span class="chat-nickname">${msgVO.memNickname ?? ''}</span>` : '' }
		      <div class="profile-wrapper chat-profile">
		        <img class="profile-img" src="${msgVO.fileProfileStr ? msgVO.fileProfileStr : '/images/defaultProfileImg.png'}" />
		      </div>
		      ${isMine ? '' : `<span class="chat-nickname">${msgVO.memNickname ?? ''}</span>` }
		    </div>

		    <div class="chat-message ${isMine ? 'mine' : 'other'}">
		      ${msgVO.message ? `<div class="text-part" style="margin-bottom:6px;">${msgVO.message}</div>` : ''}
		      <div class="file-bubble-list">
		        ${filesHTML}
		      </div>
		    </div>

		    <div class="chat-time">${timeStr}</div>
		  </div>`;
		container.insertAdjacentHTML('beforeend', chatHTML);
		const messageEl = container.lastElementChild;
		hookMediaAutoScroll(container, messageEl);
		scrollToBottom(container);
		return;
	}

    const chatHTML = `
	<div class="message-box ${isMine ? 'mine' : 'other'}">
		<div class="chat-meta">
			${isMine ? `<span class="chat-nickname">${msgVO.memNickname}</span>` : '' }
			<div class="profile-wrapper chat-profile">
				<img class="profile-img" src="${msgVO.fileProfileStr ? msgVO.fileProfileStr : '/images/defaultProfileImg.png'}" />
			</div>
			${isMine ? '' : `<span class="chat-nickname">${msgVO.memNickname}</span>` }
		</div>
		<div class="chat-message ${isMine ? 'mine' : 'other'}">
			${msgVO.message}
		</div>
		<div class="chat-time">
		${timeStr}
		</div>
	</div>
					  `;
	container.insertAdjacentHTML('beforeend', chatHTML);
	const messageEl = container.lastElementChild;
	hookMediaAutoScroll(container, messageEl);
	scrollToBottom(container);
}

// 안읽음 UI 반영 (채팅방 목록)
function showUnreadBadge(roomId) {
	const listEl = document.getElementById('chatRoomList');
    const roomEl = document.querySelector(`.chat-room-entry[data-cr-id="${roomId}"]`);
    if (!roomEl) return;

	const unread = parseInt(unreadCounts[roomId] || 0, 10);
    const badge = roomEl.querySelector('.chat-unread-badge');
    if (badge) {
        badge.textContent = unreadCounts[roomId];
        badge.style.display = 'inline-block';
    }

	listEl.prepend(roomEl);
}

// 안읽음 UI 제거 (채팅방 목록)
async function removeUnreadBadge(roomId) {
    const roomEl = document.querySelector(`.chat-room-entry[data-cr-id="${roomId}"]`);
    if (!roomEl) return;

    const badge = roomEl.querySelector('.chat-unread-badge');
    if (badge) {
        badge.style.display = 'none';
        badge.textContent = "0";
    }

	// 서버에 해당 채팅방&현재 유저 전체 읽음으로 처리.
	await fetch(`/api/chat/updateRead?crId=${roomId}`, {
	    method: 'POST'
	}).then(res => {
	    if (!res.ok) throw new Error("서버 읽음 처리 실패");
	}).catch(err => {
	    console.error("읽음 처리 오류:", err);
	});

}

// 플로팅 버튼 안읽음 업데이트
function updateFloatingBadge(totalUnread) {
    const badge = document.getElementById("chatFloatingBadge");
    if (!badge) return;
    if (totalUnread && totalUnread > 0) {
        badge.textContent = totalUnread;
        badge.style.display = 'inline-block';
    } else {
        badge.textContent = "0";
        badge.style.display = 'none';
    }
}

function scrollToBottom(container){
	// paint가 끝난 다음 프레임에, 한 번 더 보정
	requestAnimationFrame(() => {
	  container.scrollTop = container.scrollHeight;
	  // 이미지가 늦게 커질 수 있으니 한 프레임 더
	  requestAnimationFrame(() => {
	    container.scrollTop = container.scrollHeight;
	  });
	});
}

function hookMediaAutoScroll(container, messageEl) {
  const mediaList = messageEl.querySelectorAll('img, video, audio');
  mediaList.forEach(el => {
    // img
    if (el.tagName === 'IMG') {
      if (!el.complete) {
        el.addEventListener('load', () => scrollToBottom(container), { once: true });
        el.addEventListener('error', () => scrollToBottom(container), { once: true });
      }
    }
    // video/audio
    if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO') {
      if (el.readyState < 1) {
        el.addEventListener('loadedmetadata', () => scrollToBottom(container), { once: true });
      }
    }
  });
}

// 1) 전역에 노출(필요시)되도록 이름 있는 함수로
function enableChatModalDragAndResize() {
  const modal  = document.getElementById('chat-modal');
  const header = modal?.querySelector('.chat-header');
  if (!modal || !header) return;

  // 1) 먼저 필요 상수
  const PAD = 8;

  // 2) 유틸 함수들
  function saveState(){
	const left  = modal.style.left;
	const top   = modal.style.top;
	const width = modal.style.width;
	const height= modal.style.height;
	const st = {
	  left:  (left  && left  !== 'auto') ? left  : null,
	  top:   (top   && top   !== 'auto') ? top   : null,
	  width: width  || null,
	  height:height || null,
	};
    localStorage.setItem('chatModal.state', JSON.stringify(st));
  }


  // 4) 이벤트 바인딩은 1회만
  if (modal.dataset.dragInit === '1') return;
  modal.dataset.dragInit = '1';

  let dragging = false;
  let startX=0, startY=0, startLeft=0, startTop=0;

  header.addEventListener('mousedown', (e)=>{
    if (e.button !== 0) return;
    dragging = true;
    window.__chatModalDragging = true;
    modal.classList.add('dragging');

    const r = modal.getBoundingClientRect();
    startLeft = r.left; startTop = r.top;
    startX = e.clientX; startY = e.clientY;

    // bottom/right 앵커 -> left/top 좌표계 전환
    modal.style.left   = `${r.left}px`;
    modal.style.top    = `${r.top}px`;
    modal.style.right  = 'auto';
    modal.style.bottom = 'auto';

    const onMove = (ev)=>{
      if (!dragging) return;
      let L = startLeft + (ev.clientX - startX);
      let T = startTop  + (ev.clientY - startY);
      const maxL = window.innerWidth  - modal.offsetWidth  - PAD;
      const maxT = window.innerHeight - modal.offsetHeight - PAD;
      modal.style.left = `${Math.max(PAD, Math.min(L, maxL))}px`;
      modal.style.top  = `${Math.max(PAD, Math.min(T, maxT))}px`;
    };
    const onUp = ()=>{
      if (!dragging) return;
      dragging = false;
      modal.classList.remove('dragging');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      saveState();
      setTimeout(()=>{ window.__chatModalDragging = false; }, 0);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    e.preventDefault();
  });

  if (!modal.__resizeObserver){
    modal.__resizeObserver = new ResizeObserver(()=>{
      clampIntoViewport(modal);
      saveState();
    });
    modal.__resizeObserver.observe(modal);
  }

  window.addEventListener('resize', ()=> clampIntoViewport(modal));
}

window.addEventListener('popstate', function(event) {
    const modal = document.getElementById('chat-modal');
    // 모달이 닫혀있으면 아무것도 안 함
    if (modal.style.display === 'none') {
        return;
    }

    const state = event.state;

    // History 상태가 없거나 chatState가 아니면 모달을 닫음 (목록 -> 닫기)
    if (!state || !state.chatState) {
        closeChatModal();
        return;
    }

    // History 상태가 'list'이면 채팅 목록을 보여줌 (채팅방 -> 목록)
    if (state.chatState === 'list') {
        modal.classList.remove('mobile-show-chat');
        // 구독 해제 및 현재 채팅방 ID 초기화
        if (chatRoomSubscription) {
            chatRoomSubscription.unsubscribe();
        }
        currentChatRoomId = null;
    }
});