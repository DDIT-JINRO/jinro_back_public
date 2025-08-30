<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/mpg/mat/bmk/selectBookMarkList.css">
<section class="channel myPage">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">마이페이지</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/mpg/mif/inq/selectMyInquiryView.do">내 정보</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/mpg/mat/bmk/selectBookMarkList.do">나의 활동</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/mpg/pay/selectPaymentView.do">결제 구독내역</a>
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
				<a href="/mpg/mif/inq/selectMyInquiryView.do">마이페이지</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/mpg/mat/bmk/selectBookMarkList.do">나의 활동</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/mpg/mat/bmk/selectBookMarkList.do">북마크</a>
			<a class="tab" href="/mpg/mat/csh/selectCounselingHistoryList.do">상담 내역</a>
			<a class="tab" href="/mpg/mat/reh/selectResumeHistoryList.do">이력서</a>
			<a class="tab" href="/mpg/mat/sih/selectSelfIntroHistoryList.do">자기소개서</a>
		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
		<div class="public-wrapper-main">
			<form method="GET" action="/mpg/mat/bmk/selectBookMarkList.do" class="search-filter__form">
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
						<input type="search" name="keyword" class="search-filter__input" placeholder="내 북마크에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>

				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header" id="accordion-toggle">
						<span>필터</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel" id="accordion-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group-header">
								<span class="search-filter__group-title">북마크 필터</span>
							</div>
							<div class="search-filter__options">
								<label class="search-filter__option">
									<input id="all" type="radio" name="bmCategoryId" value="" ${empty param.bmCategoryId ? 'checked' : ''} />
									<span>전체</span>
								</label>
								<c:forEach var="bmCategory" items="${bmCategoryId}">
									<label class="search-filter__option">
										<input id="${bmCategory.key}" type="radio" name="bmCategoryId" value="${bmCategory.key}" ${param.bmCategoryId == bmCategory.key ? 'checked' : ''} />
										<span>${bmCategory.value}</span>
									</label>
								</c:forEach>
							</div>
							<button type="submit" class="search-filter__submit-button">검색</button>
						</div>
					</div>
				</div>
			</form>

			<c:choose>
				<c:when test="${empty articlePage.content || articlePage.content == null }">
					<p class="content-list__no-results">현재 북마크가 없습니다.</p>
				</c:when>
				<c:otherwise>
					<div class="content-list">
						<c:forEach var="bookmark" items="${articlePage.content}">
							<div class="content-list__item bookmark-item" data-bm-category="${bookmark.bmCategoryId}" data-bm-target-id="${bookmark.bmTargetId}" data-job-code="${bookmark.jobCode}">
								<div class="bookmark-content">
									<div class="bookmark-header">
										<span class="bookmark-category-tag">${bookmark.categoryName}</span>
										<h3 class="bookmark-title">${bookmark.title}</h3>
									</div>
									<c:if test="${bookmark.bmCategoryId != 'G03005'}">
										<p class="bookmark-snippet">${bookmark.content2}</p>
									</c:if>
									<div class="bookmark-meta">
										<span>${bookmark.content1}</span>
										<span class="meta-divider">·</span>
										<span>
											북마크일 :
											<fmt:formatDate value="${bookmark.bmCreatedAt}" pattern="yyyy. MM. dd" />
										</span>
									</div>
								</div>
								<div class="bookmark-action">
									<button class="bookmark-button is-active" data-category-id="${bookmark.bmCategoryId}" data-target-id="${bookmark.bmTargetId}">
										<span class="bookmark-button__icon--active">
											<img src="/images/bookmark-btn-active.png" alt="활성 북마크" width="30" height="30">
										</span>
										<span class="bookmark-button__icon--inactive">
											<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크" width="30" height="30">
										</span>
									</button>
								</div>
							</div>
						</c:forEach>
					</div>
					<c:if test="${empty articlePage.content}">
						<div class="content-list__no-results" style="grid-column: 1/-1;">검색 결과가 없습니다.</div>
					</c:if>
				</c:otherwise>
			</c:choose>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:forEach var="p" items="${param}">
						<c:if test="${p.key ne 'currentPage'}">
							<c:forEach var="v" items="${p.value}">
								<c:param name="${p.key}" value="${v}" />
							</c:forEach>
						</c:if>
					</c:forEach>
				</c:url>
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}">← Previous</a>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:url var="pageUrl" value="${articlePage.url}">
						<c:param name="currentPage" value="${pNo}" />
						<c:forEach var="p" items="${param}">
							<c:if test="${p.key ne 'currentPage'}">
								<c:forEach var="v" items="${p.value}">
									<c:param name="${p.key}" value="${v}" />
								</c:forEach>
							</c:if>
						</c:forEach>
					</c:url>
					<c:if test="${articlePage.total == 0 }">
						<c:set var="pNo" value="1"></c:set>
					</c:if>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}">${pNo}</a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:forEach var="p" items="${param}">
						<c:if test="${p.key ne 'currentPage'}">
							<c:forEach var="v" items="${p.value}">
								<c:param name="${p.key}" value="${v}" />
							</c:forEach>
						</c:if>
					</c:forEach>
				</c:url>
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}">Next →</a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/mpg/mat/bmk/selectBookMarkList.js"></script>
</html>