<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/prg/std/createStdGroup.css">
<section class="channel program">
	<div class="channel-title">
		<div class="channel-title-text">프로그램</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/prg/ctt/cttList.do">공모전</a>
		</div>
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

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab active" href="/prg/std/stdGroupList.do">스터디 그룹</a>
		</div>
		
		<div class="public-wrapper-main">
			<h2 class="studygroup-from__title">스터디그룹 소개 및 채팅방 수정</h2>
			<p class="studygroup-form__subtitle">스터디그룹 모집 게시글을 수정합니다.</p>
			<div class="study-post-wrapper" data-board-id="${csbVO.boardId }" data-cr-id="${csbVO.chatRoomVO.crId }">
				<div class="form-group">
					<label for="post-title">게시글 제목</label>
					<input type="text" placeholder="제목을 입력하세요" class="title-input" id="post-title" value="${csbVO.boardTitle} " />

					<div class="study-info-grid">
						<div class="custom-select custom-select--disabled">
							<label for="gender">성별 제한</label>
							<div class="custom-select__label">${genderMap[csbVO.gender] }</div>
							<select id="gender" name="gender" class="visually-hidden">
								<option value="all" <c:if test="${csbVO.gender=='all'}">selected</c:if>>성별제한 없음</option>
								<option value="men" <c:if test="${csbVO.gender=='men'}">selected</c:if>>남자만</option>
								<option value="women" <c:if test="${csbVO.gender=='women'}">selected</c:if>>여자만</option>
							</select>
						</div>
						<div class="custom-select custom-select--disabled">
							<!-- 수정불가 렌더링만 -->
							<label for="region">지역 선택</label>
							<div class="custom-select__label">${csbVO.region}</div>
							<select name="region" class="visually-hidden" id="region">
								<option value="">지역 선택</option>
								<c:forEach var="region" items="${regionList }">
									<option value="${region.key }" <c:if test="${csbVO.region == region.value}">selected</c:if>>${region.value }</option>
								</c:forEach>
							</select>
						</div>
						<div class="custom-select ">
							<label for="capacity">인원 제한</label>
							<div class="custom-select__label">${csbVO.maxPeople }명</div>
							<ul class="custom-select__options">
								<li data-value="2" <c:if test="${csbVO.curJoinCnt > 2 }">data-disabled="true"</c:if>>2명</li>
								<li data-value="3" <c:if test="${csbVO.curJoinCnt > 3 }">data-disabled="true"</c:if>>3명</li>
								<li data-value="5" <c:if test="${csbVO.curJoinCnt > 5 }">data-disabled="true"</c:if>>5명</li>
								<li data-value="10" <c:if test="${csbVO.curJoinCnt > 10 }">data-disabled="true"</c:if>>10명</li>
								<li data-value="15" <c:if test="${csbVO.curJoinCnt > 15 }">data-disabled="true"</c:if>>15명</li>
								<li data-value="20" <c:if test="${csbVO.curJoinCnt > 20 }">data-disabled="true"</c:if>>20명</li>
							</ul>
							<select name="capacity" class="visually-hidden" id="capacity">
								<option value="">인원 선택</option>
								<option value="2" <c:if test="${csbVO.maxPeople == '2' }">selected</c:if>>2명</option>
								<option value="3" <c:if test="${csbVO.maxPeople == '3' }">selected</c:if>>3명</option>
								<option value="5" <c:if test="${csbVO.maxPeople == '5' }">selected</c:if>>5명</option>
								<option value="10" <c:if test="${csbVO.maxPeople == '10' }">selected</c:if>>10명</option>
								<option value="15" <c:if test="${csbVO.maxPeople == '15' }">selected</c:if>>15명</option>
								<option value="20" <c:if test="${csbVO.maxPeople == '20' }">selected</c:if>>20명</option>
								<!-- ... -->
							</select>
						</div>
						<div class="custom-select">
							<label for="interest">관심 분야</label>
							<div class="custom-select__label">${interestMap[csbVO.interest] }</div>
							<ul class="custom-select__options">
								<!-- optgroup 루프 -->
								<li class="optgroup-label">학업</li>
								<li data-value="study.general">공부</li>
								<li data-value="study.exam">수능준비</li>
								<li data-value="study.assignment">과제</li>

								<li class="optgroup-label">진로</li>
								<li data-value="career.path">진로</li>
								<li data-value="career.admission">진학</li>

								<li class="optgroup-label">취업</li>
								<li data-value="job.prepare">취업준비</li>
								<li data-value="job.concern">취업고민</li>

								<li class="optgroup-label">기타</li>
								<li data-value="social.neighbor">동네친구</li>
								<li data-value="social.talk">잡담</li>
							</ul>

							<!-- 실제 폼 전송용 select -->
							<select name="tool" class="visually-hidden" id="interest">
								<optgroup label="학업">
									<option value="study.general" <c:if test="${csbVO.interest == 'study.general'}">selected</c:if>>공부</option>
									<option value="study.exam" <c:if test="${csbVO.interest == 'study.exam'}">selected</c:if>>수능준비</option>
									<option value="study.assignment" <c:if test="${$csbVO.interest == 'study.assignment'}">selected</c:if>>과제</option>
								</optgroup>
								<optgroup label="진로">
									<option value="career.path" <c:if test="${csbVO.interest == 'career.path'}">selected</c:if>>진로</option>
									<option value="career.admission" <c:if test="${csbVO.interest == 'career.admission'}">selected</c:if>>진학</option>
								</optgroup>
								<optgroup label="취업">
									<option value="job.prepare" <c:if test="${csbVO.interest == 'job.prepare'}">selected</c:if>>취업준비</option>
									<option value="job.concern" <c:if test="${csbVO.interest == 'job.concern'}">selected</c:if>>취업고민</option>
								</optgroup>
								<optgroup label="기타">
									<option value="social.neighbor" <c:if test="${csbVO.interest == 'social.neighbor'}">selected</c:if>>동네친구</option>
									<option value="social.talk" <c:if test="${csbVO.interest == 'social.talk'}">selected</c:if>>잡담</option>
								</optgroup>
							</select>
						</div>
					</div>
					<label for="chat-title">채팅방 제목</label>
					<input type="text" placeholder="채팅방 제목을 입력하세요" class="chat-title-input" id="chat-title" value="${csbVO.chatRoomVO.crTitle }" />
					<label for="description">스터디 소개글</label>
					<textarea class="desc-textarea" placeholder="스터디 소개글을 작성하세요" id="description">${csbVO.parsedContent }</textarea>
				</div>
				<div class="btn-area">
					<button id="btnCancel" class="btn-cancel">취소</button>
					<button id="btnSubmit" class="btn-submit">등록</button>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
<script src="/js/prg/std/updateStdGroup.js"></script>
</html>