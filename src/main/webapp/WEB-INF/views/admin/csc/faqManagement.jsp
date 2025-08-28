<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<link rel="stylesheet" href="/css/csc/faq/adminFaq.css">
<div class="flex">
	<h2 class="topTitle">고객센터</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">FAQ</h2>
</div>
<div class="template-container">
	<!-- 리스트 패널 -->
	<div class="template-panel" style="flex: 1.2">
		<div class="middleTitle" id="faqHeader" style="cursor: pointer; text-decoration: none">FAQ</div>

		<!-- 리스트 패널 상단: 필터 영역 -->
		<div class="filter-box">
			<form action="/csc/faq/admin/faqList.do" method="get">
				<select name="status">
					<option value="2025">2025</option>
					<!-- … -->
				</select>
				<input type="text" name="keyword" placeholder="검색어를 입력하세요" />
				<button type="button" class="btn-save">조회</button>
			</form>
		</div>


		<p>총 <span id="faq-count"></span>건
		</p>
		<div class="table-wrapper">
			<table>
				<colgroup>
					<col style="width: 20%;">
					<col style="width: 50%;">
					<col style="width: 30%;">
				</colgroup>
				<thead>
					<tr>
						<th>번 호</th>
						<th>제 목</th>
						<th>생성일(수정일)</th>
					</tr>
				</thead>
				<tbody id="faq-list">
					<!-- Java 백엔드 렌더링용 -->
				</tbody>
			</table>
		</div>

		<div style="margin-top: 10px; text-align: center;">
			<!-- 페이지네이션 자리 -->
			<div class="card-footer clearfix">
				<div class="panel-footer pagination"></div>
			</div>
		</div>
	</div>

	<!-- 상세/작성 패널 -->
	<div class="template-panel" style="flex: 1.5">
		<div class="middleTitle">FAQ 등록 / 수정</div>
		<table class="info-table" style="display: none;">
			<thead id="info-table-thead">
				<tr>
					<th>번 호</th>
					<th>제 목</th>
					<th>생성일(수정일)</th>
				</tr>
			</thead>
			<tbody id="info-table-tbody">

			</tbody>
		</table>

		<form class="faqFormGroup" id="form-data" enctype="multipart/form-data">
			<div>
				<label>제 목</label>
				<input type="text" name="faqTitle" placeholder="제목을 입력하세요" />
			</div>

			<input type="hidden" name="fileGroupNo" id="fileGroupNo" />
			<input type="hidden" name="faqId" id="faqId" value="0" />
			<div class="ck-row">
				<label>내용</label>
				<div class="ck-editor">
					<!-- CKEditor가 여기에 mount됨 -->
					<textarea name="faqContent" id="faqContent"></textarea>
				</div>
			</div>

			<div class="faqFormGroup">
				<label for="faqFileInput">첨부 파일</label>
				<input id="faqFileInput" type="file" name="files" multiple />
			</div>
			<!-- 기존에 업로드된 파일을 뿌릴 곳 -->
			<div class="faqFormGroup" id="file" style="display: none;">
				<div style="float: left;">
					<label>기존 첨부파일</label>
				</div>
				<div id="existing-files" class="existing-files"></div>
			</div>

			<div class="panel-footer button-group">
				<button type="button" class="btn btn-delete" style="display: none;" onclick="deleteFaq()" id="btn-delete">삭제</button>
				<button type="button" onclick="resetDetail()" class="btn btn-reset">초기화</button>
				<button type="button" onclick="insertOrUpdate()" class="btn btn-save" id="btn-save">등록</button>
			</div>
		</form>
	</div>
</div>
<script type="text/javascript" src="/js/csc/faq/adminFaqList.js"></script>

