/**
 *
 */
const crId = document.body.dataset.crId;
let stompClient = null;

document.addEventListener('DOMContentLoaded', function(){
	checkValidMember();

	if(memId && memId !='anonymousUser'){
		const msgInputBox = document.getElementById('chatMessage');
		const sendBtn 	  = document.getElementById('btnSend');

		// 소켓 연결
		connectSocket();

		sendBtn.addEventListener("click", function(){
			const msg = msgInputBox.value.trim();
			if(msg==null || msg==''){
				showConfirm2("메시지를 입력해주세요.","",
					() => {
					}
				);
				return;
			}
			sendMessage(crId, msg);
		})

		let composing = false;
		msgInputBox.addEventListener('compositionstart', ()=> composing = true);
		msgInputBox.addEventListener('compositionend',   ()=> composing = false);

		// Enter 전송은 keyup에서 처리(조합 종료 이후)
		msgInputBox.addEventListener('keyup', function(e){
		  if (e.key === 'Enter' && !e.shiftKey && !composing && !e.isComposing) {
		    e.preventDefault();
		    const msg = msgInputBox.value.trim();
		    if (msg) sendMessage(crId, msg);
		  }
		});
	}
})

// 소켓 연결 함수
function connectSocket() {
    const socket = new SockJS('/ws-stomp');
    stompClient = Stomp.over(socket);

	stompClient.debug = () => {};	// 콘솔 출력안되게 덮어쓰기
    stompClient.connect({}, (frame) => {
		// 소켓연결 완료후 기존 메시지 있으면 불러와서 APPEND
		fetch('/api/chat/message/list?crId='+crId)
		.then(resp =>{
			if(!resp.ok) throw new Error('에러 발생');
			return resp.json();
		})
		.then(data =>{
			if(data.length>0){
				data.forEach(msgVO =>{
					appendMsg(msgVO);
					const chatScroll = document.getElementById('chatScroll');
				    chatScroll.scrollTop = chatScroll.scrollHeight;
				})
			}
		})
		.catch(err=>{
			console.error(err);
		})


		stompClient.subscribe(`/sub/chat/counsel/${crId}`, (message) => {
			const msgVO = JSON.parse(message.body);
			appendMsg(msgVO);
		});
    });
}

// 메시지 전송
function sendMessage(crId, content) {
	content = content.replace(/\n/g, '<br/>');
    const msg = {
        crId: crId,
        message: content,
        memId: memId, // 전역에서 선언된 로그인된 사용자 ID
    };

    stompClient.send("/pub/chat/counsel", {}, JSON.stringify(msg));
	clearInput();
}

function getTimeStr(sentAt) {
	const timeObj = new Date(sentAt);
	const timeStr = `${(""+timeObj.getFullYear()).slice(-2)}. ${("0"+(timeObj.getMonth()+1)).slice(-2)}. ${("0"+(timeObj.getDate())).slice(-2)}. ${("0"+(timeObj.getHours())).slice(-2)}:${("0"+(timeObj.getMinutes())).slice(-2)}`;
	return timeStr;
}

function appendMsg(msgVO){
	const chatScroll = document.getElementById('chatScroll');

	const msgTextEl = document.createElement('div');
	msgTextEl.classList.add('msg-row');
	if(msgVO.memId == memId){
		msgTextEl.classList.add('mine');
	}else{
		msgTextEl.classList.add('other');
	}

	const msgText = `
	  <div class="bubble-avatar" style="display:none"></div>
	  <div class="bubble">
	   ${msgVO.memId != memId ? `<div class="bubble-name">${msgVO.memName}</div>`:''}
	    <div class="bubble-text">${msgVO.message}</div>
	    <div class="bubble-meta"><span class="time">${getTimeStr(msgVO.sentAt)}</span></div>
	  </div>
	`
	msgTextEl.innerHTML = msgText;
	chatScroll.appendChild(msgTextEl);
	chatScroll.scrollTop = chatScroll.scrollHeight;
}

function clearInput(){
	document.getElementById('chatMessage').value = '';
	document.getElementById('chatFile').value = '';
}

function checkValidMember(){
	const errMsg = document.body.dataset.errorMessage;
	if(errMsg && errMsg!=''){
		showConfirm2(errMsg,"",
			() => {
				location.href='/'						
			}
		);
	}
}