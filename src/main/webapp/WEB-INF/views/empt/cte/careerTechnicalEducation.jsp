<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/empt/cte/careerTechnicalEducation.css">
<section class="channel">
	<div class="channel-title">
		<div class="channel-title-text">취업 정보</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/empt/ema/employmentAdvertisement.do">채용공고</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/empt/enp/enterprisePosting.do">기업정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
		</div>
		<div class="channel-sub-section-itemIn">
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
				<a href="/empt/cte/careerTechnicalEducation.do">직업교육</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/empt/cte/careerTechnicalEducation.do">직업교육</a>
		</div>

		<div class="public-wrapper-main">
			<form method="get" action="/empt/cte/careerTechnicalEducation.do" class="search-filter__form">
				<!-- 검색창을 userCommon.css 스타일로 변경 -->
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input type="search" name="keyword" class="search-filter__input" placeholder="직업훈련 기관 및 훈련명">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>

				<!-- 필터 아코디언을 userCommon.css 스타일로 변경 -->
				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header" id="search-filter-toggle">
						<span>필터</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel" id="search-filter-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">지역</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="서울">
										<span>서울특별시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="부산">
										<span>부산광역시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="대구">
										<span>대구광역시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="인천">
										<span>인천광역시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="광주">
										<span>광주광역시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="대전">
										<span>대전광역시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="울산">
										<span>울산광역시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="세종">
										<span>세종특별자치시</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="경기">
										<span>경기도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="강원">
										<span>강원도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="충북">
										<span>충청북도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="충남">
										<span>충청남도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="전북">
										<span>전라북도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="전남">
										<span>전라남도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="경북">
										<span>경상북도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="경남">
										<span>경상남도</span>
									</label>
									<label class="search-filter__option">
										<input type="checkbox" name="region" value="제주">
										<span>제주특별자치도</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="ratingDesc" <c:if test="${paramValues.sortOrder[0] == 'ratingDesc'}">checked</c:if> >
										<span>만족도 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="endDateDesc" <c:if test="${paramValues.sortOrder[0] == 'endDateDesc'}">checked</c:if> >
										<span>마감 임박순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="endDateAsc" <c:if test="${paramValues.sortOrder[0] == 'endDateAsc'}">checked</c:if> >
										<span>마감 늦은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="recruitCntDesc" <c:if test="${paramValues.sortOrder[0] == 'recruitCntDesc'}">checked</c:if> >
										<span>정원 많은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="recruitCntAsc" <c:if test="${paramValues.sortOrder[0] == 'recruitCntAsc'}">checked</c:if> >
										<span>정원 적은순</span>
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
				<span class="list-header__meta-item list-header__meta-item--source">[ 출처: 고용24 (국민내일배움카드 훈련과정) ]</span>
				<p class="content-list__total-count">총 ${articlePage.total}건</p>
			</div>
			<div class="content-list">
				<div class="accordion-list__header">
					<span class="accordion-list__col accordion-list__col--course">교육 과정명</span>
					<span class="accordion-list__col accordion-list__col--institution">교육기관명</span>
					<span class="accordion-list__col accordion-list__col--deadline">마감일</span>
					<span class="accordion-list__col accordion-list__col--score">만족도</span>
					<span class="accordion-list__col accordion-list__col--quota">정원</span>
					<span class="accordion-list__col accordion-list__col--toggle"></span>
				</div>

				<c:forEach var="data" items="${articlePage.content}" varStatus="status">
					<div class="accordion-list__item">
						<div class="accordion-list__item-header">
							<div class="accordion-list__col accordion-list__col--course">
								<c:choose>
									<c:when test="${fn:length(data.jtName) > 35}">
										${fn:substring(data.jtName, 0, 30)}...
									</c:when>
									<c:otherwise>
										${data.jtName}
									</c:otherwise>
								</c:choose>
							</div>
							<div class="accordion-list__col accordion-list__col--institution">${data.jtSchool}</div>
							<div class="accordion-list__col accordion-list__col--deadline">
								<fmt:formatDate value="${data.jtStartDate}" pattern="yyyy. M. d." />
							</div>
							<div class="accordion-list__col accordion-list__col--score">${data.jtScore}</div>
							<div class="accordion-list__col accordion-list__col--quota">${data.jtQuota}명</div>
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
								<div class="education-detail-section">
									<h4>교육 상세 정보</h4>
									<p><strong>교육명:</strong>&nbsp; ${data.jtName}</p>
									<p><strong>교육기관:</strong>&nbsp; ${data.jtSchool}</p>
									<p><strong>정원:</strong>&nbsp; ${data.jtQuota}명</p>
									<p><strong>교육 대상:</strong>&nbsp; ${data.jtTarget}</p>
									<p><strong>교육 평점:</strong>&nbsp; ${data.jtScore}점</p>
									<p><strong>훈련비:</strong>&nbsp; <fmt:formatNumber value="${data.jtFee}" type="currency" currencySymbol="" groupingUsed="true" /> 원</p>
									<p><strong>교육기관 주소:</strong>&nbsp; ${data.jtAddress}</p>
								</div>

								<div class="education-url-section">
									<h4>훈련 신청 사이트</h4>
									<c:if test="${not empty data.jtUrl}">
										<a href="${data.jtUrl}" target="_blank" class="education-link">사이트로 이동하기</a>
									</c:if>
									<c:if test="${empty data.jtUrl}">
										<p>제공되는 URL이 없습니다.</p>
									</c:if>
								</div>

								<div class="education-date-section">
									<h4>훈련 기간</h4>
									<div class="date-container">
										<label>
											훈련 시작일 :
											<fmt:formatDate value="${data.jtStartDate}" pattern="yyyy. M. d." />
										</label>
										<label>
											훈련 종료일 :
											<fmt:formatDate value="${data.jtEndDate}" pattern="yyyy. M. d." />
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</c:forEach>
			</div>
			<div class="pagination">
				<a href="${articlePage.url}?currentPage=${articlePage.startPage - 5 > 0 ? articlePage.startPage - 5 : 1}&keyword=${param.keyword}&status=${param.status}&region=${param.region}&sortOrder=${param.sortOrder}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<a href="${articlePage.url}?currentPage=${pNo}&keyword=${param.keyword}&status=${param.status}&region=${param.region}&sortOrder=${param.sortOrder}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<a href="${articlePage.url}?currentPage=${articlePage.endPage + 1 <= articlePage.totalPages ? articlePage.endPage + 1 : articlePage.totalPages}&keyword=${param.keyword}&status=${param.status}&region=${param.region}&sortOrder=${param.sortOrder}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/empt/cte/careerTechnicalEducation.js"></script>
