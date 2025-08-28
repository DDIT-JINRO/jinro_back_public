<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/rsm/rsmb/resumeBoardList.css">

<section class="channel">
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
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab" href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			<a class="tab active" href="/cdp/rsm/rsmb/resumeBoardList.do">이력서 템플릿 게시판</a>
		</div>

		<div class="public-wrapper-main">
			<form method="get" action="${articlePage.url}" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__select-wrapper">
						<select name="status" class="search-filter__select">
							<option value="3">전체</option>
							<option value="1">제목</option>
							<option value="2">내용</option>
						</select>
						<svg class="search-filter__select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="search-filter__input-wrapper">
						<input type="search" class="search-filter__input" name="keyword" placeholder="이력서 템플릿 게시판 내에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
							</svg>
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
										<input type="radio" name="sortOrder" value="newest">
										<span>작성일 최신순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="oldest">
										<span>작성일 과거순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="liked">
										<span>좋아요 많은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="cnt">
										<span>조회수 많은순</span>
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
					<span class="content-list__header-col content-list__header-col--no">번호</span>
					<span class="content-list__header-col content-list__header-col--title">제목</span>
					<span class="content-list__header-col content-list__header-col--author">작성자</span>
					<span class="content-list__header-col content-list__header-col--date">작성일</span>
					<span class="content-list__header-col content-list__header-col--views">조회수</span>
					<span class="content-list__header-col content-list__header-col--likes">좋아요</span>
					<span class="content-list__header-col content-list__header-col--reply-cnt">댓글수</span>
					<span class="content-list__header-col content-list__header-col--bookmark">북마크</span>
				</div>

				<c:forEach var="commBoardVO" items="${articlePage.content}">
					<div class="content-list__item" data-board-id="${commBoardVO.boardId}">
						<div class="content-list__col content-list__col--no" data-label="번호">
							<span class="badge--number">${commBoardVO.rnum}</span>
						</div>
						<div class="content-list__col content-list__col--title" data-label="제목">
							<h3 class="content-list__title">
								${commBoardVO.boardTitle}
							    <c:if test="${!empty commBoardVO.fileGroupId}">
									<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
									  <path d="M21.44 11.05l-9.19 9.19c-1.28 1.28-3.35 1.28-4.63 0s-1.28-3.35 0-4.63l9.19-9.19c.85-.85 2.23-.85 3.08 0s.85 2.23 0 3.08L12.8 16.6c-.42.42-1.1.42-1.52 0s-.42-1.1 0-1.52l7.07-7.07" stroke="gray" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</c:if>
							</h3>
						</div>
						<div class="content-list__col content-list__col--author" data-label="작성자">${commBoardVO.memNickname}</div>
						<div class="content-list__col content-list__col--date" data-label="작성일">
							<fmt:formatDate value="${commBoardVO.boardUpdatedAt}" pattern="yyyy. M. d." />
						</div>
						<div class="content-list__col content-list__col--views" data-label="조회수">${commBoardVO.boardCnt}</div>
						<div class="content-list__col content-list__col--likes" data-label="좋아요">${commBoardVO.boardLikeCnt}</div>
						<div class="content-list__col content-list__col--reply-cnt" data-label="댓글수">${commBoardVO.boardReplyCnt}</div>
						<div class="content-list__col content-list__col--bookmark" data-label="북마크">
							<button class="bookmark-button ${commBoardVO.isBookmark == commBoardVO.boardId ? 'is-active' : ''}" data-category-id="G03005" data-target-id="${commBoardVO.boardId}">
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

				<c:if test="${empty articlePage.content}">
					<p class="content-list__no-results">이력서 템플릿 게시판 정보가 없습니다.</p>
				</c:if>
			</div>

			<div class="action-bar">
				<button class="action-bar__button" id="btnWrite">글작성</button>
			</div>

			<div class="pagination">
				<c:url var="prevUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage - 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:if test="${not empty param.status}">
						<c:param name="status" value="${param.status}" />
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
						<c:if test="${not empty param.status}">
							<c:param name="status" value="${param.status}" />
						</c:if>
						<c:if test="${not empty param.sortOrder}">
							<c:param name="sortOrder" value="${param.sortOrder}" />
						</c:if>
					</c:url>
					<a href="${pageUrl}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
				</c:forEach>

				<c:url var="nextUrl" value="${articlePage.url}">
					<c:param name="currentPage" value="${articlePage.startPage + 5}" />
					<c:if test="${not empty param.keyword}">
						<c:param name="keyword" value="${param.keyword}" />
					</c:if>
					<c:if test="${not empty param.status}">
						<c:param name="status" value="${param.status}" />
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

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/cdp/rsm/rsmb/resumeBoardList.js"></script>
</body>
</html>