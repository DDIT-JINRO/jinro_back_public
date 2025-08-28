<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.css">

<section class="channel">
	<div class="channel-title">
		<div class="channel-title-text">경력관리</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/sint/qestnlst/questionList.do">자기소개서</a>
		</div>
		<div class="channel-sub-section-itemIn">
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
				<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">모의면접</a>
			</li>
		</ol>
	</nav>
</div>

<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab" href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">면접의 기본</a>
		<a class="tab active" href="/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do">면접 질문 리스트</a>
		<a class="tab" href="/cdp/imtintrvw/intrvwqestnmn/interviewQuestionMangementList.do">면접 질문 관리</a>
		<a class="tab" href="/cdp/imtintrvw/aiimtintrvw/aiImitationInterview.do">AI 모의 면접</a>
	</div>

	<div class="public-wrapper-main">
		<!-- 검색 필터 폼 -->
		<form method="get" action="/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do" class="search-filter__form">
			<!-- 검색바 -->
			<div class="search-filter__bar">
				<div class="search-filter__input-wrapper">
					<input type="text" name="keyword" value="${articlePage.keyword}" placeholder="질문 검색" class="search-filter__input" />
				</div>
				<button type="submit" class="search-filter__button">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.35-4.35" />
					</svg>
				</button>
			</div>

			<!-- 필터 아코디언 -->
			<div class="search-filter__accordion">
				<button type="button" class="search-filter__accordion-header">
					<span>상세 필터</span>
					<span class="search-filter__accordion-arrow">▲</span>
				</button>
				<div class="search-filter__accordion-panel">
					<div class="search-filter__accordion-content">
						<!-- 직무 필터 -->
						<div class="search-filter__group">
							<div class="search-filter__group-header">
								<span class="search-filter__group-title">직무 분야</span>
							</div>
							<div class="search-filter__options">
								<c:forEach var="code" items="${codeVOList}">
									<label class="search-filter__option">
										<input type="checkbox" class="filter-checkbox" name="siqJobFilter" value="${code.ccId}" data-name="${code.ccName}" data-id="${code.ccId}" />
										<span>${code.ccName}</span>
									</label>
								</c:forEach>
							</div>
						</div>

						<!-- 선택된 필터 표시 -->
						<div class="search-filter__group">
							<div class="search-filter__group-header">											
								<span class="search-filter__group-title">선택된 필터</span>
								<button type="button" class="search-filter__reset-button" onclick="resetJobFilters()">초기화</button>
							</div>							
							<div class="search-filter__selected-tags" id="selected-filters">
								<!-- JS로 동적 생성 -->
							</div>
						</div>

						<button type="submit" class="search-filter__submit-button">검색 적용</button>
					</div>
				</div>
			</div>
		</form>

		<!-- 질문 목록 -->
		<form id="cartForm" method="post" action="/cdp/imtintrvw/intrvwqestnlst/cart">
			<sec:csrfInput />
			<input type="hidden" id="questionIds" name="questionIds" />

			<!-- 총 개수 표시 -->
			<div class="content-list__total-count">총 ${articlePage.total}개의 질문</div>

			<!-- 질문 리스트 -->
			<div class="content-list">
				<c:forEach var="q" items="${articlePage.content}">
					<div class="content-list__item question-item" data-id="${q.siqId}">
						<div class="question-item__content">
							<div class="question-item__badge">${codeMap[q.siqJob]}</div>
							<h3 class="question-item__title">${q.siqContent}</h3>
						</div>
						<div class="question-item__actions">
							<input type="checkbox" class="question-item__checkbox" data-id="${q.siqId}" onchange="toggleQuestion(this, '${q.siqId}', '${q.siqContent}')" />
						</div>
					</div>
				</c:forEach>
			</div>

			<!-- 선택된 질문 패널 -->
			<div class="cart-panel">
				<div class="cart-panel__header">
					<h3>선택된 질문</h3>
				</div>
				<div class="cart-panel__content" id="cartSidebar">
					<!-- JS로 동적 생성 -->
				</div>
				<div class="cart-panel__footer">
					<button type="button" class="cart-panel__submit-btn submitCartForm">면접 질문 작성</button>
				</div>
			</div>
		</form>

		<!-- 페이지네이션 -->
		<ul class="pagination">
			<!-- Previous -->
			<li class="pagination__item">
				<a href="${articlePage.url}?currentPage=${articlePage.startPage - 5}&keyword=${articlePage.keyword}<c:forEach var='filter' items='${paramValues.siqJobFilter}'>&siqJobFilter=${filter}</c:forEach>" class="pagination__link <c:if test='${articlePage.startPage < 6}'>pagination__link--disabled</c:if>"> ← Previous </a>
			</li>

			<!-- Page Numbers -->
			<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
				<li class="pagination__item">
					<a href="${articlePage.url}?currentPage=${pNo}&keyword=${articlePage.keyword}<c:forEach var='filter' items='${paramValues.siqJobFilter}'>&siqJobFilter=${filter}</c:forEach>" class="pagination__link <c:if test='${pNo == articlePage.currentPage}'>pagination__link--active</c:if>"> ${pNo} </a>
				</li>
			</c:forEach>

			<!-- Next -->
			<li class="pagination__item">
				<a href="${articlePage.url}?currentPage=${articlePage.startPage + 5}&keyword=${articlePage.keyword}<c:forEach var='filter' items='${paramValues.siqJobFilter}'>&siqJobFilter=${filter}</c:forEach>" class="pagination__link <c:if test='${articlePage.endPage >= articlePage.totalPages}'>pagination__link--disabled</c:if>"> Next → </a>
			</li>
		</ul>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>

<script type="text/javascript">
	window.currentMemId = "${memId}";
</script>
<script type="text/javascript" src="/js/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.js"></script>
</body>
</html>