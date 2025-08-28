<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cnslt/rvw/updateCnsReviewView.css">
<link rel="stylesheet" href="/css/common/insertInterviewFeedbackView.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel counsel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">상담</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/cnslt/rvw/cnsReview.do">상담 후기</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cnslt/aicns/aicns.do">AI 상담</a>
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
				<a href="/cnslt/resve/crsv/reservation.do">상담</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/cnslt/rvw/cnsReview.do">상담 후기</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="#">상담 후기</a>
		</div>
		
		<div class="public-wrapper-main">
			<div class="feedback-form">
				<div class="feedback-form__header">
					<h2 class="feedback-form__main-title">상담 후기 수정</h2>
					<p class="feedback-form__subtitle">작성해주신 상담 후기는 닉네임으로 등록됩니다.</p>
				</div>
				<div class="feedback-form__body">
					<div class="feedback-form__group">
						<div class="feedback-form__group-header">
							<h3 class="feedback-form__group-title">상담정보</h3>
							<span class="feedback-form__required-info">※는 필수입력정보입니다</span>
						</div>
						<input type="hidden" id="cr-id" value="${counselingReview.crId}">
						<table class="feedback-form__table">
							<tbody>
								<tr>
									<th>상담사</th>
									<td><span class="feedback-form__readonly-text">${counselingReview.counselName}</span></td>
								</tr>
								<tr>
									<th>상담분야</th>
									<td><span class="feedback-form__readonly-text">${counselingReview.counselCategory}</span></td>
								</tr>
								<tr>
									<th>상담방법</th>
									<td><span class="feedback-form__readonly-text">${counselingReview.counselMethod}</span></td>
								</tr>
								<tr>
									<th>상담 일자</th>
									<td><span class="feedback-form__readonly-text">
											<fmt:formatDate value="${counselingReview.counselReqDatetime}" pattern="yyyy.MM.dd HH시 mm분" />
										</span></td>
								</tr>
								<tr>
									<th>상담 평가<span class="feedback-form__required">*</span></th>
									<td>
										<div class="rating-input" id="counsel-rating" data-rating="${counselingReview.crRate}">
											<div class="rating-input__stars">
												<span class="rating-input__star" data-value="1">★</span>
												<span class="rating-input__star" data-value="2">★</span>
												<span class="rating-input__star" data-value="3">★</span>
												<span class="rating-input__star" data-value="4">★</span>
												<span class="rating-input__star" data-value="5">★</span>
											</div>
											<span id="rating-text" class="rating-input__text">평가해주세요</span>
										</div>
										<p class="feedback-form__notice">상담 과정, 분위기, 상담사 대응 등을 종합적으로 평가해주세요.</p>
									</td>
								</tr>
								<tr>
									<th>상담 후기<span class="feedback-form__required">*</span></th>
									<td>
										<div class="input-group input-group--textarea">
											<textarea id="cr-content" class="input-group__textarea" placeholder="상담 이후 어떤 경험을 하셨나요?&#13;&#10;(사실이 아닌 비방이나 개인적인 의견은 등록이 거절될 수 있습니다.)" rows="5" maxlength="300" required>${counselingReview.crContent}</textarea>
										</div>
									</td>
								</tr>
								<tr>
									<th>공개여부</th>
									<td>
										<div class="form-radio-group">
											<label>
												<input type="radio" name="cr-public" value="Y" ${counselingReview.crPublic == 'Y' ? 'checked' : ''}>
												공개
											</label>
											<label>
												<input type="radio" name="cr-public" value="N" ${counselingReview.crPublic == 'N' ? 'checked' : ''}>
												비공개
											</label>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="feedback-form__actions">
						<button class="feedback-form__button feedback-form__button--cancel" id="back-btn">목록</button>
						<button class="feedback-form__button feedback-form__button--submit" id="submit-btn">수정</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script type="text/javascript" src="/js/cnslt/rvw/updateCnsReviewView.js"></script>
</html>