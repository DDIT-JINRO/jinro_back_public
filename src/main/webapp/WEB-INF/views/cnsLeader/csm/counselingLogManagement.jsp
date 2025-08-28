<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/cnsLeader/csm/counselingLogManagement.css">
<!-- 스크립트 작성해주시면 됩니다 (유의점 : DOMContentLoaded x) -->
<script>
</script>
<!-- 제목입니다 -->
<h3>상담일지 관리</h3>
<div class="template-container">
	<!-- 리스트 패널 -->
	<div class="template-panel" style="flex: 1.2">
		<div class="panel-header" id="noticeHeader" style="cursor: pointer; text-decoration: none">일지접수내역</div>

		<!-- 리스트 패널 상단: 필터 영역 -->
		<div class="filter-box">
			<form>
				<select name="year">
				    <option value="">전체기간</option>
				    <option value="2025">2025</option>
				    <!-- … -->
				 </select>
				<select name="status">
				    <option value="mem">회원명</option>
				    <option value="counselor">상담사명</option>
				    <!-- … -->
				 </select>
  		 		  <input type="text" name="keyword" placeholder="회원명을 입력하세요" />
 				  <button type="button" class="btn-save" onclick="fetchCounselingLog(1)">조회</button>
			</form>
		</div>
		<p>
			총 <span id="notice-count"></span>건
		</p>
		<div class="table-wrapper">
			<table>
				<colgroup>
					<col style="width: 10%;">
					<col style="width: 15%;">
					<col style="width: 30%;">
					<col style="width: 15%;">
					<col style="width: 15%;">
					<col style="width: 15%;">
				</colgroup>
				<thead>
					<tr>
						<th>번 호</th>
						<th>회원명</th>
						<th>연락처</th>
						<th>상담목적</th>
						<th>상담사</th>
						<th>상 태</th>
					</tr>
				</thead>
				<tbody id="notice-list">
					<!-- Java 백엔드 렌더링용 -->
				</tbody>
			</table>
		</div>

			<!-- 페이지네이션 자리 -->
			<div class="card-footer clearfix">
				 <div class="panel-footer pagination">

				</div>
			</div>
	</div>

	<!-- 상세/작성 패널 -->
	<div class="template-panel" style="flex: 1.7">
		<div class="panel-header">상담일지 상세정보</div>
		<h3>상담기본 정보</h3>
		<table class="info-table" style="">
			<thead id="info-table-thead">
				<tr>
					<th>번호</th>
					<th>회원명</th>
					<th>성별</th>
					<th>나이</th>
					<th>상담수단</th>
					<th>상담 난이도</th>
					<th>추가 상담여부</th>
					<th>작성(수정)일</th>
					<th>상담사</th>
					<th>상태</th>
				</tr>
			</thead>
			<tbody id="info-table-tbody">
				<tr>
		          <td colspan="9">선택된 정보가 없습니다</td>
		        </tr>
			</tbody>
		</table>
		<h3>상담일지 작성</h3>
		<form class="noticeFormGroup" id="form-data" enctype="multipart/form-data">
			<div>
				<label>제 목</label>
				<input type="text" name="clTitle" disabled>
			</div>

			<input type="hidden" name="fileGroupId" id="fileGroupId" />
			<input type="hidden" name="clIdx" id="counselLogId" value="0" />
			<input type="hidden" name="counselId" id="counselId" value="0" />
			<div class="ck-row cl-content">
			  <label>일 지</label>
  			  <div class="ck-editor">
			    <!-- CKEditor가 여기에 mount됨 -->
			    <textarea name="clContent" id="clContent"></textarea>
			  </div>
			</div>
			<div class="ck-row cl-etc">
			  <label>비 고<br/>(반려사유)</label>
  			  <div class="ck-editor">
			    <!--반려사유용 CKEditor가 여기에 mount됨 -->
			    <textarea name="etcContent" id="etcContent"></textarea>
			  </div>
			</div>

			<!-- 기존에 업로드된 파일을 뿌릴 곳 -->
			<div class="noticeFormGroup" id="file" style="display: none;">
				<div style="float:left;">
					<label>기존 첨부파일</label>
				</div>
				<div id="existing-files" class="existing-files">

				</div>
			</div>

		</form>
			<div class="panel-footer button-group">
				<button type="button" onclick="resetAfterConfirm()" class="btn btn-reset">초기화</button>
				<button  type="button" onclick="updateConfirmation('reject')" class="btn btn-save"  id="btn-save">반려</button>
				<button  type="button" onclick="updateConfirmation('confirm')" class="btn btn-confirm"  id="btn-confirm">승인</button>
			</div>
	</div>
</div>
<script type="text/javascript" src="/js/include/cnsLeader/csm/counselingLogManagement.js"></script>