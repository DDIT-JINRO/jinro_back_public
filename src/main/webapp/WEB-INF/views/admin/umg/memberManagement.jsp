<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="css/admin/umg/memberManagement.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<script src="/js/include/admin/umg/memberManagement.js"></script>
<div class="flex dkwnrrhtlvek">
	<h2 class="topTitle">사용자 관리</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">회원 관리</h2>
	<div class="flex gap5 topBtnGroup">
		<button class="btn-primary topBtn" id="memberChartAllBtn">현황</button>
		<button class="btn-primary topBtn" id="memberMngBtn">관리</button>
	</div>
</div>
<div id="memberChartAllSpace">
	<input type="hidden" id="comCalendarInput" style="display: none;" />
	<div class="member-1 flex gap">
		<div class="template-panel public-countCard">
			<div class="public-card-title">일일 사용자 현황</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-image1.png">
			<div class="public-card-count" id="dailyActiveUsersCount"></div>
			<div class="public-span-space">
				<span id="dailyActiveUsersRate" class="public-span-increase"></span>
				<div class=public-span-since>Since last day</div>
			</div>
		</div>
		<div class="template-panel public-countCard">
			<div class="public-card-title">신규 가입자 수</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-image4.png">
			<div class="public-card-count" id="dailySignUpUsersCount"></div>
			<div class="public-span-space">
				<span id="dailySignUpUsersRate" class="public-span-decrease"></span>
				<div class=public-span-since>Since last day</div>
			</div>
		</div>
		<div class="template-panel public-countCard back-color-green">
			<div class="public-card-title color-white">일일 평균 홈페이지 이용시간</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-image3.png">
			<div class="public-card-count color-white" id="avgUsageTimeCount"></div>
			<div class="public-span-space">
				<span id="avgUsageTimeRate" class="public-span-increase color-white"></span>
				<div class="public-span-since color-white">Since last day</div>
			</div>
		</div>
		<div class="template-panel public-countCard back-color-purple">
			<div class="public-card-title color-white">월간 사용자 이탈수</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-image1.png">
			<div class="public-card-count color-white" id="monthlyWithdrawalUsersCount"></div>
			<div class="public-span-space">
				<span class="public-span-increase color-white" id="monthlyWithdrawalUsersRate"></span>
				<div class="public-span-since color-white">Since last month</div>
			</div>
		</div>
	</div>



	<div class="flex gap" style="height: 800px; margin-bottom: 20px;">
		<div class="template-panel" style="width: 796px;">
			<div class="flex space-between">
				<div class="middleTitle">사용자 접속 통계</div>
				<div class="btn-group flex gap5 userOnlineChart">
					<input type="hidden" id="userOnlineChartStartDay" />
					<input type="hidden" id="userOnlineChartEndDay" />
					<select class="public-toggle-select" name="userOnlineChartDay" id="userOnlineChartDay">
						<option value="daily">일별</option>
						<option value="monthly">월별</option>
						<option value="selectDays">기간</option>
					</select> <select class="public-toggle-select" name="userOnlineChartGender" id="userOnlineChartGender">
						<option value="">성별전체</option>
						<option value="male">남자</option>
						<option value="female">여자</option>
					</select> <select class="public-toggle-select" name="userOnlineChartAgeGroup" id="userOnlineChartAgeGroup">
						<option value="">연령전체</option>
						<option value="teen">청소년</option>
						<option value="youth">청년</option>
					</select>
				</div>
			</div>
			<div class="userOnlineChartCanvasSpace">
				<canvas id="userOnlineChartCanvas"></canvas>
			</div>
		</div>
		<div class="template-panel" style="width: 796px;">
			<div class="flex space-between">
				<div class="middleTitle">페이지별 방문자 수</div>
				<div class="btn-group flex gap5 pageVisitChart">
					<input type="hidden" id="pageVisitChartStartDay" />
					<input type="hidden" id="pageVisitChartEndDay" />
					<select class="public-toggle-select" name="pageVisitChartDay" id="pageVisitChartDay">
						<option value="monthly">월간</option>
						<option value="daily">일간</option>
						<option value="selectDays">기간</option>
					</select> <select class="public-toggle-select" name="pageVisitChartGender" id="pageVisitChartGender">
						<option value="">성별전체</option>
						<option value="male">남자</option>
						<option value="female">여자</option>
					</select> <select class="public-toggle-select" name="pageVisitChartAgeGroup" id="pageVisitChartAgeGroup">
						<option value="">연령전체</option>
						<option value="teen">청소년</option>
						<option value="youth">청년</option>
					</select>
				</div>
			</div>
			<div class="pageVisitChartCanvasSpace">
				<canvas id="pageVisitChartCanvas"></canvas>
			</div>
		</div>
	</div>
