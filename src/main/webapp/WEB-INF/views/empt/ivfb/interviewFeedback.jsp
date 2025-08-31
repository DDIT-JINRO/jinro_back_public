<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/empt/ivfb/interviewFeedback.css">
<section class="channel employment">
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
		<div class="channel-sub-section-itemIn">
			<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
		</div>
		<div class="channel-sub-section-item">
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
				<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/empt/ivfb/interViewFeedback.do">면접후기</a>
		</div>
		<div class="public-wrapper-main">
			<form method="get" action="${articlePage.url}" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__select-wrapper">
						<select name="status" class="search-filter__select">
							<option value="all">전체</option>
							<option value="targetName">기업명</option>
							<option value="content">후기 내용</option>
							<option value="writer">작성자</option>
						</select>
						<svg class="search-filter__select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>
					</div>
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="면접 후기 게시판 내에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" /></svg>
						</button>
					</div>
				</div>
				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header is-active">
						<span>상세검색</span>
						<span class="search-filter__accordion-arrow">▼</span>
					</button>
					<div class="search-filter__accordion-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬 순서</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="InterviewedAtDesc" <c:if test="${paramValues.sortOrder[0] == 'InterviewedAtDesc'}">checked</c:if> >
										<span>최신 면접순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="InterviewedAtAsc" <c:if test="${paramValues.sortOrder[0] == 'InterviewedAtAsc'}">checked</c:if> >
										<span>과거 면접순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createdAtDesc" <c:if test="${paramValues.sortOrder[0] == 'createdAtDesc'}">checked</c:if> >
										<span>최신 작성순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createdAtAsc" <c:if test="${paramValues.sortOrder[0] == 'createdAtAsc'}">checked</c:if> >
										<span>과거 작성순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="reviewRateDesc" <c:if test="${paramValues.sortOrder[0] == 'reviewRateDesc'}">checked</c:if> >
										<span>평점 높은순</span>
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
				<div class="accordion-list__header">
					<span class="accordion-list__col accordion-list__col--company-name">기업명</span>
					<div class="accordion-list__col accordion-list__col--meta">
						<span class="accordion-list__col accordion-list__col--author">작성자</span>
						<span class="accordion-list__col accordion-list__col--date">작성일</span>
						<span class="accordion-list__col accordion-list__col--rating">평점</span>
					</div>
					<span class="accordion-list__col accordion-list__col--toggle"></span>
				</div>

				<c:forEach var="content" items="${articlePage.content}">
					<div class="accordion-list__item">
						<div class="accordion-list__item-header">
							<div class="accordion-list__col accordion-list__company-name" data-label="기업명">${content.targetName}</div>
							<div class="accordion-list__col accordion-list__meta">
								<div class="accordion-list__col accordion-list__author" data-label="작성자">
									<c:if test="${pageContext.request.userPrincipal.principal == content.memId}">
										<span class="badge--my-post">내 글</span>
									</c:if>
									<c:if test="${pageContext.request.userPrincipal.principal != content.memId}">${content.memNickname}</c:if>
								</div>
								<div class="accordion-list__col accordion-list__date" data-label="작성일">
									<fmt:formatDate value="${content.irCreatedAt}" pattern="yyyy. M. d." />
								</div>
								<div class="accordion-list__col accordion-list__rating" data-label="평점">
									<span class="rating__stars">
										<c:forEach begin="1" end="5" var="i">
											<c:choose>
												<c:when test="${i <= content.irRating}">★</c:when>
												<c:otherwise>☆</c:otherwise>
											</c:choose>
										</c:forEach>
									</span>
									<span>${content.irRating}.0</span>
								</div>
							</div>
							<div class="accordion-list__col accordion-list__col--toggle">
								<div class="accordion-list__toggle-icon">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
										<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" /></svg>
								</div>
							</div>
						</div>
						<div class="accordion-list__item-content">
							<div class="accordion-list__content-body">
								<div class="detail-grid">
									<div class="detail-item">
										<div class="detail-label">작성자</div>
										<div class="detail-value">${content.memNickname}</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">면접 기업</div>
										<div class="detail-value">${content.targetName}</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">면접 대상 직무</div>
										<div class="detail-value">${content.irApplication}</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">면접일</div>
										<div class="detail-value">
											<fmt:formatDate value="${content.irInterviewAt}" pattern="yyyy. M. d." />
										</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">작성일</div>
										<div class="detail-value">
											<fmt:formatDate value="${content.irCreatedAt}" pattern="yyyy. M. d. HH:mm" />
										</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">수정일</div>
										<div class="detail-value">
											<fmt:formatDate value="${content.irModAt}" pattern="yyyy. M. d. HH:mm" />
										</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">평점</div>
										<div class="detail-value">
											<span class="rating__stars">
												<c:forEach begin="1" end="5" var="i">
													<c:choose>
														<c:when test="${i <= content.irRating}">★</c:when>
														<c:otherwise>☆</c:otherwise>
													</c:choose>
												</c:forEach>
											</span>
											<span style="margin-left: 8px;">${content.irRating}.0 / 5.0</span>
										</div>
									</div>
									<div class="detail-item feedback-content">
										<div class="detail-label">후기 내용</div>
										<div class="feedback-text">${content.irContent}</div>
									</div>
								</div>
								<c:if test="${pageContext.request.userPrincipal.principal == content.memId}">
									<div class="card-actions">
										<button type="button" class="card-actions__button card-actions__button--edit" data-mem-id="${content.memId}" data-ir-id="${content.irId}">수정</button>
										<button type="button" class="card-actions__button card-actions__button--delete" data-ir-id="${content.irId}">삭제</button>
									</div>
								</c:if>
							</div>
						</div>
					</div>
				</c:forEach>
				<c:if test="${empty articlePage.content}">
					<p class="content-list__no-results">면접 후기가 없습니다.</p>
				</c:if>
			</div>

			<div class="page-actions">
				<button id="btnWrite" class="page-actions__button">면접 후기 공유하기</button>
			</div>

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
				<a href="${prevUrl}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>

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
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
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
				<a href="${nextUrl}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/empt/ivfb/interviewFeedback.js"></script>
</body>
</html>