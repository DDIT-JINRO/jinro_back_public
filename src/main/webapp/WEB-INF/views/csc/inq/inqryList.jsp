<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/csc/inq/inqList.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel serviceCenter">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">고객센터</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/csc/not/noticeList.do">공지사항</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/csc/faq/faqList.do">FAQ</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/csc/inq/inqryList.do">1:1문의</a>
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
				<a href="/csc/inq/inqryList.do">1:1문의</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/csc/inq/inqryList.do">1:1 문의</a>
		</div>

		<div class="public-wrapper-main">
			<form method="get" action="/csc/inq/inqryList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="1:1문의 내에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</form>

			<div class="content-list">
				<input type="hidden" value="${memId}" id="getMemId">
				<c:forEach var="item" items="${inqList}">
					<div class="accordion-list__item" data-is-public="${item.contactIsPublic}" data-author-id="${item.memId}">
						<div class="accordion-list__item-header">
							<div class="accordion-list__col accordion-list__col--company-name">
								<div class="inq-icon-title">
									<div class="inq-title-left">
										<span class="inq-icon">Q</span>
										<span class="inq-title-text">${item.contactTitle}</span>
									</div>
								</div>
							</div>
							<div class="accordion-list__col accordion-list__col--meta">
								<div class="accordion-list__col accordion-list__author" data-label="작성자">${item.memName}</div>
								<div class="accordion-list__col accordion-list__date" data-label="작성일">
									<fmt:formatDate value="${item.contactAt}" pattern="yyyy. M. d." />
								</div>
								<div class="accordion-list__col accordion-list__status" data-label="상태">
									<c:choose>
										<c:when test="${item.contactReply != null}">
											<span class="inquiry-status inquiry-status--completed">답변 완료</span>
										</c:when>
										<c:otherwise>
											<span class="inquiry-status inquiry-status--pending">답변 대기</span>
										</c:otherwise>
									</c:choose>
								</div>
							</div>
							<div class="accordion-list__col accordion-list__col--toggle">
								<div class="accordion-list__toggle-icon">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
										<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
									</svg>
								</div>
							</div>
						</div>

						<div class="accordion-list__item-content">
							<div class="accordion-list__content-body">
								<div class="detail-grid">
									<div class="detail-item">
										<div class="detail-label">작성자</div>
										<div class="detail-value">${item.memName}</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">작성일</div>
										<div class="detail-value">
											<fmt:formatDate value="${item.contactAt}" pattern="yyyy.MM.dd HH:mm" />
										</div>
									</div>
									<div class="detail-item">
										<div class="detail-label">상태</div>
										<div class="detail-value">
											<c:choose>
												<c:when test="${item.contactReply != null}">
													<span class="inquiry-status inquiry-status--completed">답변 완료</span>
												</c:when>
												<c:otherwise>
													<span class="inquiry-status inquiry-status--pending">답변 대기</span>
												</c:otherwise>
											</c:choose>
										</div>
									</div>
									<div class="detail-item inquiry-content">
										<div class="detail-label">문의내용</div>
										<div class="inquiry-text">${item.contactContent}</div>
									</div>

									<c:if test="${item.contactReply != null}">
										<div class="detail-item inquiry-reply">
											<div class="detail-label">답변내용</div>
											<div class="reply-text">${item.contactReply}</div>
										</div>
									</c:if>
								</div>
							</div>
						</div>
					</div>
				</c:forEach>
			</div>

			<div class="page-actions">
				<button id="btnWrite" class="page-actions__button">문의하기</button>
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
<script type="text/javascript" src="/js/csc/inq/inqList.js"></script>
</body>
</html>