<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/ertds/qlfexm/selectQlfexmList.css">
<section class="channel education">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진학 정보</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/ertds/hgschl/selectHgschList.do">고등학교 정보</a>
		</div>
		<div class="channel-sub-section-itemIn">
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
				<a href="/ertds/qlfexm/selectQlfexmList.do">검정고시</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/ertds/qlfexm/selectQlfexmList.do">검정고시</a>
		</div>
		<div class="public-wrapper-main">
			<form method="get" action="/ertds/qlfexm/selectQlfexmList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="검정고시 내에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" /></svg>
						</button>
					</div>
				</div>
				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header is-active">
						<span>상세검색</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createdAtDesc" <c:if test="${paramValues.sortOrder[0] == 'createdAtDesc'}">checked</c:if> >
										<span>작성일 내림차순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createdAtAsc" <c:if test="${paramValues.sortOrder[0] == 'createdAtAsc'}">checked</c:if> >
										<span>작성일 오름차순</span>
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
				<span class="list-header__meta-item list-header__meta-item--source">[ 출처 : 국가평생교육진흥원 검정고시지원센터 ]</span>
				<p class="content-list__total-count">총 ${getTotal}건</p>
			</div>
			<div class="content-list">
				<div class="content-list__header">
					<span class="content-list__col content-list__col--no">번호</span>
					<span class="content-list__col content-list__col--title">제목</span>
					<span class="content-list__col content-list__col--agency">교육기관</span>
					<span class="content-list__col content-list__col--date">작성일</span>
				</div>

				<c:forEach var="item" items="${articlePage.content}">
					<div class="content-list__item" data-exam-id="${item.examId}">
						<div class="content-list__col content-list__col--no" data-label="번호">
							<span class="badge--number">${item.examId}</span>
						</div>
						<div class="content-list__col content-list__col--title" data-label="제목">
							<h3 class="content-list__title">${item.examTitle}</h3>
						</div>
						<div class="content-list__col content-list__col--agency" data-label="교육기관">${item.examAreaCode}</div>
						<div class="content-list__col content-list__col--date" data-label="작성일">
							<fmt:formatDate value="${item.examNotiDate}" pattern="yyyy. M. d." />
						</div>
					</div>
				</c:forEach>
				<c:if test="${empty articlePage.content}">
					<p class="content-list__no-results">검정고시 정보가 없습니다.</p>
				</c:if>
			</div>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:if test="${not empty paramValues.sortOrder[0]}">
						<c:param name="sortOrder" value="${paramValues.sortOrder[0] }"></c:param>
					</c:if>
				</c:url>
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:url var="pageUrl" value="${articlePage.url}">
						<c:param name="currentPage" value="${pNo}" />
						<c:if test="${not empty param.keyword}">
							<c:param name="keyword" value="${param.keyword}" />
						</c:if>
						<c:if test="${not empty paramValues.sortOrder[0]}">
							<c:param name="sortOrder" value="${paramValues.sortOrder[0] }"></c:param>
						</c:if>
					</c:url>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:if test="${not empty paramValues.sortOrder[0]}">
						<c:param name="sortOrder" value="${paramValues.sortOrder[0] }"></c:param>
					</c:if>
				</c:url>
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script src="/js/ertds/qlfexm/selectQlfexmList.js"></script>
</body>
</html>
