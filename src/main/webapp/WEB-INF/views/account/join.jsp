<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/include/header.jsp"%>
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>
<link rel="stylesheet" href="/css/account/join/joinPage.css">
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
		<div id="emailModal" class="modal">
			<div class="modal-content">
				<span class="close">&times;</span>
				<h2>이메일 인증</h2>
				<p id="emailStatusMessage" style="color: green; font-weight: 600; margin: 10px 0;">사용 가능한 이메일입니다.</p>
				<p id="userEmailInfo"></p> <br />
				<button id="sendEmailBtn">인증 메일 전송</button>
				<div id="authCodeBox" style="display: none; margin-top: 10px;">
					<input type="text" id="authCodeInput" placeholder="인증코드 입력" />
					<button id="verifyCodeBtn">확인</button>
				</div>
				<p id="timer" style="margin-top: 10px;"></p>
			</div>
		</div>
		<div class="public-wrapper-main-join">
			<div class="dpfx2">
				<div class="signup-container2">
					<div class="top-text">
						<span>이미 커리어패스 회원이신가요?</span>
						<a href="/login">로그인</a>
					</div>
				</div>
			</div>
			<div class="dpfx">
				<div class="signup-container">
				<p class="pTagInfo">※모든 항목은 필수 입력란 입니다.</p>
					<form action="/join/memberJoin.do" method="post">
						<div class="input-row">
							<label for="email">이메일</label>
							<input class="inputWt" type="email" id="email" name="memEmail" placeholder="이메일을 입력해주세요." />
							<button type="button" onclick="emailCheck()">이메일 인증</button>
						</div>
						<p id="emailError"></p>

						<div class="input-row">
							<label for="nickname">닉네임</label>
							<input type="text" class="inputWt" id="nickname" name="memNickname" placeholder="닉네임을 입력해주세요." />

							<button id="nicknameCheck" type="button">중복 확인</button>
						</div>
						<p id="nicknameError"></p>

						<div class="input-row2">
							<label for="password">비밀번호</label>
							<input type="password" class="inputWt2" class="line-flex" id="password" placeholder="비밀번호를 입력해주세요." />
						</div>
						<p id="tempSpace"></p>
						<div class="input-row2">
							<label for="passwordConfirm">비밀번호 확인</label>
							<input class="inputWt2" type="password" id="passwordConfirm" name="memPassword" placeholder="비밀번호를 한 번 더 입력해주세요." />
						</div>
						<p id="passwordError"></p>
						<div class="input-row">
							<label for="phone">전화번호</label>
							<button type="button" id="phoneAccess">전화번호 인증</button>
							<input type="tel" class="inputWt" id="phone" readonly="readonly" name="memPhoneNumber" placeholder="전화번호 인증을 해주세요." />
						</div>
						<p id=""></p>
						<div class="input-row2">
							<label for="name">이름</label>
							<input class="inputWt2" type="text" id="name" readonly="readonly" name="memName" placeholder="자동입력란입니다." />
						</div>
						<p id="nameError"></p>
						<div class="input-row2">
							<label for="birth">생년월일</label>
							<input class="inputWt2" type="text" id="birth" readonly="readonly" name="memBirth" placeholder="자동입력란입니다." />
						</div>
						<p id=""></p>
						<div class="input-row2">
							<label for="birth">성별</label>

							<input type="radio" id="genMale" name="memGenView" disabled="disabled">
							남성
							<input type="radio" id="genFemale" name="memGenView" disabled="disabled">
							여성

							<input class="inputWt2" type="hidden" id="gen" readonly="readonly" name="memGen" placeholder="자동입력란입니다." />
						</div>

						<!-- 						<div class="input-gen"> -->
						<!-- 							<div class="gender-wt">성별</div> -->
						<!-- 							<div class="gender-row"> -->
						<!-- 								<label><input type="radio" name="gender" value="male" -->
						<!-- 									checked /> 남</label> <label><input type="radio" name="gender" -->
						<!-- 									value="female" /> 여</label> -->
						<!-- 							</div> -->
						<!-- 						</div> -->

						<!-- 						<label for="birth">생년월일</label> <input type="date" id="birth" -->
						<!-- 							placeholder="생년월일" /> -->

						<div class="checkboxes">
							<div class="reqAgree">
								<label>
									<input id="reqchk" type="checkbox" />
									이용약관 동의
									<span class="minimal" style="color: red;">필수</span>
								</label>
								<div class="agreeBorder" id="showTermsOfService">내용보기</div>
							</div>

							<div class="solAgree">
								<label>
									<input id="infochk" type="checkbox" />
									개인정보 수집 및 이용 동의
									<span class="minimal" style="color: red;">필수</span>
								</label>
								<div class="agreeBorder" id="showPrivacyPolicy">내용보기</div>
							</div>
							<!-- <div class="eventAgree">
								<label>
									<input type="checkbox" value="mail"/>
									이벤트 등 프로모션 메일 수신 동의
									<span class="minimal">선택</span>
								</label>
								<div class="agreeBorder">내용보기</div>
							</div>
							<div class="eventAgree">
								<label>
									<input type="checkbox" value="kakao"/>
									카카오톡 수신 동의
									<span class="minimal">선택</span>
								</label>
								<div class="agreeBorder">내용보기</div>
							</div> -->
						</div>
						<div class="tooltip-wrapper">
							<button class="btn-signup" type="submit" disabled="disabled" id="joinBtn">회원가입</button>
							<span class="tooltip-text">모든 필수사항을 입력해주세요</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/views/include/footer.jsp"%>
</body>
</html>
<script src="/js/account/join.js">
	
</script>