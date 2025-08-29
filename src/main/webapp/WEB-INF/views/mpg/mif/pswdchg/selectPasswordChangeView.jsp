<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/mpg/mif/pswdchg/selectPasswordChangeView.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel myPage" data-success-message="${successMessage}" data-error-message="${errorMessage}">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">마이페이지</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/mpg/mif/inq/selectMyInquiryView.do">내 정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/mpg/mat/bmk/selectBookMarkList.do">나의 활동</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/mpg/pay/selectPaymentView.do">결제 구독내역</a>
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
				<a href="/mpg/mif/inq/selectMyInquiryView.do">마이페이지</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/mpg/mif/inq/selectMyInquiryView.do">내 정보</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
			<a class="tab" href="/mpg/mif/inq/selectMyInquiryView.do">조회 및 수정</a>
			<a class="tab active" href="/mpg/mif/pswdchg/selectPasswordChangeView.do">비밀번호 변경</a>
			<a class="tab" href="/mpg/mif/whdwl/selectWithdrawalView.do">회원 탈퇴</a>
		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
		<div class="public-wrapper-main">
			<div class="password-change-container">
				<div class="notice-box">
					<ul>
						<li>비밀번호 변경 규칙</li>
						<li>- 비밀번호는 최소 8자 이상이어야 합니다.</li>
						<li>- 영문, 숫자, 특수문자를 포함해야 합니다.</li>
					</ul>
				</div>

				<div class="form-box">
					<div class="form-row">
						<label for="user-email">이메일 주소</label>
						<div class="input-wrapper">
							<input type="email" id="user-email" value="${member.memEmail}" disabled>
						</div>
					</div>
					<div class="form-row">
						<label for="old-password">현재 비밀번호</label>
						<div class="input-wrapper">
							<input type="password" id="old-password" placeholder="현재 커리어패스 비밀번호를 입력하세요.">
							<p class="validation-message"></p>
						</div>
					</div>
					<div class="form-row">
						<label for="new-password">비밀번호</label>
						<div class="input-wrapper">
							<input type="password" id="new-password" placeholder="새 커리어패스 비밀번호를 입력하세요.">
							<p class="validation-message"></p>
						</div>
					</div>
					<div class="form-row">
						<label for="confirm-password">비밀번호 확인</label>
						<div class="input-wrapper">
							<input type="password" id="confirm-password" placeholder="확인 비밀번호를 입력하세요.">
							<p class="validation-message"></p>
						</div>
					</div>
					<div class="button-wrapper">
						<button type="button" class="btn btn-primary" id="submit-btn">비밀번호 변경</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/mpg/mif/pswdchg/selectPasswordChangeView.js"></script>
</html>