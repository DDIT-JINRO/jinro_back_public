<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/comm/peer/teen/teenInsert.css">
<link rel="stylesheet" href="/css/cdp/rsm/rsmb/resumeBoardInsert.css">

<c:if test="${not empty board.boardContent}">
	<script>
		const boardContent = `<c:out value="${board.boardContent}" escapeXml="false"/>`;
	</script>
</c:if>

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
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab" href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			<a class="tab active" href="/cdp/rsm/rsmb/resumeBoardList.do">이력서 템플릿 게시판</a>
		</div>

		<div class="public-wrapper-main">
			<div class="titleSpace">
				<input type="hidden" id="boardId" name="boardId" value="${board.boardId}">
				<div class="insertTitle">제목</div>
				<input class="Insert-title" id="title" type="text" placeholder="제목을 입력하세요." value="${board.boardTitle}">
			</div>
			<div class="Insert-write">
				<div class="editor-container">
					<div id="editor"></div>
				</div>

				<!-- 기존 파일 미리보기 섹션 -->
				<c:if test="${not empty fileList}">
					<label class="file-label">기존 첨부 파일 미리보기</label>
					<div class="preview-container">
						<div id="existing-preview-container">
							<c:forEach var="file" items="${fileList}" varStatus="status">
								<c:if test="${fn:endsWith(fn:toLowerCase(file.fileOrgName), '.pdf')}">
									<div class="pdf-file-item">
										<div class="pdf-file-header">
											<div class="pdf-file-name">${file.fileOrgName}</div>
											<button type="button" class="btn-pdf-preview" data-pdf-url="${file.filePath}" data-target-id="pdf-preview-existing-${status.index}">미리보기 보기</button>
										</div>
										<div class="pdf-preview-container" id="pdf-preview-existing-${status.index}"></div>
									</div>
								</c:if>
							</c:forEach>
						</div>
					</div>
				</c:if>
				
				<label for="fileInput" class="file-label">파일 첨부 (기존 파일은 삭제됩니다)</label>
				<div class="file-upload-container">
					<input type="file" id="fileInput" multiple>
					<ul id="fileList" class="file-list"></ul>
				</div>

				<!-- 새 파일 미리보기 섹션 -->
				<label class="file-label">새 파일 미리보기</label>
				<div id="preview-container" class="preview-container">
					<div id="preview-list">미리보기할 PDF 파일이 없습니다.</div>
				</div>

				<div class="button-group">
					<button class="cancel-btn" id="backBtn">취소</button>
					<button class="submit-btn" id="submitBtn">수정완료</button>
				</div>
			</div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/cdp/rsm/rsmb/resumeBoardUpdate.js"></script>
</body>
</html>