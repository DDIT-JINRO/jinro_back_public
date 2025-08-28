<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/admin/umg/counselorManagement.css">

<script src="/js/include/admin/umg/counselorManagement.js"></script>
<div class="flex dkwnrrhtlvek">
	<h2 class="topTitle">사용자 관리</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">상담사 관리</h2>
	<div class="flex gap5 topBtnGroup">
		<button class="btn-primary topBtn" id="cnsChartAllBtn">현황</button>
		<button class="btn-primary topBtn" id="cnsMngBtn">관리</button>
	</div>
</div>
<input type="hidden" id="comCalendarInput" style="display: none;" />

<div id="cnsChartAllSpace">
	<div class="flex gap cnsMg-1" style="margin-bottom: 20px;">
		<div class="template-panel public-countCard ">
			<div class="public-card-title">월간 상담 신청 수</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-image1.png">
			<div class="public-card-count" id="monthlyCnsCount">123</div>
			<div class="public-span-space">
				<span id="monthlyCnsApp" class="public-span-increase">▲13.5%</span>
				<div class=public-span-since>Since last month</div>
			</div>
		</div>
		<div class="template-panel public-countCard back-color-red">
			<div class="public-card-title color-white">월간 대면상담 신청수</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-offlineCns.png">
			<div class="public-card-count color-white" id="dailyOffCnsCount">123</div>
			<div class="public-span-space">
				<span class="public-span-increase color-white" id="dailyOffCnsRate">▲13.5%</span>
				<div class="public-span-since color-white">Since last month</div>
			</div>
		</div>
		<div class="template-panel public-countCard back-color-green">
			<div class="public-card-title color-white">월간 채팅상담 신청수</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-chatCns.png">
			<div class="public-card-count color-white" id="dailyChatCnsCount">123</div>
			<div class="public-span-space">
				<span class="public-span-increase color-white" id="dailyChatCnsRate">▲13.5%</span>
				<div class="public-span-since color-white">Since last month</div>
			</div>
		</div>
		<div class="template-panel public-countCard back-color-purple">
			<div class="public-card-title color-white">월간 화상상담 신청수</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-videoCns.png">
			<div class="public-card-count color-white" id="dailyVideoCnsCount">123</div>
			<div class="public-span-space">
				<span class="public-span-increase color-white" id="dailyVideoCnsRate">▲13.5%</span>
				<div class="public-span-since color-white">Since last month</div>
			</div>
		</div>
	</div>
	<div class="cnsMg-2 flex gap" style="margin-bottom: 20px;">
		<div class="cnsMg-2-1 gap">
			<div class="cnsMg-2-1-1 flex gap" style="margin-bottom: 20px;">
				<div class="template-panel cnsCateChart">
					<div class="flex space-between">
						<div class="middleTitle">상담 유형별</div>
						<input type="hidden" id="cnsCateChartStartDay" />
						<input type="hidden" id="cnsCateChartEndDay" />
						<div class="flex gap5" style="justify-content: flex-end;">
							<button class="public-toggle-button" id="cnsCateChartReset">전체</button>
							<select class="public-toggle-select" id="cnsCateChartDateType">
								<option value="daily">주간</option>
								<option value="monthly">월간</option>
								<option value="selectDays">기간</option>
							</select> <select class="public-toggle-select" id="cnsCateChartGender">
								<option value="">성별전체</option>
								<option value="G11001">남자</option>
								<option value="G11002">여자</option>
							</select> <select class="public-toggle-select" id="cnsCateChartAgeGroup">
								<option value="">연령전체</option>
								<option value="youth">청년</option>
								<option value="teen">청소년</option>
							</select>
						</div>
					</div>
					<div style="height: 500px; margin-top: auto;">
						<canvas id="consultMethodStatisticsChartCanvas"></canvas>
					</div>
				</div>
				<div class="template-panel cnsTop3Chart">
					<div class="flex space-between">
						<div class="middleTitle">상담사 TOP3</div>
						<input type="hidden" id="cnsTop3ChartStartDay" />
						<input type="hidden" id="cnsTop3ChartEndDay" />
						<div class="flex gap5" style="justify-content: flex-end;">
							<button class="public-toggle-button" id="cnsTop3ChartReset">전체</button>
							<select class="public-toggle-select" id="cnsTop3ChartDate">
								<option value="daily">주간</option>
								<option value="monthly">월간</option>
								<option value="selectDays">기간</option>
							</select> <select class="public-toggle-select" id="cnsTop3ChartType">
								<option value="satisfaction">만족도</option>
								<option value="reviews">후기건수</option>
								<option value="consultations">상담건수</option>
							</select>
						</div>
					</div>
					<div class="topcnsListChartSpace">
						<canvas id="topCounselorListChartCanvas"></canvas>
					</div>
				</div>
			</div>

			<div class="template-panel cnsTypeChart">
				<div class="flex space-between">
					<div class="middleTitle">상담 종류별</div>
					<input type="hidden" id="cnsTypeChartStartDay" />
					<input type="hidden" id="cnsTypeChartEndDay" />
					<div class="flex gap5" style="justify-content: flex-end;">
						<button class="public-toggle-button" id="cnsTypeChartReset">전체</button>
						<select class="public-toggle-select" id="cnsTypeChartDate">
							<option value="daily">주간</option>
							<option value="monthly">월간</option>
							<option value="selectDays">기간</option>
						</select> <select class="public-toggle-select" id="cnsTypeChartGen">
							<option value="">성별전체</option>
							<option value="G11001">남자</option>
							<option value="G11002">여자</option>
						</select> <select class="public-toggle-select" id="cnsTypeChartAgeGroup">
							<option value="">연령전체</option>
							<option value="youth">청년</option>
							<option value="teen">청소년</option>
						</select>
					</div>
				</div>
				<div class="counselingStatsByCategoryChartCanvasSpace">
					<canvas id="counselingStatsByCategoryChartCanvas"></canvas>
				</div>
			</div>
		</div>
		<div class="cnsMg-2-2 template-panel">
			<div class="flex space-between">
				<div class="middleTitle">상담 시간대 통계</div>
				<input type="hidden" id="cnsHoursChartStartDay" />
				<input type="hidden" id="cnsHoursChartEndDay" />
				<div class="flex gap5" style="justify-content: flex-end;">
					<button class="public-toggle-button" id="cnsHoursChartReset">전체</button>
					<select class="public-toggle-select" id="cnsHoursChartDate">
						<option value="daily">주간</option>
						<option value="monthly">월간</option>
						<option value="selectDays">기간</option>
					</select> <select class="public-toggle-select" id="cnsHoursChartGen">
						<option value="">성별전체</option>
						<option value="G11001">남자</option>
						<option value="G11002">여자</option>
					</select> <select class="public-toggle-select" id="cnsHoursChartAgeGroup">
						<option value="">연령전체</option>
						<option value="youth">청년</option>
						<option value="teen">청소년</option>
					</select>
				</div>
			</div>
			<div class="counselingStatsByTimeChartCanvasSpace">
				<canvas id="counselingStatsByTimeChartCanvas"></canvas>
			</div>
		</div>
	</div>
