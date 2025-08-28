<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/account/loginPage.css">
<!-- 스타일 여기 적어주시면 가능 -->

<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<!-- 		<div class="tab-container" id="tabs"> -->
		<!-- 		    <div class="tab ">대학 검색</div> -->
		<!-- 		    <div class="tab active">학과 정보</div> -->
		<!-- 		    <div class="tab">입시 정보</div> -->
		<!--   		</div> -->
		<!-- 여기부터 작성해 주시면 됩니다 -->
			<h1 class="login-req-tag">로그인이 필요한 서비스입니다.</h1>
		<div class="public-wrapper-main-login">
			<div class="login-container">
				<div class="login-container-imgBox">
					<img alt="" src="/images/logo.png">
				</div>
				<label for="login-user-email">이메일</label> <input type="email" id="login-user-email"
					placeholder="이메일을 입력해주세요."> <label for="login-user-password">비밀번호</label>
				<input type="password" id="login-user-password" placeholder="비밀번호를 입력해주세요.">

				<div class="login-options">
					<label id="autoLogin"><input type="checkbox"> 자동 로그인</label>
					<label id="saveId"><input type="checkbox"> 아이디 저장</label>
				</div>

				<button class="login-btn" onclick ="loginBtn()">로그인</button>

				<div class="find-links">
					아이디, 비밀번호를 잊으셨나요? <a href="/lgn/findId.do">아이디 찾기</a><a href="/lgn/findPw.do">비밀번호 찾기</a>
				</div>

				<div class="sns-login">
					<button class="kakao">카카오톡 계정으로 로그인</button>
					<button class="naver">네이버 계정으로 로그인</button>
				</div>

				<div class="signup-box">
					아직 커리어 패스의 회원이 아니신가요? <a href="#">회원가입</a>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/account/loginReq.js">
</script>