<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/ertds/univ/dpsrch/deptList.css">
<section class="channel education">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진학 정보</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
		</div>
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
		<div class="tab-container" id="tabs">
			<a class="tab" href="/ertds/univ/uvsrch/selectUnivList.do">대학 검색</a>
			<a class="tab active" href="/ertds/univ/dpsrch/selectDeptList.do">학과 정보</a>
			<a class="tab" href="/ertds/univ/uvivfb/selectInterviewList.do">면접 후기</a>
		</div>
		<div class="public-wrapper-main">
			<form method="get" action="/ertds/univ/dpsrch/selectDeptList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="학과명으로 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" /></svg>
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
								<label class="search-filter__group-title">계열</label>
								<div class="search-filter__options">
									<c:forEach var="lClass" items="${lClass}">
										<label class="search-filter__option">
											<c:set var="isChecked" value="false" />
											<c:forEach var="submittedLClass" items="${paramValues.lClassIds}">
												<c:if test="${lClass.ccId eq submittedLClass}">
													<c:set var="isChecked" value="true" />
												</c:if>
											</c:forEach>
											<input type="checkbox" name="lClassIds" value="${lClass.ccId}" ${isChecked ? 'checked' : ''}>
											<span>${lClass.ccName}</span>
										</label>
									</c:forEach>
								</div>
							</div>
							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="admissionDesc" <c:if test="${paramValues.sortOrder[0] == 'admissionDesc'}">checked</c:if> >
										<span>경쟁률 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="admissionAsc" <c:if test="${paramValues.sortOrder[0] == 'admissionAsc'}">checked</c:if> >
										<span>경쟁률 낮은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="employmentDesc" <c:if test="${paramValues.sortOrder[0] == 'employmentDesc'}">checked</c:if> >
										<span>취업률 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="employmentAsc" <c:if test="${paramValues.sortOrder[0] == 'employmentAsc'}">checked</c:if> >
										<span>취업률 낮은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="salaryDesc" <c:if test="${paramValues.sortOrder[0] == 'salaryDesc'}">checked</c:if> >
										<span>급여 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="salaryAsc" <c:if test="${paramValues.sortOrder[0] == 'salaryAsc'}">checked</c:if> >
										<span>급여 낮은순</span>
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
			<span class="list-header__meta-item list-header__meta-item--source">[ 출처 : 한국직업능력연구원 국가진로교육연구센터 (커리어넷) ]</span>
			<div class="content-list">
				<div class="content-list__header">
					<span class="content-list__col content-list__col--dept-name">학과명</span>
					<span class="content-list__col content-list__col--field">학과계열</span>
					<span class="content-list__col content-list__col--admission">입학경쟁률</span>
					<span class="content-list__col content-list__col--employment">취업률</span>
					<span class="content-list__col content-list__col--salary">첫월급 평균</span>
					<span class="content-list__col content-list__col--bookmark">북마크</span>
					<span class="content-list__col content-list__col--compare">비교</span>
				</div>
				<c:forEach var="univDept" items="${articlePage.content}">
					<div class="content-list__item" data-univdept-id="${univDept.uddId}">
						<div class="content-list__col content-list__col--dept-name" data-label="학과명">
							<h3 class="content-list__title">${univDept.uddMClass}</h3>
						</div>
						<div class="content-list__col content-list__col--field" data-label="학과계열">${univDept.uddLClass}</div>
						<div class="content-list__col content-list__col--admission" data-label="입학경쟁률">${univDept.admissionRate}</div>
						<div class="content-list__col content-list__col--employment" data-label="취업률">${univDept.empRate}%</div>
						<div class="content-list__col content-list__col--salary" data-label="첫월급 평균">${univDept.avgSalary}만원</div>
						<div class="content-list__col content-list__col--bookmark" data-label="북마크">
							<c:set var="isBookmarked" value="false" />

							<c:forEach var="bookmark" items="${bookMarkVOList}">
								<c:if test="${univDept.uddId eq bookmark.bmTargetId}">
									<c:set var="isBookmarked" value="true" />
								</c:if>
							</c:forEach>

							<button class="bookmark-button ${isBookmarked ? 'is-active' : ''}" data-category-id="G03006" data-target-id="${fn:escapeXml(univDept.uddId)}">
								<span class="bookmark-button__icon--active">
									<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
								</span>
								<span class="bookmark-button__icon--inactive">
									<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
								</span>
							</button>
						</div>
						<div class="content-list__col content-list__col--compare" data-label="비교">
							<label class="compare-button">
								<input type="checkbox" id="compare-btn${univDept.uddId}" name="jobLcls" value="${univDept.uddId}" data-dept-name="${univDept.uddMClass}" data-dept-sal="${univDept.avgSalary}" data-dept-emp="${univDept.empRate}" data-dept-admission="${univDept.admissionRate}" />
								<span>
									비교
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
	                             				<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143z" clip-rule="evenodd" />
	                         				</svg>
								</span>
							</label>
						</div>
					</div>
				</c:forEach>
			</div>

			<!-- 페이징 -->
			<!-- 페이징 -->
			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:forEach var="lClassId" items="${paramValues.lClassIds}">
						<c:param name="lClassIds" value="${lClassId}" />
					</c:forEach>
					<c:param name="sortOrder" value="${paramValues.sortOrder[0] }" />
				</c:url>
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:url var="pageUrl" value="${articlePage.url}">
						<c:param name="currentPage" value="${pNo}" />
						<c:if test="${not empty param.keyword}">
							<c:param name="keyword" value="${param.keyword}" />
						</c:if>
						<c:forEach var="lClassId" items="${paramValues.lClassIds}">
							<c:param name="lClassIds" value="${lClassId}" />
						</c:forEach>
						<c:param name="sortOrder" value="${paramValues.sortOrder[0] }" />
					</c:url>
					<c:if test="${articlePage.total == 0 }">
						<c:set var="pNo" value="1"></c:set>
					</c:if>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:forEach var="lClassId" items="${paramValues.lClassIds}">
						<c:param name="lClassIds" value="${lClassId}" />
					</c:forEach>
					<c:param name="sortOrder" value="${paramValues.sortOrder[0] }" />
				</c:url>
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<aside class="compare-popup compare-popup--dept">
	<header class="compare-popup__header">
		<div class="compare-popup__title-group">
			<img src="/images/deptCompareImg.png" alt="학과 비교" class="compare-popup__logo">
			<h2 class="compare-popup__title">학과 비교</h2>
		</div>
		<button type="button" class="compare-popup__close-button" aria-label="닫기">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E1E1E" width="28" height="28">
				<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path></svg>
		</button>
	</header>
	<div class="compare-popup__content">
		<div class="compare-popup__list"></div>
	</div>
	<footer class="compare-popup__footer">
		<button type="button" class="compare-popup__button compare-popup__button--clear">모두 삭제</button>
		<button type="button" class="compare-popup__button compare-popup__button--submit">학과 비교하기</button>
	</footer>
</aside>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script type="text/javascript" src="/js/ertds/univ/dpsrch/deptList.js"></script>