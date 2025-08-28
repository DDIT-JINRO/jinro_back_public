<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/views/include/cnsLeader/sidebar.jsp"%>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/cnsLeader/cnsLeaderDashboard.css">
<link rel="stylesheet" href="/css/cnsLeader/scm/scheduleManagement.css">
<title>상담사 메인</title>
<script>
	
</script>
<style>
</style>
</head>
<body>

	<!-- 메인 콘텐츠 영역 -->
	<div class="main-content">
	<div class="cnsLd-logoutBtn" id="cnsLd-logout">로그아웃</div>
		<div id="content">
			<h3>스케줄 관리</h3>
		<div class="template-container">
			<div class="top-row">
				<div class="template-panel topheader">
					<div class="panel-header" id="counselListHeader"
						style="cursor: pointer; text-decoration: none">상담 리스트</div>
					<!-- 리스트 패널 상단: 필터 영역 -->
					<div class="filter-box">
						<div>
							<select name="status">
								<option value="counselor">상담사명</option>
								<!-- … -->
							</select> <input type="text" name="keyword" id="keyword"
								placeholder="상담사명을 입력하세요" />
							<button type="button" class="btn-save" id="btn-search">조회</button>
						</div>
					</div>
					<p>
						총 <span id="schedule-count"></span>건
					</p>
					<span id="selectedDateText"></span>
					<div class="table-wrapper">
						<table>
							<colgroup>
								<col style="width: 10%;">
								<col style="width: 25%;">
								<col style="width: 25%;">
								<col style="width: 25%;">
								<col style="width: 15%;">
							</colgroup>
							<thead>
								<tr>
									<th>번 호</th>
									<th>상담 회원</th>
									<th>상담일시</th>
									<th>상담사</th>
									<th>상 태</th>
								</tr>
							</thead>
							<tbody id="bookedSchedulesContainer">
							</tbody>
						</table>
					</div>
						<div class="card-footer clearfix">
							<div class="panel-footer pagination"></div>
						</div>
				</div>
				<div class="template-panel topheader">
					<div class="panel-header" id="calenderHeader"
						style="cursor: pointer; text-decoration: none">달력</div>
					<div id='calendar'></div>
					<div id="timeSlotsContainer">
						<div id="timeSlotButtons"></div>
					</div>
					<input type="hidden" id="counselReqDatetimeInput"
						name="counselReqDatetime">
				</div>
			    </div>
				
			<div class="template-panel bottom-box">
				<div class="panel-header" id="calenderHeader"
					style="cursor: pointer; text-decoration: none">스케줄 관리</div>
				<div class="bottom-content-wrapper">
					<div class="bottom-panel" style="flex: 1">
						<div class="panel-section-title">상담사</div>
						<div class="panel-section-content">
							<div class="info-item">
								<span class="info-label">이름</span> <span
									class="info-value-counselName"></span>
							</div>
						</div>

						<div class="panel-section-title">상담 신청 기본정보</div>
						<div class="panel-section-content">
							<div class="info-item">
								<span class="info-label">이름</span> <span
									class="info-value-memName"></span>
							</div>
							<div class="info-item">
								<span class="info-label">나이</span> <span
									class="info-value-memBirth"></span>
							</div>
							<div class="info-item">
								<span class="info-label">성별</span> <span
									class="info-value-memGenStr"></span>
							</div>
							<div class="info-item">
								<span class="info-label">이메일</span> <span
									class="info-value-memEmail"></span>
							</div>
							<div class="info-item">
								<span class="info-label">연락처</span> <span
									class="info-value-memPhoneNumber"></span>
							</div>
						</div>
					</div>

					<div class="bottom-panel" style="flex: 1">
						<div class="panel-section-title">상담 신청 정보</div>
						<div class="panel-section-content">
							<div class="info-item">
								<span class="info-label">상담 분야</span> <span
									class="info-value-counselCategoryStr"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 방법</span> <span
									class="info-value-counselMethodStr"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 예약일</span> <span
									class="info-value-counselReqDate"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 예약시간</span> <span
									class="info-value-counselReqtime"></span>
							</div>
							<div class="info-item">
								<span class="info-label">예약 상태</span> <span
									class="info-value-counselStatusStr"></span>
							</div>
						</div>
					</div>

					<div class="bottom-panel" style="flex: 2">
						<div class="panel-section-title description">신청동기</div>
						<div class="panel-section-content">
							<div class="info-item">
								<span class="info-label-counselDescription"></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
<script type="text/javascript" src="/js/com/index.global.min.js"></script>
<script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
<script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.min.js"></script>
<script type="text/javascript"
	src="/js/include/cnsLeader/scm/scheduleManagement.js"></script>