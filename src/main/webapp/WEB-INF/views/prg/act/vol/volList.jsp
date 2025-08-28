<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<jsp:useBean id="now" class="java.util.Date" />
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/prg/ctt/cttList.css">
<section class="channel program">
	<div class="channel-title">
		<div class="channel-title-text">프로그램</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/prg/ctt/cttList.do">공모전</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/prg/act/vol/volList.do">대외활동</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/prg/std/stdGroupList.do">스터디그룹</a>
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
				<a href="/prg/ctt/cttList.do">프로그램</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/prg/act/vol/volList.do">대외활동</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/prg/act/vol/volList.do">봉사활동</a>
			<a class="tab" href="/prg/act/cr/crList.do">인턴십</a>
			<a class="tab" href="/prg/act/sup/supList.do">서포터즈</a>
		</div>

		<div class="public-wrapper-main">
			<div class="filter-section">
				<form method="get" action="/prg/act/vol/volList.do" class="search-filter__form">
					<div class="search-filter__bar">
						<div class="search-filter__input-wrapper">
							<input type="search" name="keyword" value="${checkedFilters.keyword}" class="search-filter__input" placeholder="검색어를 입력하세요">
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
									<label class="search-filter__group-title">모집 상태</label>
									<div class="search-filter__options">
										<label class="search-filter__option">
											<input type="checkbox" name="contestStatusFilter" value="proceeding" <c:if test="${fn:contains(checkedFilters.contestStatusFilter, 'proceeding')}">checked</c:if> />
											<span>진행중</span>
										</label>
										<label class="search-filter__option">
											<input type="checkbox" name="contestStatusFilter" value="finished" <c:if test="${fn:contains(checkedFilters.contestStatusFilter, 'finished')}">checked</c:if> />
											<span>마감</span>
										</label>
									</div>
								</div>

								<div class="search-filter__group">
									<label class="search-filter__group-title">모집 대상</label>
									<div class="search-filter__options">
										<c:forEach var="cTarget" items="${contestTargetList}">
											<label class="search-filter__option">
												<input type="checkbox" name="contestTargetFilter" value="${cTarget.ccId}" <c:if test="${fn:contains(checkedFilters.contestTargetFilter, cTarget.ccId)}">checked</c:if> />
												<span>${cTarget.ccName}</span>
											</label>
										</c:forEach>
									</div>
								</div>

								<div class="search-filter__group">
									<label class="search-filter__group-title">정렬 순서</label>
									<div class="search-filter__options">
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="deadline" ${checkedFilters.sortOrder == 'deadline' ? 'checked' : ''} />
											<span>마감일 임박순</span>
										</label>
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="latest" ${checkedFilters.sortOrder == 'latest' ? 'checked' : ''} />
											<span>최신 등록순</span>
										</label>
										<label class="search-filter__option">
											<input type="radio" name="sortOrder" value="viewCount" ${checkedFilters.sortOrder == 'viewCount' ? 'checked' : ''} />
											<span>조회수순</span>
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
			</div>
			<div class="source-div">
				<span class="list-header__meta-item list-header__meta-item--source">[
					출처: 씽굿(Thinkcontest.com), 대학문화신문사 ]</span>
				<div class="content-list__total-count">총 ${articlePage.total}건</div>
			</div>
			<div class="list-container">
				<c:if test="${not empty articlePage.content}">
					<c:forEach var="contest" items="${articlePage.content}">
						<a href="/prg/act/vol/volDetail.do?volId=${contest.contestId}" class="contest-card">
							<div class="card-image-box">
								<img src="/files/download?fileGroupId=${contest.fileGroupId}&seq=1" alt="포스터 이미지" class="contest-image">
							</div>
							<div class="card-content">
								<h3 class="contest-title">${contest.contestTitle}</h3>
								<div class="contest-description">
									<ul class="card-info-list">
										<li>
											<span class="info-label">주최</span>
											<span class="info-value">${contest.contestHost}</span>
										</li>
										<li>
											<span class="info-label">접수기간</span>
											<span class="info-value">
												<fmt:formatDate value="${contest.contestStartDate}" pattern="yyyy. M. d." />
												~
												<fmt:formatDate value="${contest.contestEndDate}" pattern="yyyy. M. d." />
											</span>
										</li>
										<li class="d-day-item" data-end-date="<fmt:formatDate value='${contest.contestEndDate}' pattern='yyyy. M. d.' />">
											<span class="info-label">마감까지</span>
											<span class="info-value d-day-text"> </span>
										</li>
										<li>
											<span class="info-label">모집상태</span>
											<span class="info-value">
												<fmt:formatDate value="${contest.contestEndDate}" pattern="yyyy. M. d." var="endDay" />
												<fmt:formatDate value="${now}" pattern="yyyy. M. d." var="today" />
												<c:choose>
													<c:when test="${endDay < today}">
														<span class="status-tag finished">마감</span>
													</c:when>
													<c:otherwise>
														<span class="status-tag proceeding">진행중</span>
													</c:otherwise>
												</c:choose>
											</span>
										</li>
									</ul>
								</div>
								<div class="contest-meta">
									<span class="meta-item"> ${contest.contestGubunName} | ${contest.contestTypeName} | ${contest.contestTargetName} </span>
									<br />
									<span class="meta-item">조회수 ${contest.contestRecruitCount}</span>
									<span class="meta-item">
										<fmt:formatDate value="${contest.contestCreatedAt}" pattern="yyyy. M. d." />
									</span>
								</div>
							</div>
						</a>
					</c:forEach>
				</c:if>
				<c:if test="${empty articlePage.content}">
					<div class="content-list__no-results" style="grid-column: 1/-1;">검색 결과가 없습니다.</div>
				</c:if>
			</div>
		</div>

		<c:if test="${not empty articlePage.content}">
			<ul class="pagination">
				<li>
					<c:url value="/prg/act/vol/volList.do" var="prevUrl">
						<c:param name="currentPage" value="${articlePage.startPage - 5}" />
						<c:param name="keyword" value="${checkedFilters.keyword}" />
						<c:param name="sortOrder" value="${checkedFilters.sortOrder}" />
						<c:forEach var="filter" items="${checkedFilters.contestTargetFilter}">
							<c:param name="contestTargetFilter" value="${filter}" />
						</c:forEach>
						<c:forEach var="filter" items="${checkedFilters.contestStatusFilter}">
							<c:param name="contestStatusFilter" value="${filter}" />
						</c:forEach>
					</c:url>
					<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}">← Previous</a>
				</li>

				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<li>
						<c:url value="/prg/act/vol/volList.do" var="pageUrl">
							<c:param name="currentPage" value="${pNo}" />
							<c:param name="keyword" value="${checkedFilters.keyword}" />
							<c:param name="sortOrder" value="${checkedFilters.sortOrder}" />
							<c:forEach var="filter" items="${checkedFilters.contestTargetFilter}">
								<c:param name="contestTargetFilter" value="${filter}" />
							</c:forEach>
							<c:forEach var="filter" items="${checkedFilters.contestStatusFilter}">
								<c:param name="contestStatusFilter" value="${filter}" />
							</c:forEach>
						</c:url>
						<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}">${pNo}</a>
					</li>
				</c:forEach>

				<li>
					<c:url value="/prg/act/vol/volList.do" var="nextUrl">
						<c:param name="currentPage" value="${articlePage.startPage + 5}" />
						<c:param name="keyword" value="${checkedFilters.keyword}" />
						<c:param name="sortOrder" value="${checkedFilters.sortOrder}" />
						<c:forEach var="filter" items="${checkedFilters.contestTargetFilter}">
							<c:param name="contestTargetFilter" value="${filter}" />
						</c:forEach>
						<c:forEach var="filter" items="${checkedFilters.contestStatusFilter}">
							<c:param name="contestStatusFilter" value="${filter}" />
						</c:forEach>
					</c:url>
					<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}">Next →</a>
				</li>
			</ul>
		</c:if>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script src="/js/prg/ctt/cttList.js"></script>
</body>
</html>