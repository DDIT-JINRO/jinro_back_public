<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/pse/cr/crl/selectCareerList.css">
<section class="channel careerQuest">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진로 탐색</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item"><a href="/pse/cat/careerAptitudeTest.do">진로 심리검사</a></div>
		<div class="channel-sub-section-itemIn"><a href="/pse/cr/crl/selectCareerList.do">직업백과</a></div>
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
				<a href="/pse/cat/careerAptitudeTest.do">진로 탐색</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/pse/cr/crl/selectCareerList.do">직업백과</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/pse/cr/crl/selectCareerList.do">직업 목록</a>
			<a class="tab" id="goToRkJob" href="/pse/cr/crr/selectCareerRcmList.do">추천 직업</a>
		</div>

		<div class="public-wrapper-main">
			<form method="GET" action="/pse/cr/crl/selectCareerList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__select-wrapper">
						<select name="status" class="search-filter__select">
							<option value="all">전체</option>
							<option value="title">제목</option>
							<option value="content">내용</option>
						</select>
						<svg class="search-filter__select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
							</svg>
					</div>
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="직업 목록에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
									<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
								</svg>
						</button>
					</div>
				</div>

				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header">
						<span>필터</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">직업 대분류</label>
								<div class="search-filter__options">
									<c:forEach var="jobLcl" items="${jobLclCode}">
										<c:set var="isChecked" value="${false}" />
										<c:forEach var="submittedLcl" items="${paramValues.jobLcls}">
											<c:if test="${jobLcl.key eq submittedLcl}">
												<c:set var="isChecked" value="${true}" />
											</c:if>
										</c:forEach>
										<label class="search-filter__option">
											<input id="${jobLcl.key}" type="checkbox" name="jobLcls" value="${jobLcl.key}" ${isChecked ? 'checked' : ''} />
											<span>${jobLcl.value}</span>
										</label>
									</c:forEach>
								</div>
							</div>
							<div class="search-filter__group">
								<label class="search-filter__group-title">연봉</label>
								<div class="search-filter__options">
									<c:forEach var="salOption" items="<%=new String[] {\"sal1\",\"sal2\",\"sal3\",\"sal4\" }%>">
										<c:set var="salLabels" value="${{'sal1':'3000천만원 미만', 'sal2':'3천만원 이상 5천만원 미만', 'sal3':'5천만원 이상 1억원 미만', 'sal4':'1억원 이상'}}" />
										<c:set var="isSalChecked" value="${false}" />
										<c:forEach var="submittedSal" items="${paramValues.jobSals}">
											<c:if test="${salOption eq submittedSal}">
												<c:set var="isSalChecked" value="${true}" />
											</c:if>
										</c:forEach>
										<label class="search-filter__option">
											<input id="${salOption}" type="checkbox" name="jobSals" value="${salOption}" ${isSalChecked ? 'checked' : ''} />
											<span>${salLabels[salOption]}</span>
										</label>
									</c:forEach>
								</div>
							</div>
							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="salDesc" <c:if test="${paramValues.sortOrder[0] == 'salDesc'}">checked</c:if> >
										<span>연봉 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="prospectDesc" <c:if test="${paramValues.sortOrder[0] == 'prospectDesc'}">checked</c:if> >
										<span>전망 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="staisDesc" <c:if test="${paramValues.sortOrder[0] == 'satisDesc'}">checked</c:if> >
										<span>만족도 높은순</span>
									</label>
								</div>
							</div>
							<div class="search-filter__group">
								<div class="search-filter__group-header">
									<label class="search-filter__group-title">선택된 필터</label>
									<button type="button" class="search-filter__reset-button">초기화</button>
								</div>
								<div class="search-filter__selected-tags">
									<c:forEach var="submittedLcl" items="${paramValues.jobLcls}">
										<span class="search-filter__tag" data-group="jobLcls" data-value="${submittedLcl}">
											직업 대분류 > ${jobLclCode[submittedLcl]}
											<button type="button" class="search-filter__tag-remove">×</button>
										</span>
									</c:forEach>
									<c:forEach var="submittedSal" items="${paramValues.jobSals}">
										<c:set var="salLabels" value="${{'sal1':'3000천만원 미만', 'sal2':'3천만원 이상 5천만원 미만', 'sal3':'5천만원 이상 1억원 미만', 'sal4':'1억원 이상'}}" />
										<span class="search-filter__tag" data-group="jobSals" data-value="${submittedSal}">
											연봉 > ${salLabels[submittedSal]}
											<button type="button" class="search-filter__tag-remove">×</button>
										</span>
									</c:forEach>
									<c:forEach var="sortOrder" items="${paramValues.sortOrder}">
										<span class="search-filter__tag" data-group="sortOrder" data-value="${sortOrder}">
										<c:set var="sortLabels" value="${{'salDesc':'연봉 높은 순', 'prospectDesc':'전망 높은 순', 'staisDesc':'만족도 높은 순'}}" />
											정렬 > ${sortLabels[sortOrder]}
											<button type="button" class="search-filter__tag-remove">×</button>
										</span>
									</c:forEach>
								</div>
							</div>
							<button type="submit" class="search-filter__submit-button">검색</button>
						</div>
					</div>
				</div>
			</form>

			<span class="list-header__meta-item list-header__meta-item--source">[ 출처 : 한국고용정보원 고용24 (구 워크넷) ]</span>
			<c:choose>
				<c:when test="${empty articlePage.content || articlePage.content == null }">
					<p class="content-list__no-results">해당 직업 목록이 없습니다.</p>
				</c:when>
				<c:otherwise>
					<div class="content-list">
						<div class="content-list__header">
							<span class="content-list__header-col content-list__header-col--main">직업명</span>
							<span class="content-list__header-col content-list__header-col--meta">직업 정보</span>
							<div class="content-list__actions">
								<span class="content-list__header-col content-list__header-col--bookmark">북마크</span>
								<span class="content-list__header-col content-list__header-col--compare">비교</span>
							</div>
						</div>

						<c:forEach var="jobs" items="${articlePage.content}">
							<div class="content-list__item" data-job-id="${jobs.jobCode}">
								<div class="content-list__main-info">
									<h3 class="content-list__title">${jobs.jobName}</h3>
									<p class="content-list__snippet">${jobs.jobMainDuty}</p>
								</div>
								<div class="content-list__meta-group">
									<div class="content-list__meta-item">
										<div class="content-list__meta-icon">
											<img src="/images/jobAverageImg.png" alt="연봉">
										</div>
										<div>
											<h4 class="content-list__meta-title">평균 연봉</h4>
											<p class="content-list__meta-value">${jobs.averageSal}</p>
										</div>
									</div>
									<div class="content-list__meta-item">
										<div class="content-list__meta-icon">
											<img src="/images/jobProspectImg.png" alt="전망">
										</div>
										<div>
											<h4 class="content-list__meta-title">미래 전망</h4>
											<p class="content-list__meta-value">${jobs.prospect}</p>
										</div>
									</div>
									<div class="content-list__meta-item">
										<div class="content-list__meta-icon">
											<img src="/images/jobSatisImg.png" alt="만족도">
										</div>
										<div>
											<h4 class="content-list__meta-title">만족도</h4>
											<p class="content-list__meta-value">${jobs.jobSatis}</p>
										</div>
									</div>
								</div>
								<div class="content-list__actions">
									<button class="bookmark-button ${jobs.isBookmark == job.jobTargetId ? '' : 'is-active' }" data-category-id="G03004" data-target-id="${jobs.jobTargetId}">
										<span class="bookmark-button__icon--active">
											<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
										</span>
										<span class="bookmark-button__icon--inactive">
											<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
										</span>
									</button>
									<label class="compare-button">
										<input type="checkbox" id="compare-btn${jobs.jobCode}" name="jobLcls" value="${jobs.jobCode}" data-job-name="${jobs.jobName}" data-job-sal="${jobs.averageSal}" data-job-prospect="${jobs.prospect}" data-job-satis="${jobs.jobSatis}" />
										<span>
											비교
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
												<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143z" clip-rule="evenodd" /></svg>
										</span>
									</label>
								</div>
							</div>
						</c:forEach>
					</div>
				</c:otherwise>
			</c:choose>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:if test="${not empty param.status}">
						<c:param name="status" value="${param.status}" />
					</c:if>
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:forEach var="jobLcl" items="${paramValues.jobLcls}">
						<c:param name="jobLcls" value="${jobLcl}" />
					</c:forEach>
					<c:forEach var="jobSal" items="${paramValues.jobSals}">
						<c:param name="jobSals" value="${jobSal}" />
					</c:forEach>
					<c:if test="${not empty param.sortOrder}">
						<c:param name="sortOrder" value="${param.sortOrder}" />
					</c:if>
				</c:url>
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:url var="pageUrl" value="${articlePage.url}">
						<c:param name="currentPage" value="${pNo}" />
						<c:if test="${not empty param.status}">
							<c:param name="status" value="${param.status}" />
						</c:if>
						<c:if test="${not empty param.keyword}">
							<c:param name="keyword" value="${param.keyword}" />
						</c:if>
						<c:forEach var="jobLcl" items="${paramValues.jobLcls}">
							<c:param name="jobLcls" value="${jobLcl}" />
						</c:forEach>
						<c:forEach var="jobSal" items="${paramValues.jobSals}">
							<c:param name="jobSals" value="${jobSal}" />
						</c:forEach>
						<c:if test="${not empty param.sortOrder}">
							<c:param name="sortOrder" value="${param.sortOrder}" />
						</c:if>
					</c:url>
					<c:if test="${articlePage.total == 0 }">
						<c:set var="pNo" value="1"></c:set>
					</c:if>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:if test="${not empty param.status}">
						<c:param name="status" value="${param.status}" />
					</c:if>
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:forEach var="jobLcl" items="${paramValues.jobLcls}">
						<c:param name="jobLcls" value="${jobLcl}" />
					</c:forEach>
					<c:forEach var="jobSal" items="${paramValues.jobSals}">
						<c:param name="jobSals" value="${jobSal}" />
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

<aside class="compare-popup">
	<header class="compare-popup__header">
		<div class="compare-popup__title-group">
			<img src="/images/jobCompareImg.png" alt="직업 비교" class="compare-popup__logo">
			<h2 class="compare-popup__title">직업 비교</h2>
		</div>
		<button type="button" class="compare-popup__close-button" aria-label="닫기">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E1E1E" width="28" height="28">
				<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>
		</button>
	</header>
	<div class="compare-popup__content">
		<div class="compare-popup__list"></div>
	</div>
	<footer class="compare-popup__footer">
		<button type="button" class="compare-popup__button compare-popup__button--clear">모두 삭제</button>
		<button type="button" class="compare-popup__button compare-popup__button--submit">직업 비교하기</button>
	</footer>
</aside>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/pse/cr/crl/selectCareerList.js"></script>
</html>