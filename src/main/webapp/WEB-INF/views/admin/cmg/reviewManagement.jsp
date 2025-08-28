<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script src="/js/include/admin/cmg/reviewManagement.js"></script>
<link rel="stylesheet" href="/css/admin/cmg/reviewManagement.css">
<link rel="stylesheet" href="css/admin/umg/sanctionsDescription.css">
<div class="flex">
	<h2 class="topTitle">컨텐츠 관리</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">후기 관리</h2>
</div>
<body>
	<div class="review-management-card-wrapper flex gap">
		<div class="template-panel review-card review-card-left">
			<div class="middleTitle">후기 목록</div>

			<div class="public-listSearch">
				<select name="status">
					<option value="">전체</option>
					<option value="target">면접처</option>
					<option value="content">내용</option>
					<option value="writer">작성자</option>
				</select>

				<input id="search" name="keyword" placeholder="검색어를 입력하세요">
				<button class="btn-save searchReportBtn">조회</button>
			</div>

			<p class="ptag-list">
				총 <span id="reviewList-count"></span> 건
				<span class="pageCnt" style="padding-left: 10px"> (Page <span id=reviewListPage></span>/<span id=reviewListTotalPage></span>)</span>	
			</p>

			<div style="display: flex; justify-content: space-between; margin: 10px 0;">
				<div class="btn-group flex gap5 reviewListBtnGroup">
					<button class="public-toggle-button active sort-button" data-sort-by="irId">리뷰번호</button>
					<button class="public-toggle-button sort-button" data-sort-by="irCreatedAt">작성일</button>
					<button class="public-toggle-button sort-button" data-sort-by="irStatus">상태</button>
					<select class="public-toggle-select" name="order">
						<option value="desc">내림차순</option>
						<option value="asc">오름차순</option>
					</select>
				</div>

				<div>
					<select class="public-toggle-select" name="irStatus">
						<option value="">상태</option>
						<option value="">등록</option>
						<option value="">신청</option>
						<option value="">삭제</option>
						<option value="">반려</option>
					</select>
				</div>
			</div>

			<table id="reviewListTable">
				<thead>
					<tr>
						<th class="reviewNo">후기번호</th>
						<th class="reviewAuthor">작성자</th>
						<th class="reviewGubun">구분</th>
						<th class="reviewDivision">지원처</th>
						<th class="reviewField">지원분야</th>
						<th class="reviewStatus">상태</th>
						<th class="reviewDate">작성일</th>
					</tr>
				</thead>
				<tbody id="reviewList">
				</tbody>
			</table>
			<div class="card-footer clearfix">
				<div class="panel-footer pagination reviewListPageination"></div>
			</div>
		</div>
		<div class="template-panel review-card review-card-right">
			<div class="middleTitle">후기 상세 정보</div>
			<div id="review-detail-box" class="penalty-detail-view">
				<div class="detail-item-group">
					<div class="detail-item">
						<span class="detail-label">후기번호</span>
						<input type="text" id="review-detail-irId" class="detail-input" readonly="">
					</div>
					<div class="detail-item">
						<span class="detail-label">작성자</span>
						<input type="text" id="review-detail-memName" class="detail-input" readonly="">
					</div>
				</div>
				<div class="detail-item-group">
					<div class="detail-item">
						<span class="detail-label">지원처</span>
						<input type="text" id="review-detail-targetName" class="detail-input" readonly="">
					</div>
					<div class="detail-item">
						<span class="detail-label">지원분야</span>
						<input type="text" id="review-detail-application" class="detail-input" readonly="">
					</div>
				</div>
				<div class="detail-item-group">
					<div class="detail-item">
						<span class="detail-label">면접일</span>
						<input type="text" id="review-detail-interviewAt" class="detail-input" readonly="">
					</div>
					<div class="detail-item">
						<span class="detail-label">구분</span>
						<input type="text" id="review-detail-irType" class="detail-input" readonly="" data-ir-type="">
					</div>
				</div>
				<div class="detail-item-group">
					<div class="detail-item">
						<span class="detail-label">상태</span>
						<input type="text" id="review-detail-status-text" class="detail-input" readonly="">
						<select id="review-detail-status-select" class="detail-input-select">
							<option value="S06001">등록</option>
							<option value="S06002">신청</option>
							<option value="S06003">삭제</option>
							<option value="S06004">반려</option>
						</select>
					</div>
				</div>
				<div class="detail-item-group">
					<div class="detail-item">
						<span class="detail-label">후기 수정일</span>
						<input type="text" id="review-detail-modAt" class="detail-input" readonly="">
					</div>
					<div class="detail-item">
						<span class="detail-label">후기 작성일</span>
						<input type="text" id="review-detail-createdAt" class="detail-input" readonly="">
					</div>
				</div>

				<div class="detail-reason-item">
					<span class="detail-label">후기 내용</span>
					<textarea id="review-detail-content" class="detail-textarea" readonly=""></textarea>
				</div>

				<div class="detail-reason-item" id="reject-reason-container" style="display: none;">
					<span class="detail-label">반려 사유</span>
					<textarea id="review-detail-reject-reason" class="detail-textarea"></textarea>
				</div>

				<div class="detail-item-file">
					<span class="detail-label">증빙 자료</span>
					<a href="#" id="review-detail-file-link" class="detail-file-link">-</a>
				</div>
			</div>
			<button class="btn-save reportModify" id="review-modify-button">수정</button>
		</div>
	</div>
</body>