</div>
<div id="memberMngSpace" style="display: none;">
	<div class="member-1 flex gap" style="height: 970px;">
		<div class="template-panel" style="width: 796px;">
			<div class="flex space-between">
				<div class="middleTitle">
					<!-- 여기 부분 스타일 적용하시면 됩니다. -->
					<p>사용자 조회</p>
				</div>
				<div class="public-listSearch">
					<select name="status" id="activityFilter">
						<option value="1">전체</option>
						<option value="2">이름</option>
						<option value="3">이메일</option>
					</select>
					<input id="search" name="keyword" placeholder="검색어를 입력하세요" />
					<button class="btn-save searchUserBtn">조회</button>
				</div>
			</div>
			<div class="search-filter-bar userListPtagList">
				<p class="ptag-list">총 <span id="userList-count"></span> 건 <span class="pageCnt">
						(Page
						<span id=memListPage></span>
						/
						<span id=memListTotalPage></span>
						)
					</span>
				</p>
			</div>
			<div style="display: flex; justify-content: space-between;">
				<div class="btn-group flex gap5 userListBtnGroup">
					<button class="public-toggle-button active" style="display: none;"></button>
					<button class="public-toggle-button" id="userListId">ID</button>
					<button class="public-toggle-button" id="userListName">이름</button>
					<button class="public-toggle-button" id="userListEmail">이메일</button>
					<select class="public-toggle-select" id="userListSortOrder">
						<option value="asc">오름차순</option>
						<option value="desc">내림차순</option>
					</select>
				</div>
				<select class="public-toggle-select selectUserList-top" id="userListStatus">
					<option value="">전체</option>
					<option value="online">활동중</option>
					<option value="offline">비활동</option>
					<option value="suspended">정지상태</option>

				</select>
			</div>
			<div class="userListSpace">

				<table id="userListTable">
					<thead>
						<tr>
							<th class="body-id">NO</th>
							<th class="body-memName">회원명</th>
							<th class="body-email">이메일</th>
							<th class="body-status">활동 상태</th>
						</tr>
					</thead>
					<tbody class="userList" id="userList">
					</tbody>
				</table>
			</div>
			<div class="card-footer clearfix">
				<div class="panel-footer pagination"></div>
			</div>

		</div>
		<div style="width: 796px;">
			<div class="template-panel" style="margin-bottom: 20px; height: 505px; width: 796px;">
				<div class="middleTitle">사용자 상세</div>
				<div class="profileInfo-1">
					<div class="profileInfo-1-1">
						<div class="profile-container">
							<div class="profileFlex">
								<div class="profile-image-wrapper">
									<img id="member-profile-img" class="profile-image" src="/images/defaultProfileImg.png" alt="프로필 이미지">
								</div>
							</div>
							<div class="profile-info">
								<label for="mem-nickname"> </label>
								<input type="text" id="mem-id" style="display: none">
								<input id="mem-nickname" class="profile-nickname">
								<div id="profile-status" class="profile-status">
									<div id="profile-badge" class="profileBadge-none">일반</div>
								</div>
							</div>
						</div>
					</div>
					<div class="profileInfo-1-2">
						<div class="info-field">
							<label for="mem-name">이름</label>
							<input id="mem-name" type="text" value="" disabled="disabled">
						</div>
						<div class="info-field">
							<label for="mem-phone">휴대전화</label>
							<input id="mem-phone" type="text" value="" disabled>
						</div>
						<div class="info-field">
							<label>생년월일</label>
							<input type="text" value="" id="mem-birth" disabled>
						</div>
						<div class="info-field">
							<label>로그인 타입</label>
							<input id="mem-logType" type="text" value="" disabled="disabled">
						</div>
					</div>
					<div class="profileInfo-1-3">
						<div class="info-field">
							<label>이메일</label>
							<input id="mem-email" type="email" value="" disabled>
						</div>
						<div class="info-field">
							<label>성별</label>
							<input id="mem-gen" type="text" value="" disabled>
						</div>
						<div class="info-field">
							<label>경고수</label>
							<input id="mem-warn-count" type="text" value="" disabled>
						</div>
						<div class="info-field">
							<label>정지수</label>
							<input id="mem-ban-count" type="text" value="" disabled>
						</div>
					</div>
					<div class="profileInfo-1-4">
						<div class="info-field">
							<label>회원 권한</label>
							<select class="inputmem-role" id="mem-role">
								<option value="">-</option>
								<option value="R01001">회원</option>
								<option value="R01002">관리자</option>
								<option value="R01003">상담사</option>
								<option value="R01004">상담센터장</option>
							</select>
						</div>

					</div>
				</div>
				<div style="margin-top: auto; margin-left: 40px;">
					<div class="info-second-space flex">
						<div class="info-history flex">
							<span>관심 키워드 :</span>
							<div id="mem-interests">-</div>
						</div>
					</div>
					<div class="info-second-space2 flex">
						<div class="info-history2">
							<span>AI 피드백 :</span>
							<div id="aiFeedbackCount">-</div>
						</div>
						<div class="info-history2">
							<span>상담횟수 :</span>
							<div id="counselingCompletedCount">-</div>
						</div>
						<div class="info-history2">
							<span>월드컵 :</span>
							<div id="worldcupCount">-</div>
						</div>
						<div class="info-history2">
							<span>로드맵 :</span>
							<div id="roadmapCount">-</div>
						</div>
					</div>
					<div class="info-second-space2 flex">
						<div class="info-history2">
							<span>심리검사 :</span>
							<div id="psychTestCount">-</div>
						</div>
						<div class="info-history2">
							<span>모의면접 :</span>
							<div id="mockInterviewCount">-</div>
						</div>
						<div class="info-history2">
							<span>최근 로그인 기록 :</span>
							<div id="recentLoginDate"></div>
						</div>
						<div class="info-history2">
							<span>최근 제재 기록 :</span>
							<div id="recentPenaltyDate"></div>
						</div>
					</div>
				</div>
				<div class="userdetail-button-group">
					<button class="btn-primary" id="userModify">
						<i class="fas fa-save"></i>저장
					</button>
				</div>
			</div>
			<div class="template-panel" style="height: 445px;">
				<div class="middleTitle">
					<select class="user-detail-listSelect" id="tableSelector">
						<option value="table1">회원 게시글 내역</option>
						<option value="table2">회원 댓글 내역</option>
						<!--  <option value="table3">회원 결제 내역</option>-->
					</select>
				</div>
				<div class="tableSpace-memDetailBoardList" id="tableContainer1">
					<div style="display: flex; justify-content: space-between;">
						<div class="btn-group flex gap5 userDetailBtnGroup">
							<button class="public-toggle-button active" id="memDetailBoardList-orderBtn-id">ID</button>
							<button class="public-toggle-button" id="memDetailBoardList-orderBtn-delYn">삭제여부</button>
							<button class="public-toggle-button" id="memDetailBoardList-orderBtn-date">작성일자</button>
							<select class="public-toggle-select" id="memDetailSortOrder">
								<option value="asc">오름차순</option>
								<option value="desc">내림차순</option>
							</select>
						</div>
						<select class="public-toggle-select selectpb-top" id="boardListCategory">
							<option value="">전체</option>
							<option value="G09001">청소년 커뮤니티</option>
							<option value="G09002">진로 진학 커뮤니티</option>
							<option value="G09003">면접후기 커뮤니티</option>
							<option value="G09004">이력서 템플릿 공유</option>
							<option value="G09005">스터디 그룹 게시글</option>
							<option value="G09006">청년 커뮤니티</option>
						</select>
					</div>
					<table class="userDetailTable" id="userDetailTable-memDetailBoardList">
						<thead>
							<tr>
								<th class="body-boardId">NO</th>
								<th class="body-memName">분류</th>
								<th class="body-boardTitle">제목</th>
								<th class="body-boardCnt">조회수</th>
								<th class="body-status">작성일</th>
								<th class="body-status">삭제여부</th>
							</tr>
						</thead>
						<tbody class="userDetailList" id="userDetailBoardList">
						</tbody>
					</table>
				</div>




				<div class="tableSpace-memDetailReplyList" style="display: none;" id="tableContainer2">
					<div class="btn-group flex gap5 userDetailBtnGroup">
						<button class="public-toggle-button active" id="memDetailReplyList-orderBtn-id">ID</button>
						<button class="public-toggle-button" id="memDetailReplyList-orderBtn-delYn">삭제여부</button>
						<button class="public-toggle-button" id="memDetailReplyList-orderBtn-date">작성일자</button>
						<select class="public-toggle-select" id="memDetailReplySortOrder">
							<option value="asc">오름차순</option>
							<option value="desc">내림차순</option>
						</select>
					</div>
					<table class="userDetailTable" id="userDetailTable-memDetailReplyList">
						<thead>
							<tr>
								<th class="body-id">NO</th>
								<th class="body-memName">종류</th>
								<th class="body-status">작성일</th>
								<th class="body-status">삭제여부</th>
							</tr>
						</thead>
						<tbody class="userDetailList" id="userDetailReplyList">
						</tbody>
					</table>
				</div>


				<div class="tableSpace-memDetailPaymentList" style="display: none;" id="tableContainer3">
					<div class="btn-group flex gap5 userDetailBtnGroup">
						<button class="public-toggle-button active" id="memDetailPaymentList-orderBtn-id">ID</button>
						<button class="public-toggle-button" id="memDetailPaymentist-orderBtn-category">결제일</button>
					</div>
					<table class="userDetailTable" id="userDetailTable-memDetailPaymentList">
						<thead>
							<tr>
								<th class="body-id">NO</th>
								<th class="body-memName">분류</th>
								<th class="body-email">조회수</th>
								<th class="body-status">작성일</th>
								<th class="body-status">삭제여부</th>
							</tr>
						</thead>
						<tbody class="userDetailList" id="userDetailPaymentList">
						</tbody>
					</table>
				</div>
				<div class="card-footer clearfix" id="memDetailBoardListPagenationSpace">
					<div class="panel-footer pagination" id="memDetailBoardListPagenation"></div>
				</div>
				<div class="card-footer clearfix" id="memDetailReplyListPagenationSpace" style="display: none;">
					<div class="panel-footer pagination" id="memDetailReplyListPagenation"></div>
				</div>
				<div class="card-footer clearfix" style="display: none;">
					<div class="panel-footer pagination memDetailPaymentListPagenation"></div>
				</div>

			</div>
		</div>
	</div>
	<div class="flex gap" style="height: 500px; margin-bottom: 20px;">
		<div class="template-panel usagePersonChart">
			<div class="flex space-between">
				<div class="middleTitle">사용자 접속 통계</div>
				<div class="btn-group flex gap5">
					<input type="hidden" id="personChartStartDay" />
					<input type="hidden" id="personChartEndDay" />
					<select class="public-toggle-select" id="personChartDay">
						<option value="daily">일별</option>
						<option value="monthly">월별</option>
						<option value="selectDays">기간</option>
					</select>
				</div>
			</div>
			<div class="userOnlineChartCanvasSpace" style="height: calc(100% - 40px);">
				<canvas id="usagePersonChartCanvas"></canvas>
			</div>
		</div>
		<!-- <div class="template-panel insertMember">
			<div class="middleTitle">회원 등록</div>
			<div class="member-form">
				<div class="member-form-left">
					<label>회원 이메일</label>
					<input id="insertEmail" type="text">
					<button class="btn-temp" id="emailDoubleCheck">이메일 중복확인</button>
					<label>회원 프로필</label>
					<div class="profile-wrapper">
						<img src="/images/defaultProfileImg.png" alt="프로필">
						<label class="upload-icon" for="profileUpload">+</label>
						<input type="file" id="profileUpload">
					</div>

					<label>회원 권한</label>
					<select id="insertRole">
						<option value="R01001">일반</option>
						<option value="R01002">관리자</option>
						<option value="R01003">상담사</option>
						<option value="R01004">상담센터장</option>
					</select>
				</div>
				<div class="member-form-right">
					<label>회원명</label>
					<input id="insertName" type="text">
					<label>닉네임</label>
					<input id="insertNickname" type="text">
					<button class="btn-temp" id="nicknameDoubleCheck">닉네임 중복확인</button>
					<label>비밀번호</label>
					<input id="insertPassword" type="password">
					<label>연락처</label>
					<input id="insertPhone" type="text">
				</div>
				<div class="member-form-extra">
					<label>성별</label>
					<select id="insertGen" type="text">
						<option value="G11001">남자</option>
						<option value="G11002">여자</option>
					</select>
					<label>생년월일</label>
					<input id="insertBirth" type="date">
				</div>
			</div>
			<div style="display: flex; justify-content: flex-end;">
				<button class="add-btn">추가</button>
			</div>
		</div> -->
		<div class="template-panel" style="width: 796px;">
			<div class="middleTitle">페이지 방문 조회</div>

			<div class="search-filter-bar">
				<p class="ptag-list pageLogCount">총<span id="pageLog-count"></span>건 <span class="pageCnt" style="margin-top: 20px;">
						(Page
						<span id=memPageVisitPage></span>
						/
						<span id=memPageVisitTotalPage></span>
						)
					</span>
				</p>
			</div>
			<div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
				<div class="btn-group flex gap5 pageVisitList">
					<button class="public-toggle-button active" id="pageLogSortByPlId" data-sort-by="plId">로그ID</button>
					<button class="public-toggle-button" id="pageLogSortByMemId" data-sort-by="memId">회원ID</button>
					<button class="public-toggle-button" id="pageLogSortByPlTitle" data-sort-by="plTitle">페이지 제목</button>
					<button class="public-toggle-button" id="pageLogSortByPlCreatedAt" data-sort-by="plCreatedAt">방문일시</button>
					<select class="public-toggle-select" id="pageLogSortOrder">
						<option value="asc">오름차순</option>
						<option value="desc">내림차순</option>
					</select>
				</div>
				<div class="public-listSearch">
					<input id="pageLogKeyword" name="keyword" placeholder="(페이지 제목, URL, 회원ID)" />
					<button class="btn-save pageLogSearchBtn">조회</button>
				</div>
			</div>
			<div class="pageLogListSpace">
				<table id="pageLogTable">
					<thead>
						<tr>
							<th class="body-logId">NO</th>
							<th class="body-memId">회원ID</th>
							<th class="body-memName">회원명</th>
							<th class="body-title">페이지 제목</th>
							<th class="body-createdAt">방문일시</th>
						</tr>
					</thead>
					<tbody class="pageLogList" id="pageLogList">
					</tbody>
				</table>
			</div>
			<div class="card-footer clearfix">
				<div class="panel-footer pagination" id="pageLogPagination"></div>
			</div>
		</div>
	</div>