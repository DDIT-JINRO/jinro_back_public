<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!-- 사이드바 -->
<link rel="stylesheet" href="/css/admin/admSideBar.css">
<link rel="shortcut icon" href="/images/crppvc.png">
<link rel="stylesheet" href="/css/pagenation.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="/js/include/admin/sidebar.js"></script>
<script src="/js/axios.min.js"></script>
<script src="/ckeditor5/ckeditor.js"></script>
<script src="/js/chart/chart.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>


<script>
document.addEventListener('DOMContentLoaded', function () {
	sidebar();
});
</script>
<aside class="admin-side-sidebar">
	<div class="admin-side-logo-container">
		<img class="admin-side-logo" alt="logo" src="/images/logoWhite.png">
	</div>
	<div class="admin-side-logo-text">Admin Page</div>
	<div class="admin-side-mainMove">
		<a href="/"><img alt="바로가기" src="/images/mainPortal.png">
		<p class="admin-side-portaltext">사이트 바로가기</p></a>
	</div>
	<ul class="admin-side-menu">
		<li class="admin-side-menu-item">
			<a href="/admin">관리자 대시보드</a>
		</li>

		<!-- 필요한 항목이 있을때 이곳을 복사하거나 수정하면됩니다. -->
		<li class="admin-side-menu-item" onclick="toggleSubmenu('adminSideUsers')">
			<a href="javascript:void(0)">사용자 관리</a>
			<ul class="admin-side-submenu" id="adminSideUsers">
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=umg/memberManagement">회원 관리</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=umg/counselorManagement">상담사 관리</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=umg/sanctionsDescription">제재 내역</a>
				</li>
			</ul>
		</li>

		<li class="admin-side-menu-item" onclick="toggleSubmenu('adminSideContens')">
			<a href="javascript:void(0)">컨텐츠 관리</a>
			<ul class="admin-side-submenu" id="adminSideContens">
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=cmg/univManagement">대학 관리</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=cmg/enterpriseManagement">기업 관리</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=cmg/contestManagement">공모전 관리</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=cmg/activityManagement">대외활동 관리</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=cmg/reviewManagement">후기 관리</a>
				</li>
			</ul>
		</li>

		<li class="admin-side-menu-item" onclick="toggleSubmenu('adminSideInqMenu')">
			<a href="javascript:void(0)">고객 센터</a>
			<ul class="admin-side-submenu" id="adminSideInqMenu">
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=csc/faqManagement">FAQ</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=csc/inquiryManagement">1:1 문의</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=csc/noticeManagement">공지사항</a>
				</li>
			</ul>
		</li>

		<li class="admin-side-menu-item" onclick="toggleSubmenu('adminSideLogMenu')">
			<a href="javascript:void(0)">로그 및 통계</a>
			<ul class="admin-side-submenu" id="adminSideLogMenu">
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=las/contentUsageStatistics">컨텐츠 이용 통계</a>
				</li>
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/admin/adminMoveController.do?target=las/paymentPremiumServiceStatistics">결제/프리미엄 서비스 통계</a>
				</li>
			</ul>
		</li>
	</ul>
</aside>

<script>
function toggleSubmenu(id) {
  const submenu = document.getElementById(id);
  const parentItem = submenu.closest('.admin-side-menu-item');

  const isOpen = submenu.classList.contains('open');

  document.querySelectorAll('.admin-side-submenu').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.admin-side-menu-item').forEach(el => el.classList.remove('active'));

  if (!isOpen) {
    submenu.classList.add('open');
    parentItem.classList.add('active');
  }
}
</script>