</div>
<div id="cnsMngSpace" style="display: none;">
	<div class="cnsMg-3 flex gap" style="margin-bottom: 20px;">
		<div class="template-panel cnsCompleteAndReviewList">
			<div class="flex space-between">
				<div class="middleTitle">상담사별 처리 건수 및 만족도 평가</div>
				<div class="public-listSearch">
					<select name="status" id="cnsListStatus">
						<option value="1">이름</option>
					</select>
					<input id="search" name="keyword" placeholder="이름을 입력하세요" />
					<button class="btn-save searchUserBtn">조회</button>
				</div>
			</div>
			<div class="search-filter-bar">
				<p class="ptag-list">총 <span id="cnsList-count"></span> 건
				</p>
			</div>
			<div style="display: flex; justify-content: space-between;">
				<div class="btn-group flex gap5 cnsCompleteAndReviewBtnGroup" style="margin-bottom: 10px;">
					<button class="public-toggle-button" id="cnsListName">이름</button>
					<button class="public-toggle-button" id="cnsListCnsCnt">상담건수</button>
					<button class="public-toggle-button" id="cnsListReviewCnt">후기건수</button>
					<button class="public-toggle-button" id="cnsListRating">만족도</button>
					<select class="public-toggle-select" id="cnsListSortOrder">
						<option value="asc">오름차순</option>
						<option value="desc">내림차순</option>
					</select>
				</div>
			</div>
			<div class="cnsListSpace">
				<table id="cnsListTable">
					<thead>
						<tr>
							<th class="body-id">ID</th>
							<th class="body-memName">상담사명</th>
							<th class="body-email">상담건수</th>
							<th class="body-status">후기건수</th>
							<th class="body-status">만족도</th>
						</tr>
					</thead>
					<tbody class="cnsList" id="cnsList">
						<tr>
							<td>1</td>
							<td>홍길동</td>
							<td>1</td>
							<td>1</td>
							<td><span class="star-rating">★★★★★</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>홍길동</td>
							<td>1</td>
							<td>1</td>
							<td><span class="star-rating">★★★★★</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>홍길동</td>
							<td>1</td>
							<td>1</td>
							<td><span class="star-rating">★★★★★</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>홍길동</td>
							<td>1</td>
							<td>1</td>
							<td><span class="star-rating">★★★★★</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>홍길동</td>
							<td>1</td>
							<td>1</td>
							<td><span class="star-rating">★★★★★</span></td>
						</tr>
						<tr>
							<td>1</td>
							<td>홍길동</td>
							<td>1</td>
							<td>1</td>
							<td><span class="star-rating">★★★★★</span></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card-footer clearfix">
				<div class="panel-footer pagination" id="cnsListPagenation"></div>
			</div>
		</div>
		<div>
			<div class="template-panel cns-info-detail">
				<div class="middleTitle">상담사 상세정보</div>
				<div id="cns-detail-box">
					<div class="cns-header-section flex">
						<div class="profile-container">
							<div class="profileFlex">
								<div class="profile-image-wrapper">
									<img id="cns-profile-img" class="profile-image" src="/images/defaultProfileImg.png" alt="프로필 이미지">
								</div>
							</div>
							<div class="profile-info">
								<label for="cns-nickname">
									<i class="fa-solid fa-pencil"></i>
								</label>
								<input type="text" id="cns-id" style="display: none">
								<input id="cns-nickname" class="profile-nickname">
							</div>
						</div>




						<div class="cns-info-grid">
							<span style="display: none">
								<input type="text" id="mem-id" style="display: none">
							</span>
							<div class="info-field">
								<label>이름</label>
								<input type="text" id="mem-name">
							</div>
							<div class="info-field">
								<label>이메일</label>
								<input type="text" id="mem-email" disabled="disabled">
							</div>
							<div class="info-field">
								<label>전화번호</label>
								<input type="text" id="mem-phone" disabled="disabled">
							</div>
							<div class="info-field">
								<label>생년월일</label>
								<input type="text" id="mem-birth" disabled="disabled">
							</div>
							<div class="info-field">
								<label>성별</label>
								<input type="text" id="mem-gen" disabled="disabled">
							</div>
							<div class="info-field">
								<label>권한</label>
								<select id="mem-role">
									<option value="R01001">회원</option>
									<option value="R01002">관리자</option>
									<option value="R01003">상담사</option>
									<option value="R01004">상담센터장</option>
								</select>
							</div>
							<div class="info-field">
								<label>상담 횟수</label>
								<input type="text" id="counselor-cns-count" disabled="disabled">
							</div>
							<div class="info-field">
								<label>휴가 횟수</label>
								<input type="text" id="counselor-vac-count" disabled="disabled">
							</div>
							<div class="info-field">
								<label>상담 평점</label>
								<input type="text" id="counselor-review-point" disabled="disabled">
							</div>
						</div>
					</div>
				</div>
				<div class="info-second-space2 flex">
					<div class="info-history2 recentLoginDateSpace">
						<span>최근 상담 기록 :</span>
						<div id="recentLoginDate">
							<i class="fa-regular fa-clock"></i>-
						</div>
					</div>
					<div class="info-history2">
						<span>최근 휴가 기록 :</span>
						<div id="recentPenaltyDate">
							<i class="fa-regular fa-clock"></i>-
						</div>
					</div>
				</div>

				<div class="flex" style="justify-content: flex-end; margin-top: auto;">
					<button class="btn-primary" id="cnsModify">
						<i class="fas fa-save"></i>저장
					</button>
				</div>
			</div>
			<div class="template-panel cnsDetailListSpace">
				<div class="middleTitle">상담 내역</div>
				<div class="search-filter-bar">
					<p class="ptag-list">
						총 <span id="cnsHistory-count"></span>건
						<span class="pageCnt" style="gap:10px;"> (Page <span id=couListPage></span>/<span id=couListTotalPage></span>)</span>
					</p>
				</div>
				<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">

					<div class="btn-group flex gap5 userListBtnGroup">
						<button class="public-toggle-button" id="cnsDetailListReqTime">상담일시</button>
						<button class="public-toggle-button" id="cnsDetailListRating">만족도</button>
						<select class="public-toggle-select" id="cnsDetailListOrder">
							<option value="asc">오름차순</option>
							<option value="desc">내림차순</option>
						</select>
					</div>
					<div class="filter-group">
						<select class="public-toggle-select selectUserList-top" id="cnsCateFilter">
							<option value="">유형</option>
							<option value="G08001">대면</option>
							<option value="G08002">채팅</option>
							<option value="G08003">화상</option>
						</select> <select class="public-toggle-select selectUserList-top" id="cnsTypeFilter">
							<option value="">종류</option>
							<option value="G07001">취업</option>
							<option value="G07002">학업</option>
							<option value="G07003">심리</option>
						</select> <select class="public-toggle-select selectUserList-top" id="cnsStatusFilter">
							<option value="">상태</option>
							<option value="S04001">신청</option>
							<option value="S04002">취소</option>
							<option value="S04003">확정</option>
							<option value="S04004">완료</option>
							<option value="S04005">개설</option>
						</select>
					</div>
				</div>
				<table id="cnsDetailListTable">
					<thead>
						<tr>
							<th class="body-id">상담ID</th>
							<th class="body-cnsCate">상담유형</th>
							<th class="body-cnsType">상담종류</th>
							<th class="body-cnsDate">상담일시</th>
							<th class="body-reviewPonit">만족도</th>
							<th class="body-cnsStatus">상태</th>
						</tr>
					</thead>
					<tbody class="cnsDetailList" id="cnsDetailList">
						<tr>
							<td colspan="6">상담사를 선택해주세요</td>
						</tr>
					</tbody>
				</table>
				<div class="card-footer clearfix">
					<div class="panel-footer pagination" id="cnsDetailListPagenation"></div>
				</div>
			</div>
		</div>
	</div>
</div>