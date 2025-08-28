<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/ertds/univ/uvsrch/univList.css">
<!-- 스타일 여기 적어주시면 가능 -->
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
			<a class="tab active" href="/ertds/univ/uvsrch/selectUnivList.do">대학 검색</a>
			<a class="tab" href="/ertds/univ/dpsrch/selectDeptList.do">학과 정보</a>
			<a class="tab" href="/ertds/univ/uvivfb/selectInterviewList.do">면접 후기</a>
		</div>
		<div class="public-wrapper-main">
			<form method="get" action="/ertds/univ/uvsrch/selectUnivList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="대학명으로 검색" value="${param.keyword}">
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
								<label class="search-filter__group-title">대학 지역</label>
								<div class="search-filter__options">
									<c:forEach var="region" items="${codeVORegionList}">
										<label class="search-filter__option">
											<input type="checkbox" name="regionIds" value="${region.ccId}" <c:forEach var="submittedRegion" items="${paramValues.regionIds}">
							                        <c:if test="${region.ccId eq submittedRegion}">checked</c:if>
							                    </c:forEach>>
											<span>${region.ccEtc}</span>
										</label>
									</c:forEach>
								</div>
							</div>
							<div class="search-filter__group">
								<label class="search-filter__group-title">대학 유형</label>
								<div class="search-filter__options">
									<c:forEach var="type" items="${codeVOUniversityTypeList}">
										<label class="search-filter__option">
											<!-- checked 속성 추가 -->
											<input type="checkbox" name="typeIds" value="${type.ccId}" <c:forEach var="submittedType" items="${paramValues.typeIds}">
							                        <c:if test="${type.ccId eq submittedType}">checked</c:if>
							                    </c:forEach>>
											<span>${type.ccName}</span>
										</label>
									</c:forEach>
								</div>
							</div>
							<div class="search-filter__group">
								<label class="search-filter__group-title">설립 유형</label>
								<div class="search-filter__options">
									<c:forEach var="gubun" items="${codeVOUniversityGubunList}">
										<label class="search-filter__option">
											<!-- checked 속성 추가 -->
											<input type="checkbox" name="gubunIds" value="${gubun.ccId}" <c:forEach var="submittedGubun" items="${paramValues.gubunIds}">
							                        <c:if test="${gubun.ccId eq submittedGubun}">checked</c:if>
							                    </c:forEach>>
											<span>${gubun.ccName}</span>
										</label>
									</c:forEach>
								</div>
							</div>
							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="nameAsc" <c:if test="${paramValues.sortOrder[0] == 'nameAsc'}">checked</c:if> >
										<span>대학명 오름차순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="nameDesc" <c:if test="${paramValues.sortOrder[0] == 'nameDesc'}">checked</c:if> >
										<span>대학명 내림차순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="deptCountDesc" <c:if test="${paramValues.sortOrder[0] == 'deptCountDesc'}">checked</c:if> >
										<span>학과 많은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="deptCountAsc" <c:if test="${paramValues.sortOrder[0] == 'deptCountAsc'}">checked</c:if> >
										<span>학과 적은순</span>
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
					<span class="content-list__col content-list__col--univ-name">대학명</span>
					<span class="content-list__col content-list__col--region">지역</span>
					<span class="content-list__col content-list__col--type">대학유형</span>
					<span class="content-list__col content-list__col--gubun">설립유형</span>
					<span class="content-list__col content-list__col--dept-count">설치학과</span>
					<span class="content-list__col content-list__col--bookmark">북마크</span>
				</div>

				<c:forEach var="university" items="${articlePage.content}">
					<div class="content-list__item" data-univ-id="${university.univId}">
						<div class="content-list__col content-list__col--univ-name" data-label="대학명">
							<div class="content-list__main-info">
								<h3 class="content-list__title">${university.univName}</h3>
							</div>
						</div>
						<div class="content-list__col content-list__col--region" data-label="지역">${university.univRegion}</div>
						<div class="content-list__col content-list__col--type" data-label="대학유형">${university.univType}</div>
						<div class="content-list__col content-list__col--gubun" data-label="설립유형">${university.univGubun}</div>
						<div class="content-list__col content-list__col--dept-count" data-label="설치학과">${university.deptCount}</div>
						<div class="content-list__col content-list__col--bookmark" data-label="북마크">
							<c:set var="isBookmarked" value="false" />
							<c:forEach var="bookmark" items="${bookMarkVOList}">
								<c:if test="${university.univId eq bookmark.bmTargetId}">
									<c:set var="isBookmarked" value="true" />
								</c:if>
							</c:forEach>
							<button class="bookmark-button ${isBookmarked ? 'is-active' : ''}" data-category-id="G03001" data-target-id="${fn:escapeXml(university.univId)}">
								<span class="bookmark-button__icon--active">
									<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
								</span>
								<span class="bookmark-button__icon--inactive">
									<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
								</span>
							</button>
						</div>
					</div>
				</c:forEach>
			</div>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:forEach var="regionId" items="${paramValues.regionIds}">
						<c:param name="regionIds" value="${regionId}" />
					</c:forEach>
					<c:forEach var="typeId" items="${paramValues.typeIds}">
						<c:param name="typeIds" value="${typeId}" />
					</c:forEach>
					<c:forEach var="gubunId" items="${paramValues.gubunIds}">
						<c:param name="gubunIds" value="${gubunId}" />
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
						<c:forEach var="regionId" items="${paramValues.regionIds}">
							<c:param name="regionIds" value="${regionId}" />
						</c:forEach>
						<c:forEach var="typeId" items="${paramValues.typeIds}">
							<c:param name="typeIds" value="${typeId}" />
						</c:forEach>
						<c:forEach var="gubunId" items="${paramValues.gubunIds}">
							<c:param name="gubunIds" value="${gubunId}" />
						</c:forEach>
						<c:param name="sortOrder" value="${paramValues.sortOrder[0] }" />
					</c:url>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:forEach var="regionId" items="${paramValues.regionIds}">
						<c:param name="regionIds" value="${regionId}" />
					</c:forEach>
					<c:forEach var="typeId" items="${paramValues.typeIds}">
						<c:param name="typeIds" value="${typeId}" />
					</c:forEach>
					<c:forEach var="gubunId" items="${paramValues.gubunIds}">
						<c:param name="gubunIds" value="${gubunId}" />
					</c:forEach>
					<c:param name="sortOrder" value="${paramValues.sortOrder[0] }" />
				</c:url>
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script type="text/javascript" src="/js/ertds/univ/uvsrch/univList.js"></script>