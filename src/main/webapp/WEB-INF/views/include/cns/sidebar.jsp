<%@ page contentType="text/html;charset=UTF-8"%>
<!-- 사이드바 -->
<link rel="stylesheet" href="/css/cns/cnsSideBar.css">
<link rel="shortcut icon" href="/images/crppvc.png">
<link rel="stylesheet" href="/css/pagenation.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="/js/include/cns/sidebar.js"></script>
<script src="/js/axios.min.js"></script>
<script src="/ckeditor5/ckeditor.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
	 sidebar();
});
</script>
<aside class="admin-side-sidebar">
	<div class="admin-side-logo-container">
		<img class="admin-side-logo" alt="logo" src="/images/logoWhite.png">
	</div>
	<div class="admin-side-logo-text">Counselor</div>
	<div class="admin-side-mainMove">
		<a href="/"><img alt="바로가기" src="/images/mainPortal.png">
		<p class="admin-side-portaltext">사이트 바로가기</p></a>
	</div>
	<ul class="admin-side-menu">
		<li class="admin-side-menu-item">
			<a href="/cns">스케줄관리</a>
		</li>

		<li class="admin-side-menu-item" onclick="toggleSubmenu('counselingLog')">
			<a href="javascript:void(0)">상담 일지</a>
			<ul class="admin-side-submenu" id="counselingLog">
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/cns/cnsMoveController.do?target=csl/counselingLog">상담 일지 작성</a>
				</li>
			</ul>
		</li>

		<li class="admin-side-menu-item" onclick="toggleSubmenu('vacationMenu')">
			<a href="javascript:void(0)">연차/휴가</a>
			<ul class="admin-side-submenu" id="vacationMenu">
				<li>
					<a href="#" class="admin-side-menu-link" data-page="<%=request.getContextPath()%>/cns/cnsMoveController.do?target=vac/vacation">연차/휴가 신청 및 목록</a>
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
