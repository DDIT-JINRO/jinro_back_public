<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/listCard.css">

<section class="channel personalHistory">
	<div class="channel-title">
		<div class="channel-title-text">경력관리</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/sint/qestnlst/questionList.do">자기소개서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">모의면접</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">AI 피드백</a>
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
				<a href="/cdp/rsm/rsm/resumeList.do">경력 관리</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			</li>
		</ol>
	</nav>
</div>
<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab active" href="/cdp/rsm/rsm/resumeList.do">이력서</a>
		<a class="tab" href="/cdp/rsm/rsmb/resumeBoardList.do">이력서 템플릿 게시판</a>
	</div>

	<div class="public-wrapper-main">
		<form method="get" action="/cdp/rsm/rsm/resumeList.do" class="search-filter__form">
			<div class="search-filter__bar">
				<div class="search-filter__input-wrapper">
					<input type="search" name="keyword" value="${param.keyword}" class="search-filter__input" placeholder="이력서 제목 검색">
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
							<label class="search-filter__group-title">상태</label>
							<div class="search-filter__options">
								<label class="search-filter__option">
									<input type="radio" name="status" value="" <c:if test="${param.status eq ''}">checked</c:if>>
									<span>전체</span>
								</label>
								<label class="search-filter__option">
									<input type="radio" name="status" value="Y" <c:if test="${param.status eq 'Y'}">checked</c:if>>
									<span>작성중</span>
								</label>
								<label class="search-filter__option">
									<input type="radio" name="status" value="N" <c:if test="${param.status eq 'N'}">checked</c:if>>
									<span>완료</span>
								</label>
							</div>
						</div>
						<div class="search-filter__group">
							<label class="search-filter__group-title">정렬 순서</label>
							<div class="search-filter__options">
								<label class="search-filter__option">
									<input type="radio" name="sortOrder" value="updatedAtDesc" <c:if test="${paramValues.sortOrder[0] == 'updatedAtDesc'}">checked</c:if> >
									<span>수정일 최신순</span>
								</label>
								<label class="search-filter__option">
									<input type="radio" name="sortOrder" value="updatedAtAsc" <c:if test="${paramValues.sortOrder[0] == 'updatedAtAsc'}">checked</c:if> >
									<span>수정일 과거순</span>
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

		<div class="content-list__total-count">총 ${articlePage.total}건</div>

		<div class="content-list">
			<c:choose>
				<c:when test="${not empty articlePage.content}">
					<c:forEach var="resume" items="${articlePage.content}">
						<div class="list-card">
							<div class="list-card__info">
								<h3 class="list-card__title">${resume.resumeTitle}</h3>
								<div class="list-card__meta">
									<div class="list-card__meta-item">
										<span class="list-card__meta-label">수정일:</span>
										<fmt:formatDate value="${resume.updatedAt}" pattern="yyyy. M. d. (E) HH:mm" />
									</div>
									<div class="list-card__meta-item">
										<span class="list-card__meta-label">상태:</span>
										<span class="list-card__status <c:choose><c:when test='${resume.resumeIsTemp eq \"N\"}'>list-card__status--completed</c:when><c:otherwise>list-card__status--draft</c:otherwise></c:choose>">
											<c:choose>
												<c:when test="${resume.resumeIsTemp eq 'N'}">완료</c:when>
												<c:when test="${resume.resumeIsTemp eq 'Y'}">임시 저장</c:when>
												<c:otherwise>미지정</c:otherwise>
											</c:choose>
										</span>
									</div>
								</div>
							</div>
							<div class="list-card__actions">
								<a class="list-card__edit-button" href="/cdp/rsm/rsm/resumeWriter.do?resumeId=${resume.resumeId}"> 이력서 수정하기 </a>
							</div>
						</div>
					</c:forEach>
				</c:when>
				<c:otherwise>
					<div class="empty-state">
						<div class="empty-state__title">작성된 이력서가 없습니다</div>
						<div class="empty-state__description">새로운 이력서를 작성하여 취업 활동을 시작해보세요.</div>
					</div>
				</c:otherwise>
			</c:choose>
		</div>

		<sec:authorize access="isAuthenticated()">
			<div class="list__footer">
				<a href="/cdp/rsm/rsm/resumeWriter.do" class="list__create-button"> 이력서 작성하기 </a>
			</div>
		</sec:authorize>

		<c:if test="${not empty articlePage.content}">
			<ul class="pagination">
				<li>
					<a href="${articlePage.url}?currentPage=${articlePage.startPage - 5}&keyword=${param.keyword}&status=${param.status}&sortOrder=${paramValues.sortOrder[0]}" class="pagination__link <c:if test='${articlePage.startPage < 6}'>pagination__link--disabled</c:if>"> ← Previous </a>
				</li>
				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:if test="${articlePage.total == 0 }">
						<c:set var="pNo" value="1"></c:set>
					</c:if>
					<li>
						<a href="${articlePage.url}?currentPage=${pNo}&keyword=${param.keyword}&status=${param.status}&sortOrder=${paramValues.sortOrder[0]}" class="pagination__link <c:if test='${pNo == articlePage.currentPage}'>pagination__link--active</c:if>"> ${pNo} </a>
					</li>
				</c:forEach>
				<li>
					<a href="${articlePage.url}?currentPage=${articlePage.startPage + 5}&keyword=${param.keyword}&status=${param.status}&sortOrder=${paramValues.sortOrder[0]}" class="pagination__link <c:if test='${articlePage.endPage >= articlePage.totalPages}'>pagination__link--disabled</c:if>"> Next → </a>
				</li>
			</ul>
		</c:if>
	</div>
</div>
<script type="text/javascript" src="/js/cdp/rsm/rsm/resumeList.js"></script>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>