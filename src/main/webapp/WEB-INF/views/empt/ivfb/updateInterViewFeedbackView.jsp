<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/insertInterviewFeedbackView.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel" data-error-message="${errorMessage}">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">취업 정보</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/empt/ema/employmentAdvertisement.do">채용공고</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/empt/enp/enterprisePosting.do">기업정보</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/empt/cte/careerTechnicalEducation.do">직업교육</a>
		</div>
	</div>
</section>
<div class="breadcrumb-container-space" data-error-message="${errorMessage}">
	<nav class="breadcrumb-container" aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a href="/">
					<i class="fa-solid fa-house"></i> 홈
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/empt/ema/employmentAdvertisement.do">취업 정보</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/empt/ivfb/interViewFeedback.do">면접후기</a>
		</div>
		<div class="public-wrapper-main">
			<div class="feedback-form">
				<div class="feedback-form__header">
					<h2 class="feedback-form__main-title">면접 후기 수정</h2>
					<p class="feedback-form__subtitle">작성해주신 면접 후기는 닉네임으로 등록됩니다.</p>
				</div>
				<div class="feedback-form__body">
					<div class="feedback-form__group">
						<div class="feedback-form__group-header">
							<h3 class="feedback-form__group-title">기본정보 입력</h3>
							<span class="feedback-form__required-info">※는 필수입력정보입니다</span>
						</div>
						<input type="hidden" value="${interviewReview.irId}" id="ir-id">
						<table class="feedback-form__table">
							<tbody>
								<tr>
									<th><label>기업명</label></th>
									<td><span class="feedback-form__readonly-text">${interviewReview.targetName}</span></td>
								</tr>
								<tr>
									<th><label>직무직업</label></th>
									<td><span class="feedback-form__readonly-text">${interviewReview.irApplication}</span></td>
								</tr>
								<tr>
									<th><label>면접 일자</label></th>
									<td><span class="feedback-form__readonly-text"><fmt:formatDate value="${interviewReview.irInterviewAt}" pattern="yyyy.MM.dd"/></span></td>
								</tr>
								<tr>
									<th>기업 평가 <span class="feedback-form__required">*</span></th>
									<td>
										<div class="rating-input" id="rating" data-rating="${interviewReview.irRating}">
											<div class="rating-input__stars">
												<span class="rating-input__star" data-value="1">★</span>
												<span class="rating-input__star" data-value="2">★</span>
												<span class="rating-input__star" data-value="3">★</span>
												<span class="rating-input__star" data-value="4">★</span>
												<span class="rating-input__star" data-value="5">★</span>
											</div>
											<span class="rating-input__text" id="rating-text">평가해주세요</span>
										</div>
										<p class="feedback-form__notice">면접 과정, 분위기, 기업 대응 등을 종합적으로 평가해주세요</p>
									</td>
								</tr>
								<tr>
									<th>면접 후기 <span class="feedback-form__required">*</span></th>
									<td>
										<div class="input-group input-group--textarea">
											<textarea id="interview-detail" class="input-group__textarea" placeholder="서류 합격 후 어떤 전형과 면접을 경험하셨나요?&#13;&#10;(사실이 아닌 비방이나 개인적인 의견은 등록이 거절될 수 있습니다.)" rows="5" maxlength="300" required>${interviewReview.irContent}</textarea>
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
<script type="text/javascript" src="/js/empt/ivfb/updateInterviewFeedbackView.js"></script>
</html>