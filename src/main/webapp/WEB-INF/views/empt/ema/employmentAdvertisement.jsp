<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/empt/ema/employmentAdvertisement.css">
<section class="channel">
	<div class="channel-title">
		<div class="channel-title-text">취업 정보</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/empt/ema/employmentAdvertisement.do">채용공고</a>
		</div>
		<div class="channel-sub-section-item">
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
				<a href="/empt/ema/employmentAdvertisement.do">채용공고</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/empt/ema/employmentAdvertisement.do">채용공고</a>
		</div>
		<div class="public-wrapper-main">
			<form method="get" action="/empt/ema/employmentAdvertisement.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input type="search" name="keyword" class="search-filter__input" placeholder="제목 or 기업명 검색">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>

				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header" id="search-filter-toggle">
						<span>필터</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel" id="search-filter-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">직무</label>
								<div class="search-filter__options">
									<c:forEach var="hireClass" items="${CodeVOHireClassList}">
										<label class="search-filter__option">
											<input type="checkbox" name="hireClassCodeNames" value="${hireClass.ccId}">
											<span>${hireClass.ccName}</span>
										</label>
									</c:forEach>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">지역</label>
								<div class="search-filter__options">
									<c:forEach var="region" items="${CodeVORegionList}">
										<label class="search-filter__option">
											<input type="checkbox" name="regions" value="${region.ccId}">
											<span>${region.ccEtc}</span>
										</label>
									</c:forEach>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">채용유형</label>
								<div class="search-filter__options">
									<c:forEach var="hireType" items="${CodeVOHireTypeList}">
										<label class="search-filter__option">
											<input type="checkbox" name="hireTypeNames" value="${hireType.ccId}">
											<span>${hireType.ccName}</span>
										</label>
									</c:forEach>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">채용상태</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="checkbox" name="cpHiringStatus" value="Y">
										<span>채용 중</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="hireEndDesc" <c:if test="${paramValues.sortOrder[0] == 'hireEndDesc'}">checked</c:if> >
										<span>마감일 임박순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createdDesc" <c:if test="${paramValues.sortOrder[0] == 'createdDesc'}">checked</c:if> >
										<span>최신 공고순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createdAsc" <c:if test="${paramValues.sortOrder[0] == 'createdAsc'}">checked</c:if> >
										<span>과거 공고순</span>
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
			<div class="content-list">
				<div class="accordion-list__header">
					<span class="accordion-list__col accordion-list__col--title">공고명</span>
					<div class="accordion-list__col accordion-list__col--meta">
						<span class="accordion-list__col accordion-list__col--company">기업명</span>
						<span class="accordion-list__col accordion-list__col--type">고용형태</span>
						<span class="accordion-list__col accordion-list__col--hireEndDate">마감일</span>
						<span class="accordion-list__col accordion-list__col--bookmark">북마크</span>
					</div>
					<span class="accordion-list__col accordion-list__col--toggle"></span>
				</div>

				<c:forEach var="hire" items="${articlePage.content}" varStatus="status">
					<div class="accordion-list__item">
						<div class="accordion-list__item-header">
							<div class="accordion-list__col accordion-list__title">${hire.hireTitle}</div>
							<div class="accordion-list__col accordion-list__col--meta">
								<div class="accordion-list__col accordion-list__company">${hire.cpName}</div>
								<div class="accordion-list__col accordion-list__type">${hire.hireTypename}</div>
								<div class="accordion-list__col accordion-list__hireEndDate">
									<c:choose>
										<c:when test="${hire.dday >= 0}">D-${hire.dday}</c:when>
										<c:when test="${hire.dday < 0}">마감</c:when>
									</c:choose>
								</div>
								<div class="accordion-list__col accordion-list__bookmark">
									<c:set var="isBookmarked" value="false" />
									<c:forEach var="bookmark" items="${bookMarkVOList}">
										<c:if test="${hire.hireId eq bookmark.bmTargetId}">
											<c:set var="isBookmarked" value="true" />
										</c:if>
									</c:forEach>
									<button class="bookmark-button ${isBookmarked ? 'is-active' : ''}" data-category-id="G03003" data-target-id="${fn:escapeXml(hire.hireId)}">
										<span class="bookmark-button__icon--active">
											<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
										</span>
										<span class="bookmark-button__icon--inactive">
											<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
										</span>
									</button>
								</div>
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
								<div class="hire-description-section">
									<h4>채용 내용</h4>
									<p>${hire.hireDescription}</p>
								</div>
								<div class="hire-url-section">
									<h4>채용 홈페이지</h4>
									<a href="${hire.hireUrl}" target="_blank" class="homepage-link">홈페이지로 이동하기</a>
								</div>
								<div class="hire-date-section">
									<h4>채용 기간</h4>
									<div class="date-container">
										<label>
											공고 시작일 :
											<fmt:formatDate value="${hire.hireStartDate}" pattern="yyyy. M. d." />
										</label>
										<label>
											공고 마감일 :
											<span class="deadline-text <c:choose><c:when test="${hire.dday >= 0 and hire.dday <= 3}">deadline-imminent</c:when><c:when test="${hire.dday < 0}">deadline-passed</c:when></c:choose>">
												<fmt:formatDate value="${hire.hireEndDate}" pattern="yyyy. M. d." />
												<c:choose>
													<c:when test="${hire.dday >= 0}"> (D-${hire.dday})</c:when>
													<c:when test="${hire.dday < 0}"> (마감됨)</c:when>
												</c:choose>
											</span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</c:forEach>
			</div>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:param name="keyword" value="${articlePage.keyword}" />
					<c:forEach var="hireClassCodeNames" items="${paramValues.hireClassCodeNames}">
						<c:param name="hireClassCodeNames" value="${hireClassCodeNames}" />
					</c:forEach>
					<c:forEach var="regions" items="${paramValues.regions}">
						<c:param name="regions" value="${regions}" />
					</c:forEach>
					<c:forEach var="hireTypeNames" items="${paramValues.hireTypeNames}">
						<c:param name="hireTypeNames" value="${hireTypeNames}" />
					</c:forEach>
					<c:if test="${not empty param.sortOrder}">
						<c:param name="sortOrder" value="${param.sortOrder}" />
					</c:if>
				</c:url>
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:url var="pageUrl" value="${articlePage.url}">
						<c:param name="currentPage" value="${pNo}" />
						<c:param name="keyword" value="${articlePage.keyword}" />
						<c:forEach var="hireClassCodeNames" items="${paramValues.hireClassCodeNames}">
							<c:param name="hireClassCodeNames" value="${hireClassCodeNames}" />
						</c:forEach>
						<c:forEach var="regions" items="${paramValues.regions}">
							<c:param name="regions" value="${regions}" />
						</c:forEach>
						<c:forEach var="hireTypeNames" items="${paramValues.hireTypeNames}">
							<c:param name="hireTypeNames" value="${hireTypeNames}" />
						</c:forEach>
						<c:if test="${not empty param.sortOrder}">
							<c:param name="sortOrder" value="${param.sortOrder}" />
						</c:if>
					</c:url>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:param name="keyword" value="${articlePage.keyword}" />
					<c:forEach var="hireClassCodeNames" items="${paramValues.hireClassCodeNames}">
						<c:param name="hireClassCodeNames" value="${hireClassCodeNames}" />
					</c:forEach>
					<c:forEach var="regions" items="${paramValues.regions}">
						<c:param name="regions" value="${regions}" />
					</c:forEach>
					<c:forEach var="hireTypeNames" items="${paramValues.hireTypeNames}">
						<c:param name="hireTypeNames" value="${hireTypeNames}" />
					</c:forEach>
					<c:if test="${not empty param.sortOrder}">
						<c:param name="sortOrder" value="${param.sortOrder}" />
					</c:if>
				</c:url>
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/empt/ema/employmentAdvertisement.js"></script>
</body>
</html>