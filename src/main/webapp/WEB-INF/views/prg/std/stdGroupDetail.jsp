<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/prg/std/stdGroupDetail.css">
<section class="channel program">
	<div class="channel-title">
		<div class="channel-title-text">프로그램</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/prg/ctt/cttList.do">공모전</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/prg/act/vol/volList.do">대외활동</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/prg/std/stdGroupList.do">스터디그룹</a>
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
				<a href="/prg/ctt/cttList.do">프로그램</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/prg/std/stdGroupList.do">스터디 그룹</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<sec:authorize access="isAuthenticated()">
		<sec:authentication property="principal" var="memId" />
	</sec:authorize>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/prg/std/stdGroupList.do">스터디 그룹</a>
		</div>

		<div class="public-wrapper-main">
			<div class="boardEtcBtn" id="boardEtcBtn">...</div>
			<div class="boardEtcContainer" data-board-id="${stdBoardVO.boardId }">
				<c:choose>
					<c:when test="${memId==stdBoardVO.memId }">
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
				<h1 class="post-title" id="post-title" <c:if test="${newChatRoom != null}">data-new-room="${newChatRoom }"</c:if> >${stdBoardVO.boardTitle}</h1>
				<div class="author-meta">
					<div class="profile-wrapper user-profile">
						<img class="profile-img" src="<c:out value="${not empty stdBoardVO.fileProfileStr ? stdBoardVO.fileProfileStr : '/images/defaultProfileImg.png' }"/>" alt="프로필" />
					</div>
					<span class="author-nickname">${stdBoardVO.memNickname}</span>
				</div>
				<div class="post-meta">
					<span class="meta-item">
						작성일:
						<fmt:formatDate value="${stdBoardVO.boardCreatedAt}" pattern="yyyy. M. d." />
					</span>
					<span class="meta-item">조회수: ${stdBoardVO.boardCnt}</span>
				</div>
			</div>

			<!-- 2) 핵심 정보 그리드 -->
			<dl class="info-grid">
				<div class="info-item">
					<dt>지역</dt>
					<dd>${stdBoardVO.region}</dd>
				</div>
				<div class="info-item">
					<dt>성별</dt>
					<dd>${stdBoardVO.gender == 'all' ? '전체' : (stdBoardVO.gender=='men'?'남자만':'여자만')}</dd>
				</div>
				<div class="info-item">
					<dt>관심분야</dt>
					<dd>${interestMap[stdBoardVO.interest]}</dd>
					<!-- 서버에서 한글명 치환해 두면 편해요 -->
				</div>
				<div class="info-item">
					<dt>채팅방 제목</dt>
					<dd>${stdBoardVO.chatRoomVO.crTitle}</dd>
				</div>
				<div class="info-item">
					<dt>입장제한 인원수</dt>
					<dd>${stdBoardVO.chatRoomVO.crMaxCnt}명</dd>
				</div>
				<div class="info-item">
					<dt>현재 입장 인원수</dt>
					<dd>${stdBoardVO.curJoinCnt}명</dd>
				</div>
			</dl>
			<div class="enter-btn-wrapper">
				<c:choose>
					<c:when test="${isEntered }">
						<button id="exitChatBtn" class="btn-enter-chat entered">🛑 채팅방 퇴장</button>
					</c:when>
					<c:when test="${stdBoardVO.maxPeople <= stdBoardVO.curJoinCnt}">
						<button id="enterChatBtn" class="btn-enter-chat disabled">❌ 입장 불가</button>
					</c:when>
					<c:otherwise>
						<button id="enterChatBtn" class="btn-enter-chat">💬 채팅방 입장</button>
					</c:otherwise>
				</c:choose>
			</div>
			<!-- 3) 본문 -->
			<div class="group-description">
				<h2 class="desc-title">소개글</h2>
				<p>${stdBoardVO.parsedContent}</p>
			</div>

			<form action="/prg/std/createStdReply.do" method="post" class="comment-form">
				<input type="hidden" name="boardId" value="${stdBoardVO.boardId}" />
				<textarea id="replyContent" name="replyContent" maxlength="300" placeholder="댓글을 입력하세요."></textarea>
				<div class="comment-footer">
					<span class="char-count" id="char-count">0 / 300</span>
					<button type="submit" class="btn-submit">등록</button>
				</div>
			</form>

			<!-- 댓글 리스트 -->
			<div class="comment-section">
				<c:forEach var="reply" items="${stdBoardVO.stdReplyVOList}">
					<div class="reply-box" id="reply-${stdBoardVO.boardId}-${reply.replyId }" data-reply-mem="${reply.memId }">
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
						<div>
							<button class="reply-child-btn" id="reply-${reply.replyId }">답글</button>
							<!-- 토글시킬 답글버튼 id:reply-댓글번호 -->
							<span class="child-count">
								<c:if test="${reply.childCount > 0 }">
				  			${reply.childCount }
					  	</c:if>
							</span>
						</div>
					</div>
					<!-- 대댓글 (childReplyVOList) -->
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
						<!-- 대댓글 입력창 -->
						<form action="/prg/std/createStdReply.do" method="post" class="comment-form child-form">
							<input type="hidden" name="boardId" value="${stdBoardVO.boardId}" />
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
					<a href="/prg/std/stdGroupList.do" class="btn-back">목록</a>
				</div>
			</div>
		</div>


		<!-- 신고모달 -->
		<div class="modal-overlay" id="report-modal-overlay">
			<div class="modal-content">
				<button class="modal-close-btn" type="button">&times;</button>
				<h3>신고 사유 입력</h3>
				<p>신고하실 내용을 구체적으로 입력해주세요.<br /> 예: 욕설·비방, 개인정보 노출, 허위 사실 유포, 부적절한 홍보 등<br /> 위반 항목과 상황을 간략히 작성해 주시면 처리에 도움이 됩니다.
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
		<!-- 신고모달끝 -->
	</div>
</div>


<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script>
	const crId = "${stdBoardVO.chatRoomVO.crId}";
</script>
<script src="/js/prg/std/stdGroupDetail.js"></script>
</html>