<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<!-- 스타일 여기 적어주시면 가능 -->
<link rel="stylesheet" href="/css/csc/not/notice.css">

<section class="channel serviceCenter">
	<!-- 여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">고객센터</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-itemIn">
			<a href="/csc/not/noticeList.do">공지사항</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/csc/faq/faqList.do">FAQ</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/csc/inq/inqryList.do" id="goToInq">1:1문의</a>
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
				<a href="/csc/not/noticeList.do">고객센터</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/csc/not/noticeList.do">공지사항</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/csc/not/noticeList.do">공지사항</a>
		</div>

		<div class="public-wrapper-main">
			<form method="get" action="/csc/not/noticeList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="공지사항 내에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" /></svg>
						</button>
					</div>
				</div>
				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header">
						<span>상세검색</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="latest" <c:if test="${param.sortOrder == 'latest'}">checked</c:if>>
										<span>작성일 최신순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="oldest" <c:if test="${param.sortOrder == 'oldest'}">checked</c:if>>
										<span>작성일 오래된순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="cnt" <c:if test="${param.sortOrder == 'cnt'}">checked</c:if>>
										<span>조회수 높은순</span>
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

			<div class="content-list">
				<div class="content-list__header">
					<span class="content-list__col content-list__col--no">번호</span>
					<span class="content-list__col content-list__col--title">제목</span>
					<span class="content-list__col content-list__col--count">조회수</span>
					<span class="content-list__col content-list__col--date">작성일</span>
				</div>

				<c:forEach var="notice" items="${getList}">
					<div class="content-list__item" data-notice-id="${notice.noticeId}">
						<div class="content-list__col content-list__col--no" data-label="번호">
							<span class="badge--number">${notice.noticeId}</span>
						</div>
						<div class="content-list__col content-list__col--title" data-label="제목">
							<h3 class="content-list__title">
								${notice.noticeTitle}
							    <c:if test="${!empty notice.fileGroupNo}">
									<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
									  <path d="M21.44 11.05l-9.19 9.19c-1.28 1.28-3.35 1.28-4.63 0s-1.28-3.35 0-4.63l9.19-9.19c.85-.85 2.23-.85 3.08 0s.85 2.23 0 3.08L12.8 16.6c-.42.42-1.1.42-1.52 0s-.42-1.1 0-1.52l7.07-7.07" stroke="gray" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</c:if>
							</h3>
						</div>
						<div class="content-list__col content-list__col--count" data-label="조회수">${notice.noticeCnt}</div>
						<div class="content-list__col content-list__col--date" data-label="작성일">
							<fmt:formatDate value="${notice.noticeCreatedAt}" pattern="yyyy. M. d." />
						</div>
					</div>
				</c:forEach>
				<c:if test="${empty getList}">
					<p class="content-list__no-results">공지사항이 없습니다.</p>
				</c:if>
			</div>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:if test="${not empty param.sortOrder}">
						<c:param name="sortOrder" value="${param.sortOrder}" />
					</c:if>
				</c:url>
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:url var="pageUrl" value="${articlePage.url}">
						<c:param name="currentPage" value="${pNo}" />
						<c:if test="${not empty param.keyword}">
							<c:param name="keyword" value="${param.keyword}" />
						</c:if>
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
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:if test="${not empty param.sortOrder}">
						<c:param name="sortOrder" value="${param.sortOrder}" />
					</c:if>
				</c:url>
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<!-- js 파일 -->
<script src="/js/csc/not/noticeList.js"></script>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
