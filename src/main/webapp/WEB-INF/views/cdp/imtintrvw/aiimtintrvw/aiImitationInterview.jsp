<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/imtintrvw/aiimtintrvw/aimitationInterview.css">

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

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab" href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">면접의 기본</a>
			<a class="tab" href="/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do">면접 질문 리스트</a>
			<a class="tab" href="/cdp/imtintrvw/intrvwqestnmn/interviewQuestionMangementList.do">면접 질문 관리</a>
			<a class="tab active" href="/cdp/imtintrvw/aiimtintrvw/aiImitationInterview.do">AI 모의 면접</a>
		</div>
		<div class="public-wrapper-main">
			<div class="ai-interview__title">AI 모의 면접</div>

			<div class="form-section">
				<div class="tag-container">
					<div class="tag active" data-type="saved">
						<div class="tag-text">저장 질문 면접</div>
					</div>
					<div class="tag" data-type="random">
						<div class="tag-text">랜덤 질문 면접</div>
					</div>
				</div>
			</div>

			<div class="form-section">
				<label class="form-label">
					<span class="asterisk-icon"></span>
					<span class="section-title">사용 질문 리스트</span>
				</label>
				<select class="form-input question-select" id="questionSelect">
					<option value="" disabled selected>면접 질문 리스트를 선택하세요.</option>
				</select>
			</div>

			<div class="form-section">
				<label class="form-label">
					<span class="asterisk-icon"></span>
					<span>시작 전 확인사항</span>
				</label>
				<div class="checklist-container">
					<div class="checklist-item">
						<div class="checklist-text">얼굴 전체가 화면에 들어오게 캠을 조정하세요, 너무 가깝거나 멀다면 얼굴 식별이 힘들 수 있어요!</div>
						<div class="checkbox"></div>
					</div>
					<div class="checklist-item">
						<div class="checklist-text">측면을 비추는 방향으로 캠을 두지 마세요, 면접이 진행되는 중에도 얼굴의 측면이 아닌 정면을 잘 비출 수 있도록 캠을 신경써주세요!</div>
						<div class="checkbox"></div>
					</div>
					<div class="checklist-item">
						<div class="checklist-text">질문에 대한 답변이 잘 녹화, 녹음될 수 있도록 유의하세요 잡음이 발생할 수 있는 주변 환경을 피하고 큰 목소리를 유지해 주세요!</div>
						<div class="checkbox"></div>
					</div>
				</div>
			</div>

			<div class="form-actions">
				<button class="btn btn--primary start-button" onclick="startMockInterview()" id="startButton">
					<span>모의면접 시작하기</span>
					<div class="loading-spinner" id="loadingSpinner"></div>
				</button>
			</div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script src="/js/cdp/imtintrvw/aiimtintrvw/aimitationInterview.js"></script>
</body>
</html>