<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/insertInterviewFeedbackView.css">
<link rel="stylesheet" href="/css/cnslt/rvw/insertCnsReviewView.css">
<section class="channel counsel">
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">상담</div> 
	</div>
	<div class="channel-sub-sections">
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
					<h2 class="feedback-form__main-title">상담 후기 등록</h2>
					<p class="feedback-form__subtitle">작성해주신 상담 후기는 닉네임으로 등록됩니다.</p>
				</div>
				<div class="feedback-form__body">
					<div class="feedback-form__group">
						<div class="feedback-form__group-header">
							<h3 class="feedback-form__group-title">상담정보 입력</h3>
							<span class="feedback-form__required-info">※는 필수입력정보입니다</span>
						</div>
						<table class="feedback-form__table">
							<tbody>
								<tr>
									<th><label for="counsel-name">
											상담사
											<span class="feedback-form__required">*</span>
										</label></th>
									<td>
										<div class="input-group">
											<input type="text" id="counsel-name" class="input-group__text-input" data-cr-id="" placeholder="상담사명을 입력하세요." readonly required>
											<button type="button" id="counsel-history-search" class="input-group__button">과거 상담내역 검색</button>
										</div>
									</td>
								</tr>
								<tr>
									<th><label for="counsel-category">상담분야</label></th>
									<td><input type="text" id="counsel-category" class="input-group__text-input" placeholder="상담분야" readonly></td>
								</tr>
								<tr>
									<th><label for="counsel-method">상담방법</label></th>
									<td><input type="text" id="counsel-method" class="input-group__text-input" placeholder="상담방법" readonly></td>
								</tr>
								<tr>
									<th><label for="counsel-req-datetime">상담 일자</label></th>
									<td><input type="datetime-local" id="counsel-req-datetime" class="input-group__text-input" readonly></td>
								</tr>
								<tr>
									<th>상담 평가<span class="feedback-form__required">*</span></th>
									<td>
										<div class="rating-input" id="counsel-rating" data-rating="0">
											<div class="rating-input__stars">
												<span class="rating-input__star" data-value="1">★</span>
												<span class="rating-input__star" data-value="2">★</span>
												<span class="rating-input__star" data-value="3">★</span>
												<span class="rating-input__star" data-value="4">★</span>
												<span class="rating-input__star" data-value="5">★</span>
											</div>
											<span id="rating-text" class="rating-input__text">평가해주세요</span>
										</div>
										<p class="feedback-form__notice">상담 내용, 만족도 등을 종합적으로 평가해주세요.</p>
									</td>
								</tr>
								<tr>
									<th>상담 후기<span class="feedback-form__required">*</span></th>
									<td>
										<div class="input-group input-group--textarea">
											<textarea id="cr-content" class="input-group__textarea" placeholder="상담 이후 어떤 경험을 하셨나요?&#13;&#10;(사실이 아닌 비방이나 개인적인 의견은 등록이 거절될 수 있습니다.)" rows="5" maxlength="300" required></textarea>
										</div>
									</td>
								</tr>
								<tr>
									<th>공개여부</th>
									<td>
										<div class="form-radio-group">
											<label>
												<input type="radio" name="cr-public" value="Y" checked>
												공개
											</label>
											<label>
												<input type="radio" name="cr-public" value="N">
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
						<button class="feedback-form__button feedback-form__button--submit" id="submit-btn">등록</button>
					</div>
				</div>
			</div>
	        <button id="autoCompleteBtn" type="button" class="btn-submit" 
			style="position: absolute; top: 15px; right: 15px;">자동완성</button>
		</div>
	</div>

	<div class="search-modal" id="search-modal">
		<div class="search-modal__content">
			<button class="search-modal__close-button" type="button">&times;</button>
			<h3 class="search-modal__title">내 상담 내역 검색</h3>
			<p class="search-modal__subtitle">후기를 작성할 상담 내역을 선택해주세요.</p>
			<div class="search-modal__bar">
				<input type="text" id="modal-search-input" class="search-modal__input" placeholder="상담사명을 입력하세요" autocomplete="off">
				<button type="button" id="modal-search-btn" class="search-modal__button">검색</button>
			</div>
			<div class="search-modal__list-container">
				<ul id="modal-list" class="search-modal__list"></ul>
			</div>
			<div class="search-modal__pagination">
				<button type="button" id="prev-page" class="search-modal__page-button" disabled>이전</button>
				<span id="page-info">1 / 1</span>
				<button type="button" id="next-page" class="search-modal__page-button" disabled>다음</button>
			</div>
			<div class="search-modal__actions">
				<button class="search-modal__action-button search-modal__action-button--cancel" id="modal-cancel-btn">취소</button>
				<button class="search-modal__action-button search-modal__action-button--confirm" id="modal-confirm-btn" disabled>선택</button>
			</div>
		</div>
	</div>

</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script type="text/javascript" src="/js/cnslt/rvw/insertCnsReviewView.js"></script>
</html>