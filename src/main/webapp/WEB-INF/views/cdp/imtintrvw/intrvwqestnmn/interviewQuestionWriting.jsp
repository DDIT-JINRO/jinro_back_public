<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/imtintrvw/intrvwqestnmn/interviewQuestionWriting.css">

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
		<a class="tab" href="/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do">면접 질문 리스트</a>
		<a class="tab active" href="/cdp/imtintrvw/intrvwqestnmn/interviewQuestionMangementList.do">면접 질문 관리</a>
		<a class="tab" href="/cdp/imtintrvw/aiimtintrvw/aiImitationInterview.do">AI 모의 면접</a>
	</div>

	<div class="public-wrapper-main">
		<div class="selfintro-write-container">
			<form action="/cdp/imtintrvw/intrvwqestnmn/save" method="post" class="selfintro-write-form">
				<div class="form-section">
					<label class="form-label">면접 질문 세트 제목</label>
					<input type="text" name="idlTitle" value="${interviewDetailListVO.idlTitle}" placeholder="제목을 입력하세요" class="form-input form-input--large" required />
					<input type="hidden" name="idlId" value="${empty interviewDetailListVO.idlId ? 0 : interviewDetailListVO.idlId}" />
					<input type="hidden" name="memId" value="${interviewDetailListVO.memId}" />
					<input type="hidden" name="idlStatus" id="idlStatus" value="완료" />
				</div>

				<div class="qa-container" id="questionContainer">
					<c:if test="${empty interviewQuestionVOList}">
						<c:forEach var="q" items="${commonQList}" varStatus="st">
							<div class="qa-card">
								<div class="qa-card__header">
									<div class="qa-card__number">${st.index + 1}</div>
									<h3 class="qa-card__question">${q.iqContent}</h3>
									<input type="hidden" name="iqIdList" value="${q.iqId}" />
								</div>
								<div class="qa-card__body">
									<div class="form-group">
										<textarea name="idAnswerList" placeholder="답변을 작성해주세요" rows="8" maxlength="2000" class="form-textarea" oninput="countChars(this, ${st.index})"></textarea>
										<div class="char-counter">
											<span id="charCount-${st.index}">0</span>
											/ 2000자
										</div>
									</div>
								</div>
							</div>
						</c:forEach>
					</c:if>

					<c:if test="${not empty interviewQuestionVOList}">
						<c:forEach var="q" items="${interviewQuestionVOList}" varStatus="st">
							<div class="qa-card">
								<div class="qa-card__header">
									<div class="qa-card__number">${st.index + 1}</div>
									<h3 class="qa-card__question">${q.iqContent}</h3>
									<input type="hidden" name="iqIdList" value="${q.iqId}" />
								</div>
								<div class="qa-card__body">
									<div class="form-group">
										<textarea name="idAnswerList" placeholder="답변을 작성해주세요" rows="8" maxlength="2000" class="form-textarea" oninput="countChars(this, ${st.index})">${interviewDetailVOList[st.index].idAnswer}</textarea>
										<div class="char-counter">
											<span id="charCount-${st.index}">0</span>
											/ 2000자
										</div>
									</div>
								</div>
							</div>
						</c:forEach>
					</c:if>
				</div>

				<div class="form-actions">
					<div class="form-actions__left">
						<c:if test="${not empty interviewDetailListVO.idlId && interviewDetailListVO.idlId != 0}">
							<button type="button" class="btn btn--danger btn--outline">
								삭제하기
							</button>
						</c:if>
					</div>
					<div class="form-actions__right">
						<button type="button" class="btn btn--outline" id="autoCompleteBtn">자동완성</button>
						<button type="button" class="btn btn--secondary btn-temp-save">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
								<path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
								<path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>
							임시저장
						</button>
						<button type="button" class="btn btn--outline btn-preview">
							미리보기
						</button>
						<button type="submit" class="btn btn--primary">
							작성완료
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
<script src="/js/cdp/imtintrvw/intrvwqestnmn/interviewQuestionWriting.js"></script>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>