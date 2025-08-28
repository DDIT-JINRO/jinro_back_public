<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/csc/inq/insertInq.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel serviceCenter">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">고객센터</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/csc/not/noticeList.do">공지사항</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/csc/faq/faqList.do">FAQ</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/csc/inq/inqryList.do">1:1문의</a>
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
				<a href="/csc/not/noticeList.do">고객센터</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/csc/inq/inqryList.do">1:1문의</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/csc/inq/inqryList.do">1:1 문의</a>
		</div>

		<div class="public-wrapper-main">
			<div class="form-container">
				<div class="form-group">
					<label for="post-title" class="form-label">문의 제목</label>
					<input type="text" placeholder="제목을 입력하세요" class="form-input" id="post-title" />
				</div>

				<div class="form-group">
					<label for="description" class="form-label">문의 내용</label>
					<textarea class="form-textarea" placeholder="문의 내용을 작성하세요" id="description"></textarea>
				</div>

				<div class="detail__actions">
					<button id="btnCancel" class="detail__action-button detail__action-button--secondary" onclick="location.href='/csc/inq/inqryList.do'">취소</button>
					<button id="btnSubmit" class="detail__action-button" onclick="insertInq()">등록</button>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/csc/inq/insertInq.js"></script>
</body>
</html>