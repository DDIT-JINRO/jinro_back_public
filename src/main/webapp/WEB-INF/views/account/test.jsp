<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="../include/header.jsp"%>
<link rel="stylesheet" href="">
<!-- 스타일 여기 적어주시면 가능 -->
<section class="channel">
	<!-- 	여기가 네비게이션 역할을 합니다.  -->
	<div class="channel-title">
		<!-- 대분류 -->
		<div class="channel-title-text">테스트</div> 
	</div>
	<div class="channel-sub-sections">
		<!-- 중분류 -->
		<div class="channel-sub-section-itemIn"><a href="#">테스트</a></div> <!-- 중분류 -->
		<div class="channel-sub-section-item"><a href="#">테스트</a></div>
	</div>
</section>
<div>
	<div class="public-wrapper">
		<!-- 여기는 소분류(tab이라 명칭지음)인데 사용안하는곳은 주석처리 하면됩니다 -->
		<div class="tab-container" id="tabs">
		    <div class="tab ">테스트</div>
		    <div class="tab active">테스트</div>
		    <div class="tab">테스트</div>
		    <div class="tab">테스트</div>
  		</div>
		<!-- 여기부터 작성해 주시면 됩니다 -->
  		<div class="public-wrapper-main">
  			여기가 작성해야할 공간입니다.
  			</br></br></br></br>
  			</br></br></br></br>
  			</br></br></br></br>
  			</br></br></br></br>
  		</div>
	</div>
</div>
<%@ include file="../include/footer.jsp"%>
</body>
</html>
<script>
	// 스크립트 작성 해주시면 됩니다.
	fetch('/api/fetchTest', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({ key1: 'value1', key2: 'value2' }),
	})
	.then(res => {
	  if (!res.ok) throw new Error('요청 실패');
	  return res.text();
	})
	.then(data => {
	  console.log(data);
	})
	.catch(err => {
	  console.error("에러발생");
	});
</script>