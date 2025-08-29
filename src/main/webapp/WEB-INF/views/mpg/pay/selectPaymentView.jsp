<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/mpg/pay/selectPaymentView.css">
<section class="channel myPage">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">마이페이지</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/mpg/mif/inq/selectMyInquiryView.do">내 정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/mpg/mat/bmk/selectBookMarkList.do">나의 활동</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/mpg/pay/selectPaymentView.do">결제 구독내역</a>
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
				<a href="/mpg/mif/inq/selectMyInquiryView.do">마이페이지</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/mpg/pay/selectPaymentView.do">결제 구독내역</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/mpg/pay/selectPaymentView.do">결제/구독내역</a>
		</div>
		
		<div class="public-wrapper-main">
			<div class="content-container">
				<div class="section-header"
					style="display: flex; justify-content: space-between; align-items: center;">
					<h2 class="section-title">구독 등급 목록</h2>
					<c:choose>
						<%-- 1. 예약된 구독이 있을 경우 '예약 취소' 링크 표시 --%>
						<c:when test="${reservedSub != null}">
							<a href="#" id="cancel-reservation-link" class="cancel-link">구독
								변경 예약을 취소하시겠습니까?</a>
						</c:when>
						<%-- 2. 현재 구독 중일 경우 '구독 취소' 링크 표시 --%>
						<c:when
							test="${currentSub != null && currentSub.subStatus == 'Y'}">
							<a href="#" id="cancel-link" class="cancel-link">구독을 취소하고
								싶으신가요?</a>
						</c:when>
					</c:choose>
				</div>
				<div class="pricing-cards-container">
					<%-- 컨트롤러에서 받은 구독 상품 목록(subProducts)을 JSTL로 반복 표시 --%>
					<c:forEach var="product" items="${subProducts}">
						<%-- 현재 구독중인 상품에 highlighted 클래스를 추가하여 강조 --%>
						<div
							class="pricing-card ${currentSub.subId == product.subId ? 'highlighted' : ''}">
							<c:if test="${currentSub.subId == product.subId}">
								<div class="popular-tag">현재 구독중인 상품</div>
							</c:if>
							<h3 class="card-title">${product.subName}</h3>
							<p class="card-price">
								₩
								<fmt:formatNumber value="${product.subPrice}" pattern="#,###" />
								<span>/월</span>
							</p>
							<ul class="card-features">
								<c:forEach var="benefit"
									items="${fn:split(product.subBenefit, ',')}">
									<li>${benefit}</li>
								</c:forEach>
							</ul>

							<%-- 현재 구독 상태에 따라 버튼을 다르게 표시 --%>
							<c:choose>
								<%-- 1. 아무것도 구독하지 않은 경우 --%>
								<c:when test="${currentSub == null}">
									<button class="subscribe-btn card-button"
										data-sub-id="${product.subId}" data-name="${product.subName}"
										data-price="${product.subPrice}">가입</button>
								</c:when>
								<%-- 2. 현재 바로 이 상품을 구독 중인 경우 --%>
								<c:when test="${currentSub.subId == product.subId}">
									<button class="card-button" disabled>구독중</button>
								</c:when>
								<%-- 3. 그 외의 경우 (다른 상품을 구독 중이거나, 예약된 상품이 있는 경우) --%>
								<c:otherwise>
									<%-- 예약된 구독이 있으면 모든 '변경하기' 버튼을 비활성화하고 '변경 예약됨'으로 표시 --%>
									<c:if test="${reservedSub != null}">
										<button class="card-button" disabled>
											<%-- 예약된 상품과 현재 상품이 같으면 '변경 예약됨' 표시 --%>
											<c:if test="${reservedSub.subId == product.subId}">
							                    변경 예약됨
							                </c:if>
											<%-- 예약된 상품과 다른 상품이면 그냥 비활성화 --%>
											<c:if test="${reservedSub.subId != product.subId}">
							                    변경하기
							                </c:if>
										</button>
									</c:if>

									<%-- 예약된 구독이 없으면 '변경하기' 버튼 활성화 --%>
									<c:if test="${reservedSub == null}">
										<button class="change-sub-btn card-button"
											data-sub-id="${product.subId}">변경하기</button>
									</c:if>
								</c:otherwise>
							</c:choose>
						</div>
					</c:forEach>
				</div>
			</div>
			<div class="content-container">
				<h2 class="section-title">구독 결제 내역</h2>
				<div class="history-table">
					<div class="history-row history-header">
						<span>번호</span> <span>상품명</span> <span>결제일</span> <span>결제
							금액</span>
					</div>
					<c:forEach var="payment" items="${paymentHistory}"
						varStatus="status">
						<div class="history-row">
							<a href="#">${status.count}</a> <span>${payment.subName}</span> <span><fmt:formatDate
									value="${payment.payDate}" pattern="yyyy. MM. dd" /></span> <span><fmt:formatNumber
									value="${payment.payAmount}" pattern="#,###" /> 원</span>
						</div>
					</c:forEach>
					<c:if test="${empty paymentHistory}">
						<div class="history-row">
							<span style="grid-column: 1/-1; text-align: center;">결제
								내역이 없습니다.</span>
						</div>
					</c:if>
				</div>
			</div>
		</div>
	</div>
</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>
<script src="/js/mpg/pay/payment.js"></script>