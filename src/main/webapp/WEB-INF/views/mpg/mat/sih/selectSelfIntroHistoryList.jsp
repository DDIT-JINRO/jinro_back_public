<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/listCard.css">

<section class="channel myPage">
	<div class="channel-title">
		<div class="channel-title-text">마이페이지</div>
	</div>
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

<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab" href="/mpg/mat/bmk/selectBookMarkList.do">북마크</a>
		<a class="tab" href="/mpg/mat/csh/selectCounselingHistoryList.do">상담 내역</a>
		<a class="tab" href="/mpg/mat/reh/selectResumeHistoryList.do">이력서</a>
		<a class="tab active" href="/mpg/mat/sih/selectSelfIntroHistoryList.do">자기소개서</a>
	</div>

	<div class="public-wrapper-main">
		<form method="GET" action="/mpg/mat/sih/selectSelfIntroHistoryList.do" class="search-filter__form">
			<div class="search-filter__bar">
				<div class="search-filter__select-wrapper">
					<select name="status" class="search-filter__select">
						<option value="">전체</option>
						<option value="작성중" <c:if test="${param.status eq '작성중'}">selected</c:if>>작성중</option>
						<option value="완료" <c:if test="${param.status eq '완료'}">selected</c:if>>작성완료</option>
					</select>
					<svg class="search-filter__select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="search-filter__input-wrapper">
					<input type="search" name="keyword" value="${param.keyword}" class="search-filter__input" placeholder="내가 작성한 자기소개서에서 검색">
					<button class="search-filter__button" type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
							<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
						</svg>
					</button>
				</div>
			</div>
		</form>

		<div class="content-list__total-count">총 ${articlePage.total}건</div>

		<div class="content-list">
			<c:choose>
				<c:when test="${empty articlePage.content || articlePage.content == null}">
					<div class="empty-state">
						<div class="empty-state__title">작성된 자기소개서가 없습니다</div>
						<div class="empty-state__description">새로운 자기소개서를 작성하여 취업 활동을 시작해보세요.</div>
						<div class="empty-state__action">
							<a href="/cdp/sint/sintwrt/selfIntroWriting.do" class="button button--primary button--large"> 자기소개서 작성하기 </a>
						</div>
					</div>
				</c:when>
				<c:otherwise>
					<c:forEach var="selfIntro" items="${articlePage.content}">
						<div class="list-card">
							<div class="list-card__info">
								<h3 class="list-card__title">${selfIntro.siTitle}</h3>
								<div class="list-card__meta">
									<div class="list-card__meta-item">
										<span class="list-card__meta-label">수정일:</span>
										<fmt:formatDate value="${selfIntro.siUpdatedAt}" pattern="yyyy.MM.dd (E) HH:mm" />
									</div>
									<div class="list-card__meta-item">
										<span class="list-card__meta-label">상태:</span>
										<span class="list-card__status <c:choose><c:when test='${selfIntro.siStatus eq \"완료\"}'>list-card__status--completed</c:when><c:otherwise>list-card__status--draft</c:otherwise></c:choose>"> ${selfIntro.siStatus} </span>
									</div>
								</div>
							</div>
							<div class="list-card__actions">
								<a class="list-card__edit-button" href="/cdp/sint/sintwrt/selfIntroWriting.do?siId=${selfIntro.siId}"> 자기소개서 수정하기 </a>
							</div>
						</div>
					</c:forEach>
				</c:otherwise>
			</c:choose>
			<c:if test="${empty articlePage.content}">
				<div class="content-list__no-results" style="grid-column: 1/-1;">검색 결과가 없습니다.</div>
			</c:if>
		</div>

		<c:if test="${not empty articlePage.content}">
			<ul class="pagination">
				<li>
					<a href="${articlePage.url}?currentPage=${articlePage.startPage - 5}&keyword=${param.keyword}&status=${param.status}" class="pagination__link <c:if test='${articlePage.startPage < 6}'>pagination__link--disabled</c:if>"> ← Previous </a>
				</li>
				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<c:if test="${articlePage.total == 0 }">
						<c:set var="pNo" value="1"></c:set>
					</c:if>
					<li>
						<a href="${articlePage.url}?currentPage=${pNo}&keyword=${param.keyword}&status=${param.status}" class="pagination__link <c:if test='${pNo == articlePage.currentPage}'>pagination__link--active</c:if>"> ${pNo} </a>
					</li>
				</c:forEach>
				<li>
					<a href="${articlePage.url}?currentPage=${articlePage.startPage + 5}&keyword=${param.keyword}&status=${param.status}" class="pagination__link <c:if test='${articlePage.endPage >= articlePage.totalPages}'>pagination__link--disabled</c:if>"> Next → </a>
				</li>
			</ul>
		</c:if>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>