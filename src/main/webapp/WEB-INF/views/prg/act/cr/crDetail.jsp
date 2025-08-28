<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/prg/ctt/cttDetail.css">
<section class="channel program">
	<div class="channel-title">
		<div class="channel-title-text">프로그램</div>
	</div>
	<div class="channel-sub-sections">
		<div class="channel-sub-section-item">
			<a href="/prg/ctt/cttList.do">공모전</a>
		</div>
		<div class="channel-sub-section-itemIn">
			<a href="/prg/act/vol/volList.do">대외활동</a>
		</div>
		<div class="channel-sub-section-item">
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
				<a href="/prg/act/vol/volList.do">대외활동</a>
			</li>
		</ol>
	</nav>
</div>

<div>
	<div class="public-wrapper">
		<div class="tab-container" id="tabs">
			<a class="tab" href="/prg/act/vol/volList.do">봉사활동</a>
			<a class="tab active" href="/prg/act/cr/crList.do">인턴십</a>
			<a class="tab" href="/prg/act/sup/supList.do">서포터즈</a>
		</div>
		<div class="public-wrapper-main">
			<div class="detail-title-wrapper">
				<h1>${crDetail.contestTitle}</h1>
				<div class="meta-info">
					<span>조회수: ${crDetail.contestRecruitCount}</span>
					<span class="divider">|</span>
					<span>
						게시일:
						<fmt:formatDate value="${crDetail.contestCreatedAt}" pattern="yyyy. M. d." />
					</span>
					<span class="divider">|</span>
					<span class="detail-header__meta-item detail-header__meta-item--source">[ 출처: 씽굿(Thinkcontest.com), 대학문화신문사 ]</span>
				</div>
			</div>

			<div class="summary-layout">
				<div class="poster-wrapper">
					<img src="/files/download?fileGroupId=${crDetail.fileGroupId}&seq=1" alt="${cttDetail.contestTitle} 포스터" class="poster-image" id="poster-modal-trigger">
				</div>
				<div id="poster-modal" class="modal">
					<span class="close-button">&times;</span>
					<img class="modal-content" id="modal-image">
				</div>
				<div class="summary-wrapper">
					<div class="summary-header">
						<h3 class="summary-title">인턴십 정보</h3>
					</div>
					
					<table class="info-table">
						<tbody>
							<tr>
								<th>주최</th>
								<td>${crDetail.contestHost}</td>
							</tr>
							<tr>
								<th>주관</th>
								<td>${crDetail.contestOrganizer}</td>
							</tr>
							<tr>
								<th>접수기간</th>
								<td><fmt:formatDate value="${crDetail.contestStartDate}" pattern="yyyy. M. d." /> ~ <fmt:formatDate value="${crDetail.contestEndDate}" pattern="yyyy. M. d." /></td>
							</tr>
							<tr>
								<th>참가자격</th>
								<td>${crDetail.contestTargetName}</td>
							</tr>
							<tr>
								<th>접수방법</th>
								<td>${crDetail.applicationMethod}</td>
							</tr>
							<tr>
								<th>시상종류</th>
								<td>${crDetail.awardType}</td>
							</tr>
							<tr>
								<th>홈페이지</th>
								<td><a href="${crDetail.contestUrl}" target="_blank">바로가기</a></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="content-wrapper">
				<div class="tabs">
					<div class="tab-item active">공모요강</div>
				</div>
				<div class="tab-content">
					<c:forEach var="section" items="${crDetail.descriptionSections}">
						<div class="description-section">
							<p class="description-text">${section}</p>
						</div>
					</c:forEach>
				</div>
			</div>

			<div class="bottom-button-wrapper">
				<a href="/prg/act/cr/crList.do" class="btn-list-bottom">목록</a>
			</div>

		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
<script src="/js/prg/ctt/cttDetail.js"></script>
</body>
</html>