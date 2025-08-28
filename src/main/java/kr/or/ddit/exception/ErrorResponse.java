package kr.or.ddit.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
	private int status; // HTTP 상태 코드 (예: 404)
	private String error; // HTTP 상태 이름 (예: "NOT_FOUND")
	private String code; // 커스텀 에러 코드 (예: "USER_NOT_FOUND")
	private String message; // 에러 상세 메시지
	private String developerMessage; // 개발자/로그용 메시지
}
