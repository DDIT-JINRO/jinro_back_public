<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/common/comparsionView.css">

<section class="channel education">
	<div class="channel-title">
		<div class="channel-title-text">진학 정보</div>
	</div>
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

		<div class="table-responsive-wrapper">
			<table class="comparison-table">
				<thead class="comparison-table__header">
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header"></th>
						<c:forEach var="dept" items="${compareList}" varStatus="status">
							<th class="comparison-table__job-col-header">
								<div class="job-card-condensed">
									<c:set var="isBookmarked" value="false" />
									<c:forEach var="bookmark" items="${bookMarkVOList}">
										<c:if test="${dept.uddId eq bookmark.bmTargetId}">
											<c:set var="isBookmarked" value="true" />
										</c:if>
									</c:forEach>
									<button class="bookmark-button job-card-condensed__bookmark ${isBookmarked ? 'is-active' : ''}" data-category-id="G03006" data-target-id="${fn:escapeXml(dept.uddId)}">
										<span class="bookmark-button__icon--active">
											<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
										</span>
										<span class="bookmark-button__icon--inactive">
											<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
										</span>
									</button>
									<button class="job-card-condensed__remove" data-column-index="${status.index}">&times;</button>
									<h4 class="job-card-condensed__title">${dept.uddMClass}</h4>
									<p>${dept.uddLClass}</p>
									<a href="/ertds/univ/dpsrch/selectDetail.do?uddId=${dept.uddId}" class="job-card-condensed__detail-link">학과 상세보기</a>
								</div>
							</th>
						</c:forEach>
					</tr>
				</thead>
				<tbody class="comparison-table__body">
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="admissionRate">입학 경쟁률 ↕</th>
						<c:forEach var="dept" items="${compareList}">
							<td class="comparison-table__cell" data-label="입학 경쟁률">${dept.admissionRate}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="avgSalary">첫 평균 급여 ↕</th>
						<c:forEach var="dept" items="${compareList}">
							<td class="comparison-table__cell" data-label="첫 평균 급여">${dept.avgSalary}만원</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="avgTuitionFormatted">평균 등록금 ↕</th>
						<c:forEach var="dept" items="${compareList}">
							<td class="comparison-table__cell" data-label="평균 등록금">${dept.avgTuitionFormatted}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="avgScholarFormatted">평균 장학금 ↕</th>
						<c:forEach var="dept" items="${compareList}">
							<td class="comparison-table__cell" data-label="평균 장학금">${dept.avgScholarFormatted}</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="satisfactionAvg">만족도 ↕</th>
						<c:forEach var="dept" items="${compareList}">
							<td class="comparison-table__cell" data-label="만족도">${dept.satisfactionGrade}(${dept.satisfactionAvg})</td>
						</c:forEach>
					</tr>
					<tr class="comparison-table__row">
						<th class="comparison-table__category-header comparison-table__category-header--sortable" data-sort-key="empRate">취업률 ↕</th>
						<c:forEach var="dept" items="${compareList}">
							<td class="comparison-table__cell" data-label="취업률">${dept.empRate}%</td>
						</c:forEach>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script type="text/javascript" src="/js/ertds/univ/dpsrch/deptCompare.js"></script>