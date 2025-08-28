<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/csc/not/noticeDetail.css">

<section class="channel serviceCenter">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">고객센터</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-itemIn">
			<a href="/csc/not/noticeList.do">공지사항</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
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
				<a href="/csc/not/noticeList.do">공지사항</a>
			</li>
		</ol>
	</nav>
</div>

<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab active" href="/csc/not/noticeList.do">공지사항</a>
	</div>

	<div class="public-wrapper-main">
		<div class="detail__header-wrapper">
			<div class="detail__header">
				<span class="detail__badge">
					<fmt:formatNumber value="${noticeDetail.noticeId}" pattern="000" />
				</span>
				<h1 class="detail__title">${noticeDetail.noticeTitle}</h1>
			</div>
			<div class="detail__meta">
				<span class="detail__meta-item">번호: ${noticeDetail.noticeId}</span>
				<span class="detail__meta-item">조회수: ${noticeDetail.noticeCnt}</span>
				<span class="detail__meta-item">
					작성일:
					<fmt:formatDate value="${noticeDetail.noticeCreatedAt}" pattern="yyyy. M. d." />
				</span>
			</div>
		</div>
		<hr class="detail__divider" />

		<div class="notice-content">${noticeDetail.noticeContent}</div>
		<!-- 첨부파일 섹션 -->
		<div class="detail__attachments">
			<h3 class="detail__attachments-title">첨부파일</h3>
			<div class="detail__attachments-list">
				<div class="fileClass">
					<c:choose>
						<c:when test="${not empty noticeDetail.getFileList}">
							<c:forEach var="file" items="${noticeDetail.getFileList}">
								<div class="detail__attachment-item detailFile">
									<svg class="detail__attachment-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
									</svg>
									<div class="file-info">
										<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" class="detail__attachment-name file-name" title="파일명을 클릭하여 다운로드"> ${file.fileOrgName} </a>
									</div>
									<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" class="file-download-btn" title="다운로드"> 다운로드 </a>
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

		<hr class="detail__divider" />

		<div class="detail__back-to-list">
			<a href="/csc/not/noticeList.do" class="detail__action-button">목 록</a>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/csc/not/noticeDetail.js" defer></script>
</body>
</html>