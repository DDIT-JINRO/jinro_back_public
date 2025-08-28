<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/mpg/mif/whdwl/selectWithdrawalView.css">
<section class="channel" data-success-message="${successMessage}" data-error-message="${errorMessage}">
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
			<a class="tab" href="/mpg/mif/pswdchg/selectPasswordChangeView.do">비밀번호 변경</a>
			<a class="tab active" href="/mpg/mif/whdwl/selectWithdrawalView.do">회원 탈퇴</a>
		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
		<div class="public-wrapper-main">
			<div class="withdrawal-container">
				<div class="notice-box">
					<p>
						고객님께서 회원 탈퇴를 원하신다니 저희 홈페이지의 서비스가 많이 부족하고 미흡했나 봅니다.
						<br />
						불편하셨던 점이나 불만사항을 알려주시면 적극 반영해서 고객님께 만족을 드리는 서비스를 제공하도록 노력하겠습니다.
						<br />
					</p>
					<p>아울러 회원 탈퇴시의 아래 사항을 숙지하시기 바랍니다.</p>
					<ol>
						<li>탈퇴 처리는 1주일의 유예기간 이후에 삭제됩니다.</li>
						<li>유예기간 중 회원 탈퇴를 취소 할 수 있습니다.</li>
						<li>탈퇴 시 고객님께서 보유하던 포인트는 모두 삭제됩니다.</li>
					</ol>
				</div>

				<form class="withdrawal-form">
					<div class="form-row-split">
						<div class="form-group">
							<label for="password">비밀번호 입력</label>
							<input type="password" id="password" placeholder="비밀번호를 입력하세요." required>
							<p id="password-check-message"></p>
						</div>
						<div class="form-group">
							<label for="reason-select">무엇이 불편하셨나요?</label>
							<select id="reason-select" required>
								<option value="" selected disabled>무엇이 불편하셨나요?</option>
								<c:forEach var="category" items="${mdCategoryList}">
								<option value="${category.ccId}">${category.ccName}</option>
								</c:forEach>
							</select>
						</div>
					</div>

					<div class="form-group">
						<label for="reason-text">회원 탈퇴 사유에 대하여 적어주세요.</label>
						<textarea id="reason-text" rows="6" placeholder="회원 탈퇴 사유에 대하여 적어주시면, 더욱 안정적인 서비스 품질 향상을 위하여 노력하겠습니다." required></textarea>
					</div>

					<div class="button-wrapper">
						<button type="submit" class="btn btn-danger">탈퇴신청</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/mpg/mif/whdwl/selectWithdrawalView.js"></script>
</html>