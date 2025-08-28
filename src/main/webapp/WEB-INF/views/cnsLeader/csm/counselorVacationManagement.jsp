<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/cnsLeader/csm/counselorVacationManagement.css">
<!-- 스크립트 작성해주시면 됩니다 (유의점 : DOMContentLoaded x) -->
<script>
</script>
<!-- 제목입니다 -->
<h3>연차/휴가 관리</h3>
<div class="template-container">
	<!-- 리스트 패널 -->
	<div class="template-panel" style="flex: 1.2">
		<div class="panel-header" id="noticeHeader" style="cursor: pointer; text-decoration: none">휴가신청내역</div>

		<!-- 리스트 패널 상단: 필터 영역 -->
		<div class="filter-box vacSearch" >
			<form>
				<select name="status">
				    <option value="counselor">상담사명</option>
				    <!-- … -->
				 </select>
  		 		 <input type="text" name="keyword" placeholder="상담사명을 입력하세요" />
 				 <button type="button" class="btn-save" id="btn-search">조회</button>
			</form>
		</div>
		<div class="filter-box vacRadio">
			<p>상태필터</p>
			전체<input type="radio" name="filter" value="" checked />
			접수<input type="radio" name="filter" value="S03001"/>
			승인<input type="radio" name="filter" value="S03003"/>
			반려<input type="radio" name="filter" value="S03002"/>
		</div>
		<p>
			총 <span id="notice-count"></span>건
		</p>
		<div class="table-wrapper">
			<table>
				<colgroup>
					<col style="width: 8%;">
					<col style="width: 12%;">
					<col style="width: 18%;">
					<col style="width: 15%;">
					<col style="width: 15%;">
					<col style="width: 20%;">
					<col style="width: 12%;">
				</colgroup>
				<thead>
					<tr>
						<th>번 호</th>
						<th>상담사명</th>
						<th>연락처</th>
						<th>신청일</th>
						<th>시작일</th>
						<th>종료일</th>
						<th>상태</th>
					</tr>
				</thead>
				<tbody id="notice-list">
					<!-- Java 백엔드 렌더링용 -->
				</tbody>
			</table>
		</div>

		<div style="margin-top: 10px; text-align: center;">
			<!-- 페이지네이션 자리 -->
			<div class="card-footer clearfix">
				 <div class="panel-footer pagination">

				</div>
			</div>
		</div>
	</div>

	<!-- 상세/작성 패널 -->
	<div class="template-panel" style="flex: 1.5">
		<div class="panel-header">신청내역 상세정보</div>
		<h3>휴가 신청정보</h3>
		<table class="info-table" style="">
			<thead id="info-table-thead">
				<tr>
					<th>번호</th>
					<th>상담사명</th>
					<th>연락처</th>
					<th>신청일</th>
					<th>휴가시작일</th>
					<th>휴가종료일</th>
					<th>상태</th>
				</tr>
			</thead>
			<tbody id="info-table-tbody">
				<tr>
		          <td colspan="9">선택된 정보가 없습니다</td>
		        </tr>
			</tbody>
		</table>
		<h3>휴가 사유</h3>
		<form class="noticeFormGroup" id="form-data" enctype="multipart/form-data">
			<input type="hidden" name="fileGroupId" id="fileGroupId" />
			<input type="hidden" name="vaId" id="vaId" value="0" />
			<div class="ck-row cl-content">
			  <label>사 유</label>
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

			<div class="panel-footer button-group">
				<button type="button" onclick="resetAfterConfirm()" class="btn btn-reset">초기화</button>
				<button  type="button" onclick="updateConfirmation('reject')" class="btn btn-save"  id="btn-save">반려</button>
				<button  type="button" onclick="updateConfirmation('confirm')" class="btn btn-confirm"  id="btn-confirm">승인</button>
			</div>
		</form>
	</div>
</div>

<script type="text/javascript" src="/js/include/cnsLeader/csm/counselorVacationManagement.js"></script>