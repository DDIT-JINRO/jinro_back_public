<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/prg/std/createStdGroup.css">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">프로그램</div>
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/prg/ctt/cttList.do">공모전</a>
		</div>
		<!-- 중분류 -->
		<div class="channel-sub-section-item">
			<a href="/prg/act/vol/volList.do">대외활동</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/prg/std/stdGroupList.do">스터디그룹</a>
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
				<a href="/prg/ctt/cttList.do">프로그램</a>
			</li>
			<li class="breadcrumb-item active">
				<a href="/prg/std/stdGroupList.do">스터디 그룹</a>
			</li>
		</ol>
	</nav>
</div>

<div class="public-wrapper">
	<div class="tab-container" id="tabs">
		<a class="tab active" href="/prg/std/stdGroupList.do">스터디 그룹</a>
	</div>

	<div class="public-wrapper-main">
		<h2 class="studygroup-from__title">스터디그룹 소개 및 채팅방 개설</h2>
		<p class="studygroup-form__subtitle">스터디그룹 모집 게시글 작성과 함께 채팅방이 개설됩니다.</p>
		<div class="create-wrapper">
			<div class="form-group">
				<label for="post-title">게시글 제목</label>
				<input type="text" placeholder="제목을 입력하세요" class="title-input" id="post-title" />

				<div class="study-info-grid">
					<div class="custom-select">
						<label for="gender">성별 제한</label>
						<div class="custom-select__label">성별제한 없음</div>
						<ul class="custom-select__options">
							<li data-value="all">성별제한 없음</li>
							<li data-value="men">남자만</li>
							<li data-value="women">여자만</li>
						</ul>
						<select id="gender" name="gender" class="visually-hidden">
							<option value="all">성별제한 없음</option>
							<option value="men">남자만</option>
							<option value="women">여자만</option>
						</select>
					</div>
					<div class="custom-select">
						<label for="region">지역 선택</label>
						<div class="custom-select__label">지역 선택</div>
						<ul class="custom-select__options">
							<c:forEach var="region" items="${regionList }">
								<li data-value="${region.key }">${region.value }</li>
							</c:forEach>
						</ul>
						<select name="region" class="visually-hidden" id="region">
							<option value="">지역 선택</option>
							<c:forEach var="region" items="${regionList }">
								<option value="${region.key }">${region.value }</option>
							</c:forEach>
						</select>
					</div>
					<div class="custom-select">
						<label for="capacity">인원 제한</label>
						<div class="custom-select__label">인원 선택</div>
						<ul class="custom-select__options">
							<li data-value="2">2명</li>
							<li data-value="3">3명</li>
							<li data-value="5">5명</li>
							<li data-value="10">10명</li>
							<li data-value="15">15명</li>
							<li data-value="20">20명</li>
						</ul>
						<select name="capacity" class="visually-hidden" id="capacity">
							<option value="">인원 선택</option>
							<option value="2">2명</option>
							<option value="3">3명</option>
							<option value="5">5명</option>
							<option value="10">10명</option>
							<option value="15">15명</option>
							<option value="20">20명</option>
							<!-- ... -->
						</select>
					</div>
					<div class="custom-select">
						<label for="interest">관심 분야</label>
						<div class="custom-select__label">선택하세요</div>
						<ul class="custom-select__options">
							<!-- optgroup 루프 -->
							<li class="optgroup-label">학업</li>
							<li data-value="study.general">공부</li>
							<li data-value="study.exam">수능준비</li>
							<li data-value="study.assignment">과제</li>
							<li data-value="study.etc">기타</li>

							<li class="optgroup-label">진로</li>
							<li data-value="career.path">진로</li>
							<li data-value="career.admission">진학</li>
							<li data-value="career.etc">기타</li>

							<li class="optgroup-label">취업</li>
							<li data-value="job.prepare">취업준비</li>
							<li data-value="job.concern">취업고민</li>
							<li data-value="job.etc">기타</li>

							<li class="optgroup-label">기타</li>
							<li data-value="social.neighbor">동네친구</li>
							<li data-value="social.talk">잡담</li>
							<li data-value="social.etc">기타</li>
						</ul>

						<!-- 실제 폼 전송용 select -->
						<select name="tool" class="visually-hidden" id="interest">
							<optgroup label="학업">
								<option value="study.general">공부</option>
								<option value="study.exam">수능준비</option>
								<option value="study.assignment">과제</option>
								<option value="study.etc">기타</option>
							</optgroup>
							<optgroup label="진로">
								<option value="career.path">진로</option>
								<option value="career.admission">진학</option>
								<option value="career.etc">기타</option>
							</optgroup>
							<optgroup label="취업">
								<option value="job.prepare">취업준비</option>
								<option value="job.concern">취업고민</option>
								<option value="job.etc">기타</option>
							</optgroup>
							<optgroup label="기타">
								<option value="social.neighbor">동네친구</option>
								<option value="social.talk">잡담</option>
								<option value="social.etc">기타</option>
							</optgroup>
						</select>
					</div>
				</div>
				<label for="chat-title">채팅방 제목</label>
				<input type="text" placeholder="채팅방 제목을 입력하세요" class="chat-title-input" id="chatTitle" />
				<label for="description">스터디 소개글</label>
				<textarea class="desc-textarea" placeholder="스터디 소개글을 작성하세요" id="description"></textarea>
			</div>
			<div class="btn-area">
				<button id="btnCancel" class="btn-cancel">취소</button>
				<button id="btnSubmit" class="btn-submit">등록</button>
			</div>
		</div>
		<button id="autoCompleteBtn" type="button" class="btn-submit">자동완성</button>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/prg/std/createStdGroup.js"></script>
</html>
