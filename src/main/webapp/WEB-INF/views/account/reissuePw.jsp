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
				<div class="box">
					<h2>임시 비밀번호가 발급되었습니다</h2>
					<p>아래 임시 비밀번호로 로그인 후 변경해주세요.</p>
					<div class="tempPw">${tempPw}</div>
					<br />
					<p>해당 이메일: ${email}</p>
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
<script>
	// 스크립트 작성 해주시면 됩니다.
</script>