<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="css/admin/umg/sanctionsDescription.css">
<script src="/js/include/admin/umg/sanctionsDescription.js"></script>

<div class="flex">
	<h2 class="topTitle">사용자 관리</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">제재 내역</h2>
</div>


<div class="sancChartSpace flex gap">
	<input type="hidden" id="comCalendarInput" style="display: none;" />
	<div class="sancChart-1">
		<div class="flex gap" style="margin-bottom: 20px;">
			<div class="template-panel dailyReportCount">
				<div class="middleTitle">오늘 접수된 신고 수</div>
				<img class="public-card-icon" alt="" src="/images/admin/admin-time.png">
				<div class="public-card-green-count" id="dailyReportCnt">123건</div>
			</div>
			<div class="template-panel delayReportCount">
				<div class="middleTitle">처리 대기중 신고 수</div>
				<img class="public-card-icon" alt="" src="/images/admin/admin-warning.png">
				<div class="public-card-red-count" id="delayReportCnt"></div>
			</div>
		</div>
		<div class="template-panel penaltyMemberChart">
			<div class="middleTitle">정지 회원 비율</div>
			<img class="public-card-icon" alt="" src="/images/admin/admin-stop.png">
			<div class="flex chartDounutSpac">
				<div class="penaltyMemberChart-2">
					<canvas id="penaltyDounutChart"></canvas>
				</div>
				<div class="penaltyMemberChart-1" id="suspendedMemberRatio"></div>
			</div>
		</div>
	</div>
	<div class="sancChart-2">
		<div class="template-panel penaltyStats">
			<div class="middleTitle">제재 유형 분포</div>
			<div class="flex gap10 endflex btn-group">
				<input type="hidden" id="penaltyStatsStartDay" />
				<input type="hidden" id="penaltyStatsEndDay" />
				<select class="public-toggle-select" id="penaltyStatsDateBtn">
					<option value="monthly">월간</option>
					<option value="daily">일간</option>
					<option value="selectDays">기간</option>
				</select> <select class="public-toggle-select" id="penaltyStatsGenBtn">
					<option value="">성별</option>
					<option value="male">남자</option>
					<option value="female">여자</option>
				</select> <select class="public-toggle-select" id="penaltyStatsAgeBtn">
					<option value="">연령대</option>
					<option value="youth">청년</option>
					<option value="teen">청소년</option>
				</select>
			</div>
			<div class="penaltyChartSpace">
				<canvas id="penaltyChart"></canvas>
			</div>
		</div>
	</div>
</div>


<div class="scdMng-2">
	<div class="template-panel scdMng-2-1">
		<div class="middleTitle">신고 목록</div>
		<div class="public-listSearch">
			<select name="statusReport" id="">
				<option value="1">전체</option>
				<option value="2">신고자명</option>
				<option value="3">신고대상명</option>
			</select>
			<input id="searchReport" name="keywordReport" placeholder="검색어를 입력하세요" />
			<button class="btn-save searchReportBtn">조회</button>
		</div>
		<p class="ptag-list">
			총
			<span id="reportList-count"></span>
			건
			<span class="pageCnt" style="padding-left: 10px;">(Page <span id=reportListPage></span>/<span id=reportListTotalPage></span>)</span>
		</p>
		<div style="display: flex; justify-content: space-between; margin: 10px 0;">

			<div class="btn-group flex gap5 reportListBtnGroup">
				<input class="public-toggle-button active" type="hidden" id="ReportListSortByStatus" data-sort-by="status" />
				<button class="public-toggle-button" id="ReportListSortByMemId" data-sort-by="memId">신고자명</button>
				<button class="public-toggle-button" id="ReportListSortByTargetName" data-sort-by="plTitle">신고대상명</button>
				<button class="public-toggle-button" id="ReportListSortByRpCreatedAt" data-sort-by="plCreatedAt">신고일시</button>
				<select class="public-toggle-select" id="ReportListSortOrder">
					<option value="asc">오름차순</option>
					<option value="desc">내림차순</option>
				</select>
			</div>
			<div>
				<select class="public-toggle-select" id="ReportListFilter">
					<option value="">상태</option>
					<option value="S03003">승인</option>
					<option value="S03001">접수</option>
					<option value="S03002">반려</option>
				</select>
			</div>
		</div>

		<table id="reportTable">
			<thead>
				<tr>
					<th>신고ID</th>
					<th>신고자명</th>
					<th>신고대상명</th>
					<th>처리상태</th>
					<th>신고일시</th>
				</tr>
			</thead>
			<tbody id="reportList">
				<!-- 데이터가 여기에 채워집니다. -->
			</tbody>
		</table>
		<div class="card-footer clearfix">
			<div class="panel-footer pagination"></div>
		</div>
	</div>
	<div class="template-panel scdMng-2-2">
		<div class="middleTitle">신고 상세 정보</div>
		<div id="penalty-detail-box" class="penalty-detail-view">
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">신고 ID</span>
					<input type="text" id="report-detail-mpId" class="detail-input" readonly>
				</div>
				<div class="detail-item">
					<span class="detail-label">신고 대상 ID</span>
					<input type="text" id="report-detail-targetId" class="detail-input" readonly>
				</div>
			</div>
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">신고 타입</span>
					<input type="text" id="report-detail-mpType" class="detail-input" readonly>
				</div>
				<div class="detail-item">
					<span class="detail-label">신고 대상명</span>
					<input type="text" id="report-detail-targetName" class="detail-input" readonly>
				</div>
			</div>
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">신고자 ID</span>
					<input type="text" id="report-detail-memId" class="detail-input" readonly>
				</div>
				<div class="detail-item">
					<span class="detail-label">신고 상태</span>
					<select id="report-detail-status" class="detail-input-select" disabled>
						<option value="S03001">접수</option>
						<option value="S03002">반려</option>
						<option value="S03003" title="승인은 신규 제제 등록으로 처리바랍니다" disabled>승인</option>
					</select>
				</div>
			</div>
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">신고자명</span>
					<input type="text" id="report-detail-memName" class="detail-input" readonly>
				</div>
				<div class="detail-item">
					<span class="detail-label">신고 일시</span>
					<input type="text" id="report-detail-warnDate" class="detail-input" readonly>
				</div>
			</div>

			<div class="detail-reason-item">
				<span class="detail-label">신고 사유</span>
				<textarea id="report-detail-reason" class="detail-textarea" readonly></textarea>
			</div>

			<div class="detail-item-file">
				<span class="detail-label">증빙 자료</span>
				<a href="#" id="report-detail-file" class="detail-file-link"></a>
			</div>

		</div>
		<button class="btn-save reportModify" id="reportModify">수정</button>
	</div>
