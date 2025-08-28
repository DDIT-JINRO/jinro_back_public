<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/comparsionView.css">

<section class="channel">
	<div class="channel-title">
		<div class="channel-title-text">진로 탐색</div>
	</div>
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
			<a class="tab active" href="#">직업 비교</a>
		</div>
	
		<div class="table-responsive-wrapper">
			<table class="comparison-table">
				<thead class="comparison-table__header">
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header"></th>
						<c:forEach var="job" items="${jobsList}" varStatus="status">
							<th class="comparison-table__job-col-header">
								<div class="job-card-condensed">
									<button class="bookmark-button job-card-condensed__bookmark ${job.isBookmark == job.jobTargetId ? 'is-active' : '' }" data-category-id="G03004" data-target-id="${job.jobTargetId}">
										<span class="bookmark-button__icon--active">
											<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
										</span>
										<span class="bookmark-button__icon--inactive">
											<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
										</span>
									</button>
									<button class="job-card-condensed__remove" data-column-index="${status.index}">&times;</button>
									<h4 class="job-card-condensed__title">${job.jobName}</h4>
									<a href="/pse/cr/crl/selectCareerDetail.do?jobCode=${job.jobCode}" class="job-card-condensed__detail-link">직업 상세보기</a>
								</div>
							</th>
						</c:forEach>
					</tr>
				</thead>

				<tbody class="comparison-table__body">
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header">하는 일</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell comparison-table__cell--align-left" data-label="하는 일">${job.jobMainDuty}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header">직업 대분류</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell" data-label="직업 대분류">${job.jobLcl}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header">직업 중분류</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell" data-label="직업 중분류">${job.jobMcl}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="education">평균 학력 ↕</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell" data-label="평균 학력">${job.education}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="salary">평균 연봉 ↕</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell" data-label="평균 연봉">${job.averageSal}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="prospect">미래 전망 ↕</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell" data-label="미래 전망">${job.prospect}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="satisfaction">만족도 ↕</th>
						<c:forEach var="job" items="${jobsList}">
							<td class="comparison-table__cell" data-label="만족도">${job.jobSatis}</td>
						</c:forEach>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/pse/cr/cco/careerComparsionView.js"></script>
</html>