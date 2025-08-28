<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- 채팅 모달 -->
<div id="chat-modal">
	<div class="chat-header">
	  <span>채팅</span>
	  <button class="chat-modal__close-button" onclick="closeChatModal()">×</button>
	</div>

	<div class="chat-content">
	  <!-- 왼쪽: 채팅방 목록 -->
	  <div id="chatRoomList" class="chat-room-list">
	  </div>

	  <!-- 오른쪽: 채팅 메시지 및 입력 -->
	  <div class="chat-message-area">
		<div class="chat-room-meta">
		    <button class="chat-back-btn">‹</button>
		    <div class="chat-title" id="chat-room-title">제목영역</div>
		</div>
	    <div id="chat-container">
	    	<p class="chat-room-no-selected">목록에서 채팅방을 선택해주세요</p>
	    </div>
	    <div id="attach-preview-bar" class="attach-preview-bar" hidden>
			<div class="attach-preview-list" id="attachPreviewList"></div>
			<button type="button" id="clearAttachBtn" class="attach-clear-btn">취소</button>
		</div>
	    <div class="chat-input" id="chat-input">
	    	<div class="attach-group">
	      		<img id="chatImgBtn" class="chat-img-btn" src="/images/image-attach.png" title="사진첨부">
	      		<img id="chatFileBtn" class="chat-file-btn" src="/images/file-attach.png" title="파일첨부">
	      		<input type="file" id="attach-input-img" accept="image/*" multiple hidden/>
	      		<input type="file" id="attach-input-file" multiple hidden/>
	    	</div>
	    	<textarea id="chatMessageInput" placeholder="메시지를 입력하세요..."></textarea>
	    	<button id="sendMsgBtn">전송</button>
	    	<button id="exitBtn" data-cr-id>퇴장</button>
	    </div>

	    <!-- 이미지 확대 오버레이 -->
		<div id="img-overlay">
		  <div class="imgov-stage">
		    <button type="button" class="imgov-btn" id="imgov-prev">‹</button>
		    <div class="imgov-viewport">
		    	<img id="imgov-view" src="" alt="">
		    </div>
		    <button type="button" class="imgov-btn" id="imgov-next">›</button>

		    <div class="imgov-topbar">
		      <div class="imgov-caption">
		        <span id="imgov-name"></span>
		        <a id="imgov-download" class="imgov-download" href="" download>다운로드</a>
		      </div>
		      <button type="button" class="imgov-close" id="imgov-close">×</button>
		    </div>
		  </div>
		</div>
	  </div>
	</div>
</div>
<!-- 채팅 모달 끝 -->
<script>
let stompClient = null;	// 소켓 연결 객체
let currentChatRoomId = null; // 현재 보고 있는 채팅방 ID
let unreadCounts = {}; // 안 보고 있는 채팅방의 읽지 않은 메시지 수 관리
let chatRoomSubscription = null; // 채팅방 구독 관리. (현재 보고 있는 채팅방만 구독 : 채팅주고받기);
let unreadDetailSubscription = null; // 전체 채팅방별 안 읽은 갯수 구독 관리

</script>
<script type="text/javascript" src="/js/include/chatModal.js" ></script>