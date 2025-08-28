<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/mpg/mat/csh/selectCounselingHistoryList.css">

<section class="channel">
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">상담</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cnslt/rvw/cnsReview.do">상담 후기</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cnslt/aicns/aicns.do">AI 상담</a>
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
				<a href="/cnslt/resve/crsv/reservation.do">상담</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/cnslt/resve/crsv/reservation.doo">상담 예약</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab " href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
			<a class="tab active" href="/cnslt/resve/cnsh/counselingReserveHistory.do">상담 내역</a>
		</div>
		<div class="public-wrapper-main">
			<div class="activity-container">
				<form method="GET" action="${articlePage.url}" class="search-filter__form">
					<div class="search-filter__bar">
						<div class="search-filter__select-wrapper">
							<select name="searchType" class="search-filter__select">
								<option value="all" ${param.searchType == 'all' ? 'selected' : ''}>전체</option>
								<option value="title" ${param.searchType == 'title' ? 'selected' : ''}>제목</option>
								<option value="content" ${param.searchType == 'content' ? 'selected' : ''}>내용</option>
							</select>
							<svg class="search-filter__select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                 <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                            </svg>
						</div>
						<div class="search-filter__input-wrapper">
							<input type="search" name="keyword" class="search-filter__input" placeholder="내 상담내역에서 검색" value="${param.keyword}">
							<button class="search-filter__button" type="submit">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                   <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
								</svg>
							</button>
						</div>
					</div>
					<div class="search-filter__accordion">
						<button type="button" class="search-filter__accordion-header" id="search-filter-toggle">
							<span>상세 필터</span>
							<span class="search-filter__accordion-arrow">▲</span>
						</button>
						<div class="search-filter__accordion-panel" id="search-filter-panel">
							<div class="search-filter__accordion-content">
								<div class="search-filter__group">
									<label class="search-filter__group-title">상담 신청 상태</label>
									<div class="search-filter__options">
										<label class="search-filter__option">
											<input type="radio" name="counselStatus" value="" ${param.counselStatus=='' ? 'checked' : '' }>
											<span>전체</span>
										</label>
										<c:forEach var="status" items="${counselStatus}">
											<label class="search-filter__option">
												<input type="radio" name="counselStatus" value="${status.key}" ${status.key == param.counselStatus ? 'checked' : '' }>
												<span>${status.value}</span>
											</label>
										</c:forEach>
									</div>
								</div>
								<div class="search-filter__group">
									<label class="search-filter__group-title">상담 분류</label>
									<div class="search-filter__options">
										<label class="search-filter__option">
											<input type="radio" name="counselCategory" value="" ${param.counselCategory=='' ? 'checked' : '' }>
											<span>전체</span>
										</label>
										<c:forEach var="category" items="${counselCategory}">
											<label class="search-filter__option">
												<input type="radio" name="counselCategory" value="${category.key}" ${category.key == param.counselCategory ? 'checked' : '' }>
												<span>${category.value}</span>
											</label>
										</c:forEach>
									</div>
								</div>
								<div class="search-filter__group">
									<label class="search-filter__group-title">상담 방법</label>
									<div class="search-filter__options">
										<label class="search-filter__option">
											<input type="radio" name="counselMethod" value="" ${param.counselMethod=='' ? 'checked' : '' }>
											<span>전체</span>
										</label>
										<c:forEach var="method" items="${counselMethod}">
											<label class="search-filter__option">
												<input type="radio" name="counselMethod" value="${method.key}" ${method.key == param.counselMethod ? 'checked' : '' }>
												<span>${method.value}</span>
											</label>
										</c:forEach>
									</div>
								</div>

								<div class="search-filter__group">
									<label class="search-filter__group-title">정렬 순서</label>
									<div class="search-filter__options">
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="createdAtDesc" ${param.sortOrder == 'createdAtDesc' ? 'checked' : ''} />
											<span>신청일 최신순</span>
										</label>
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="createdAtAsc" ${param.sortOrder == 'createdAtAsc' ? 'checked' : ''} />
											<span>신청일 오래된순</span>
										</label>
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="reqDateAsc" ${param.sortOrder == 'reqDateAsc' ? 'checked' : ''} />
											<span>예약일 빠른순</span>
										</label>
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="reqDateDesc" ${param.sortOrder == 'reqDateDesc' ? 'checked' : ''} />
											<span>예약일 늦은순</span>
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

				<c:choose>
					<c:when test="${empty articlePage.content}">
						<p class="no-content-message">현재 상담 내역이 없습니다.</p>
					</c:when>
					<c:otherwise>
						<div class="counsel-list">
							<c:forEach var="content" items="${articlePage.content}">
								<div class="counsel-item">
									<div class="item-content">
										<div class="item-header">
											<span class="category-tag">${counselCategory[content.counselCategory]}</span>
											<span class="category-tag">${counselStatus[content.counselStatus]}</span>
											<span class="category-tag">${counselMethod[content.counselMethod]}</span>
										</div>
										<h3 class="item-title">${content.counselTitle}</h3>
										<p class="item-snippet">${content.counselDescription}</p>
										<div class="item-meta">
											<span>상담사: ${content.counselName}</span>
											<span class="divider">·</span>
											<span>
												신청일:
												<fmt:formatDate value="${content.counselCreatedAt}" pattern="yyyy. M. d." />
											</span>
											<span class="divider">·</span>
											<span>
												예약일:
												<fmt:formatDate value="${content.counselReqDatetime}" pattern="yyyy. M. d. (HH시)" />
											</span>
										</div>
									</div>
									<div class="item-content">
										<c:choose>
											<c:when test="${content.counselStatus == 'S04001'}">
												<span class="btn btn-danger">대기중</span>
											</c:when>
											<c:when test="${content.counselStatus == 'S04002'}">
												<span class="btn btn-danger">취소됨</span>
											</c:when>
											<c:when test="${content.counselStatus == 'S04003'}">
												<span class="btn btn-primary">확정</span>
											</c:when>
											<c:when test="${content.counselStatus == 'S04005'}">
												<a href="#" onclick="openCounselingPopup('${content.counselUrlUser}'); return false;" class="btn btn-primary counselStart">상담시작</a>
											</c:when>
											<c:when test="${content.counselReviewd == 'N' && content.counselStatus == 'S04004'}">
												<a href="/cnslt/rvw/cnsReview.do" class="btn btn-primary">후기 작성하기</a>
											</c:when>
										</c:choose>
									</div>
								</div>
							</c:forEach>
						</div>
					</c:otherwise>
				</c:choose>

				<ul class="pagination">
					<li class="pagination__item">
						<a href="${articlePage.url}?currentPage=${articlePage.startPage - 5}&keyword=${param.keyword}&status=${param.status}&counselStatus=${param.counselStatus}&counselCategory=${param.counselCategory}&counselMethod=${param.counselMethod}&sortOrder=${paramValues.sortOrder[0]}" class="pagination__link <c:if test='${articlePage.startPage < 6}'>pagination__link--disabled</c:if>"> ← Previous </a>
					</li>

					<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
						<li class="pagination__item">
							<a href="${articlePage.url}?currentPage=${pNo}&keyword=${param.keyword}&status=${param.status}&counselStatus=${param.counselStatus}&counselCategory=${param.counselCategory}&counselMethod=${param.counselMethod}&sortOrder=${paramValues.sortOrder[0]}" class="pagination__link <c:if test='${pNo == articlePage.currentPage}'>pagination__link--active</c:if>"> ${pNo} </a>
						</li>
					</c:forEach>

					<li class="pagination__item">
						<a href="${articlePage.url}?currentPage=${articlePage.startPage + 5}&keyword=${param.keyword}&status=${param.status}&counselStatus=${param.counselStatus}&counselCategory=${param.counselCategory}&counselMethod=${param.counselMethod}&sortOrder=${paramValues.sortOrder[0]}" class="pagination__link <c:if test='${articlePage.endPage >= articlePage.totalPages}'>pagination__link--disabled</c:if>"> Next → </a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/mpg/mat/csh/selectCounselingHistoryList.js"></script>
<script src="/js/cnslt/resve/cnsh/counselingreservehistory.js"></script>