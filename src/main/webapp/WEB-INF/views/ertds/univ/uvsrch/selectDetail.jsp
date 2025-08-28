<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/ertds/univ/uvsrch/univDetail.css">
<section class="channel">
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
			<a class="tab active" href="/ertds/univ/uvsrch/selectUnivList.do">대학 검색</a>
			<a class="tab" href="/ertds/univ/dpsrch/selectDeptList.do">학과 정보</a>
			<a class="tab" href="/ertds/univ/uvivfb/selectInterviewList.do">면접 후기</a>
		</div>
		<div class="public-wrapper-main">
			<!-- 대학 기본 정보 -->
			<div class="univ-detail-info">
				<div class="univ-basic-info">
					<div class="univ-title-section">
						<h1 class="univ-name">${universityDetail.univName}</h1>
						<div class="univ-bookmark">
							<c:set var="isBookmarked" value="false" />
							<c:forEach var="bookmark" items="${bookMarkVOList}">
								<c:if test="${universityDetail.univId eq bookmark.bmTargetId}">
									<c:set var="isBookmarked" value="true" />
								</c:if>
							</c:forEach>

							<button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-category-id="G03001" data-target-id="${universityDetail.univId}">
								<span class="icon-active">
									<img src="/images/bookmark-btn-active.png" alt="활성 북마크">
								</span>
								<span class="icon-inactive">
									<img src="/images/bookmark-btn-inactive.png" alt="비활성 북마크">
								</span>
							</button>
						</div>
					</div>

					<div class="univ-info-grid">
						<div class="info-item">
							<span class="info-label">대학 유형</span>
							<span class="info-value">${universityDetail.univType}</span>
						</div>
						<div class="info-item">
							<span class="info-label">설립 유형</span>
							<span class="info-value">${universityDetail.univGubun}</span>
						</div>
						<div class="info-item">
							<span class="info-label">홈페이지</span>
							<span class="info-value">
								<c:choose>
									<c:when test="${not empty universityDetail.univUrl}">
										<a href="${universityDetail.univUrl}" target="_blank" class="homepage-link">바로가기</a>
									</c:when>
									<c:otherwise>
										<span class="no-homepage">홈페이지 정보 없음</span>
									</c:otherwise>
								</c:choose>
							</span>
						</div>
						<div class="info-item">
							<span class="info-label">지역</span>
							<span class="info-value">${universityDetail.univRegion}</span>
						</div>
						<div class="info-item">
							<span class="info-label">주소</span>
							<span class="info-value">${universityDetail.univAddr}</span>
						</div>

						<div class="info-item">
							<span class="info-label">총 학과 수</span>
							<span class="info-value">${universityDetail.totalDeptCount}개</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 학과 검색 및 목록 -->
			<div class="dept-list-section">
				<h2>개설 학과 정보</h2>
				<p class="section-description">출처 : 대학알리미 2024년도 자료</p>

				<!-- 학과 검색 -->
				<div class="dept-search">
					<input type="search" id="deptSearchInput" placeholder="학과명으로 검색">
					<button class="search-btn" type="button" id="deptSearchBtn">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                        </svg>
					</button>
				</div>

				<!-- 학과 목록 헤더 -->
				<div class="dept-list">
					<div class="dept-list-header">
						<div class="header-item header-name">학과명</div>
						<div class="header-item header-tuition">등록금 (전국평균)</div>
						<div class="header-item header-scholar">1인당 평균 장학금 (전국평균)</div>
						<div class="header-item header-competition">경쟁률 (전국평균)</div>
						<div class="header-item header-employment">취업률 (전국평균)</div>
					</div>

					<!-- 학과 목록 -->
					<div id="deptListContainer">
						<c:choose>
							<c:when test="${not empty universityDetail.deptList}">
								<c:forEach var="dept" items="${universityDetail.deptList}">
									<div class="dept-item clickable-item" data-dept-name="${dept.udName}" data-href="/ertds/univ/dpsrch/selectDetail.do?uddId=${dept.uddId}">
										<div class="dept-item-content">
											<!-- 학과명 - 클릭 가능한 링크 -->
											<div class="dept-info-item dept-name">${dept.udName}</div>

											<!-- 등록금 비교 -->
											<div class="dept-info-item comparison-item dept-tuition">
												<div class="value-comparison">
													<c:choose>
														<c:when test="${dept.udTuition != null and dept.udTuition > 0}">
															<span class="current-value 
                                                                ${dept.udTuition > dept.avgTuition ? 'higher' : 
                                                                  dept.udTuition < dept.avgTuition ? 'lower' : 'equal'}">
																<fmt:formatNumber value="${dept.udTuition}" pattern="#,###" />
																원 ${dept.udTuition > dept.avgTuition ? '↑' : '↓'}
															</span>
															<c:if test="${dept.avgTuition != null and dept.avgTuition > 0}">
																<span class="avg-value">
																	(
																	<fmt:formatNumber value="${dept.avgTuition}" pattern="#,###" />
																	원)
																</span>
															</c:if>
														</c:when>
														<c:otherwise>
															<span class="no-data">데이터 없음</span>
														</c:otherwise>
													</c:choose>
												</div>
											</div>

											<!-- 장학금 비교 -->
											<div class="dept-info-item comparison-item dept-scholar">
												<div class="value-comparison">
													<c:choose>
														<c:when test="${dept.udScholar != null and dept.udScholar > 0}">
															<span class="current-value 
                                                                ${dept.udScholar > dept.avgScholar ? 'higher' : 
                                                                  dept.udScholar < dept.avgScholar ? 'lower' : 'equal'}">
																<fmt:formatNumber value="${dept.udScholar}" pattern="#,###" />
																원 ${dept.udScholar > dept.avgScholar ? '↑' : '↓'}
															</span>
															<c:if test="${dept.avgScholar != null and dept.avgScholar > 0}">
																<span class="avg-value">
																	(
																	<fmt:formatNumber value="${dept.avgScholar}" pattern="#,###" />
																	원)
																</span>
															</c:if>
														</c:when>
														<c:otherwise>
															<span class="no-data">데이터 없음</span>
														</c:otherwise>
													</c:choose>
												</div>
											</div>

											<!-- 경쟁률 비교 -->
											<div class="dept-info-item comparison-item dept-competition">
												<div class="value-comparison">
													<c:choose>
														<c:when test="${not empty dept.udCompetition and dept.udCompetition != '0' and dept.udCompetition != '0:1'}">
															<span class="current-value">${dept.udCompetition}</span>
															<c:if test="${not empty dept.avgCompetition}">
																<span class="avg-value">(${dept.avgCompetition})</span>
															</c:if>
														</c:when>
														<c:otherwise>
															<span class="no-data">데이터 없음</span>
														</c:otherwise>
													</c:choose>
												</div>
											</div>

											<!-- 취업률 비교 -->
											<div class="dept-info-item comparison-item dept-employment">
												<div class="value-comparison">
													<c:choose>
														<c:when test="${not empty dept.udEmpRate and dept.udEmpRate != '0' and dept.udEmpRate != '0.0'}">
															<span class="current-value 
                                                                ${dept.udEmpRate > dept.avgEmpRate ? 'higher' : 
                                                                  dept.udEmpRate < dept.avgEmpRate ? 'lower' : 'equal'}"> ${dept.udEmpRate}% ${dept.udEmpRate > dept.avgEmpRate ? '↑' : '↓'} </span>
															<c:if test="${dept.avgEmpRate != null and dept.avgEmpRate > 0}">
																<span class="avg-value">(${dept.avgEmpRate}%)</span>
															</c:if>
														</c:when>
														<c:otherwise>
															<span class="no-data">데이터 없음</span>
														</c:otherwise>
													</c:choose>
												</div>
											</div>
										</div>
									</div>
								</c:forEach>
							</c:when>
							<c:otherwise>
								<div class="no-data-message">
									<p>등록된 학과 정보가 없습니다.</p>
								</div>
							</c:otherwise>
						</c:choose>
					</div>
				</div>

				<!-- 범례 -->
				<div class="comparison-legend">
					<h3>비교 안내</h3>
					<div class="legend-items">
						<div class="legend-item">
							<span class="legend-color higher"></span>
							<span>전국 평균보다 높음 (등록금: 비쌈, 장학금/취업률: 좋음)</span>
						</div>
						<div class="legend-item">
							<span class="legend-color lower"></span>
							<span>전국 평균보다 낮음 (등록금: 저렴, 장학금/취업률: 아쉬움)</span>
						</div>
						<div class="legend-item">
							<span class="legend-text">괄호 안은 전국 평균값</span>
						</div>
						<div class="legend-item">
							<span class="legend-text">학과명을 클릭하면 해당 학과의 상세 정보를 볼 수 있습니다</span>
						</div>
						<div class="legend-item">
							<span class="legend-text">'데이터 없음'은 해당 정보가 제공되지 않는 학과입니다</span>
						</div>
					</div>
				</div>
			</div>

			<div class="interview-list-section">
				<!-- 대학 면접 후기 -->
				<div class="interview-review-list-section">
					<h2>대학 면접 후기</h2>
					<!-- 학과 목록 헤더 -->
					<div class="interview-review-list">
						<c:forEach var="interviewReview" items="${interviewReviewList}">
							<div class="review-item">
								<div class="review-meta">
									<span>
										<strong> ${interviewReview.memNickname}</strong>
									</span>
									<div class="rating-and-date">
										<span>
											<strong class="review-rating-icon">★</strong> ${interviewReview.irRating}
										</span>
									</div>
								</div>
								<p class="review-content">${interviewReview.irContent}</p>
								<p class="review-date">
									<fmt:formatDate value="${interviewReview.irCreatedAt}" pattern="yyyy. MM. dd" />
								</p>
							</div>
						</c:forEach>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script type="text/javascript" src="/js/ertds/univ/uvsrch/univDetail.js"></script>

</body>
</html>