</div>
<div class="scdMng-2" style="margin-bottom: 20px;">
	<div class="template-panel scdMng-2-1">
		<div class="middleTitle">제재 이력 목록</div>
		<div class="public-listSearch">
			<button type="button" id="openNewPenaltyModalBtn" class="btn-save" style="background-color: #FA5C7C; margin-right: 20px;">신규 제재 등록</button>
			<select name="statusPenalty" id="">
				<option value="1">전체</option>
				<option value="2">회원명</option>
			</select>
			<input id="searchPenalty" name="keywordPenalty" placeholder="회원명을 입력하세요" />
			<button class="btn-save searchPenaltyBtn">조회</button>
		</div>

		<p class="ptag-list">
			총
			<span id="penaltyList-count"></span>
			건
			<span class="pageCnt" style="padding-left: 10px;">(Page <span id=penaltyListPage></span>/<span id=penaltyListTotalPage></span>)</span>
		</p>
		<div style="display: flex; justify-content: space-between; margin: 10px 0;">

			<div class="btn-group flex gap5 penalListBtnGroup">
				<button class="public-toggle-button"
					id="penaltyListSortByTargetName" data-sort-by="memName">회원명</button>
				<button class="public-toggle-button"
					id="penaltyListSortByRpCreatedAt" data-sort-by="mpWarnDate">제재일시</button>
				<select class="public-toggle-select" id="penaltyListSortOrder">
					<option value="asc">오름차순</option>
					<option value="desc">내림차순</option>
				</select>
			</div>
			<div>
				<select class="public-toggle-select" id="penaltyTypeFilter">
					<option value="">유형</option>
					<option value="G14001">경고</option>
					<option value="G14002">정지</option>
				</select>
			</div>
		</div>
		<table id="penaltyTable">
			<thead>
				<tr>
					<th>이력ID</th>
					<th>회원ID</th>
					<th>회원명</th>
					<th>제재유형</th>
					<th>제재일시</th>
				</tr>
			</thead>
			<tbody id="penaltyList">
			</tbody>
		</table>
		<div class="card-footer clearfix">
			<div class="panel-footer paginationPenalty"></div>
		</div>
	</div>
	<div class="template-panel scdMng-2-2">
		<div class="middleTitle">제재 상세 정보</div>
		<div id="penalty-detail-box" class="penalty-detail-view">
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">이력 ID:</span>
					<input type="text" id="penalty-detail-mpId" class="detail-input" readonly>
				</div>
				<div class="detail-item">
					<span class="detail-label">회원 ID:</span>
					<input type="text" id="penalty-detail-memId" class="detail-input" readonly>
				</div>
			</div>
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">회원명:</span>
					<input type="text" id="penalty-detail-memName" class="detail-input" readonly>
				</div>
				<div class="detail-item">
					<span class="detail-label">제재 유형:</span>
					<select name="penalty-detail-mpType" id="penalty-detail-mpType" class="detail-input-select" disabled>
						<option value="G14001">경고</option>
						<option value="G14002">정지</option>
					</select>
				</div>
			</div>
			<div class="detail-item-group">
				<div class="detail-item">
					<span class="detail-label">제재 일시:</span>
					<input type="text" id="penalty-detail-warnDate" class="detail-input" readonly>
				</div>
				<div class="detail-item" id="memPenaltyStartBox" style="display: none">
					<span class="detail-label">정지 시작일:</span>
					<input type="text" id="penalty-detail-startDate" class="detail-input" readonly>
				</div>
			</div>
			<div class="detail-item-group">
				<div class="detail-item" id="memPenaltyEndBox" style="display: none">
					<span class="detail-label">정지 종료일:</span>
					<input type="text" id="penalty-detail-endDate" class="detail-input"
						readonly>
				</div>
				<div class="detail-item" id="memPenaltyModifyBox" style="justify-content: center; display: none;">
					<input type="button" id="penalty-detail-dateBtn" class="detail-input detail-btn disabled" value="기간선택" style="place-content:center; max-width: 35%;" disabled/>
				</div>
			</div>

			<div class="detail-reason-item">
				<span class="detail-label">제재 사유:</span>
				<textarea id="penalty-detail-reason" class="detail-textarea" readonly></textarea>
			</div>

			<div class="detail-item-file" id="penaltyFileBox">
				<span class="detail-label">제재 증빙자료:</span>
				<a href="#" id="penalty-detail-file" class="detail-file-link"></a>
			</div>
		</div>
		<div class="penalty-modify-group">
			<button class="btn-save penaltyModify" id="penaltyReset">초기화</button>
			<button class="btn-save penaltyModify" id="penaltyCancel">제재취소</button>
			<button class="btn-save penaltyModify" id="penaltyModify">수정</button>
		</div>
	</div>
