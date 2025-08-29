<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<link rel="stylesheet" href="/css/csc/inq/adminInq.css">
<div class="flex">
	<h2 class="topTitle">고객센터</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">1:1 문의</h2>
</div>
<div class="template-container">
	<div class="template-panel" style="flex: 1.2">
		<div class="middleTitle" id="inqHeader" style="cursor: pointer; text-decoration: none">1:1문의</div>

		<div class="filter-box">
			<form id="searchFrm">
				<select name="status">
				    <option value="2025">2025</option>
				    </select>
  		 		  <input type="text" name="keyword" placeholder="검색어를 입력하세요" />
 				  <button type="button" class="btn-save">조회</button>
			</form>
		</div>


		<p>
			총 <span id="inq-count"></span>건
		</p>
		<div class="table-wrapper">
			<table>
				<colgroup>
					<col style="width: 10%;">
					<col style="width: 40%;">
					<col style="width: 15%;">
					<col style="width: 20%;">
					<col style="width: 15%;">
				</colgroup>
				<thead>
					<tr>
						<th>번 호</th>
						<th>제 목</th>
						<th>공개여부</th>
						<th>생성일</th>
						<th>답변 여부</th>
					</tr>
				</thead>
				<tbody id="inq-list" >
					</tbody>
			</table>
		</div>

		<div style="margin-top: 10px; text-align: center;">
			<div class="card-footer clearfix">
				 <div class="panel-footer pagination inquiryListPagenation">

				</div>
			</div>
		</div>
	</div>

	<div class="template-panel" style="flex: 1.5">
		<div class="middleTitle">1:1문의 답변</div>
		<h3>1:1문의 기본정보</h3>
		<table class="info-table" style="display: none;">
			<thead id="info-table-thead">
				<tr>
					<th>번 호</th>
					<th>제 목</th>
					<th>공개여부</th>
					<th>생성일</th>
				</tr>
			</thead>
			<tbody id="info-table-tbody">

			</tbody>
		</table>

		<form class="inqFormGroup" id="form-data" enctype="multipart/form-data">
			<div>
				<label>제 목</label>
				<input type="text" name="inqTitle" placeholder="제목을 입력하세요" readonly />
			</div>

			<input type="hidden" name="inqId" id="inqId" value="0"/>
			<div class="ck-row">
			  <label>내용</label>
			  <textarea name="inqContent" id="txtInqContent" disabled="disabled"></textarea>
			</div>
			<div class="ck-row">
			  <label>답변</label>
			  <textarea name="inqAnswer" id="txtInqAnswer"></textarea>
			</div>

			<div class="panel-footer button-group">
				<button type="button" onclick="resetDetail()" class="btn btn-reset">초기화</button>
				<button  type="button" onclick="insertAnswer()" class="btn btn-save"  id="btn-save">등록</button>
			</div>
		</form>
	</div>
</div>
<script type="text/javascript" src="/js/csc/inq/adminInqList.js"></script>