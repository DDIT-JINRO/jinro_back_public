<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html>
<head>
<link rel="shortcut icon" href="/images/crppvc.png">
<link rel="stylesheet" href="/css/common/userCommon.css">
<link rel="stylesheet" href="/css/user-profile.css">
<link rel="stylesheet" href="/css/chatModal.css">
<script src="/js/axios.min.js"></script>
<script src="/js/com/sockjs.min.js"></script>
<script src="/js/com/stomp.min.js"></script>
<script src="/ckeditor5/ckeditor.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hangul-js@0.2.6/hangul.min.js"></script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="진로 탐색부터 취업, 경력 관리까지. AI가 설계해주는 나만의 커리어 로드맵, 커리어패스에서 시작하세요.)">
<title>CareerPath</title>
<script src="/js/include/header.js"></script>
<script>
	const memId = '<sec:authentication property="name" />';
	const FRONT_URL = "${frontUrl}";
	const BACK_URL = "${backUrl}";
	document.addEventListener("DOMContentLoaded",() => {
		header();
	});
</script>
</head>
<body>
	<header class="header">
		<div class="header__brand">
			<a href="/">
				<img src="/images/logo.png" alt="로고" class="header__logo" />
			</a>
		</div>

		<button class="header__mobile-menu-trigger" id="mobileMenuTrigger">
			<img src="/images/menuAll.png" alt="메뉴 열기" />
		</button>

		<div class="header__nav-container--desktop">
			<ul class="main-nav">
				<li class="main-nav__item main-nav__item--mega-menu-trigger" id="megaMenuToggle">
					<img src="/images/menuAll.png" alt="메뉴 아이콘" class="main-nav__icon" />
				</li>
				<li class="main-nav__item">
					<a href="/pse/cat/careerAptitudeTest.do" class="main-nav__link">진로</a>
					<div class="dropdown-submenu">
						<a href="/pse/cat/careerAptitudeTest.do">진로 심리검사</a>
						<a href="/pse/cr/crl/selectCareerList.do">직업백과</a>
					</div>
				</li>
				<li class="main-nav__item">
					<a href="/ertds/univ/uvsrch/selectUnivList.do" class="main-nav__link">진학</a>
					<div class="dropdown-submenu">
						<a href="/ertds/univ/uvsrch/selectUnivList.do">대학교 정보</a>
						<a href="/ertds/hgschl/selectHgschList.do">고등학교 정보</a>
						<a href="/ertds/qlfexm/selectQlfexmList.do">검정고시</a>
					</div>
				</li>
				<li class="main-nav__item">
					<a href="/empt/ema/employmentAdvertisement.do" class="main-nav__link">취업</a>
					<div class="dropdown-submenu">
						<a href="/empt/ema/employmentAdvertisement.do">채용공고</a>
						<a href="/empt/enp/enterprisePosting.do">기업정보</a>
						<a href="/empt/ivfb/interViewFeedback.do">면접후기</a>
						<a href="/empt/cte/careerTechnicalEducation.do">직업교육</a>
					</div>
				</li>
				<li class="main-nav__item main-nav__item--priority-low">
					<a href="/cdp/rsm/rsm/resumeList.do" class="main-nav__link" id="goTologin6">경력관리</a>
					<div class="dropdown-submenu">
						<a href="/cdp/rsm/rsm/resumeList.do" id="goTologin7">이력서</a>
						<a href="/cdp/sint/qestnlst/questionList.do" id="goTologin8">자기소개서</a>
						<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do" id="goTologin9">모의 면접</a>
						<a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do" id="goTologin10">AI 피드백</a>
					</div>
				</li>
				<li class="main-nav__item">
					<a href="/cnslt/resve/crsv/reservation.do" class="main-nav__link">상담</a>
					<div class="dropdown-submenu">
						<a href="/cnslt/resve/crsv/reservation.do">상담 예약</a>
						<a href="/cnslt/rvw/cnsReview.do">상담 후기</a>
						<a href="/cnslt/aicns/aicns.do">AI 상담</a>
					</div>
				</li>
				<li class="main-nav__item main-nav__item--priority-low">
					<a href="/prg/ctt/cttList.do" class="main-nav__link">프로그램</a>
					<div class="dropdown-submenu">
						<a href="/prg/ctt/cttList.do">공모전</a>
						<a href="/prg/act/vol/volList.do">대외활동</a>
						<a href="/prg/std/stdGroupList.do">스터디그룹</a>
					</div>
				</li>
				<li class="main-nav__item">
					<a href="/comm/peer/teen/teenList.do" class="main-nav__link">커뮤니티</a>
					<div class="dropdown-submenu">
						<a href="/comm/peer/teen/teenList.do">또래 게시판</a>
						<a href="/comm/path/pathList.do">진로/진학 게시판</a>
					</div>
				</li>
				<li class="main-nav__item main-nav__item--priority-low">
					<a href="/csc/not/noticeList.do" class="main-nav__link">고객센터</a>
					<div class="dropdown-submenu">
						<a href="/csc/not/noticeList.do">공지사항</a>
						<a href="/csc/faq/faqList.do">FAQ</a>
						<a href="/csc/inq/inqryList.do" id="goTologin11">1:1 문의</a>
					</div>
				</li>
			</ul>
		</div>

		<div class="header__user-actions--desktop">
			<sec:authorize access="hasRole('ROLE_CNSLEADER')">
				<a href="/cnsLeader" class="user-actions__button">
					<img src="/images/cnsLeader.png" alt="상담센터장" class="user-actions__icon">
				</a>
			</sec:authorize>
			<sec:authorize access="hasRole('ROLE_COUNSEL')">
				<a href="/cns" class="user-actions__button">
					<img src="/images/counselor.png" alt="상담사" class="user-actions__icon">
				</a>
			</sec:authorize>
			<sec:authorize access="hasRole('ROLE_ADMIN')">
				<a href="/admin" class="user-actions__button">
					<img src="/images/manager.png" alt="관리자" class="user-actions__icon">
				</a>
			</sec:authorize>
			<sec:authorize access="isAuthenticated()">
				<a href="/mpg/mif/inq/selectMyInquiryView.do" class="user-actions__button">
					<img src="/images/profile.png" alt="프로필" class="user-actions__icon" />
				</a>
				<a href="#" id="alarmBtn" class="user-actions__button user-actions__button--alarm">
					<img src="/images/alarm.png" alt="알림" class="user-actions__icon" />
					<span id="alarm-badge" class="badge">0</span>
				</a>
				<a href="/logoutProcess" class="user-actions__button">
					<img src="/images/logout.png" alt="로그아웃" class="user-actions__icon" />
				</a>
			</sec:authorize>
			<sec:authorize access="!isAuthenticated()">
				<a href="/login" class="user-actions__button">
					<img src="/images/login.png" alt="로그인" class="user-actions__icon" />
				</a>
			</sec:authorize>
		</div>

		<div class="mobile-nav-panel" id="mobileNavPanel">
			<div class="mobile-nav-panel__header">
				<button class="mobile-nav-panel__close" id="mobileNavClose"></button>
			</div>
			<ul class="mobile-nav-panel__menu">
				<li>
					<a href="/pse/cat/careerAptitudeTest.do">진로</a>
				</li>
				<li>
					<a href="/ertds/univ/uvsrch/selectUnivList.do">진학</a>
				</li>
				<li>
					<a href="/empt/ema/employmentAdvertisement.do">취업</a>
				</li>
				<li>
					<a href="/cdp/rsm/rsm/resumeList.do" id="goTologin1">경력관리</a>
				</li>
				<li>
					<a href="/cnslt/resve/crsv/reservation.do">상담</a>
				</li>
				<li>
					<a href="/prg/ctt/cttList.do">프로그램</a>
				</li>
				<li>
					<a href="/comm/peer/teen/teenList.do">커뮤니티</a>
				</li>
				<li>
					<a href="/csc/not/noticeList.do">고객센터</a>
				</li>
			</ul>
			<div class="mobile-nav-panel__user-actions">
				<sec:authorize access="isAuthenticated()">
					<a href="/mpg/mif/inq/selectMyInquiryView.do">마이페이지</a>
					<a href="/logoutProcess">로그아웃</a>
				</sec:authorize>
				<sec:authorize access="!isAuthenticated()">
					<a href="/login">로그인</a>
				</sec:authorize>
			</div>
		</div>
		<div class="overlay" id="overlay"></div>
	</header>

	<div id="megaMenu" class="mega-menu mega-menu--hidden">
		<div class="mega-menu__header">
			<div class="mega-menu__dots">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<div class="mega-menu__title">MENU</div>
		</div>
		<div class="mega-menu__container">
			<div class="mega-menu__row">
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">진로</div>
					<div class="mega-menu__links">
						<a href="/pse/cat/careerAptitudeTest.do">
							<span>진로 심리 검사</span>
						</a>
						<a href="/pse/cr/crl/selectCareerList.do">
							<span>직업 목록</span>
						</a>
						<a href="/pse/cr/crr/selectCareerRcmList.do">
							<span>추천 직업</span>
						</a>
					</div>
				</div>
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">진학</div>
					<div class="mega-menu__links">
						<a href="/ertds/univ/uvsrch/selectUnivList.do">
							<span>대학 검색</span>
						</a>
						<a href="/ertds/univ/mjsrch/selectMajorList.do">
							<span>학과 정보</span>
						</a>
						<a href="/ertds/hgschl/selectHgschList.do">
							<span>고등학교 정보</span>
						</a>
						<a href="/ertds/qlfexm/selectQlfexmList.do">
							<span>검정고시</span>
						</a>
					</div>
				</div>
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">취업</div>
					<div class="mega-menu__links">
						<a href="/empt/ema/employmentAdvertisement.do">
							<span>채용공고</span>
						</a>
						<a href="/empt/enp/enterprisePosting.do">
							<span>기업정보</span>
						</a>
						<a href="/empt/ivfb/interViewFeedback.do">
							<span>면접후기</span>
						</a>
						<a href="/empt/cte/careerTechnicalEducation.do">
							<span>직업교육</span>
						</a>
					</div>
				</div>
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">경력관리</div>
					<div class="mega-menu__links">
						<a href="/cdp/rsm/rsm/resumeList.do" id="goTologin2" >
							<span>이력서</span>
						</a>
						<a href="/cdp/sint/qestnlst/questionList.do" id="goTologin3" >
							<span>자기소개서</span>
						</a>
						<a href="/cdp/imtintrvw/intrvwitr/interviewIntro.do" id="goTologin4" >
							<span>모의 면접</span>
						</a>
						<a href="/cdp/aifdbck/rsm/aiFeedbackResumeList.do" id="goTologin5" >
							<span>AI 피드백</span>
						</a>
					</div>
				</div>
			</div>
			<div class="mega-menu__row">
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">상담</div>
					<div class="mega-menu__links">
						<a href="/cnslt/resve/crsv/reservation.do">
							<span>상담 예약</span>
						</a>
						<a href="/cnslt/rvw/cnsReview.do">
							<span>상담 후기</span>
						</a>
						<a href="/cnslt/aicns/aicns.do">
							<span>AI 상담</span>
						</a>
					</div>
				</div>
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">프로그램</div>
					<div class="mega-menu__links">
						<a href="/prg/ctt/cttList.do">
							<span>공모전</span>
						</a>
						<a href="/prg/act/vol/volList.do">
							<span>대외 활동</span>
						</a>
						<a href="/prg/std/stdGroupList.do">
							<span>스터디그룹</span>
						</a>
					</div>
				</div>
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">커뮤니티</div>
					<div class="mega-menu__links">
						<a href="/comm/peer/teen/teenList.do">
							<span>또래 게시판</span>
						</a>
						<a href="/comm/path/pathList.do">
							<span>진로/진학 게시판</span>
						</a>
					</div>
				</div>
				<div class="mega-menu__category">
					<div class="mega-menu__category-title">고객센터</div>
					<div class="mega-menu__links">
						<a href="/csc/not/noticeList.do">
							<span>공지사항</span>
						</a>
						<a href="/csc/faq/faqList.do">
							<span>자주 묻는 질문</span>
						</a>
						<a href="/csc/inq/inqryList.do" id="goTologin12">
							<span>1:1 문의</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="floating-bar">
		<button class="floating-bar__button" id="worldcup">
			<img src="/images/worldCup.png" alt="월드컵">
		</button>
		<button class="floating-bar__button" id="chatRooms">
			<img src="/images/chaticon.png" alt="채팅">
			<span id="chatFloatingBadge" class="badge badge--chat" style="display: none;">0</span>
		</button>
		<button class="floating-bar__button" id="roadmap">
			<img src="/images/roadmapicon.png" alt="진로탐색">
		</button>
	</div>

    <!-- 모달 -->
	<div id="customConfirm" class="custom-confirm" style="display: none;">
		<div class="custom-confirm__content">
			<h4>알 림</h4>
			<div class="pData">
				<p id="confirmMessage1"></p>
				<p id="confirmMessage2"></p>
			</div>
			<div class="custom-confirm__buttons">
				<button id="confirmCancel">취소</button>
				<button id="confirmOk" class="confirmOk">확인</button>
			</div>
		</div>
	</div>

	<div id="customConfirm2" class="custom-confirm" style="display: none;">

		<div class="custom-confirm__content">
			<h4>알 림</h4>
			<div class="pData">
				<p id="confirmMessage3"></p>
				<p id="confirmMessage4"></p>
			</div>
			<div class="custom-confirm__buttons">
				<button id="confirmOk2" class="confirmOk">확인</button>
			</div>
		</div>
	</div>

	<div class="custom-confirm-overlay"></div>

	<%@ include file="/WEB-INF/views/include/chatModal.jsp"%>
	<%@ include file="/WEB-INF/views/include/alarmModal.jsp"%>
</body>
</html>