<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link href='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css' rel='stylesheet' />
<link rel="stylesheet" href="/css/cnslt/resve/crsv/counselingreserve.css">
<section class="channel counsel">
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">상담</div> 
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cnslt/rvw/cnsReview.do">상담 후기</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cnslt/aicns/aicns.do">AI 상담</a>
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
				<a href="/cnslt/resve/crsv/reservation.do">상담</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
			<a class="tab" href="/cnslt/resve/cnsh/counselingReserveHistory.do" id="goToCounselingReserveHistory">상담 내역</a>
		</div>

		<div class="public-wrapper-main">
			<div class="reserveTitle">상담 예약</div>
			<div class="reserveHeader">
				<div class="dept-asterisk"></div>
				<h2>상담선택</h2>
			</div>
			<form id="reservationForm" action="/cnslt/resve/holdAndRedirect" method="post">

				<div class="couselCustom">
					<div class="counselor-select-area">
						<span>상담사 선택: </span>
						<select id="counselorSelect" name="counsel">
							<c:forEach var="counselor" items="${counselorList}">
								<option value="${counselor.memId}">${counselor.memName}</option>
							</c:forEach>
						</select>
					</div>

					<div class="counselor-select-area">
						<span>상담방법 선택: </span>
						<select id="counselMethodSelect" name="counselMethod">
							<c:forEach var="method" items="${counselMethodList}">
								<option value="${method.ccId}">${method.ccName}</option>
							</c:forEach>
						</select>
					</div>

					<div class="counselor-select-area">
						<span>상담목적 선택: </span>
						<select id="counselCategorySelect" name="counselCategory">
							<c:forEach var="category" items="${counselCategoryList}">
								<option value="${category.ccId}">${category.ccName}</option>
							</c:forEach>
						</select>
					</div>
				</div>

				<div class="reserveDate">
					<div class="dept-asterisk"></div>
					<h2>일정 예약</h2>
				</div>
				<div id='calendar'></div>
				<div id="timeSlotsContainer">
					<div id="selectedDateText"></div>
					<div id="timeSlotButtons"></div>
				</div>

				<input type="hidden" id="counselReqDatetimeInput" name="counselReqDatetime">
				<input type="hidden" id="payId" name="payId">
				<button type="button" id="nextBtn">다음</button>
			</form>
		</div>
	</div>
</div>
<c:if test="${not empty errorMessage}">
	<script>
		showConfirm2("${errorMessage}","",
			() => {
				return;
			}
		);
	</script>
</c:if>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js'></script>
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/locales/ko.js'></script>
<script src="/js/cnslt/resve/crsv/counselingreserve.js"></script>