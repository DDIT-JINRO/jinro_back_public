<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/sint/sintwrt/selfIntroWriting.css">

<c:if test="${not empty errorMessage}">
	<script type="text/javascript">
		showConfirm2("${fn:escapeXml(errorMessage)}","",
			() => {
			}
		);
	    return;
	</script>
</c:if>

<section class="channel">
	<div class="channel-title">
		<div class="channel-title-text">경력관리</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
		</div>
		<div class="channel-sub-section-itemIn">
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
				<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">자기소개서</a>
			</li>
		</ol>
	</nav>
</div>

<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab" href="/cdp/sint/qestnlst/questionList.do">질문 리스트</a>
		<a class="tab" href="/cdp/sint/sintlst/selfIntroList.do">자기소개서 리스트</a>
		<a class="tab active" href="/cdp/sint/sintwrt/selfIntroWriting.do">자기소개서 작성</a>
	</div>

	<div class="public-wrapper-main">
		<div class="selfintro-write-container">
			<form action="/cdp/sint/sintwrt/save" method="post" class="selfintro-write-form">
				<!-- 제목 입력 섹션 -->
				<div class="form-section">
					<label class="form-label">자기소개서 제목</label>
					<input type="text" name="siTitle" value="${selfIntroVO.siTitle}" placeholder="자기소개서 제목을 입력하세요" class="form-input form-input--large" required />
					<input type="hidden" name="siId" value="${selfIntroVO.siId}" />
					<input type="hidden" name="memId" value="${selfIntroVO.memId}" />
					<input type="hidden" name="siStatus" id="siStatus" value="완료" />
				</div>

				<!-- 질문·답변 컨테이너 -->
				<div class="qa-container" id="questionContainer">
					<!-- 공통 질문 -->
					<c:forEach var="q" items="${commonQList}" varStatus="st">
						<div class="qa-card">
							<div class="qa-card__header">
								<div class="qa-card__number">${st.index + 1}</div>
								<h3 class="qa-card__question">${q.siqContent}</h3>
								<input type="hidden" name="siqIdList" value="${q.siqId}" />
							</div>
							<div class="qa-card__body">
								<div class="form-group">
									<textarea name="sicContentList" placeholder="답변을 작성해주세요" rows="8" maxlength="2000" class="form-textarea" oninput="countChars(this, ${st.index})"></textarea>
									<div class="char-counter">
										<span id="charCount-${st.index}">0</span>
										/ 2000자
									</div>
								</div>
							</div>
						</div>
					</c:forEach>

					<!-- 선택된 질문(수정 모드) -->
					<c:if test="${not empty selfIntroQVOList}">
						<c:forEach var="q" items="${selfIntroQVOList}" varStatus="st">
							<c:set var="globalIndex" value="${commonQList.size() + st.index}" />
							<div class="qa-card">
								<div class="qa-card__header">
									<div class="qa-card__number">${globalIndex + 1}</div>
									<h3 class="qa-card__question">${q.siqContent}</h3>
									<input type="hidden" name="siqIdList" value="${q.siqId}" />
								</div>
								<div class="qa-card__body">
									<div class="form-group">
										<textarea name="sicContentList" placeholder="답변을 작성해주세요" rows="8" maxlength="2000" class="form-textarea" oninput="countChars(this, ${globalIndex})">${selfIntroContentVOList[st.index].sicContent}</textarea>
										<div class="char-counter">
											<span id="charCount-${globalIndex}">0</span>
											/ 2000자
										</div>
									</div>
								</div>
							</div>
						</c:forEach>
					</c:if>
				</div>

				<!-- 액션 버튼 그룹 -->
				<div class="form-actions">
					<div class="form-actions__left">
						<c:if test="${selfIntroVO.siId != 0 && not empty selfIntroVO.siId}">
							<button type="button" class="btn btn--danger btn--outline">
								삭제하기
							</button>
						</c:if>
					</div>
					<div class="form-actions__right">
						<button type="button" class="btn btn--outline" id="autoCompleteBtn">자동완성</button>
						<button type="button" class="btn btn--secondary btn-temp-save">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
								<path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
								<path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
							</svg>
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

<script type="text/javascript" src="/js/cdp/sint/sintwrt/selfIntroWriting.js"></script>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>