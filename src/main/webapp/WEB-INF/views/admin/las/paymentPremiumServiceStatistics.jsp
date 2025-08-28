<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/admin/las/paymentStatistics.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<script src="/js/include/admin/las/paymentStatistics.js"></script>
<div class="flex dkwnrrhtlvek">
	<h2 class="topTitle">로그 및 통계</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">결제/프리미엄 서비스 통계</h2>
</div>
<input type="hidden" id="comCalendarInput" style="display: none;" />
<div class="main-container flex gap" style="margin-bottom: 20px;">
	<!-- 왼쪽 컬럼 -->
	<div class="left-column">
		<!-- 상단 카드 2개 -->
		<div class="cards-row flex gap" style="margin-bottom: 20px;">
			<div class="template-panel public-countCard">
				<div class="public-card-title">총 구독자 수</div>
				<img class="public-card-icon" alt="" src="/images/admin/admin-image1.png">
				<div class="public-card-count" id="totalSubscribersCount">0</div>
				<div class="public-span-space">
					<span id="totalSubscribersRate" class="public-span-increase">+0%</span>
					<div class="public-span-since">Since last month</div>
				</div>
			</div>

			<div class="template-panel public-countCard back-color-green">
				<div class="public-card-title color-white">오늘 구독자 수</div>
				<img class="public-card-icon" alt="" src="/images/admin/admin-green-plus.png">
				<div class="public-card-count color-white" id="todaySubscribersCount">0</div>
				<div class="public-span-space">
					<span id="todaySubscribersRate" class="public-span-increase color-white">+0%</span>
					<div class="public-span-since color-white">Since yesterday</div>
				</div>
			</div>
		</div>

		<!-- 첫 번째 큰 div - 구독 결제 매출 -->
		<div class="template-panel large-panel">
			<div class="middleTitle">구독 결제 매출</div>
			<div class="btn-group flex gap5 revenueChart">
				<input type="hidden" id="revenueChartStartDay" />
				<input type="hidden" id="revenueChartEndDay" />
				<button class="public-toggle-button" id="revenueChartReset">전체</button>
				<select class="public-toggle-select" name="revenueChartDay" id="revenueChartDay">
					<option value="quarterly">분기별</option>
					<option value="daily">일별</option>
					<option value="monthly">월별</option>
					<option value="selectDays">기간선택</option>
				</select> <select class="public-toggle-select" name="revenueChartGender" id="revenueChartGender">
					<option value="">성별전체</option>
					<option value="male">남자</option>
					<option value="female">여자</option>
				</select> <select class="public-toggle-select" name="revenueChartAgeGroup" id="revenueChartAgeGroup">
					<option value="">연령전체</option>
					<option value="teen">청소년</option>
					<option value="youth">청년</option>
				</select>
			</div>
			<div class="chart-container">
				<canvas id="revenueChartCanvas"></canvas>
			</div>
		</div>

		<!-- 두 번째 큰 div - 상품별 인기 통계 -->
	</div>


	<!-- 오른쪽 컬럼 -->
	<div class="right-column">
		<!-- 첫 번째 큰 div - 구독자 수 통계 -->
		<div class="template-panel panel-right">
			<div class="middleTitle">구독자 수 통계</div>
			<div class="btn-group flex gap5 subscriberChart">
				<input type="hidden" id="subscriberChartStartDay" />
				<input type="hidden" id="subscriberChartEndDay" />
				<button class="public-toggle-button" id="subscriberChartReset">전체</button>
				<select class="public-toggle-select" name="subscriberChartDay" id="subscriberChartDay">
					<option value="quarterly">분기별</option>
					<option value="daily">일별</option>
					<option value="monthly">월별</option>
					<option value="selectDays">기간선택</option>
				</select> <select class="public-toggle-select" name="subscriberChartGender" id="subscriberChartGender">
					<option value="">성별전체</option>
					<option value="male">남자</option>
					<option value="female">여자</option>
				</select> <select class="public-toggle-select" name="subscriberChartAgeGroup" id="subscriberChartAgeGroup">
					<option value="">연령전체</option>
					<option value="teen">청소년</option>
					<option value="youth">청년</option>
				</select>
			</div>
			<div class="subscriberCanvas">
				<canvas id="subscriberChartCanvas"></canvas>
			</div>
		</div>
	</div>
</div>


<!-- 두 번째 큰 div - 유료 컨텐츠 이용내역 -->
<div class="flex gap" style="margin-bottom: 20px;">
	<div class="template-panel productPanel">
		<div class="middleTitle">상품별 인기 통계</div>
		<div class="btn-group flex gap5 productChartBtnGroup">
			<input type="hidden" id="productChartStartDay" />
			<input type="hidden" id="productChartEndDay" />
			<button class="public-toggle-button" id="productChartReset">전체</button>
			<select class="public-toggle-select" name="productChartDay" id="productChartDay">
				<option value="quarterly">분기별</option>
				<option value="daily">일별</option>
				<option value="monthly">월별</option>
				<option value="selectDays">기간선택</option>
			</select> <select class="public-toggle-select" name="productChartGender" id="productChartGender">
				<option value="">성별전체</option>
				<option value="male">남자</option>
				<option value="female">여자</option>
			</select> <select class="public-toggle-select" name="productChartAgeGroup" id="productChartAgeGroup">
				<option value="">연령전체</option>
				<option value="teen">청소년</option>
				<option value="youth">청년</option>
			</select>
		</div>
		<div class="chart-container">
			<canvas id="productChartCanvas"></canvas>
		</div>
	</div>


	<div class="template-panel aiServiceSpace">
		<div class="middleTitle">유료 컨텐츠 이용내역</div>
		<div class="btn-group flex gap5 aiServiceChart">
			<input type="hidden" id="aiServiceChartStartDay" />
			<input type="hidden" id="aiServiceChartEndDay" />
			<button class="public-toggle-button" id="aiServiceChartReset">전체</button>
			<select class="public-toggle-select" name="aiServiceChartDay" id="aiServiceChartDay">
				<option value="quarterly">분기별</option>
				<option value="daily">일별</option>
				<option value="monthly">월별</option>
				<option value="selectDays">기간선택</option>
			</select> <select class="public-toggle-select" name="aiServiceChartGender" id="aiServiceChartGender">
				<option value="">성별전체</option>
				<option value="male">남자</option>
				<option value="female">여자</option>
			</select> <select class="public-toggle-select" name="aiServiceChartAgeGroup" id="aiServiceChartAgeGroup">
				<option value="">연령전체</option>
				<option value="teen">청소년</option>
				<option value="youth">청년</option>
			</select>
			<!-- 새로 추가되는 서비스 유형 선택 셀렉트 -->
			<select class="public-toggle-select" name="aiServiceChartType" id="aiServiceChartType">
				<option value="">전체서비스</option>
				<option value="resume">이력서 첨삭</option>
				<option value="cover">자기소개서 첨삭</option>
				<option value="mock">모의면접</option>
				<option value="counseling">AI 상담</option>
			</select>
		</div>
		<div class="chart-container4">
			<canvas id="aiServiceChartCanvas"></canvas>
		</div>
	</div>
</div>
