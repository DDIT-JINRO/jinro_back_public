<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/views/include/cns/sidebar.jsp"%>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="/css/cns/cnsDashboard.css">
<link rel="stylesheet" href="/css/cns/scm/scheduleManagement.css">
<title>상담사 메인</title>
<script>
	
</script>
<style>
</style>
</head>
<body>

	<!-- 메인 콘텐츠 영역 -->
	<div class="main-content">
		<div class="cns-logoutBtn" id="cns-logout">로그아웃</div>
		<div id="content">
			<h3>상담 스케줄 관리</h3>
			<div class="template-container">
				<div class="template-panel" style="flex: 1.5">
					<div class="panel-header" id="noticeHeader"
						style="cursor: pointer; text-decoration: none">상담 리스트</div>

					<p>
						총 <span id="schedule-count"></span>건
					</p>
					<div id="selectedDateText"></div>
					<div class="table-wrapper">
						<table>
							<colgroup>
								<col style="width: 10%;">
								<col style="width: 15%;">
								<col style="width: 10%;">
								<col style="width: 30%;">
								<col style="width: 23%;">
								<col style="width: 12%;">
							</colgroup>
							<thead>
								<tr>
									<th>번 호</th>
									<th>회원명</th>
									<th>나 이</th>
									<th>이메일</th>
									<th>연락처</th>
									<th>상 태</th>
								</tr>
							</thead>
							<tbody id="bookedSchedulesContainer">
							</tbody>
						</table>
					</div>
					<div style="margin-top: 10px; text-align: center;">
						<div class="card-footer clearfix">
							<div class="panel-footer pagination"></div>
						</div>
					</div>
				</div>

				<div class="template-panel" style="flex: 2.5">
					<div class="template-panel-top" style="flex: 1">
						<div class="panel-header schedule">스케줄 관리</div>
						<div class="reserveDate">
							<div class="dept-asterisk"></div>
						</div>
						<div id='calendar'></div>
						<div id="timeSlotsContainer">
							<div id="timeSlotButtons"></div>
						</div>
						<input type="hidden" id="counselReqDatetimeInput"
							name="counselReqDatetime">
					</div>

					<div class="template-panel-bottom" style="flex: 1">
						<div class="panel-header detail">상담 신청 상세내용</div>

						<div class="counsel-info-summary">
							<div class="info-item">
								<span class="info-label">상담 분야: </span> <span class="info-value"
									id="counselCategory"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 방법: </span> <span class="info-value"
									id="counselMethod"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 예약일: </span> <span class="info-value"
									id="counselReqDate"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 예약시간: </span> <span class="info-value"
									id="counselReqTime"></span>
							</div>
							<div class="info-item">
								<span class="info-label">상담 상태: </span> <span class="info-value"
									id="counselStatus"></span>
							</div>
						</div>

						<div class="counsel-detail-content">
							<div class="counsel-motivation">
								<h4 class="section-title">신청 동기</h4>
								<textarea class="counsel-textarea" id="counselDescription"
									placeholder="상담 신청 동기 내용" readonly></textarea>
							</div>
							<div class="personal-info">
								<h4 class="section-title">인적 사항</h4>
								<div class="info-item">
									<span class="info-label">이름:</span> <span class="info-value"
										id="memName"></span>
								</div>
								<div class="info-item">
									<span class="info-label">나이:</span> <span class="info-value"
										id="memAge"></span>
								</div>
								<div class="info-item">
									<span class="info-label">이메일:</span> <span class="info-value"
										id="memEmail"></span>
								</div>
								<div class="info-item">
									<span class="info-label">연락처:</span> <span class="info-value"
										id="memPhoneNumber"></span>
								</div>
							</div>
							<div class="button-group">
								<button class="btn btn-save" hidden></button>
								<button class="btn btn-cancel" hidden>상담취소</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script type="text/javascript" src="/js/com/index.global.min.js"></script>

<script type="text/javascript"
	src="/js/include/cns/scm/scheduleManagement.js"></script>

