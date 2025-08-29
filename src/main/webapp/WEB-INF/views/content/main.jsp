<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/main.css" />
<div class="mainContainer">



	<!-- Trending Strip: 헤더와 메인 사이 -->
	<div id="trending-strip" class="trending-strip" role="region" aria-label="인기 북마크/게시글 TOP5">
		<!-- 직업 -->
		<section class="trend-widget" data-endpoint="/bookmark/top?categoryId=G03004&limit=5" aria-label="직업 북마크 TOP5">
			<header class="trend-header">
				<span class="trend-title">직업 TOP</span>
			</header>
			<div class="trend-viewport" tabindex="0">
				<ul class="trend-roller" id="trend-roller-jobs" aria-live="polite"></ul>
			</div>
			<div class="trend-panel hidden" id="trend-panel-jobs"></div>
		</section>

		<!-- 대학 -->
		<section class="trend-widget" data-endpoint="/bookmark/top?categoryId=G03001&limit=5" aria-label="대학 북마크 TOP5">
			<header class="trend-header">
				<span class="trend-title">대학 TOP</span>
			</header>
			<div class="trend-viewport" tabindex="0">
				<ul class="trend-roller" id="trend-roller-unis" aria-live="polite"></ul>
			</div>
			<div class="trend-panel hidden" id="trend-panel-unis"></div>
		</section>

		<!-- 학과 -->
		<section class="trend-widget" data-endpoint="/bookmark/top?categoryId=G03006&limit=5" aria-label="학과 북마크 TOP5">
			<header class="trend-header">
				<span class="trend-title">학과 TOP</span>
			</header>
			<div class="trend-viewport" tabindex="0">
				<ul class="trend-roller" id="trend-roller-majors" aria-live="polite"></ul>
			</div>
			<div class="trend-panel hidden" id="trend-panel-majors"></div>
		</section>

		<!-- 커뮤니티 -->
		<section class="trend-widget" data-endpoint="/community/top5/main" aria-label="커뮤니티 게시글 TOP5">
			<header class="trend-header">
				<span class="trend-title">커뮤니티 TOP</span>
			</header>
			<div class="trend-viewport" tabindex="0">
				<ul class="trend-roller" id="trend-roller-community" aria-live="polite"></ul>
			</div>
			<div class="trend-panel hidden" id="trend-panel-community"></div>
		</section>
	</div>

	<section class="main-banner slider-container">
		<button class="prev-btn" id="prev-btn">‹</button>

		<div class="slides">
			<div class="slide">
				<div class="main-banner__inner">
					<div class="main-banner__text-content">
						<img src="/images/logo.png" alt="CareerPath Logo" class="main-banner__logo">
						<h1 class="main-banner__title">미래를 여는 길</h1>
						<p class="main-banner__subtitle">진로와 진학, 취업을 위한 종합 정보 제공<br /> 미래를 설계하는 데 필요한 모든 것
						</p>
						<button class="main-banner__button roadmapBtn">로드맵 바로가기</button>
					</div>
					<div class="main-banner__visuals">
						<img src="/images/main/loadMapIcon-board.png" class="main-banner__float-icon main-banner__float-icon--1" />
						<img src="/images/main/loadMapIcon-charactor.png" class="main-banner__float-icon main-banner__float-icon--char" />
						<img src="/images/main/loadMapIcon-book.png" class="main-banner__float-icon main-banner__float-icon--2" />
						<img src="/images/main/loadMapIcon-book2.png" class="main-banner__float-icon main-banner__float-icon--3" />
						<img src="/images/main/loadMapIcon-chart.png" class="main-banner__float-icon main-banner__float-icon--4" />
						<img src="/images/main/loadMapIcon-cogwheel.png" class="main-banner__float-icon main-banner__float-icon--5" />
						<img src="/images/main/loadMapIcon-lamp.png" class="main-banner__float-icon main-banner__float-icon--6" />
						<img src="/images/main/loadMapIcon-reading_glasses.png" class="main-banner__float-icon main-banner__float-icon--7" />
					</div>
				</div>
			</div>
			<c:if test="${memId eq 'anonymousUser' or isTeen eq 'true'}">
				<div class="slide">
					<div class="main-banner__inner">
						<div class="main-banner__text-content">
							<img src="/images/logo.png" alt="CareerPath Logo" class="main-banner__logo">
							<h1 class="main-banner__title">꿈을 찾는 길</h1>
							<p class="main-banner__subtitle">대학에 꿈을 가진 청소년에게<br> 미래를 설계하는데 필요한 학과 비교 페이지
							</p>
							<a href="/ertds/univ/dpsrch/selectDeptList.do" class="main-banner__button BtnData">학과비교 바로가기</a>
						</div>
						<div class="main-banner__visuals">
							<img src="/images/main/loadMapIcon-board.png" class="main-banner__float-icon main-banner__float-icon--1" />
							<img src="/images/main/selectDept-logo.png" class="main-banner__float-icon main-banner__float-icon--char2 "/>
							<img src="/images/main/loadMapIcon-book.png" class="main-banner__float-icon main-banner__float-icon--2" />
							<img src="/images/main/loadMapIcon-book2.png" class="main-banner__float-icon main-banner__float-icon--3" />
							<img src="/images/main/loadMapIcon-chart.png" class="main-banner__float-icon main-banner__float-icon--4" />
							<img src="/images/main/loadMapIcon-cogwheel.png" class="main-banner__float-icon main-banner__float-icon--5" />
							<img src="/images/main/loadMapIcon-lamp.png" class="main-banner__float-icon main-banner__float-icon--6" />
							<img src="/images/main/loadMapIcon-reading_glasses.png" class="main-banner__float-icon main-banner__float-icon--7" />
						</div>
					</div>
				</div>
			</c:if>
			<c:if test="${memId eq 'anonymousUser' or isTeen eq 'false'}">
				<div class="slide">
					<div class="main-banner__inner">
						<div class="main-banner__text-content">
							<img src="/images/logo.png" alt="CareerPath Logo" class="main-banner__logo">
							<h1 class="main-banner__title">꿈이 현실이 되는 길</h1>
							<p class="main-banner__subtitle">꿈을 향해 달려가는 멋진 청년에게<br> 진로를 설계하는데 필요한 직업 비교 페이지
							</p>
							<a href="/pse/cr/crl/selectCareerList.do" class="main-banner__button BtnData">직업비교 바로가기</a>
						</div>

						<div class="main-banner__visuals">
							<img src="/images/main/loadMapIcon-board.png" class="main-banner__float-icon main-banner__float-icon--1" />
							<img src="/images/main/selectJobs-logo.png" class="main-banner__float-icon main-banner__float-icon--char3" />
							<img src="/images/main/loadMapIcon-book.png" class="main-banner__float-icon main-banner__float-icon--2" />
							<img src="/images/main/loadMapIcon-book2.png" class="main-banner__float-icon main-banner__float-icon--3" />
							<img src="/images/main/loadMapIcon-chart.png" class="main-banner__float-icon main-banner__float-icon--4" />
							<img src="/images/main/loadMapIcon-cogwheel.png" class="main-banner__float-icon main-banner__float-icon--5" />
							<img src="/images/main/loadMapIcon-lamp.png" class="main-banner__float-icon main-banner__float-icon--6" />
							<img src="/images/main/loadMapIcon-reading_glasses.png" class="main-banner__float-icon main-banner__float-icon--7" />
						</div>
					</div>
				</div>
			</c:if>
		</div>
		<button class="next-btn" id="next-btn">›</button>
		<div class="slider-controls">
			<div class="dots-container">
				<!-- 첫 번째 dot (항상 표시) -->
				<span class="dot active" data-slide-index="0"></span>

				<!-- 두 번째 dot -->
				<c:choose>
					<c:when test="${memId eq 'anonymousUser'}">
						<!-- 비로그인: 학과비교 -->
						<span class="dot" data-slide-index="1"></span>
					</c:when>
					<c:when test="${isTeen eq 'true'}">
						<!-- 로그인 + 청소년: 학과비교 -->
						<span class="dot" data-slide-index="1"></span>
					</c:when>
					<c:when test="${isTeen eq 'false'}">
						<!-- 로그인 + 성인: 직업비교 -->
						<span class="dot" data-slide-index="1"></span>
					</c:when>
				</c:choose>

				<!-- 세 번째 dot (비로그인 사용자만) -->
				<c:if test="${memId eq 'anonymousUser'}">
					<span class="dot" data-slide-index="2"></span>
				</c:if>
			</div>
		</div>
	</section>

	<!-- AI 기능 바로가기 섹션 -->
	<section id="ai-shortcuts" aria-labelledby="ai-shortcuts-title">
		<div class="ai-shortcuts__container">
			<div class="ai-shortcuts__head">
				<c:if test="${memId eq 'anonymousUser'}">
					<p class="ai-shortcuts__eyebrow">로그인이 필요한 서비스입니다</p>
				</c:if>
				<h2 id="ai-shortcuts-title" class="ai-shortcuts__title">AI와 함께 똑똑하게 준비하기</h2>
				<p class="ai-shortcuts__desc">AI 기반 커리어 도구를 지금 바로 경험해보세요.</p>
			</div>

			<div class="ai-shortcuts__grid">
				<!-- 1. AI 모의면접 -->
				<a class="ai-card" href="/cdp/imtintrvw/aiimtintrvw/aiImitationInterview.do" aria-label="AI 모의면접 바로가기"> 
					<img class="ai-card__icon" src="/images/main/charactor5-aimockintrv.png" alt="" />
					<div class="ai-card__body">
						<h3 class="ai-card__title">AI 모의면접</h3>
						<p class="ai-card__text">실전 감각 · AI 피드백</p>
					</div>
				</a>

				<!-- 2. AI 이력서 -->
				<a class="ai-card" href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do" aria-label="AI 이력서 바로가기"> 
					<img class="ai-card__icon" src="/images/main/charactor6-airesume.png" alt="" />
					<div class="ai-card__body">
						<h3 class="ai-card__title">AI 이력서 첨삭</h3>
						<p class="ai-card__text">키워드 보강 · 문장 다듬기</p>
					</div>
				</a>

				<!-- 3. AI 자소서 -->
				<a class="ai-card" href="/cdp/aifdbck/sint/aiFeedbackSelfIntroList.do" aria-label="AI 자소서 바로가기"> 
					<img class="ai-card__icon" src="/images/main/charactor7-aiselfintro.png" alt="" />
					<div class="ai-card__body">
						<h3 class="ai-card__title">AI 자소서 첨삭</h3>
						<p class="ai-card__text">항목별 구조화 · 첨삭</p>
					</div>
				</a>

				<!-- 4. AI 상담 -->
				<a class="ai-card" href="/cnslt/aicns/aicns.do" aria-label="AI 상담 바로가기"> 
					<img class="ai-card__icon" src="/images/main/charactor8-aicounsel.png" alt="" />
					<div class="ai-card__body">
						<h3 class="ai-card__title">AI 24시 상담</h3>
						<p class="ai-card__text">진로·진학/취업 맞춤 조언</p>
					</div>
				</a>
			</div>
		</div>
	</section>


	<section class="feature-slider">
		<div class="feature-slider__header">
			<h2 class="feature-slider__title">Career Path</h2>
			<p class="feature-slider__subtitle">나만의 길을 찾고 있나요? 진로 고민은 이제 그만! 당신의 잠재력을 깨울 <strong> 최신 공모전, 대외활동</strong>으로 새로운 기회를 경험해 보세요.
			</p>
		</div>
		<div class="feature-slider__container">
			<div class="feature-slider__slides">
			</div>
		</div>
	</section>

	<section class="promo-section">
		<div class="promo-section__inner">
			<div class="promo-card">
				<h3 class="promo-card__title">직업 이상형 월드컵</h3>
				<div class="promo-card__body">
					<div class="promo-card__visuals">
						<img src="/images/main/charactor1.png" alt="캐릭터" class="promo-card__character promo-card__character--1" />
						<img src="/images/main/charactor4.png" alt="캐릭터" class="promo-card__character promo-card__character--2" />
					</div>
					<div class="promo-card__text-content">
						<p>500여 개의 직업 중<br />자신이 선호하는 직업은 무엇인지,
						</p>
						<p>선택의 순간마다,<br /> 당신의 직업 가치관이 드러납니다<br /> 직업 월드컵을 통해 꿈을 찾아보세요!
						</p>
						<button class="promo-card__button" id="worldcupBtn">직업 이상형 월드컵</button>
					</div>
				</div>
			</div>
			<div class="promo-card">
				<h3 class="promo-card__title">진로 심리 검사</h3>
				<div class="promo-card__body">
					<div class="promo-card__visuals">
						<img src="/images/main/charactorChalsak.png" alt="캐릭터" class="promo-card__character promo-card__character--3" />
						<img src="/images/main/charactor3.png" alt="캐릭터" class="promo-card__character promo-card__character--4" />
					</div>
					<div class="promo-card__text-content">
						<p>여러 검사들을 통해<br /> 나의 직업 성향과 특성을 이해하고,
						</p>
						<p>자신이 선호하는 직업이 무엇인지,<br /> 자신에게 적합한 진로를 탐색해 보세요
						</p>
						<button class="promo-card__button" onclick="location.href='/pse/cat/careerAptitudeTest.do'">진로 심리 검사</button>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="content-showcase content-showcase--youtube">
		<div class="content-showcase__header">
			<h2 id="typing-js" class="content-showcase__title typing-js"></h2>
		</div>
		<div>
			<div class="goToTest" id="nonKeyword">
				<p>* 맞춤 영상을 제공받고 싶다면?</p>
				<button onclick="location.href='/pse/cat/careerAptitudeTest.do'">진로검사 시작하기</button>
			</div>
			<div class="goToTest" id="getKeyword">
				<p>*<span id="goToTestJobName" style="font: bold; font-weight: 600"></span>의 직업이 궁금하다면?</p>
				<button id="getKeywordBtn">직업정보 확인하기</button>
			</div>
			<div class="content-showcase__list">
				
			</div>
			<div class="content-showcase__header" style="margin-top: 10px;">
				<h3>커리어패스는 회원님의 진로 및 관심사에 맞춰 맞춤 동영상을 제공합니다!</h3>
			</div>
		</div>
	</section>

	<script src="/js/content/main.js"></script>
	<%@ include file="/WEB-INF/views/include/footer.jsp"%>