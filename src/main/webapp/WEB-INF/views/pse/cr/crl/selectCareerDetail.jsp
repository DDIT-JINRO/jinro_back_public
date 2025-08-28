<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/selectDetailPage.css">
<section class="channel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">진로 탐색</div>
	</div>
	<!-- 중분류 -->
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/pse/cat/careerAptitudeTest.do">진로 심리검사</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/pse/cr/crl/selectCareerList.do">직업백과</a>
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
				<a href="/pse/cat/careerAptitudeTest.do">진로 탐색</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/pse/cr/crl/selectCareerList.do">직업백과</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="#">직업 상세</a>
		</div>

		<div class="public-wrapper-main">
			<div class="detail-page">
				<section class="detail-header">
					<div class="detail-header__main">
						<h2 class="detail-header__title">${jobs.jobName}</h2>
						<div class="detail-header__actions">
							<button class="bookmark-button detail-header__bookmark ${jobs.isBookmark == jobs.jobTargetId ? 'is-active' : '' }" data-category-id="G03004" data-target-id="${jobs.jobTargetId}">
								<span class="bookmark-button__icon--active">
									<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
								</span>
								<span class="bookmark-button__icon--inactive">
									<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
								</span>
							</button>
						</div>
					</div>
					<div class="detail-header__divider"></div>
					<div class="detail-header__meta">
						<span class="detail-header__meta-item">${jobs.jobLcl} > ${jobs.jobMcl}</span>
						<span class="detail-header__meta-item detail-header__meta-item--source">[ 출처 : 한국고용정보원 고용24 (구 워크넷) ]</span>
					</div>
				</section>

				<section class="detail-content">
					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--first"></div>
							<h3 class="detail-content__title">하는 일</h3>
						</div>
						<p class="detail-content__body">${jobs.jobMainDuty}</p>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--second"></div>
							<h3 class="detail-content__title">이 직업을 갖는 방법</h3>
						</div>
						<p class="detail-content__body">${jobs.jobWay}</p>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--third"></div>
							<h3 class="detail-content__title">임금</h3>
						</div>
						<p class="detail-content__body detail-content__body--salary">${jobs.jobSal}</p>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--fourth"></div>
							<h3 class="detail-content__title">직업만족도</h3>
						</div>
						<p class="detail-content__body detail-content__body--satisfaction">${jobs.jobSatis}점</p>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--chart"></div>
							<h3 class="detail-content__title">재직자가 생각하는 일자리 전망</h3>
						</div>
						<div class="detail-content__chart-container">
							<canvas id="job-prospect-chart" width="400" height="200"></canvas>
						</div>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--fifth"></div>
							<h3 class="detail-content__title">관련전공 및 자격</h3>
						</div>
						<p class="detail-content__body">${jobs.jobRelatedMajor}</p>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--sixth"></div>
							<h3 class="detail-content__title">관련직업</h3>
						</div>
						<div class="tag-list">
							<c:forEach var="job" items="${jobs.jobsRelVOList}">
								<a class="tag-list__item" href="/pse/cr/crl/selectCareerDetail.do?jobCode=${job.jrCode}">${job.jobName}</a>
							</c:forEach>
						</div>
					</div>

					<div class="detail-content__section">
						<div class="detail-content__header">
							<div class="detail-content__icon detail-content__icon--chart"></div>
							<h3 class="detail-content__title">학력 분포</h3>
						</div>
						<div class="detail-content__chart-container">
							<canvas id="job-edubg-chart" width="400" height="200"></canvas>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>

<script src="/js/pse/cr/crl/selectCareerDetail.js"></script>
<script type="text/javascript">
    // 취업 분야 분포 데이터
    
    const jobEdubgData = {
        labels: ['중학교', '고등학교', '전문대학', '대학', '대학원', '박사'],
        data: [
            ${jobs.edubgMgraduUndr != null ? jobs.edubgMgraduUndr : 0},
            ${jobs.edubgHgradu     != null ? jobs.edubgHgradu     : 0},
            ${jobs.edubgCgraduUndr != null ? jobs.edubgCgraduUndr : 0},
            ${jobs.edubgUgradu     != null ? jobs.edubgUgradu     : 0},
            ${jobs.edubgHgradu     != null ? jobs.edubgHgradu     : 0},
            ${jobs.edubgDgradu     != null ? jobs.edubgDgradu     : 0}
        ]
    };
    
    // 성별 입학률 데이터
    const jobProspectData = {
        labels: ['감소', '다소감소', '유지', '다소증가', '증가'],
        data: [
            ${jobs.outlookDecrease       != null ? jobs.outlookDecrease       : 0},
            ${jobs.outlookSlightDecrease != null ? jobs.outlookSlightDecrease : 0},
            ${jobs.outlookStable         != null ? jobs.outlookStable         : 0},
            ${jobs.outlookSlightIncrease != null ? jobs.outlookSlightIncrease : 0},
            ${jobs.outlookIncrease       != null ? jobs.outlookIncrease       : 0}
        ]
    };
</script>

</body>
</html>