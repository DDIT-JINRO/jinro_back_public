<%@ include file="/WEB-INF/views/include/header.jsp"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<style>
  /* header.jsp가 렌더링하는 영역 통째로 숨기기 */
  #header, .header, header {
    display: none !important;
  }
</style>
</head>
<body>
<script>
    showConfirm2("${message}","",
			() => {
			    history.back();
			}
		);
  	return;
</script>
</body>
</html>
