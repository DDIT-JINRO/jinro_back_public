<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/selectDetailPage.css">
<link rel="stylesheet" href="/css/ertds/hgschl/HighSchoolDetail.css">
<section class="channel education">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진학 정보</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/ertds/hgschl/selectHgschList.do">고등학교 정보</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/ertds/qlfexm/selectQlfexmList.do">검정고시</a>
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
				<a href="/ertds/univ/uvsrch/selectUnivList.do">진학 정보</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/ertds/hgschl/selectHgschList.do">고등학교 정보</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/ertds/hgschl/selectHgschList.do">고등학교 정보</a>
		</div>
		<div class="public-wrapper-main">
			<span class="detail-header__meta-item detail-header__meta-item--source">[ 출처 : 나이스 교육정보 개방 포털(NEIS) ]</span>
			<div class="detail-page" id="highSchoolDetailContainer" data-hs-name="${highSchool.hsName}" data-hs-addr="${highSchool.hsAddr}" data-hs-tel="${highSchool.hsTel}" data-hs-lat="${empty highSchool.hsLat ? 0 : highSchool.hsLat}" data-hs-lot="${empty highSchool.hsLot ? 0 : highSchool.hsLot}">

				<section class="detail-header">
					<div class="detail-header__main">
						<h2 class="detail-header__title">${highSchool.hsName}</h2>
					</div>
					<hr class="detail-header__divider">
					<div class="detail-header__meta">
						<span class="detail-header__meta-item">
							<strong>지역:</strong> ${highSchool.hsRegion}
						</span>
						<span class="detail-header__meta-item">
							<strong>유형:</strong> ${highSchool.hsTypeName}, ${highSchool.hsCoeduType}
						</span>
						<span class="detail-header__meta-item">
							<strong>설립:</strong> ${highSchool.hsFoundType}
						</span>
					</div>
				</section>

				<section class="detail-content">
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--first"></div>
							<h3 class="detail-content__title">학교 위치</h3>
						</div>
						<div class="detail-content__body">
							<div id="map"></div>
						</div>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--second"></div>
							<h3 class="detail-content__title">상세 정보</h3>
						</div>
						<div class="detail-content__body">
							<table class="info-table">
								<tbody>
									<tr>
										<th>주소</th>
										<td>${highSchool.hsAddr}</td>
									</tr>
									<tr>
										<th>연락처</th>
										<td>${highSchool.hsTel}</td>
									</tr>
									<tr>
										<th>홈페이지</th>
										<td><a href="${highSchool.hsHomepage}" target="_blank">${highSchool.hsHomepage}</a></td>
									</tr>
									<tr>
										<th>설립일</th>
										<td>${highSchool.hsFoundDate}</td>
									</tr>
									<tr>
										<th>개교기념일</th>
										<td>${highSchool.hsAnnivAt}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<c:if test="${!empty deptList}">
						<div class="detail-content__section">
							<div class="detail-content__header">
								<div class="detail-content__icon"></div>
								<h3 class="detail-content__title">학과 정보</h3>
							</div>
							<div class="tag-list">
								<c:forEach var="dept" items="${deptList}">
									<span class="tag-list__item tag-list__item--non-link">${dept.hsdName}</span>
								</c:forEach>
							</div>
						</div>
					</c:if>
				</section>

				<div class="page-actions page-actions--center" data-html2canvas-ignore="true">
					<button type="button" id="pdf-preview-btn" class="page-actions__button page-actions__button--secondary">PDF 미리보기</button>
					<button type="button" id="pdf-download-btn" class="page-actions__button page-actions__button--primary">PDF 다운로드</button>
					<a href="/ertds/hgschl/selectHgschList.do" class="page-actions__button page-actions__button--dark">목록</a>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=1881066df7ed9e16e4315953d2419995&libraries=services,clusterer,drawing"></script>
<script src="/js/ertds/hgschl/HighSchoolDetail.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2pdf.js@0.11.1/dist/html2pdf.bundle.min.js"></script>
</body>
</html>