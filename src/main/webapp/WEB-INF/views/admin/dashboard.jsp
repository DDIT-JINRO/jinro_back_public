<%@ page contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/admin/admDashboard.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<title>관리자 메인</title>
</head>
<%@ include file="/WEB-INF/views/include/admin/sidebar.jsp"%>

<body>
	<!-- 메인 콘텐츠 영역 -->
	<div class="main-content">
	<div class="admin-logoutBtn" id="admin-logout">로그아웃</div>
		<div id="content">
			<h2 style="color: gray; font-size: 18px; margin: 0; line-height: 75px;">대시 보드</h2>
			<div class="dashboard-1 overflow-wrap">
				<div class="dashboard-1-1 overflow-wrap">
					<div class="template-panel dashboard-1-1-1 overflow-wrap">
						<div class="public-card-title">실시간 이용자</div>
						<img class="image1-1-1-1" alt="" src="/images/admin/admin-image1.png">
						<div class="userCnt-1-1-1" id="liveUserCount"></div>
						<div id="localTimeDisplay"></div>
					</div>
					<div class="template-panel dashboard-1-1-1 overflow-wrap">
						<div class="public-card-title">당월 이용자</div>
						<img class="image1-1-1-1" alt="" src="/images/admin/admin-image2.png">
						<div class="userCnt-1-1-1" id="monthUserCount"></div>
						<div class="increase-1-1-1-red">
							<span class="public-span-decrease" id="monthUserRate"></span>

							<div class="increase-1-1-1-p">Since last month</div>
						</div>
					</div>
					<div class="template-panel dashboard-1-1-1 overflow-wrap" style="margin-bottom: 0;">
						<div class="public-card-title">전체 이용자</div>
						<img class="image1-1-1-1" alt="" src="/images/admin/admin-image1.png">
						<div class="userCnt-1-1-1" id="allUserCount"></div>
						<div class="increase-1-1-1">
							<span class="public-span-increase" id="allUserRate"></span>
							<div class="increase-1-1-1-p">Since last month</div>
						</div>
					</div>
				</div>
				<div class="template-panel dashboard-1-2 overflow-wrap">
					<div class="middleTitle">
						<div>월별 이용자 통계</div>
						<div>
							<button class="middleTitleBtn" id="monthPng">다운로드</button>
						</div>
					</div>
					<div style="width: 100%; height: 100%; margin-top: 15px;">
						<canvas id="lineChart"></canvas>
					</div>
				</div>
			</div>
			<div class="dash2Flex">
				<div class="template-panel dashboard-2 overflow-wrap">
					<div class="middleTitle">
						결제/구독 통계
						<div>
							<button class="middleTitleBtn" id="moneyPng">다운로드</button>
						</div>
					</div>
					<div class="dashboard-2-1">

						<div class="stat-item">
							<div class="stat-title">월평균 결제금액</div>
							<div class="stat-value-wrapper">
								<span class="stat-dot dot-current"></span>
								<span class="stat-value" id="avgPreviousRevenue"></span>
							</div>
						</div>

						<div class="stat-item">
							<div class="stat-title">예상 결제금액</div>
							<div class="stat-value-wrapper">
								<span class="stat-dot dot-current"></span>
								<span class="stat-value" id="estimatedCurrentRevenue"></span>
							</div>
						</div>

					</div>
					<div class="chart-container">
						<canvas id="revenueChart"></canvas>
					</div>
				</div>
				<div class="dashboard-2-2 template-panel">
					<div class="middleTitlePp">
						컨텐츠 이용 통계
						<div class="flex gap10 endflex btn-group"
							style="height: 30px; font-size: 12px; font-weight: bold;">
							<button class="public-toggle-button active" id="teenBtn">청소년</button>
							<button class="public-toggle-button" id="youthBtn">청년</button>
							<button class="public-toggle-button" id="contentBtn">다운로드</button>
						</div>
					</div>
					<div class="chart-container-doughnut">
						<canvas id="nestedDoughnutChart"></canvas>
					</div>
				</div>
			</div>

		</div>
	</div>
	<div id="scriptContainer"></div>
	<!-- 모달 -->
    <div id="customConfirm" class="custom-confirm" style="display: none;">
        <div class="custom-confirm__content">
        	<h4>알 림</h4>
        	<div class ="pData">
	            <p id="confirmMessage1"></p>
	            <p id="confirmMessage2"></p>
            </div>
            <div class="custom-confirm__buttons">
                <button id="confirmCancel">취소</button>
                <button id="confirmOk" class="confirmOk">확인</button>
            </div>
        </div>
    </div>

	<div id="customConfirm2" class="custom-confirm" style="display: none;">

		<div class="custom-confirm__content">
			<h4>알 림</h4>
			<div class ="pData">
				<p id="confirmMessage3"></p>
				<p id="confirmMessage4"></p>
			</div>
			<div class="custom-confirm__buttons">
				<button id="confirmOk2" class="confirmOk">확인</button>
			</div>
		</div>
	</div>
</body>
<script src="/js/include/admin/dashboard.js"></script>

</html>