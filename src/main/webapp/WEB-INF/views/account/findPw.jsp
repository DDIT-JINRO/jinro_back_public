<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<link rel="stylesheet" href="/css/account/findIdPage.css">
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
		<div class="public-wrapper-main">
			<div class="findEmail-container">
				<div class="findEmail-container-imgBox">
					<img alt="" src="/images/logo.png">
				</div>
				<label for="findEmail-user-email">이메일</label> <input type="email"
					id="findEmail-user-email" name="email" placeholder="이메일을 입력해주세요.">
				<label for="findEmail-user-name">이름</label> <input type="email"
					id="findEmail-user-name" name="name" placeholder="이름을 입력해주세요.">


				<button class="findEmail-btn" id="reissueBtn" onclick="ReissuePwBtn()">임시
					비밀번호 발급</button>
				<div class="find-links">
					이메일을 잊으셨나요? <a href="/lgn/findId.do">이메일 찾기</a>
				</div>
				<div class="signup-box">
					로그인하실 준비가 되셨나요? <a href="/login">로그인</a>
				</div>
			</div>
		</div>
	</div>
</div>
<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/account/findPw.js">
</script>