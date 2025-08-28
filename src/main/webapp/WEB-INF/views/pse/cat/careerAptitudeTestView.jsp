<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/pse/cat/careerAptitudeTestView.css">
<sec:authorize access="hasRole('ROLE_USER')">
	<script>
		window.isLoggedIn = true;
	</script>
</sec:authorize>
<sec:authorize access="!isAuthenticated()">
	<script>
		window.isLoggedIn = false;
	</script>
</sec:authorize>
<section class="channel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진로 탐색</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/pse/cat/careerAptitudeTest.do">진로 심리검사</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/pse/cr/crl/selectCareerList.do">직업백과</a>
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
				<a href="/pse/cat/careerAptitudeTest.do">진로 탐색</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/pse/cat/careerAptitudeTest.do">진로 심리검사</a>
			</li>
		</ol>
	</nav>
</div>
<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab active" href="/pse/cat/careerAptitudeTest.do">진로 심리검사</a>

	</div>
	<div class="public-wrapper-main">
		<div class="test-intro">
			<span class="list-header__meta-item list-header__meta-item--source">[ 출처 : 한국직업능력연구원 국가진로교육연구센터 (커리어넷) ]</span>
			<h2 class="test-intro__title">진로 심리검사 안내</h2>
			<p class="test-intro__subtitle">
				나를 바로 알면 <strong>성공한 미래</strong>가 보인다!
			</p>
			<p class="test-intro__description">
				진로심리검사는 자신의 흥미와 성격, 가치관을 기반으로 진로를 탐색할 수 있도록 도와줍니다.<br> 다른 검사결과는 진단 후 결과만 제공하지만, 진로심리검사는 검사 후 진로 정보와 직업 정보를 함께 제공함으로써 실제 진로로 발전할 수 있는 방향까지 안내합니다.<br> 자신에게 맞는 심리를 선택하여 검사하고, 검사 결과를 바탕으로 진로를 개발하기 위한 첫 걸음을 내딛기 바랍니다.
			</p>

			<div class="test-intro__features">
				<div class="test-intro__feature-item test-intro__feature-item--pink">
					진로목표가<br>나는 누구인가<br>어떤꿈인가?
				</div>
				<div class="test-intro__feature-item test-intro__feature-item--blue">
					진로에서 필요한<br>어떤 성격과 태도가<br>나와 적합한 역할?
				</div>
				<div class="test-intro__feature-item test-intro__feature-item--green">
					진로특성, 진로정보<br>무슨 직무가<br>발달할까?
				</div>
			</div>

			<div class="test-intro__tabs">
				<button class="test-intro__tab test-intro__tab--active" data-type="student">중·고등학생용</button>
				<button class="test-intro__tab" data-type="adult">대학·성인용</button>
			</div>

			<div class="test-intro__card-grid" id="cardGrid"></div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>

</html>
<script src="/js/pse/cat/careerAptitudeTestView.js"></script>