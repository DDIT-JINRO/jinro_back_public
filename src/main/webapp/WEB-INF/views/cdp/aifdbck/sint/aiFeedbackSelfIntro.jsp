<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet"
	href="/css/cdp/aifdbck/sint/aiFeedbackSelfIntro.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">경력관리</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item"><a href="/cdp/rsm/rsm/resumeList.do">이력서</a></div>
		<div class="channel-sub-section-item"><a href="/cdp/sint/qestnlst/questionList.do">자기소개서</a></div>
		<div class="channel-sub-section-item"><a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">모의면접</a></div>
		<div class="channel-sub-section-itemIn"><a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">AI 피드백</a>	</div>
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
				<a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">AI 피드백</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
			<a class="tab" href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">이력서</a>
			<a class="tab active"
				href="/cdp/aifdbck/sint/aiFeedbackSelfIntroList.do">자기소개서</a>
		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
		<div class="public-wrapper-main">
			<!-- 자기소개서 목록 드롭다운 -->
			<select class="self-intro-select" id="selfIntroList">
				<option value="">내가 작성한 자기소개서 리스트를 선택하세요.</option>
				<c:forEach var="intro" items="${selfIntroList}">
					<option value="${intro.siId}">${intro.siTitle}</option>
				</c:forEach>
			</select> <br /> <br />
			<div class="aifb-container">
				<!-- 자기소개서 원본 입력 영역 -->
				<h1 class="aifb-title">자기소개서 제목</h1>
				<div class="aifb-content-wrapper">
					<div class="aifb-section">
						<div class="aifb-section-header">
							<h2>자기소개서</h2>
						</div>
						<div class="aifb-questions-wrapper" id="questionsWrapper">자기소개서 내용이 출력될 공간입니다</div>
					</div>

					<!-- AI 피드백 출력 영역 -->
					<div class="aifb-feedback-wrapper">
						<div class="aifb-feedback-header">
							<h2>AI 피드백</h2>
							<!-- 피드백 밑에 버튼 추가 -->
							<div class="aifb-button-group">
							  <button id="previewPdfBtn" class="aifb-button">미리보기</button>
							  <button id="downloadPdfBtn" class="aifb-button">다운로드</button>
							</div>
						</div>
						<div class="aifb-feedback-area" id="feedbackArea">AI의 피드백 내용이 출력될 공간입니다</div>
					</div>
				</div>

				<div class="aifb-footer-wrapper">
				    <div class="ai-feedback-section">
				        <button id="requestAiFeedback" class="aifb-button feedback">AI 피드백 요청</button>
				        <span class="powered-by-text">Powered by Gemini</span>
				    </div>
				    <button class="aifb-button proofread" onclick="requestProofread()">내 자기소개서 수정하러 가기</button>
				</div>
			</div>
			
			<!-- 모달 -->
			<div class="ai-modal-backdrop" id="modalBg" aria-hidden="true"></div>
			<div class="ai-modal" id="confirmModal" role="dialog"
				aria-modal="true" aria-labelledby="confirmTitle">
				<h4 id="confirmTitle">AI 첨삭 시작을 확인해 주세요</h4>
				<div class="ai-kv">
					<div>
						<b>사용 서비스</b> : <span>자기소개서 AI 첨삭</span>
					</div>
					<div>
						<b>남은 이용권 수</b> : <span id="cover-count-display">${aiCounts.payCoverCnt}</span>회
					</div>
				</div>
				<p>확인을 누르면 이용권이 차감되며, AI첨삭이 시작됩니다.</p>
				<div class="row">
					<button type="button" class="btn secondary" id="btnCancel">취소</button>
					<button type="button" class="btn" id="btnConfirm">확인하고 시작</button>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/cdp/aifdbck/sint/aiFeedbackSelfIntro.js" defer></script>
<script>
	// 스크립트 작성 해주시면 됩니다.
</script>