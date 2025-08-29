<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/mpg/mif/inq/selectMyInquiryView.css">
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>

<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel myPage" >
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">마이페이지</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/mpg/mif/inq/selectMyInquiryView.do">내 정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/mpg/mat/bmk/selectBookMarkList.do">나의 활동</a>
		</div>
		<div class="channel-sub-section-item">
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
				<a href="/mpg/mif/inq/selectMyInquiryView.do">내 정보</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper" data-success-message="${successMessage}" data-error-message="${errorMessage}">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/mpg/mif/inq/selectMyInquiryView.do">조회 및 수정</a>
			<a class="tab" href="/mpg/mif/pswdchg/selectPasswordChangeView.do">비밀번호 변경</a>
			<a class="tab" href="/mpg/mif/whdwl/selectWithdrawalView.do">회원 탈퇴</a>
		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
		<div class="public-wrapper-main">
			<div class="profile-layout">
				<div class="profile-row">
					<div class="profile-card profile-photo-card">
						<h3 class="card-title">프로필 사진</h3>
						<div class="profile-photo-area">
							<div class="profile-wrapper">
								<img class="profile-img" src="<c:out value="${!empty member.profileFilePath ? member.profileFilePath : '/images/defaultProfileImg.png' }"/>" alt="프로필이미지" />
							</div>
							

							<div class="profile-photo-buttons">
								<input type="file" id="change-photo-input" style="display: none;" accept="image/jpeg, image/png" />
								<button type="button" class="detail__action-button" id="change-photo-btn">사진 변경</button>
							</div>
						</div>
					</div>

					<div class="profile-card my-info-card">
						<div class="card-header">
							<div class="card-title-wrapper">
								<h3 class="card-title">나의 정보</h3>
							</div>
							<div class="info-item profile-update">
								<button type="button" id="info-update-btn" class="detail__action-button disable" disabled="disabled">수정</button>
							</div>
						</div>
						<form action="updateMyInquiryDetail.do" method="POST">
							<div class="info-grid">
								<div class="info-item">
									<label>이름</label>
									<input value="${member.memName}" name="memName" data-init-value="${member.memName}" class="form-input" />
								</div>
								<div class="info-item">
									<label>닉네임</label>
									<input value="${member.memNickname}" name="memNickname" data-init-value="${member.memNickname}" class="form-input" />
								</div>
								<div class="info-item">
									<label>이메일</label>
									<span class="info-value">${member.memEmail}</span>
								</div>
								<div class="info-item">
									<label>성별</label>
									<c:choose>
										<c:when test="${member.memGen eq 'G11001'}">
											<span class="info-value">남</span>
										</c:when>
										<c:otherwise>
											<span class="info-value">여</span>
										</c:otherwise>
									</c:choose>
								</div>
								<div class="info-item">
									<label>연락처</label>
									<span class="info-value">${member.memPhoneNumber}</span>
									<button type="button" class="detail__action-button detail__action-button--auth" id="phoneChangeBtn">번호 변경</button>
								</div>
								<div class="info-item">
									<label>생년월일</label>
									<span class="info-value">
										<fmt:formatDate pattern="yyyy년 MM월 dd일" value="${member.memBirth}" />
									</span>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div class="profile-row">
					<div class="profile-card my-interest-card">
						<div class="card-header">
							<h3 class="card-title">나의 관심 분야</h3>
							<button class="detail__action-button" id="interests-update-btn">수정</button>
						</div>
						<div class="tags-container">
							<c:if test="${empty member.interests}">
								<span class="empty-message">선택한 관심 분야가 없습니다.</span>
							</c:if>
							<c:forEach var="userKeyword" items="${member.interests}">
								<span class="interest-tag">${userKeyword.ccName}</span>
							</c:forEach>
						</div>
					</div>

					<div class="profile-card my-subscription-card">
						<c:if test="${member.remainingDays == 0}">
							<div class="card-header">
								<h3 class="card-title">나의 구독 상태</h3>
								<div class="subscription-header-right">
									<button type="button" class="detail__action-button" id="move-sub-btn">구독하러 가기</button>
								</div>
							</div>
							<p class="plan-desc">구독 중인 상품이 없습니다.</p>
						</c:if>
						<c:if test="${member.remainingDays != 0}">
							<div class="card-header">
								<h3 class="card-title">나의 구독 상태</h3>
								<div class="subscription-header-right">
									<span class="days-remaining">구독 만료까지 ${member.remainingDays}일 남았어요!</span>
								</div>
							</div>
							<button type="button" class="subscription-status-box">
							    <div class="plan-header">
							        <p class="plan-name">${member.subName}</p> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							        <p class="plan-desc">${member.subDetail}</p>
							    </div>
							    <p class="plan-sevice">
							        이력서첨삭: ${member.resumeRemain}/${member.serviceTotal} &nbsp;&nbsp;
							        자기소개서첨삭: ${member.coverRemain}/${member.serviceTotal} &nbsp;&nbsp;
							        상담: ${member.consultRemain}/${member.serviceTotal} &nbsp;&nbsp;
							        모의면접: ${member.mockRemain}/${member.serviceTotal}
							    </p>
							</button>
						</c:if>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modals remain the same but with updated button classes -->
