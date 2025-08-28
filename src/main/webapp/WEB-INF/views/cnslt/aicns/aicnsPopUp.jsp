<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AI 상담</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="stylesheet" href="/css/cnslt/aicns/aicnsPopUp.css">
<script src="/js/axios.min.js"></script>
</head>
<body>
	<div class="wrap">

		<!-- HEADER -->
		<header class="header">
			<div class="title">AI 상담</div>
			<span class="badge" id="topicBadge" data-topic="${topic }">주제: ${topicKr}</span> <span class="sep" aria-hidden="true"></span>
			<div class="note">대화는 저장되지 않습니다 · 팝업 종료 시 복구 불가</div>
			<button class="btn-ghost" id="btn-close">창 닫기</button>
		</header>

		<!-- ERROR BAR -->
		<div class="errorbar" id="errorBar"
		<c:if test="${errorMessage!=null and errorMessage!=''}">
		 data-message="${errorMessage }"
		 </c:if>
		 >
		</div>

		<!-- CHAT AREA -->
		<main id="chat" class="chat" aria-live="polite" aria-label="대화 내용">
			<div class="sys">상담을 시작해 보세요. 엔터로 전송, Shift+Enter는 줄바꿈.</div>
		</main>
		<button id="btnNewMsg" class="newmsg">새 메시지 보기 ↓</button>

		<!-- COMPOSER -->
		<footer class="composer">
			<textarea id="ta" class="ta" placeholder="질문을 입력하세요 (엔터로 전송, Shift+Enter 줄바꿈)" rows="1"></textarea>
			<button id="btnSend" class="btn" disabled>전송</button>
		</footer>
	</div>
	<script src="/js/cnslt/aicns/aicnsPopUp.js"></script>
</body>
</html>