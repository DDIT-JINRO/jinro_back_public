<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="">
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
		<div class="channel-sub-section-itemIn"><a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">모의면접</a></div>
		<div class="channel-sub-section-item"><a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">AI 피드백</a></div>
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
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
		    <a class="tab active" href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">면접의 기본</a>
		    <a class="tab" href="/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do">면접 질문 리스트</a>
		    <a class="tab" href="/cdp/imtintrvw/intrvwqestnmn/interviewQuestionMangementList.do">면접 질문 관리</a>
		    <a class="tab" href="/cdp/imtintrvw/aiimtintrvw/aiImitationInterview.do">AI 모의 면접</a>
  		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
  		<div class="public-wrapper-main">
    		<img alt="인터뷰" src="/images/interview.png" style="display: block; margin: 0 auto;">
  		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script>
	// 스크립트 작성 해주시면 됩니다.
</script>