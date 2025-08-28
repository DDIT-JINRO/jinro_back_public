<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/csc/faq/faqList.css">
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
		<div class="channel-sub-section-itemIn">
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
				<a href="/csc/faq/faqList.do">FAQ</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/csc/faq/faqList.do">FAQ</a>
		</div>

		<div class="public-wrapper-main">
			<form method="get" action="/csc/faq/faqList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__input-wrapper">
						<input class="search-filter__input" type="search" name="keyword" placeholder="FAQ 내에서 검색" value="${param.keyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
			                    <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
			                </svg>
						</button>
					</div>
				</div>
			</form>

			<div class="content-list">
				<c:forEach var="item" items="${faqList}">
					<div class="accordion-list__item">
						<div class="accordion-list__item-header">
							<div class="accordion-list__col accordion-list__col--company-name">
								<div class="faq-icon-title">
									<span class="faq-icon">Q</span>
									<span class="faq-title-text">${item.faqTitle}</span>
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
								<div class="faq-answer-content">${item.faqContent}</div>

								<!-- FAQ 첨부파일 -->
								<div class="fileClass">
									<c:choose>
										<c:when test="${not empty item.getFileList}">
											<c:forEach var="file" items="${item.getFileList}">
												<div class="detailFile">
													<div class="file-info">
														<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" class="detail__attachment-name" title="파일명을 클릭하여 다운로드"> ${file.fileOrgName} </a>
													</div>
													<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" class="detail__attachment-download-btn" title="다운로드"> 다운로드 </a>
												</div>
											</c:forEach>
										</c:when>
										<c:otherwise>
											<div class="no-files">첨부된 파일이 없습니다.</div>
										</c:otherwise>
									</c:choose>
								</div>


							</div>
						</div>
					</div>
				</c:forEach>
			</div>

			<c:if test="${empty faqList}">
				<p class="content-list__no-results">FAQ가 없습니다.</p>
			</c:if>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/csc/faq/faqList.js"></script>
</body>
</html>