<div class="modal-overlay" id="password-modal-overlay">
	<div class="modal-content">
		<button class="modal-close-btn" type="button">&times;</button>
		<h3>비밀번호 확인</h3>
		<p>회원 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 입력해 주세요.</p>
		<div class="modal-form">
			<input type="password" id="password-check-input" placeholder="비밀번호를 입력하세요" class="form-input">
			<span class="modal-error-msg" id="modal-error-msg"></span>
			<button class="detail__action-button" id="password-confirm-btn" type="button">인증</button>
		</div>
	</div>
</div>

<div class="modal-overlay" id="interest-modal-overlay">
	<div class="modal-content interests-modal">
		<button class="modal-close-btn" type="button">&times;</button>
		<h3>관심사 수정</h3>
		<p>수정 할 관심 분야를 선택하세요.</p>
		<div class="modal-form keyword-modal">
			<form method="post" action="insertInterestList.do">
				<div class="com-filter-section">
					<div class="com-filter-options">
						<c:set var="currentCat" value=""/>					
						<c:forEach items="${interetsKeywordList}" var="allKeyword" varStatus="status">
							<c:if test="${currentCat != allKeyword.ccEtc}">
								<div class="interest-modal__keyword-group">
									<span class="interest-modal__keyword-title">
										${allKeyword.ccEtc}
									</span>
									<div class="interest-modal__keyword-items">
							</c:if>
							
							<c:set var="isChecked" value="false" />
							<c:forEach var="userKeyword" items="${member.interests}">
								<c:if test="${allKeyword.ccId == userKeyword.ccId }">
									<c:set var="isChecked" value="true" />
								</c:if>
							</c:forEach>

							<label class="com-filter-item">
								<input type="checkbox" name="filter-keyword" value="${allKeyword.ccId}" ${isChecked ? "checked" : ""}>
								<span>${allKeyword.ccName}</span>
							</label>
							
							<c:set var="currentCat" value="${allKeyword.ccEtc}"/>					
							
							<c:if test="${status.last or currentCat != interetsKeywordList[status.index + 1].ccEtc}">
									</div>
								</div>
							</c:if>
						</c:forEach>
					</div>
				</div>
				<div class="com-filter-section">
					<div class="com-button-container">
						<label class="com-filter-title">선택된 관심 분야</label>
						<button type="button" class="com-filter-reset-btn">초기화</button>
					</div>
					<div class="com-selected-filters">
						<c:forEach var="userKeyword" items="${member.interests}">
							<span class="com-selected-filter" data-filter="${userKeyword.ccName}">${userKeyword.ccName}</span>
						</c:forEach>
					</div>
				</div>
				<button type="submit" class="detail__action-button">수정</button>
			</form>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/mpg/mif/inq/selectMyInquiryView.js"></script>
</html>