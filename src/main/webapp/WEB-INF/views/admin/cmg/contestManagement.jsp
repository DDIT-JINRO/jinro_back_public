<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="css/admin/cmg/contestManagement.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<script src="/js/include/admin/cmg/contestManagement.js"></script>
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<div class="flex">
	<h2 class="topTitle">컨텐츠 관리</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">공모전 관리</h2>
</div>
<body>
	<div class="admin-actMng-1" style="margin-bottom: 20px;">
		<div class="template-panel admin-actMng-1-1">
			<div class="middleTitle flex act-mng-category-header">공모전 리스트</div>
			<div class="filter-box">
				<input type="text" name="keyword" placeholder="제목으로 검색" />
				<button type="button" class="btn-save" id="btnSearch">조회</button>
			</div>
			<div class="listEnt">
				<div class="search-filter-bar">
					<p class="ptag-list" style="margin-bottom: 10px">
						총
						<span id="cctList-count"></span>
						건
						<span class="pageCnt" style="padding-left: 10px"> (Page <span id=cctListPage></span>/<span id=cctListTotalPage></span>)</span>	
					</p>
				</div>
				<div class="listEntBody">
					<table id="entTable">
						<thead>
							<tr>
								<th class="body-id">ID</th>
								<th class="body-act-name">공모전명</th>
								<th class="body-act-createAt">등록일</th>
								<th class="body-act-host">주최</th>
							</tr>
						</thead>
						<tbody id="cctList">
						</tbody>
					</table>
				</div>
			</div>
			<div class="card-footer clearfix">
				<div class="panel-footer pagination cctListPage"></div>
			</div>
		</div>

		<div>
			<div class="template-panel">
				<div class="act-profile-container">
					<div class="profile-card">
						<img id="cctImg" src="/images/cp31logo.png" alt="기업 로고" class="profile-logo">
						<h3 id="actName" class="profile-name">공모전명</h3>

						<div class="profile-about">
							<h4>ABOUT</h4>
						</div>

						<div class="profile-info">
							<p><strong>주최사 : </strong> <span id="contestHostProfile">-</span></p>
							<p><strong>주관 : </strong> <span id="contestOrganizerProfile">-</span></p>
							<p><strong>일자 : </strong> <span id="contestDate">-</span></p>
						</div>
					</div>
				</div>
			</div>
			<div class="template-panel entAbout" style="margin-top: 20px;">
				<div class="middleTitle" style="margin-bottom: 10px;">공모전 설명</div>
				<textarea id="cctDetailAbout"></textarea>
			</div>
		</div>
	</div>

	<div class="template-panel admin-actMng-2">
		<div class="middleTitle">공모전 등록/수정</div>
		<p class="form-subtitle">따끈따끈한 공모전 소식, 가장 먼저 알려주세요.</p>

		<div class="form-row">
			<div class="form-input-section">
				<div class="input-group">
					<label for="contestTitle">공모전명</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" class="contest-form-input" id="contestTitle" placeholder="예) 2025년 커리어패스배 공모전">
					</div>
				</div>

				<div class="location-group">
					<label>공모전 분류</label>
					<div class="input-with-icon">
						<i class="fas fa-expand"></i> <select class="coords-select-group contest-form-input" id="contestType">
						</select>
					</div>
				</div>

				<div class="location-group">
					<label>대상</label>
					<div class="input-with-icon">
						<i class="fas fa-expand"></i> <select class="coords-select-group contest-form-input" id="contestTarget">
							<option value="G34001">전체</option>
							<option value="G34002">청소년</option>
							<option value="G34003">청년</option>
						</select>
					</div>
				</div>

				<div class="input-group">
					<label for="applicationMethod">접수 방법</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" class="contest-form-input" id="applicationMethod" placeholder="예) 홈페이지 접수">
					</div>
				</div>

				<div class="input-group">
					<label for="awardType">시상 종류</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" class="contest-form-input" id="awardType" placeholder="예) OO 시장상">
					</div>
				</div>

				<div class="input-group">
					<label for="contestUrl">홈페이지 URL</label>
					<div class="input-with-icon">
						<i class="fas fa-globe"></i>
						<input type="text" class="contest-form-input" id="contestUrl" placeholder="예) https://www.careerpath.store">
					</div>
				</div>

				<div class="input-group">
					<label for="contestHost">주최사</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" class="contest-form-input" id="contestHost" placeholder="예) (주)커리어패스">
					</div>
				</div>

				<div class="input-group">
					<label for="contestSponsor">후원사</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" class="contest-form-input" id="contestSponsor" placeholder="예) 고용노동부, 일자리경제진흥원">
					</div>
				</div>

				<div class="input-group">
					<label for="contestOrganizer">주관</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" class="contest-form-input" id="contestOrganizer" placeholder="예) 커리어패스 공모전 운영사무국">
					</div>
				</div>

				<div class="flex" style="gap: 20px">
					<div class="input-group">
						<label for="contestStartDate">시작일</label>
						<div class="input-with-icon">
							<i class="fas fa-building"></i>
							<input type="date" class="contest-form-input" id="contestStartDate">
						</div>
					</div>
					<div class="input-group">
						<label for="contestEndDate">종료일</label>
						<div class="input-with-icon">
							<i class="fas fa-building"></i>
							<input type="date" class="contest-form-input" id="contestEndDate">
						</div>
					</div>
				</div>

				<div class="form-textarea-section">
					<div class="input-group">
						<label for="contestDescription">공모전에 대한 설명</label>
						<textarea id="contestDescription" class="contest-form-input" placeholder="공모전의 취지, 참가 자격, 심사 기준, 유의사항 등 상세한 내용을 작성해주세요."></textarea>
					</div>
				</div>

				<div class="flex" style="flex-direction: row-reverse; gap: 20px;">
					<div class="form-actions">
						<button type="button" id="btnRegister" class="btn-primary">저장</button>
					</div>
					<div class="form-actions">
						<button type="button" id="btnReset" class="btn-warning">초기화</button>
					</div>
					<div class="form-actions">
						<button type="button" id="btnDelete" class="btn-warning">삭제</button>
					</div>
				</div>
			</div>

			<div class="form-image-section">
				<div class="input-group">
					<label for="contestId">ID</label>
					<input type="text" id="contestId" readonly="readonly">
				</div>
				<div class="image-upload-box" id="imageUploadBox">
					<i class="fas fa-camera"></i>
					<p style="margin-top: 0;">공모전 포스터 이미지를 업로드하세요</p>
					<input type="file" id="cctImgFile" accept="image/*" class="file-input">
					<img id="cctImgPreview" src="" alt="로고 미리보기" style="display: none;">
				</div>

				<div class="image-upload-controls">
					<button type="button" id="btnChangeImg" class="btn-secondary">변경</button>
				</div>
			</div>
		</div>
	</div>
</body>