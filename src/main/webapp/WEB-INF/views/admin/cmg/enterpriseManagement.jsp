<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="css/admin/cmg/enterpriseManagement.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
<script src="/js/include/admin/cmg/enterpriseManagement.js"></script>
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<div class="flex">
	<h2 class="topTitle">컨텐츠 관리</h2>
	<div class="breadcrumb-item"></div>
	<h2 class="topTitle">기업 관리</h2>
</div>
<body>
	<div class="admin-EntMng-1" style="margin-bottom: 20px;">
		<div class="template-panel admin-entMng-1-1">
			<div class="middleTitle">기업 리스트</div>
			<div class="filter-box">
				<select name="status">
					<option value="1">전체</option>
					<option value="2">기업명</option>
					<option value="3">지역명</option>
				</select>
				<input type="text" name="keyword" placeholder="기업명으로 검색" />
				<button type="button" class="btn-save" id="btnSearch">조회</button>
			</div>
			<div class="listEnt">
				<div class="search-filter-bar">
					<p class="ptag-list" style="margin-bottom: 10px">
						총
						<span id="entList-count"></span>
						건
						<span class="pageCnt" style="padding-left:10px"> (Page <span id=entListPage></span>/<span id=entListTotalPage></span>)</span>	
					</p>
				</div>
				<div class="listEntBody">
					<table id="entTable">
						<thead>
							<tr>
								<th class="body-id">ID</th>
								<th class="body-entImg">기업이미지</th>
								<th class="body-entName">기업명</th>
								<th class="body-region">지역</th>
							</tr>
						</thead>
						<tbody id="entList">
						</tbody>
					</table>
				</div>
			</div>
			<div class="card-footer clearfix">
				<div class="panel-footer pagination entListPage"></div>
			</div>
		</div>

		<div>
			<div class="entDetail-container">
				<div class="ent-profile-container">
					<div class="ent-profile-left">
						<div class="profile-card">
							<img id="entLogo" src="/images/cp31logo.png" alt="기업 로고" class="profile-logo">
							<h3 id="entName" class="profile-name">CareerPath</h3>
							<p id="entRole" class="profile-role">South Korea / 대한민국</p>

							<div class="profile-actions">
								<div id="gubun" class="btn-follow">G30UNK</div>
								<div id="gubunName" class="btn-message">미지정</div>
							</div>

							<div class="profile-about">
								<h4>ABOUT</h4>
							</div>

							<div class="profile-info">
								<p><strong>기업ID:</strong> <span id="entId">-</span></p>
								<p><strong>기업명:</strong> <span id="entName2">커리어패스</span></p>
								<p><strong>주소:</strong> <span id="entAddress">대전광역시 유성구 대학로 91</span></p>
							</div>


						</div>
					</div>

					<div>
						<div class="ent-profile-right" style="margin-bottom: 20px;">
							<div>
								<div class="tab-menu">
									<button class="tab-btn active" data-tab="about">About</button>
									<button class="tab-btn" data-tab="timeline">Timeline</button>
								</div>
								<div class="tab-content active" id="about">
									<div class="profile-social">
										<a id="companyWebsiteLink" href="careerpath.store" target="_blank">
											<i class="fas fa-link"></i>&nbsp;&nbsp;&nbsp; URL Link
										</a>
									</div>
								</div>

								<div class="tab-content" id="timeline">
									<h4>연혁</h4>
									<p>-</p>
								</div>

							</div>
						</div>
						<div class="template-panel"></div>
					</div>
				</div>
			</div>
			<div class="template-panel entAbout" style="margin-top: 20px;">
				<div class="middleTitle" style="margin-bottom: 10px;">기업 설명</div>
				<textarea id="entDetailAbout"></textarea>
			</div>
		</div>
	</div>

	<div class="template-panel admin-entMng-2">
		<div class="middleTitle">기업 등록/수정</div>

		<p class="form-subtitle">새로운 기업 정보를 등록하여 다양한 인재를 만나보세요.</p>

		<div class="form-row">
			<div class="form-input-section">
				<div class="input-group">
					<label for="cpName">기업명</label>
					<div class="input-with-icon">
						<i class="fas fa-building"></i>
						<input type="text" id="cpName" placeholder="예) 커리어패스 주식회사">
					</div>
				</div>
				<div class="input-group">
					<label for="cpWebsite">홈페이지 URL</label>
					<div class="input-with-icon">
						<i class="fas fa-globe"></i>
						<input type="text" id="cpWebsite" placeholder="예) https://www.careerpath.store">
					</div>
				</div>
				<div class="input-group">
					<label for="cpImgUrl">이미지 URL</label>
					<div class="input-with-icon">
						<i class="fas fa-globe"></i>
						<input type="text" id="cpImgUrl" placeholder="예) https://www.careerpath.store">
					</div>
				</div>

				<div class="input-group">
					<label for="postcode">주소</label>
					<div class="address-search-group">
						<div class="input-with-icon">
							<i class="fas fa-map-marked-alt"></i>
							<input type="text" id="postcode" placeholder="우편번호" readonly>
						</div>
						<button type="button" id="btnPostcodeSearch" class="btn-secondary" onclick="execDaumPostcode()">
							<i class="fas fa-search"></i> 찾기
						</button>
						<div class="input-with-icon">
							<i class="fas fa-home"></i>
							<input type="text" id="jibunAddress" placeholder="지번주소" readonly>
						</div>
					</div>
				</div>
				<div class="location-group">
					<label>기업 규모</label>
					<div class="input-with-icon">
						<i class="fas fa-expand"></i> <select class="coords-select-group" id="cpSclae">
							<option value="G30002">공공기관</option>
							<option value="G30003">중견기업</option>
							<option value="G30004">공기업</option>
							<option value="G30005">대기업</option>
							<option value="G30006">강소기업</option>
							<option value='G30UNK'>미지정</option>
						</select>
					</div>
				</div>
				<div class="input-group">
					<label for="cpBusinessNo">사업자 등록번호</label>
					<div class="input-with-icon">
						<i class="fas fa-id-card"></i>
						<input type="text" id="cpBusinessNo" placeholder="예) 123-45-67890">
					</div>
				</div>
				<div class="flex" style="flex-direction: row-reverse; gap: 20px;">
					<div class="form-actions">
						<button type="button" id="btnRegister" class="btn-primary">저장</button>
					</div>
					<div class="form-actions">
						<button type="button" id="btnReset" class="btn-warning">초기화</button>
					</div>
				</div>
			</div>

			<div class="form-image-section">
				<div class="input-group">
					<label for="cpNoOn">ID</label>
					<input type="text" id="cpNoOn" readonly="readonly">
				</div>
				<div class="image-upload-box" id="imageUploadBox">
					<i class="fas fa-camera"></i>
					<p style="margin-top: 0;">기업 로고를 업로드하세요</p>
					<input type="file" id="cpLogoFile" accept="image/*" class="file-input">
					<img id="cpLogoPreview" src="" alt="로고 미리보기" style="display: none;">
				</div>


				<div class="image-upload-controls">
					<button type="button" id="btnChangeLogo" class="btn-secondary">변경</button>
				</div>

				<div class="form-textarea-section">
					<div class="input-group">
						<label for="cpDescription">기업에 대한 설명</label>
						<textarea id="cpDescription" placeholder="기업의 비전, 주요 사업, 문화 등 자세한 설명을 작성해주세요."></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>