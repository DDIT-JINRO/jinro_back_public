<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/comm/peer/teen/teenDetail.css">
<section class="channel community">
	<div class="channel-title">
		<div class="channel-title-text">커뮤니티</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/comm/peer/teen/teenList.do">또래 게시판</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/comm/path/pathList.do">진로/진학 게시판</a>
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
				<a href="/comm/peer/teen/teenList.do">커뮤니티</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/comm/peer/teen/teenList.do">또래 게시판</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/comm/peer/teen/teenList.do">청소년 게시판</a>
			<a class="tab" href="/comm/peer/youth/youthList.do">청년 게시판</a>
		</div>

		<div class="public-wrapper-main">
			<div class="boardEtcBtn" id="boardEtcBtn">
			    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
			        <circle cx="6" cy="12" r="2.2"></circle>
			        <circle cx="12" cy="12" r="2.2"></circle>
			        <circle cx="18" cy="12" r="2.2"></circle>
			    </svg>
			</div>
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
			<!-- 1) 제목 + 프로필 + 메타 -->
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
				</div>
			</div>

			<!-- 2) 핵심 정보 그리드 -->
			<div class="detailMainContent">
				<div class="detailContent">${boardVO.boardContent}</div>
			</div>
			<div class="fileClass">
				<c:choose>
					<c:when test="${not empty fileList}">
						<c:forEach var="file" items="${fileList}">
							<div class="detailFile">
								<div class="file-info">
									<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" 
									   class="file-name" 
									   title="파일명을 클릭하여 다운로드">
										${file.fileOrgName}
									</a>
								</div>
								<a href="/files/download?fileGroupId=${file.fileGroupId}&seq=${file.fileSeq}" 
								   class="file-download-btn" 
								   title="다운로드">
									다운로드
								</a>
							</div>
						</c:forEach>
					</c:when>
					<c:otherwise>
						<div class="no-files">첨부된 파일이 없습니다.</div>
					</c:otherwise>
				</c:choose>
			</div>

			<form action="/comm/peer/teen/createTeenReply.do" method="post" class="comment-form">
				<input type="hidden" name="boardId" value="${boardVO.boardId}" />
				<textarea id="replyContent" name="replyContent" maxlength="300" placeholder="댓글을 입력하세요."></textarea>
				<div class="comment-footer">
					<span class="char-count" id="char-count">0 / 300</span>
					<button type="submit" class="btn-submit">등록</button>
				</div>
			</form>

			<!-- 댓글 리스트 -->
			<div class="comment-section">
				<c:forEach var="reply" items="${replyVO}">
					<div class="reply-box" id="reply-${boardVO.boardId}-${reply.replyId }" data-reply-mem="${reply.memId }">
						<span class="etcBtn">
						    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						        <circle cx="6" cy="12" r="2.2"></circle>
						        <circle cx="12" cy="12" r="2.2"></circle>
						        <circle cx="18" cy="12" r="2.2"></circle>
						    </svg>
						</span>
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
							
							<button class="like-button ${reply.replyIsLiked == 1 ? 'liked' : ''}" data-board-id="${boardVO.boardId}" data-reply-id="${reply.replyId}" aria-label="댓글 좋아요 버튼">
								<svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							    </svg>
								<svg class="heart-filled" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							    </svg>
							</button>
							<span class="like-cnt" id="reply-like-cnt-${reply.replyId}">${reply.replyLikeCnt}</span>
						</div>
					</div>
					<div class="reply-child-container" data-parent-id="${reply.replyId }">
						<c:forEach var="child" items="${reply.childReplyVOList}">
							<div class="reply-box reply-child" data-reply-mem="${child.memId}" id="reply-${child.boardId}-${child.replyId }">
								<span class="etcBtn">
								    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								        <circle cx="6" cy="12" r="2.2"></circle>
								        <circle cx="12" cy="12" r="2.2"></circle>
								        <circle cx="18" cy="12" r="2.2"></circle>
								    </svg>
								</span>
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
						<form action="/comm/peer/teen/createTeenReply.do" method="post" class="comment-form child-form">
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
			</div>
			<div class="bottom-button">
				<a href="/comm/peer/teen/teenList.do" class="btn-back">목록</a>
			</div>
		</div>
		<!-- 여기까지 게시글 끝 -->
	</div>

	<div class="modal-overlay" id="report-modal-overlay">
		<div class="modal-content">
			<button class="modal-close-btn" type="button">&times;</button>
			<h3>신고 사유 입력</h3>
			<p>
				신고하실 내용을 구체적으로 입력해주세요.<br /> 예: 욕설·비방, 개인정보 노출, 허위 사실 유포, 부적절한 홍보 등<br /> 위반 항목과 상황을 간략히 작성해 주시면 처리에 도움이 됩니다.
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

</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script src="/js/comm/peer/teen/teenDetail.js"></script>
</body>
</html>