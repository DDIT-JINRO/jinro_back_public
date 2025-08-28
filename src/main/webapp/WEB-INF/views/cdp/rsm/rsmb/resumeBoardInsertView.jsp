<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/rsm/rsmb/resumeBoardInsert.css">
<link rel="stylesheet" href="/css/comm/peer/teen/teenInsert.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">경력관리</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/sint/qestnlst/questionList.do">자기소개서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">모의면접</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">AI 피드백</a>
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
				<a href="/cdp/rsm/rsm/resumeList.do">경력 관리</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
			<a class="tab" href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			<a class="tab active" href="/cdp/rsm/rsmb/resumeBoardList.do">이력서 템플릿 게시판</a>
		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
		<div class="public-wrapper-main">
			<div class="titleSpace">
				<div class="insertTitle">제목</div>
				<input class="Insert-title" id="title" type="text" placeholder="제목을 입력하세요.">
			</div>
			<div class="Insert-write">
				<div class="editor-container">
					<div id="editor"></div>
				</div>

				<label class="file-label">PDF 미리보기</label>
				<div id="preview-container" class="preview-container">
					<div id="preview-list">미리보기할 PDF 파일이 없습니다.</div>
				</div>

				<label for="fileInput" class="file-label">파일 첨부</label>
				<div class="file-upload-container">
					<input type="file" id="fileInput" multiple>
					<ul id="fileList" class="file-list"></ul>
				</div>

				<div class="button-group">
					<button class="cancel-btn" id="backBtn">목록</button>
					<button class="submit-btn" id="submitBtn">등록</button>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/cdp/rsm/rsmb/resumeBoardInsert.js"></script>
</body>
</html>