</div>

<div id="penaltyModal" class="penalty-modal-overlay" style="display: none;">
	<input type="hidden" style="display: none;" id="hiddenCalInput"/>
	<div class="penalty-modal-content">
		<h3>신규 제재 등록</h3>
		<div style="margin-bottom: 1rem;">
			<label>대상 신고 ID</label>
			<select type="text" id="modalMemId" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></select>
		</div>
		<div style="margin-bottom: 1rem;">
			<label>제재 유형</label>
			<div class="penalty-btn-group">
				<input type="hidden" id="penaltyStart" />
				<input type="hidden" id="penaltyEnd" />
				<div id="modalPenaltyType">
					<span class="penalty-type-label" data-type="G14001">경고</span>
					<span class="penalty-type-label" data-type="G14002">정지</span>
				</div>
			    <div id="penaltyPeriod" class="penalty-period" role="status" aria-live="polite" hidden>
				    <span id="penaltyPeriodRange" class="penalty-period__range"></span>
				    <span class="penalty-period__dot">·</span>
				    <span id="penaltyPeriodDays" class="penalty-period__days"></span>
			    </div>
		    </div>

		</div>
		<div id="suspensionFields" style="display: none; margin-bottom: 1rem;">
			<label>정지 기간</label>
			<input type="datetime-local" id="modalStartDate">
			~
			<input type="datetime-local" id="modalEndDate">
		</div>
		<div style="margin-bottom: 1rem;">
			<label>제재 사유</label>
			<select id="modalReason" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
				<option value="부적절한 게시물" selected>부적절한 게시물</option>
				<option value="욕설 및 비방">욕설 및 비방</option>
				<option value="혐오 및 차별적 표현">혐오 및 차별적 표현</option>
				<option value="폭력적, 위협적 내용">폭력적, 위협적 내용</option>
				<option value="허위 사실 유포">허위 사실 유포</option>
				<option value="스팸 및 광고">스팸 및 광고</option>
				<option value="불법적 홍보">불법적 홍보</option>
				<option value="타인에게 불쾌감을 주는 행위">타인에게 불쾌감을 주는 행위</option>
				<option value="커뮤니티 이용 방해">커뮤니티 이용 방해</option>
				<option value="기타 운영 정책 위반">기타 운영 정책 위반</option>
			</select>
		</div>
		<div class="modal-form-group">
			<label>증빙 자료</label>
			<input type="file" id="evidenceFile" multiple style="display: none;">
			<button type="button" class="file-attach-btn" onclick="document.getElementById('evidenceFile').click();">파일 선택</button>
			<div id="file-list"></div>
		</div>
		<div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #eee; text-align: right;">
			<div>
				<button id="confirmBtn" class="btn-save">확인</button>
				<button id="cancelBtn" class="btn-save">취소</button>
			</div>
		</div>
	</div>
</div>



