<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/selectDetailPage.css">
<section class="channel education">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진학 정보</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
		</div>
		<div class="channel-sub-section-item">
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
				<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab" href="/ertds/univ/uvsrch/selectUnivList.do">대학 검색</a>
			<a class="tab active" href="/ertds/univ/dpsrch/selectDeptList.do">학과 정보</a>
			<a class="tab" href="/ertds/univ/uvivfb/selectInterviewList.do">면접 후기</a>
		</div>

		<div class="public-wrapper-main">
			<span class="detail-header__meta-item detail-header__meta-item--source">[ 출처 : 한국직업능력연구원 국가진로교육연구센터 (커리어넷) ]</span>
			<div class="detail-page">
				<section class="detail-header">
					<div class="detail-header__main">
						<h2 class="detail-header__title">${deptDetail.uddMClass}</h2>
						<div class="detail-header__actions">
							<c:set var="isBookmarked" value="false" />
							<c:forEach var="bookmark" items="${bookMarkVOList}">
								<c:if test="${deptDetail.uddId eq bookmark.bmTargetId}">
									<c:set var="isBookmarked" value="true" />
								</c:if>
							</c:forEach>
							<button class="bookmark-button detail-header__bookmark ${isBookmarked ? 'is-active' : ''}" data-category-id="G03006" data-target-id="${fn:escapeXml(deptDetail.uddId)}">
								<span class="bookmark-button__icon--active">
									<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
								</span>
								<span class="bookmark-button__icon--inactive">
									<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
								</span>
							</button>
						</div>
					</div>
					<hr class="detail-header__divider">
					<div class="detail-header__meta detail-header__meta-dept">
						<span class="detail-header__meta-item">계열 | ${deptDetail.uddLClass}</span>
						<span class="detail-header__meta-item">입학경쟁률 | ${deptDetail.admissionRateFormatted}</span>
						<span class="detail-header__meta-item">취업률 | ${deptDetail.employmentRatePercent}</span>
					</div>
				</section>

				<section class="detail-content">
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--first"></div>
							<h3 class="detail-content__title">학과 개요</h3>
						</div>
						<p class="detail-content__body">${deptDetail.uddSum}</p>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--second"></div>
							<h3 class="detail-content__title">흥미, 적성</h3>
						</div>
						<p class="detail-content__body">${deptDetail.uddInterest}</p>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--third"></div>
							<h3 class="detail-content__title">학과 특성</h3>
						</div>
						<p class="detail-content__body">${deptDetail.uddProperty}</p>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--sixth"></div>
							<h3 class="detail-content__title">성별 입학률</h3>
						</div>
						<div class="detail-content__chart-container">
							<canvas id="genderEmploymentChart"></canvas>
						</div>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--chart"></div>
							<h3 class="detail-content__title">취업 후 첫 임금 분포</h3>
						</div>
						<div class="detail-content__chart-container">
							<canvas id="salaryChart"></canvas>
						</div>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--chart"></div>
							<h3 class="detail-content__title">직업만족도</h3>
						</div>
						<div class="detail-content__chart-container">
							<canvas id="satisfactionChart"></canvas>
						</div>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--chart"></div>
							<h3 class="detail-content__title">취업 분야 분포</h3>
						</div>
						<div class="detail-content__chart-container">
							<canvas id="employmentFieldChart"></canvas>
						</div>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--fourth"></div>
							<h3 class="detail-content__title">관련 자격</h3>
						</div>
						<div class="tag-list">
							<c:forEach var="li" items="${deptDetail.uddLiList}">
								<span class="tag-list__item tag-list__item--non-link">${li}</span>
							</c:forEach>
						</div>
					</div>
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--fifth"></div>
							<h3 class="detail-content__title">관련직업</h3>
						</div>
						<div class="tag-list">
							<c:forEach var="job" items="${deptDetail.jobListArray}">
								<span class="tag-list__item">${job}</span>
							</c:forEach>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>

<!-- Chart.js 라이브러리 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>

<!-- 차트 데이터 변수 -->
<script type="text/javascript">
    // 임금 분포 데이터
    const salaryData = {
        labels: ['0~150만원', '151~200만원', '201~250만원', '251~300만원', '301만원 이상'],
        data: [
            ${deptDetail.udsSalary0150Rate != null ? deptDetail.udsSalary0150Rate : 0},
            ${deptDetail.udsSalary151200Rate != null ? deptDetail.udsSalary151200Rate : 0},
            ${deptDetail.udsSalary201250Rate != null ? deptDetail.udsSalary201250Rate : 0},
            ${deptDetail.udsSalary251300Rate != null ? deptDetail.udsSalary251300Rate : 0},
            ${deptDetail.udsSalary301PlusRate != null ? deptDetail.udsSalary301PlusRate : 0}
        ]
    };

    // 직업만족도 데이터
    const satisfactionData = {
        labels: ['매우 불만족', '불만족', '보통', '만족', '매우 만족'],
        data: [
            ${deptDetail.udsSatisfactionVeryDissatisfied != null ? deptDetail.udsSatisfactionVeryDissatisfied : 0},
            ${deptDetail.udsSatisfactionDissatisfied != null ? deptDetail.udsSatisfactionDissatisfied : 0},
            ${deptDetail.udsSatisfactionNeutral != null ? deptDetail.udsSatisfactionNeutral : 0},
            ${deptDetail.udsSatisfactionSatisfied != null ? deptDetail.udsSatisfactionSatisfied : 0},
            ${deptDetail.udsSatisfactionVerySatisfied != null ? deptDetail.udsSatisfactionVerySatisfied : 0}
        ]
    };

    // 취업 분야 분포 데이터
    const employmentFieldData = {
        labels: ['건설', '경영관리', '교육', '미용', '복지', '연구', '운송', '예술', '생산', '농업'],
        data: [
            ${deptDetail.udsFieldConstructionRate != null ? deptDetail.udsFieldConstructionRate : 0},
            ${deptDetail.udsFieldManagementRate != null ? deptDetail.udsFieldManagementRate : 0},
            ${deptDetail.udsFieldEducationRate != null ? deptDetail.udsFieldEducationRate : 0},
            ${deptDetail.udsFieldBeautyRate != null ? deptDetail.udsFieldBeautyRate : 0},
            ${deptDetail.udsFieldWelfareRate != null ? deptDetail.udsFieldWelfareRate : 0},
            ${deptDetail.udsFieldResearchRate != null ? deptDetail.udsFieldResearchRate : 0},
            ${deptDetail.udsFieldTransportRate != null ? deptDetail.udsFieldTransportRate : 0},
            ${deptDetail.udsFieldArtRate != null ? deptDetail.udsFieldArtRate : 0},
            ${deptDetail.udsFieldProductRate != null ? deptDetail.udsFieldProductRate : 0},
            ${deptDetail.udsFieldFarmerRate != null ? deptDetail.udsFieldFarmerRate : 0}
        ]
    };

    // 성별 입학률 데이터
    const genderEmploymentData = {
        labels: ['남성', '여성'],
        data: [
            ${deptDetail.udsMaleAdmissionRate != null ? deptDetail.udsMaleAdmissionRate : 0},
            ${deptDetail.udsFemaleAdmissionRate != null ? deptDetail.udsFemaleAdmissionRate : 0}
        ]
    };
</script>

<script type="text/javascript" src="/js/ertds/univ/dpsrch/deptDetail.js"></script>
</body>
</html>