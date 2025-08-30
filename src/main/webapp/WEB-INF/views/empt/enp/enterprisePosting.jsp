<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/empt/enp/enterprisePosting.css">
<section class="channel employment">
	<div class="channel-title">
		<div class="channel-title-text">취업 정보</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/empt/ema/employmentAdvertisement.do">채용공고</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/empt/enp/enterprisePosting.do">기업정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/empt/cte/careerTechnicalEducation.do">직업교육</a>
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
				<a href="/empt/ema/employmentAdvertisement.do">취업 정보</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/empt/enp/enterprisePosting.do">기업정보</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/empt/enp/enterprisePosting.do">기업정보</a>
		</div>

		<div class="public-wrapper-main">
			<form method="get" action="/empt/enp/enterprisePosting.do" class="search-filter__form">
				<div class="search-filter__bar">
					<input type="search" name="keyword" class="search-filter__input" placeholder="기업명으로 검색">
					<button class="search-filter__button" type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
			                <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
			            </svg>
					</button>
				</div>

				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header" id="search-filter-toggle">
						<span>필터</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel" id="search-filter-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">기업 규모</label>
								<div class="search-filter__options">
									<c:forEach var="scale" items="${codeVOCompanyScaleList}">
										<label class="search-filter__option">
											<input type="checkbox" name="scaleId" value="${scale.ccId}">
											<span>${scale.ccName}</span>
										</label>
									</c:forEach>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">지역</label>
								<div class="search-filter__options">
									<%-- regionId는 CompanyVO의 필터링할 값입니다. value는 실제 데이터베이스 코드 값으로 매핑되어야 합니다. --%>
									<c:forEach var="region" items="${CodeVORegionList}">
										<label class="search-filter__option">
											<input type="checkbox" name="regionId" value="${region.ccId}">
											<span>${region.ccEtc}</span>
										</label>
									</c:forEach>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">채용여부</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="checkbox" name="hiringStatus" value="Y">
										<span>채용 중</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="hiringStatus" value="N">
										<span>채용 없음</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="reviewCntDesc" <c:if test="${paramValues.sortOrder[0] == 'reviewCntDesc'}">checked</c:if> >
										<span>후기 많은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="reviewAvgDesc" <c:if test="${paramValues.sortOrder[0] == 'reviewAvgDesc'}">checked</c:if> >
										<span>평점 높은순</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<div class="search-filter__group-header">
									<label class="search-filter__group-title">선택된 필터</label>
									<button type="button" class="search-filter__reset-button">초기화</button>
								</div>
								<div class="search-filter__selected-tags"></div>
							</div>
							<button type="submit" class="search-filter__submit-button">검색</button>
						</div>
					</div>
				</div>
			</form>
			<div class="source-div">
				<span class="list-header__meta-item list-header__meta-item--source">[ 출처 : 한국고용정보원 고용24 (구 워크넷) ]</span>
				<p class="content-list__total-count">총 ${articlePage.total}건</p>
			</div>
			<div style="display: none;" id="memId">${memId}</div>
			<div class="content-list">
				<div class="accordion-list__header">
					<span class="accordion-list__col accordion-list__col--image">기업이미지</span>
					<span class="accordion-list__col accordion-list__col--name">기업명</span>
					<span class="accordion-list__col accordion-list__col--scale">기업규모</span>
					<span class="accordion-list__col accordion-list__col--website">홈페이지</span>
					<span class="accordion-list__col accordion-list__col--bookmark">북마크</span>
					<span class="accordion-list__col accordion-list__col--toggle"></span>
				</div>

				<c:forEach var="company" items="${articlePage.content}" varStatus="status">
					<div class="accordion-list__item">
						<div class="accordion-list__item-header">
							<div class="accordion-list__col accordion-list__col--image">
								<img src="${company.cpImgUrl}" alt="기업 이미지" class="company-image">
							</div>
							<div class="accordion-list__col accordion-list__col--name">${company.cpName}</div>
							<div class="accordion-list__col accordion-list__col--scale">${company.ccName}</div>
							<div class="accordion-list__col accordion-list__col--website">
								<c:choose>
									<c:when test="${not empty company.cpWebsite}">
										<a href="${company.cpWebsite}" target="_blank" class="homepage-link">홈페이지</a>
									</c:when>
									<c:otherwise>
										<span class="no-homepage">홈페이지 없음</span>
									</c:otherwise>
								</c:choose>
							</div>
							<div class="accordion-list__col accordion-list__col--bookmark">
								<c:set var="isBookmarked" value="false" />
								<c:forEach var="bookmark" items="${bookMarkVOList}">
									<c:if test="${company.cpId eq bookmark.bmTargetId}">
										<c:set var="isBookmarked" value="true" />
									</c:if>
								</c:forEach>
								<button class="bookmark-button ${isBookmarked ? 'is-active' : ''}" data-category-id="G03002" data-target-id="${fn:escapeXml(company.cpId)}">
									<span class="bookmark-button__icon--active">
										<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
									</span>
									<span class="bookmark-button__icon--inactive">
										<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
									</span>
								</button>
							</div>
							<div class="accordion-list__col accordion-list__col--toggle">
								<div class="accordion-list__toggle-icon">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
			                        </svg>
								</div>
							</div>
						</div>
						<div class="accordion-list__item-content">
							<div class="accordion-list__content-body">
								<div class="company-description-section">
									<h4>기업 설명</h4>
									<p>${company.cpDescription}</p>
								</div>
								<div class="company-address-section">
									<h4>기업 주소</h4>
									<p>${company.cpRegion}</p>
								</div>
								<div class="company-hiring-status-section">
									<h4>현재 채용 여부</h4>
									<c:choose>
										<c:when test="${company.cpHiringStatus eq 'Y'}">
											<p>
												<a href="/empt/ema/employmentAdvertisement.do?keyword=${fn:escapeXml(company.cpName)}" class="hiring-link">채용 중 (채용공고 바로가기)</a>
											</p>
										</c:when>
										<c:otherwise>
											<p>채용 없음</p>
										</c:otherwise>
									</c:choose>
								</div>
								<div class="company-review-section">
									<h4>기업 면접 후기</h4>

									<c:set var="isReview" value="false" />

									<c:forEach var="interviewReview" items="${company.interviewReviewList}">
										<c:if test="${company.cpId eq interviewReview.targetId}">
											<div class="review-item">
												<div class="review-meta">
													<div class="review-author-rating">
														<span class="review-author">${interviewReview.memNickname}</span>

														<div class="review-rating ${interviewReview.irRating >= 4 ? 'high-rating' : (interviewReview.irRating <= 2 ? 'low-rating' : '')}">
															<div class="review-stars">
																<c:forEach var="i" begin="1" end="5">
																	<span class="review-star ${i <= interviewReview.irRating ? 'filled' : 'empty'}">★</span>
																</c:forEach>
															</div>
															<span class="review-rating-text">${interviewReview.irRating} / 5.0</span>
														</div>
													</div>

													<p class="review-date">
														<fmt:formatDate value="${interviewReview.irCreatedAt}" pattern="yyyy. M. d." />
													</p>
												</div>
												<p class="review-content">${interviewReview.irContent}</p>
											</div>
											<c:set var="isReview" value="true" />
										</c:if>
									</c:forEach>

									<c:if test="${!isReview}">
										<div class="no-review-message">등록된 면접 후기가 없습니다.</div>
									</c:if>
								</div>
							</div>
						</div>
					</div>
				</c:forEach>
			</div>

			<div class="pagination">
				<a href="${articlePage.url}?currentPage=${articlePage.startPage - 5}&keyword=${articlePage.keyword}
				<c:forEach var='scaleId' items='${paramValues.scaleId}'>&scaleId=${scaleId}</c:forEach>
				<c:forEach var='regionId' items='${paramValues.regionId}'>&regionId=${regionId}</c:forEach>
				<c:forEach var='hiringStatus' items='${paramValues.hiringStatus}'>&hiringStatus=${hiringStatus}</c:forEach>
				<c:if test="${paramValues.sortOrder != null}">&sortOrder=${paramValues.sortOrder[0]}</c:if>
				" class="pagination__link <c:if test='${articlePage.startPage < 6}'>pagination__link--disabled</c:if>"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:if test="${articlePage.total == 0 }">
						<c:set var="pNo" value="1"></c:set>
					</c:if>
					<a href="${articlePage.url}?currentPage=${pNo}&keyword=${articlePage.keyword}
					<c:forEach var='scaleId' items='${paramValues.scaleId}'>&scaleId=${scaleId}</c:forEach>
					<c:forEach var='regionId' items='${paramValues.regionId}'>&regionId=${regionId}</c:forEach>
					<c:forEach var='hiringStatus' items='${paramValues.hiringStatus}'>&hiringStatus=${hiringStatus}</c:forEach>
					<c:if test="${paramValues.sortOrder != null}">&sortOrder=${paramValues.sortOrder[0]}</c:if>
					" class="pagination__link <c:if test='${pNo == articlePage.currentPage}'>pagination__link--active</c:if>"> ${pNo} </a>
				</c:forEach>

				<a href="${articlePage.url}?currentPage=${articlePage.startPage + 5}&keyword=${articlePage.keyword}
				<c:forEach var='scaleId' items='${paramValues.scaleId}'>&scaleId=${scaleId}</c:forEach>
				<c:forEach var='regionId' items='${paramValues.regionId}'>&regionId=${regionId}</c:forEach>
				<c:forEach var='hiringStatus' items='${paramValues.hiringStatus}'>&hiringStatus=${hiringStatus}</c:forEach>
				<c:if test="${paramValues.sortOrder != null}">&sortOrder=${paramValues.sortOrder[0]}</c:if>
				" class="pagination__link <c:if test='${articlePage.endPage >= articlePage.totalPages}'>pagination__link--disabled</c:if>"> Next → </a>
			</div>

		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script type="text/javascript" src="/js/empt/enp/enterprisePosting.js"></script>
<script>

</script>