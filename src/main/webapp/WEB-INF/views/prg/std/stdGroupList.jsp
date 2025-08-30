<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/prg/std/stdGroupList.css">
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
			<form method="get" action="/prg/std/stdGroupList.do" class="search-filter__form">
				<div class="search-filter__bar">
					<div class="search-filter__select-wrapper">
						<select name="searchType" class="search-filter__select">
							<option value="title" ${searchType=='title' ? 'selected' : ''}>제목</option>
							<option value="content" ${searchType=='content' ? 'selected' : ''}>내용</option>
						</select>
						<svg class="search-filter__select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
					</div>
					<div class="search-filter__input-wrapper">
						<input type="search" name="searchKeyword" class="search-filter__input" placeholder="스터디그룹 내에서 검색" value="${searchKeyword}">
						<button class="search-filter__button" type="submit">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                </svg>
						</button>
					</div>
				</div>

				<div class="search-filter__accordion">
					<button type="button" class="search-filter__accordion-header" id="search-filter-toggle">
						<span>필터</span>
						<span class="search-filter__accordion-arrow">▲</span>
					</button>
					<div class="search-filter__accordion-panel" id="search-filter-panel">
						<div class="search-filter__accordion-content">
							<div class="search-filter__group">
								<label class="search-filter__group-title">지역</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="region" value="">
										<span>전체</span>
									</label>
									<c:forEach var="reg" items="${regionList}">
										<label class="search-filter__option">
											<input type="radio" name="region" value="${reg.key}" ${region==reg.key ? 'checked' : ''}>
											<span>${reg.value}</span>
										</label>
									</c:forEach>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">성별</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="gender" value="">
										<span>전체</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="gender" value="all" ${gender=='all' ? 'checked' : ''}>
										<span>성별무관</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="gender" value="men" ${gender=='men' ? 'checked' : ''}>
										<span>남자만</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="gender" value="women" ${gender=='women' ? 'checked' : ''}>
										<span>여자만</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">인원제한</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="maxPeople" value="2" ${maxPeople=='2' ? 'checked' : ''}>
										<span>2명</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="maxPeople" value="3" ${maxPeople=='3' ? 'checked' : ''}>
										<span>3명</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="maxPeople" value="5" ${maxPeople=='5' ? 'checked' : ''}>
										<span>5명</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="maxPeople" value="10" ${maxPeople=='10' ? 'checked' : ''}>
										<span>10명</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="maxPeople" value="15" ${maxPeople=='15' ? 'checked' : ''}>
										<span>15명</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="maxPeople" value="20" ${maxPeople=='20' ? 'checked' : ''}>
										<span>20명</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">관심사</label>
								<div class="interest-subgroups">
									<div class="interest-subgroup">
										<div class="subgroup-header">학업</div>
										<div class="search-filter__options">
											<c:forEach var="interest" items="${interestMap}">
												<c:if test="${fn:startsWith(interest.key,'study')}">
													<label class="search-filter__option">
														<input type="checkbox" name="interestItems" value="${interest.key}" <c:if test="${interestItems != null and interestItems.contains(interest.key)}">checked</c:if>>
														<span>${interest.value}</span>
													</label>
												</c:if>
											</c:forEach>
										</div>
									</div>

									<div class="interest-subgroup">
										<div class="subgroup-header">진로</div>
										<div class="search-filter__options">
											<c:forEach var="interest" items="${interestMap}">
												<c:if test="${fn:startsWith(interest.key,'career')}">
													<label class="search-filter__option">
														<input type="checkbox" name="interestItems" value="${interest.key}" <c:if test="${interestItems != null and interestItems.contains(interest.key)}">checked</c:if>>
														<span>${interest.value}</span>
													</label>
												</c:if>
											</c:forEach>
										</div>
									</div>

									<div class="interest-subgroup">
										<div class="subgroup-header">취업</div>
										<div class="search-filter__options">
											<c:forEach var="interest" items="${interestMap}">
												<c:if test="${fn:startsWith(interest.key,'job')}">
													<label class="search-filter__option">
														<input type="checkbox" name="interestItems" value="${interest.key}" <c:if test="${interestItems != null and interestItems.contains(interest.key)}">checked</c:if>>
														<span>${interest.value}</span>
													</label>
												</c:if>
											</c:forEach>
										</div>
									</div>

									<div class="interest-subgroup">
										<div class="subgroup-header">기타</div>
										<div class="search-filter__options">
											<c:forEach var="interest" items="${interestMap}">
												<c:if test="${fn:startsWith(interest.key,'social')}">
													<label class="search-filter__option">
														<input type="checkbox" name="interestItems" value="${interest.key}" <c:if test="${interestItems != null and interestItems.contains(interest.key)}">checked</c:if>>
														<span>${interest.value}</span>
													</label>
												</c:if>
											</c:forEach>
										</div>
									</div>
								</div>
							</div>

							<div class="search-filter__group">
								<label class="search-filter__group-title">정렬</label>
								<div class="search-filter__options">
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createDesc" <c:if test="${sortOrder == 'createDesc'}">checked</c:if>>
										<span>작성일 최신순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="createAsc" <c:if test="${sortOrder == 'createAsc'}">checked</c:if>>
										<span>작성일 오래된순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="viewCntDesc" <c:if test="${sortOrder == 'viewCntDesc'}">checked</c:if>>
										<span>조회수 높은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="enteredMemDesc" <c:if test="${sortOrder == 'enteredMemDesc'}">checked</c:if>>
										<span>입장인원 많은순</span>
									</label>
									<label class="search-filter__option">
										<input type="radio" name="sortOrder" value="replyCntDesc" <c:if test="${sortOrder == 'replyCntDesc'}">checked</c:if>>
										<span>댓글 많은순</span>
									</label>
								</div>
							</div>

							<div class="search-filter__group">
								<div class="search-filter__group-header">
									<label class="search-filter__group-title">선택된 필터</label>
									<button type="button" class="search-filter__reset-button">초기화</button>
								</div>
								<div class="search-filter__selected-tags"></div>
							</div>

							<button type="submit" class="search-filter__submit-button">검색</button>
						</div>
					</div>
				</div>
			</form>

			<sec:authorize access="isAuthenticated()">
				<sec:authentication property="principal" var="memId" />
			</sec:authorize>
			<c:forEach var="stdBoardVO" varStatus="stat" items="${articlePage.content }">
				<div class="group-card" data-stdb-id="${stdBoardVO.boardId }">
					<div class="group-info">
						<div class="group-tags">
							<c:choose>
								<c:when test="${myRoomSet.contains(stdBoardVO.chatRoomVO.crId) }">
									<span class="status-tag tag  entered">참여중</span>
								</c:when>
								<c:when test="${stdBoardVO.maxPeople <= stdBoardVO.curJoinCnt }">
									<span class="status-tag tag disabled">참여불가</span>
								</c:when>
								<c:otherwise>
									<span class="status-tag available">참여가능</span>
								</c:otherwise>
							</c:choose>
							<span class="tag">${stdBoardVO.region}</span>
							<c:choose>
								<c:when test="${stdBoardVO.gender == 'all'}">
									<span class="tag">성별무관</span>
								</c:when>
								<c:when test="${stdBoardVO.gender == 'men'}">
									<span class="tag">남자만</span>
								</c:when>
								<c:when test="${stdBoardVO.gender == 'women'}">
									<span class="tag">여자만</span>
								</c:when>
							</c:choose>
							<span class="tag">${interestMap[stdBoardVO.interest]}</span>
							<span class="tag">${stdBoardVO.maxPeople}명</span>
						</div>
						<div class="group-title">
							<div class="group-title-content">
								<c:choose>
									<c:when test="${fn:split(stdBoardVO.interest,'.')[0] == 'study' }"> ✏️ </c:when>
									<c:when test="${fn:split(stdBoardVO.interest,'.')[0] == 'career' }"> 📚 </c:when>
									<c:when test="${fn:split(stdBoardVO.interest,'.')[0] == 'job' }"> 🦆 </c:when>
									<c:when test="${fn:split(stdBoardVO.interest,'.')[0] == 'social' }"> 👨🏼‍🤝‍👨🏼</c:when>
								</c:choose>
								<c:choose>
									<c:when test="${fn:length(stdBoardVO.boardTitle) gt 26 }">
										<c:out value="${fn:substring(stdBoardVO.boardTitle,0,25) }..."></c:out>
									</c:when>
									<c:otherwise>
										<c:out value="${stdBoardVO.boardTitle }"></c:out>
									</c:otherwise>
								</c:choose>
							</div>
						</div>
					</div>
					<div class="group-meta">
						<div class="group-meta-labels">
							<span class="group-meta-label">참여인원</span>
							<span class="group-meta-label">조회수</span>
							<span class="group-meta-label">댓글</span>
							<span class="group-meta-label">작성일</span>
						</div>
						<div class="group-meta-values">
							<span class="group-meta-value">${stdBoardVO.curJoinCnt}/${stdBoardVO.maxPeople}</span>
							<span class="group-meta-value">${stdBoardVO.boardCnt}</span>
							<span class="group-meta-value">${stdBoardVO.replyCnt}</span>
							<span class="group-meta-value">
								<fmt:formatDate value="${stdBoardVO.boardCreatedAt}" pattern="yyyy. M. d." />
							</span>
						</div>
					</div>
				</div>
			</c:forEach>

			<c:if test="${empty articlePage.content}">
				<div class="content-list__no-results" style="grid-column: 1/-1;">검색 결과가 없습니다.</div>
			</c:if>
			
			<div class="group-write-btn-wrapper">
				<button class="btn-write-group" id="btnWrite">글 작성하기</button>
			</div>

			<ul class="pagination">
				<li>
					<a href="${articlePage.url}&currentPage=${articlePage.startPage - 5}" class="pagination__link ${articlePage.startPage < 6 ? 'pagination__link--disabled' : ''}"> ← Previous </a>
				</li>
				<c:forEach var="pNo" begin="${articlePage.startPage}" end="${articlePage.endPage}">
					<li>
						<c:if test="${articlePage.total == 0 }">
							<c:set var="pNo" value="1"></c:set>
						</c:if>
						<a href="${articlePage.url}&currentPage=${pNo}" class="pagination__link ${pNo == articlePage.currentPage ? 'pagination__link--active' : ''}"> ${pNo} </a>
					</li>
				</c:forEach>
				<li>
					<a href="${articlePage.url}&currentPage=${articlePage.startPage + 5}" class="pagination__link ${articlePage.endPage >= articlePage.totalPages ? 'pagination__link--disabled' : ''}"> Next → </a>
				</li>
			</ul>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/prg/std/stdGroupList.js"></script>