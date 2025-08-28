<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="sec"	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <script src="/js/com/sockjs.min.js"></script>
  <script src="/js/com/stomp.min.js"></script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>상담 채팅</title>
  <link rel="stylesheet" href="/css/user-profile.css"/>
  <link rel="stylesheet" href="/css/cns/counselChat.css"/>
</head>
<body class="counsel-chat-body"
      data-cr-id="${crId }" data-counsel-id="${counselInfo.counselId }" data-my-id="${memId }" data-my-role="${memRole }"
      data-error-message="${errorMessage}">
  <div class="counsel-chat-app" data-error-message="">
    <!-- 좌측: 채팅 -->

    <section class="chat-pane">
      <header class="chat-header">
        <div class="peer">
          <!-- 이미지 없으니 이니셜로 대체 -->
		  <div class="profile-wrapper chat-mem-profile">
		  	<img class="profile-img" src="${memberInfos.counselor.memId == memId ? memberInfos.member.profileFilePath : memberInfos.counselor.profileFilePath}">
		  </div>
          <div class="peer-meta">
            <div class="peer-name" id="peerName">${memberInfos.counselor.memId == memId ? memberInfos.member.memName : memberInfos.counselor.memName}</div>
            <div class="peer-sub" id="peerMeta">${memberInfos.counselor.memId == memId ? '회원' : '상담사'}</div>
          </div>
        </div>
        <div class="header-actions">
        </div>
      </header>
	  <sec:authorize access="isAuthenticated()">
		  <!-- principal이 String(memId)라면 name도 동일하게 나옵니다 -->
		  <sec:authentication property="name" var="loginIdStr"/>
	  </sec:authorize>
      <main id="chatScroll" class="chat-scroll">
        <div class="sys-msg">상담 채팅방이 열렸습니다. 원활한 상담을 위해 예의를 지켜주세요.</div>

      </main>

      <footer class="chat-input">
        <div class="input-wrap">
          <textarea id="chatMessage" rows="1" placeholder="메시지를 입력하세요. Shift+Enter 줄바꿈"></textarea>
          <div class="input-actions">
            <label class="file-label" title="파일 선택">
              <input type="file" id="chatFile" hidden />
              <span>📎</span>
            </label>
            <button id="btnSend" class="send-btn" type="button">전송</button>
          </div>
        </div>
      </footer>
    </section>
<!-- ----------------------------------------------- -->
    <!-- 우측: 정보 패널 -->
    <aside class="side-pane" id="sidePane">

<!-- ----------------------------------------------- -->
<!-- ----------------------------------------------- -->
	      <!-- 공통 상단 프로필 카드 -->
	      <div class="profile-card">
	        <div class="avatar-lg-fallback">
	        	<div class="profile-wrapper chat-mem-profile">
				  	<img class="profile-img" src="${memberInfos.member.profileFilePath}">
				</div>
	        </div>
	        <div class="p-meta">
	          <div class="p-name" id="cardName">${memberInfos.member.memName }</div>
	          <div class="p-sub" id="cardSub">회원</div>
	        </div>
	      </div>
	   	  <!-- 상담사 화면: 회원 기본정보 + 상담 요청 요약 + 시스템 정보 -->
	      <section class="info-block" data-view="counselor">
	      <div class="blk-title">회원 기본정보</div>
	        <dl class="kv">
	          <dt>이메일</dt><dd>${memberInfos.member.memEmail }</dd>
	          <dt>전화</dt><dd>${memberInfos.member.memPhoneNumber }</dd>
	        </dl>
	      </section>

    	<section class="info-block" data-view="counselor">
	        <div class="blk-title">상담 요청 요약</div>
	        <div class="desc-box">${counselInfo.counselDescription }</div>
	    </section>

	      <!-- 공통 상단 프로필 카드 -->
	      <div class="profile-card">
	        <div class="profile-wrapper chat-mem-profile">
			  	<img class="profile-img" src="${memberInfos.counselor.profileFilePath}">
			</div>
	        <div class="p-meta">
	          <div class="p-name" id="cardName">${memberInfos.counselor.memName }</div>
	          <div class="p-sub" id="cardSub">상담사</div>
	        </div>
	      </div>

	      <!-- 회원 화면(기본): 상담사 정보 -->
	      <section class="info-block" data-view="user">
	        <div class="blk-title">상담사 정보</div>
	        <dl class="kv">
	          <dt>이메일</dt><dd>${memberInfos.counselor.memEmail }</dd>
	          <dt>전화</dt><dd>${memberInfos.counselor.memPhoneNumber }</dd>
	        </dl>
	      </section>
    </aside>
  </div>
<!-- ----------------------------------------------- -->

<script type="text/javascript">
const memId = '<sec:authentication property="name" />';
</script>
<script src="/js/include/cns/counselChat.js"></script>
</body>
</html>
