<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cnslt/resve/crsv/counselingreserveDetail.css">
<section class="channel">
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
				<a href="/cnslt/resve/crsv/reservation.doo">상담 예약</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
			<a class="tab" href="/cnslt/resve/cnsh/counselingReserveHistory.do">상담 내역</a>
		</div>
		<div class="public-wrapper-main">
			<div class="reserveHeader">
				<div class="dept-asterisk"></div>
				<h3>정보 입력</h3>
			</div>

			<form id="detailForm" action="/cnslt/resve/reserve" method="post">
				<input type="hidden" name="counsel" value="${counselingVO.counsel}">
				<input type="hidden" name="memId" value="${counselingVO.memId}">
				<input type="hidden" name="counselMethod" value="${counselingVO.counselMethod}">
				<input type="hidden" name="counselCategory" value="${counselingVO.counselCategory}">
				<input type="hidden" name="counselReqDatetime" value=" <fmt:formatDate value='${counselingVO.counselReqDatetime}' pattern='yyyy-MM-dd HH:mm' />">
				<input type="hidden" name="payId" id="payId" value="${payId}">

				<div class="input-section">
					<div class="input-group">
						<label>이름</label>
						<input type="text" name="memName" value="<c:out value='${memberVO.memName}' />" readonly>
					</div>
					<div class="input-group">
						<label>성별</label>
						<input type="text" name="memGen" value="<c:out value='${memberVO.memGen}' />" readonly>
					</div>
					<div class="input-group">
						<label>나이</label>
						<input type="text" name="memAge" value="<c:out value='${memberVO.memAge}' />세" readonly>
					</div>
					<div class="input-group">
						<label>전화번호</label>
						<input type="tel" name="memPhoneNumber" value="<c:out value='${memberVO.memPhoneNumber}' />" readonly>
					</div>
					<div class="input-group">
						<label>이메일</label>
						<input type="email" name="memEmail" value="<c:out value='${memberVO.memEmail}' />" readonly>
					</div>
				</div>

				<div class="inputDescription">
					<label>신청 동기</label>
					<textarea name="counselDescription" required></textarea>
				</div>

				<button type="button" id="submitBtn">예약 확정</button>
			</form>
			<button id="autoCompleteBtn" type="button" class="btn-submit" style="position: absolute; top: 15px; right: 15px;">자동완성</button>
			
			<!-- 모달 -->
			<div class="ai-modal-backdrop" id="modalBg" aria-hidden="true"></div>
			<div class="ai-modal" id="confirmModal" role="dialog"
				aria-modal="true" aria-labelledby="confirmTitle">
				<h4 id="confirmTitle">상담 예약을 확인해 주세요</h4>
				<div class="ai-kv">
					<div>
						<b>사용 서비스</b> : <span>상담 예약</span>
					</div>
					<div>
						<b>남은 이용권 수</b> : <span>${aiCounts.payConsultCnt}</span>회
					</div>
				</div>
				<p>확인을 누르면 이용권이 차감되며, 상담 예약이 시작됩니다.</p>
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
<script src="/js/cnslt/resve/crsv/counselingreserveDetail.js"></script>