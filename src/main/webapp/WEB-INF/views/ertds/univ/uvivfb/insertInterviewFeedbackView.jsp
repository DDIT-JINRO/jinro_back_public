<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/insertInterviewFeedbackView.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel education">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진학 정보</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-itemIn">
			<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/ertds/hgschl/selectHgschList.do">고등학교 정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/ertds/qlfexm/selectQlfexmList.do">검정고시</a>
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
				<a href="/ertds/univ/uvsrch/selectUnivList.do">진학 정보</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
			<a class="tab" href="/ertds/univ/uvsrch/selectUnivList.do">대학 검색</a>
			<a class="tab" href="/ertds/univ/dpsrch/selectDeptList.do">학과 정보</a>
			<a class="tab active" href="/ertds/univ/uvivfb/selectInterviewList.do">면접 후기</a>
		</div>
		<div class="public-wrapper-main">
			<div class="feedback-form">
				<div class="feedback-form__header">
					<h2 class="feedback-form__main-title">면접 후기 등록</h2>
					<p class="feedback-form__subtitle">작성해주신 면접 후기는 닉네임으로 등록됩니다.</p>
				</div>
				<div class="feedback-form__body">
					<div class="feedback-form__group">
						<div class="feedback-form__group-header">
							<h3 class="feedback-form__group-title">기본정보 입력</h3>
							<span class="feedback-form__required-info">※는 필수입력정보입니다</span>
						</div>
						<table class="feedback-form__table">
							<tbody>
								<tr>
									<th><label for="targetName">
											학교명
											<span class="feedback-form__required">*</span>
										</label></th>
									<td>
										<div class="input-group">
											<input type="text" id="targetName" class="input-group__text-input" data-univ-id="" placeholder="학교명을 입력하세요." readonly required>
											<button type="button" id="open-search-modal" class="input-group__button">입학지원 대학 검색</button>
										</div>
									</td>
								</tr>
								<tr>
									<th><label for="application">학과</label></th>
									<td><input type="text" id="application" class="input-group__text-input" placeholder="학과를 입력하세요." maxlength="25"></td>
								</tr>
								<tr>
									<th>면접 일자 <span class="feedback-form__required">*</span></th>
									<td>
										<div class="input-group">
											<input type="date" id="interviewDate" class="input-group__text-input" required>
										</div>
									</td>
								</tr>
								<tr>
									<th>대학 평가 <span class="feedback-form__required">*</span></th>
									<td>
										<div class="rating-input" id="rating" data-rating="0">
											<div class="rating-input__stars">
												<span class="rating-input__star" data-value="1">★</span>
												<span class="rating-input__star" data-value="2">★</span>
												<span class="rating-input__star" data-value="3">★</span>
												<span class="rating-input__star" data-value="4">★</span>
												<span class="rating-input__star" data-value="5">★</span>
											</div>
											<span class="rating-input__text">평가해주세요</span>
										</div>
										<p class="feedback-form__notice">면접 과정, 분위기, 대학 대응 등을 종합적으로 평가해주세요</p>
									</td>
								</tr>
								<tr>
									<th>면접 후기 <span class="feedback-form__required">*</span></th>
									<td>
										<div class="input-group input-group--textarea">
											<textarea id="interviewContent" class="input-group__textarea" placeholder="서류 합격 후 어떤 전형과 면접을 경험하셨나요?&#13;&#10;(사실이 아닌 비방이나 개인적인 의견은 등록이 거절될 수 있습니다.)" rows="5" maxlength="300" required></textarea>
										</div>
									</td>
								</tr>
								<tr>
									<th>증빙자료 첨부 <span class="feedback-form__required">*</span></th>
									<td>
										<p class="feedback-form__notice">
											대학명이 포함된 증빙 사진 또는 캡쳐를 첨부해주세요
											<span class="feedback-form__notice-ex">(O)면접 안내 문자, 이메일 등 (X)대학 건물, 본인 사진 등</span>
										</p>
										<div class="file-uploader">
											<div class="file-uploader__button-wrapper">
												<input type="file" name="file-input" id="file-input" class="file-uploader__input" accept="image/*" required>
												<label for="file-input" class="file-uploader__button">첨부하기</label>
											</div>
											<p class="file-uploader__filename">
												선택 파일 : <b></b>
											</p>
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
				<button id="autoCompleteBtn" type="button" class="btn-submit" style="position: absolute; top: 15px; right: 15px;">자동완성</button>
			</div>
		</div>
	</div>
</div>

<!-- 기업 검색 모달 -->
<div class="search-modal" id="searchModal">
	<div class="search-modal__content">
		<button class="search-modal__close-button" type="button">&times;</button>
		<h3 class="search-modal__title">입학지원 대학 검색</h3>
		<p class="search-modal__subtitle">입학에 지원하여 면접을 경험한 대학을 선택해주세요.</p>

		<div class="search-modal__bar">
			<input type="text" id="searchInput" class="search-modal__input" placeholder="대학명을 입력하세요" autocomplete="off">
			<button type="button" id="searchBtn" class="search-modal__button">검색</button>
		</div>

		<div class="search-modal__list-container">
			<ul id="searchResultList" class="search-modal__list"></ul>
		</div>

		<div class="search-modal__pagination">
			<button type="button" id="prevPage" class="search-modal__page-button" disabled>이전</button>
			<span id="pageInfo">1 / 1</span>
			<button type="button" id="nextPage" class="search-modal__page-button" disabled>다음</button>
		</div>

		<div class="search-modal__actions">
			<button class="search-modal__action-button search-modal__action-button--cancel" id="modalCancelBtn">취소</button>
			<button class="search-modal__action-button search-modal__action-button--confirm" id="modalConfirmBtn" disabled>선택</button>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/ertds/univ/uvivfb/insertInterviewFeedbackView.js"></script>
</body>
</html>