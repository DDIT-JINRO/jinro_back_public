<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/cdp/rsm/rsm/resumeWriter.css">
<section class="channel personalHistory">
	<div class="channel-title">
		<div class="channel-title-text">경력관리</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-itemIn">
			<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/sint/qestnlst/questionList.do">자기소개서</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do">모의면접</a>
		</div>
		<div class="channel-sub-section-item">
			<a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do">AI 피드백</a>
		</div>
	</div>
</section>
<div class="breadcrumb-container-space">
	<nav class="breadcrumb-container" aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item">
				<a href="/">
					<i class="fa-solid fa-house"></i> 홈
				</a>
			</li>
			<li class="breadcrumb-item">
				<a href="/cdp/rsm/rsm/resumeList.do">경력 관리</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			</li>
		</ol>
	</nav>
</div>
<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/cdp/rsm/rsm/resumeList.do">이력서</a>
			<a class="tab" href="/cdp/rsm/rsmb/resumeBoardList.do">이력서 템플릿 게시판</a>
		</div>
		<div class="public-wrapper-main">
			<section class="personal-info-section">
				<div class="resume-title">
					<label for="name">
						제목
						<span class="required-asterisk">*</span>
					</label>
					<input type="text" name="resumeTitle" id="resumeTitle" placeholder="제목을 입력해주세요." value="${resumeVO.resumeTitle}" required>
				</div>
				<c:if test="${empty resumeVO}">
					<input type="hidden" value="0" name="resumeId" id="resumeId">
					<input type="hidden" value="0" name="fileGroupId" id="fileGroupId">
					<div class="personal-info-form">
						<div class="section-header">
							<h2>인적사항</h2>
							<p class="required-info">* 필수 입력 정보입니다.</p>
						</div>
						<div class="form-profile-grid">
						
							<div class="form-group photo-group">
								<label for="photo-upload" class="photo-upload-area drop-zone">
									<div class="upload-placeholder">
										<i class="fa fa-plus" aria-hidden="true"></i> <span>사진추가</span>
									</div> <img id="photo-preview" src="" alt="" /> <input type="file"
									id="photo-upload" name="files" accept="image/*" class="sr-only">
								</label>
								<button id="photo-delete-btn" type="button">삭제</button>
							</div>

							<div class="row-wrapper">
								<div class="form-row">
									<div class="form-group name-group">
										<label for="name"> 이름 <span class="required-asterisk">*</span>
										</label> <input type="text" id="name" name="name"
											placeholder="이름을 입력해주세요." required> <span
											class="error-message" id="name-error">이름을 입력해주세요.</span>
									</div>
									<div class="form-group gender-group">
										<label for="gender"> 성별 <span
											class="required-asterisk">*</span>
										</label> <select id="gender" name="gender" required>
											<option value="">선택</option>
											<option value="male">남자</option>
											<option value="female">여자</option>
										</select> <span class="error-message" id="gender-error">성별을
											선택해주세요.</span>
									</div>
								</div>

								<div class="form-row">
									<div class="form-group dob-group">
										<label for="dob"> 생년월일 <span class="required-asterisk">*</span>
										</label> <input type="date" id="dob" name="dob" required> <span
											class="error-message" id="dob-error">생년월일을 입력해주세요.</span>
									</div>
									<div class="form-group email-group">
										<label for="email"> 이메일 <span
											class="required-asterisk">*</span>
										</label> <input type="email" id="email" name="email" placeholder="이메일"
											value="" required> <span class="error-message"
											id="email-error">이메일을 입력해주세요.</span>
									</div>
								</div>

								<div class="form-row">
									<div class="form-group mobile-phone-group">
										<label for="mobile-phone"> 휴대폰번호 <span
											class="required-asterisk">*</span>
										</label> <input type="tel" id="mobile-phone" name="mobile-phone"
											placeholder="휴대폰번호를 입력해주세요." value="" required> <span
											class="error-message" id="mobile-phone-error">휴대폰번호를
											입력해주세요.</span>
									</div>
								</div>
							</div>
							<div class="form-group address-group">
								<label for="address">
									주소
									<span class="required-asterisk">*</span>
								</label>
								<div class="input-with-icon">
									<input type="text" id="address" value="" name="address" placeholder="돋보기로 검색해주세요." readonly required>
									<i class="fa fa-search icon-search" aria-label="주소 검색"></i>
								</div>
								<input type="text" id="address-detail" value="" name="address-detail" placeholder="상세주소 입력" required>
							</div>
						</div>
						<div class="form-JobWish">
							<div class="JobWish-header">
								<label for="desired-job">
									희망 직무
									<span class="required-asterisk">*</span>
								</label>
								<button type="button" id="add-job">추가</button>
							</div>
							<div class="job-input-group">
								<input class="desired-job" type="text" id="desired-job" name="desired-job" placeholder="희망 직무를 입력하세요" value="" required>
							</div>
						</div>

						<div class="form-Skills">
							<div class="Skills-header">
								<label for="skills">
									스킬
									<span class="required-asterisk">*</span>
								</label>
								<button type="button" id="add-skill">추가</button>
							</div>
							<div class="skills-input-group">
								<input type="text" id="skills" name="skills" placeholder="스킬을 입력하세요" value="" required>
							</div>
						</div>

						<div class="page-break"></div>
					</div>
				</c:if>
				<c:if test="${not empty resumeVO}">
					<input type="hidden" value="${resumeVO.resumeId}" name="resumeId" id="resumeId">
					<input type="hidden" value="${resumeVO.fileGroupId}" name="fileGroupId" id="fileGroupId">
					<c:out value="${resumeVO.resumeContent}" escapeXml="false" />
				</c:if>
			</section>

			<div class="btn-group">
				<div class="btn-left-group">
					<c:if test="${resumeVO.resumeId != 0 && not empty resumeVO.resumeId}">
						<button type="button" class="btn-resume-delete" id="btn-resume-delete">삭제하기</button>
					</c:if>
				</div>

				<div class="btn-right-group">
					<button type="button" id="btn-submit-Temp">임시저장</button>
					<button type="button" class="btn-preview" id="btn-preview">미리보기</button>
							<button type="button" class="btn-autocomplete" id="autoCompleteBtn">자동완성</button>
					<button type="button" id="btn-submit">저장</button>
				</div>
			</div>

		</div>
		<div class="load-button-group">
			<button type="button" id="load-education" name="rsId" data-id="1">학력 불러오기</button>

			<button type="button" id="load-certificate" name="rsId" data-id="2">자격증 불러오기</button>

			<button type="button" id="load-activities" name="rsId" data-id="3">대외활동</button>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script type="text/javascript" src="/js/cdp/rsm/rsm/resumeWriter.js"></script>
<script>
	
</script>