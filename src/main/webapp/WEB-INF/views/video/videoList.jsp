<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page import="com.google.gson.*"%>
<%@ page import="java.util.*"%>

<!DOCTYPE html>
<html>
<head>
<title>구르미 방 목록</title>
<style>
table {
	border-collapse: collapse;
	width: 100%;
}

th, td {
	border: 1px solid #ccc;
	padding: 8px;
	text-align: center;
}

th {
	background-color: #f2f2f2;
}

button {
	padding: 5px 10px;
}
</style>
</head>
<body>
	<h2>구르미 방 목록</h2>

	<c:if test="${not empty error}">
		<p style="color: red;">${error}</p>
	</c:if>

	<c:if test="${not empty roomList}">
		<table>
			<thead>
				<tr>
					<th>방 ID</th>
					<th>방 제목</th>
					<th>현재 인원</th>
					<th>최대 인원</th>
					<th>시작 시간</th>
					<th>종료 시간</th>
					<th>비밀번호</th>
					<th>입장</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="room" items="${roomList}">
					<tr>
						<td>${room.roomId}</td>
						<td><c:out value="${room.roomTitle}" default="제목 없음" /></td>
						<td>${room.currJoinCnt}</td>
						<td>${room.maxJoinCnt}</td>
						<td>${room.startDate}</td>
						<td>${room.endDate}</td>
						<td><c:choose>
								<c:when test="${room.isDefinePasswd}">O</c:when>
								<c:otherwise>X</c:otherwise>
							</c:choose></td>
						<td>
							<form action="/room/enter" method="post">
							    <input type="hidden" name="roomId" value="${room.roomId}" />
							    <button type="submit">입장</button>
							</form>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</c:if>
</body>
</html>
