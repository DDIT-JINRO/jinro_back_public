<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/rsm/rsmb/resumeBoardDetail.css">
<link rel="stylesheet" href="/css/comm/peer/teen/teenDetail.css">
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
			<div class="boardEtcBtn" id="boardEtcBtn">...</div>
			<div class="boardEtcContainer" data-board-id="${boardVO.boardId }">

				<c:choose>
					<c:when test="${memId == boardVO.memId }">

						<div class="boardEtcActionBtn" id="boardModifyBtn">
							<span>수정</span>
						</div>
						<hr />
						<div class="boardEtcActionBtn" id="boardDeleteBtn">
							<span>삭제</span>
						</div>
					</c:when>
					<c:otherwise>
						<div class="boardEtcActionBtn" id="boardReportBtn">
							<span>신고</span>
						</div>
					</c:otherwise>
				</c:choose>
			</div>
			<div class="post-header">
				<h1 class="post-title">${boardVO.boardTitle}</h1>
				<div class="author-meta">
					<div class="profile-wrapper user-profile">
						<img class="profile-img" src="<c:out value="${not empty memVO.profileFilePath ? memVO.profileFilePath : '/images/defaultProfileImg.png' }"/>" alt="프로필" />
					</div>
					<span class="author-nickname">${memVO.memNickname}</span>
				</div>
				<div class="post-meta">
					<span class="meta-item">
						작성일:
						<fmt:formatDate value="${boardVO.boardCreatedAt}" pattern="yyyy. M. d." />
					</span>
					<span class="meta-item">조회수: ${boardVO.boardCnt}</span>
					<span class="meta-item" id="like-board-wrapper-${boardVO.boardId}">
						<button class="like-button ${boardVO.boardIsLiked == 1 ? 'liked' : ''}" data-board-id="${boardVO.boardId}" aria-label="좋아요 버튼">
							<svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							    </svg>

							<svg class="heart-filled" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							    </svg>
						</button>
						<span class="like-cnt" id="board-like-cnt-${boardVO.boardId}">${boardVO.boardLikeCnt}</span>
					</span>
					<span class="meta-item">
						<button class="bookmark-button ${boardVO.isBookmark == boardVO.boardId ? 'is-active' : ''}" data-category-id="G03005" data-target-id="${boardVO.boardId}">
							<span class="bookmark-button__icon--active">
								<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
							</span>
	
							<span class="bookmark-button__icon--inactive">
								<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
							</span>
						</button>
					</span>
				</div>
			</div>
			<div class="detailMainContent">
				<div class="detailContent">${boardVO.boardContent}</div>
			</div>
			<div class="fileClass">
				<c:forEach var="file" items="${fileList}" varStatus="status">
					<div class="detailFile">
						<c:set var="lowerCaseName" value="${fn:toLowerCase(file.fileOrgName)}" />
						<div class="file-header">
							<span class="file-name">${file.fileOrgName}</span>
	
							<div class="file-btn-wrapper">
								<c:if test="${fn:endsWith(lowerCaseName, '.pdf')}">
									<button type="button" class="btn-pdf-preview" data-pdf-url="${file.filePath}" data-target-id="pdf-preview-${status.index}">미리보기 보기</button>
								</c:if>
								<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" class="btn-pdf-download"> 다운로드 </a>
							</div>
						</div>

						<c:if test="${fn:endsWith(lowerCaseName, '.pdf')}">
							<div class="pdf-preview-container" id="pdf-preview-${status.index}"></div>
						</c:if>
					</div>
				</c:forEach>
			</div>

			<form action="/cdp/rsm/rsmb/createResumeReply.do" method="post" class="comment-form">
				<input type="hidden" name="boardId" value="${boardVO.boardId}" />
				<textarea id="replyContent" name="replyContent" maxlength="300" placeholder="댓글을 입력하세요."></textarea>
				<div class="comment-footer">
					<span class="char-count" id="char-count">0 / 300</span>
					<button type="submit" class="btn-submit">등록</button>
				</div>
			</form>

			<div class="comment-section">
				<c:forEach var="reply" items="${replyVO}">
					<div class="reply-box" id="reply-${boardVO.boardId}-${reply.replyId }" data-reply-mem="${reply.memId }">
						<span class="etcBtn">…</span>
						<div class="etc-container">
							<c:choose>
								<c:when test="${reply.memId == memId }">
									<div class="etc-act-btn">수정</div>
									<hr />
									<div class="etc-act-btn">삭제</div>
								</c:when>
								<c:otherwise>
									<div class="etc-act-btn">신고</div>
								</c:otherwise>
							</c:choose>
						</div>
						<div class="reply-profile">
							<div class="profile-wrapper user-profile">
								<img class="profile-img" src="<c:out value="${not empty reply.fileProfileStr ? reply.fileProfileStr : '/images/defaultProfileImg.png' }"/>" alt="profile" />
							</div>
							<div class="writer-info">
								<div class="reply-nickname">${reply.memNickname}</div>
								<div class="reply-date">
									<fmt:formatDate pattern="yyyy. M. d. HH:mm" value="${reply.replyCreatedAt}" />
								</div>
							</div>
						</div>
						<div class="reply-content">${reply.replyContent }</div>
						<div class="reply-action-wrapper">
							<button class="reply-child-btn" id="reply-${reply.replyId }">
								답글<c:if test="${reply.childCount > 0 }"> ${reply.childCount }</c:if>
							</button>
							
							<button class="like-button ${reply.replyIsLiked == 1 ? 'liked' : ''}" data-board-id="${boardVO.boardId}" data-reply-id="${reply.replyId}" aria-label="좋아요 버튼">
								<svg class="heart-outline" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					        </svg>
								<svg class="heart-filled" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					        </svg>
							</button>
							<span class="like-cnt" id="reply-like-cnt-${reply.replyId}">${reply.replyLikeCnt}</span>
						</div>
					</div>
					<div class="reply-child-container" data-parent-id="${reply.replyId }">
						<c:forEach var="child" items="${reply.childReplyVOList}">
							<div class="reply-box reply-child" data-reply-mem="${child.memId}" id="reply-${child.boardId}-${child.replyId }">
								<span class="etcBtn">…</span>
								<div class="etc-container">
									<c:choose>
										<c:when test="${child.memId == memId }">
											<div class="etc-act-btn">수정</div>
											<hr />
											<div class="etc-act-btn">삭제</div>
										</c:when>
										<c:otherwise>
											<div class="etc-act-btn">신고</div>
										</c:otherwise>
									</c:choose>
								</div>
								<div class="reply-profile">
									<div class="profile-wrapper user-profile">
										<img class="profile-img" src="<c:out value="${not empty child.fileProfileStr ? child.fileProfileStr : '/images/defaultProfileImg.png' }"/>" />
									</div>
									<div class="writer-info">
										<div class="reply-nickname">${child.memNickname}</div>
										<div class="reply-date">
											<fmt:formatDate pattern="yyyy. M. d. HH:mm" value="${child.replyCreatedAt}" />
										</div>
									</div>
								</div>
								<div class="reply-content">${child.replyContent}</div>
							</div>
						</c:forEach>
						<form action="/cdp/rsm/rsmb/createResumeReply.do" method="post" class="comment-form child-form">
							<input type="hidden" name="boardId" value="${boardVO.boardId }" />
							<input type="hidden" name="replyParentId" value="${reply.replyId }" />
							<textarea name="replyContent" maxlength="300" placeholder="댓글을 입력하세요."></textarea>
							<div class="comment-footer">
								<span class="char-count">0 / 300</span>
								<button type="submit" class="btn-submit">등록</button>
							</div>
							<br />
							<div class="closeReplyBtn">
								<span>답글접기 ▲</span>
							</div>
						</form>
					</div>
				</c:forEach>
				<div class="bottom-button">
					<a href="/cdp/rsm/rsmb/resumeBoardList.do" class="btn-back">목록</a>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal-overlay" id="report-modal-overlay">
	<div class="modal-content">
		<button class="modal-close-btn" type="button">&times;</button>
		<h3>신고 사유 입력</h3>
		<p>신고하실 내용을 구체적으로 입력해주세요. <br /> 예: 욕설·비방, 개인정보 노출, 허위 사실 유포, 부적절한 홍보 등 <br /> 위반 항목과 상황을 간략히 작성해 주시면 처리에 도움이 됩니다.
		</p>
		<div class="modal-form">
			<input type="hidden" id="report-target-id" />
			<input type="hidden" id="report-target-type" />
			<textarea id="report-content-input" placeholder="사유를 작성해주세요"></textarea>
			<input type="file" id="report-file" />
			<span class="modal-error-msg" id="modal-error-msg"></span>
			<button class="btn btn-primary" id="report-confirm-btn" type="button">확인</button>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/cdp/rsm/rsmb/resumeBoardDetail.js"></script>
</body>
</html>