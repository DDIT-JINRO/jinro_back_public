<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/comm/peer/teen/teenInsert.css">
<c:if test="${not empty board.boardContent}">
	<script>
		const boardContent = `<c:out value="${board.boardContent}" escapeXml="false"/>`;
	</script>
</c:if>
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel community">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">커뮤니티</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-itemIn">
			<a href="/comm/peer/teen/teenList.do">또래 게시판</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/comm/path/pathList.do">진로/진학 게시판</a>
		</div>
	</div>
</section>

<div class="breadcrumb-container-space">
	<nav class="breadcrumb-container" aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a href="/">
					<i class="fa-solid fa-house"></i> 홈
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/comm/peer/teen/teenList.do">커뮤니티</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/comm/peer/teen/teenList.do">또래 게시판</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab" href="/comm/peer/teen/teenList.do">청소년 게시판</a>
			<a class="tab active" href="/comm/peer/youth/youthList.do">청년 게시판</a>
		</div>
		<div class="public-wrapper-main">
			<div class="titleSpace">
				<input type="hidden" id="boardId" name="boardId" value="${board.boardId}">
				<div class="insertTitle">제목</div>
				<input class="Insert-title" id="title" type="text" placeholder="제목을 입력하세요." value="${board.boardTitle}">
			</div>
			<div class="Insert-write">
				<div class="editor-container">
					<div id="editor"></div>
				</div>
				<label for="fileInput" class="file-label">파일 첨부</label>
				<div class="file-upload-container">
					<input type="file" id="fileInput" multiple>
					<ul id="fileList" class="file-list"></ul>
				</div>
				<div class="button-group">
					<button class="cancel-btn" id="backBtn">취소</button>
					<button class="submit-btn" id="submitBtn">수정완료</button>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/comm/peer/teen/teenBoardUpdate.js"></script>
</html>