package kr.or.ddit.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;


import org.springframework.http.HttpStatus;

public enum ErrorCode {
	INVALID_INPUT(HttpStatus.BAD_REQUEST, "INVALID_INPUT", "잘못된 요청입니다."),
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "사용자를 찾을 수 없습니다."),
	INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SERVER_ERROR", "서버 오류가 발생했습니다."),
	ACCESS_DENIED(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "이 자원에 접근할 권한이 없습니다."),
	INVALID_USER(HttpStatus.UNAUTHORIZED, "INVALID_USER", "로그인을 해주세요."),

	// MyInquiry
	INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD", "비밀번호가 일치하지 않습니다."),
	USER_UPDATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "USER_UPDATE_FAILED", "사용자 정보 수정에 실패했습니다."),
	FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "FILE_UPLOAD_FAILED", "파일 업로드에 실패했습니다."),
	INVALID_AUTHORIZE(HttpStatus.UNAUTHORIZED, "INVALID_AUTHORIZE", "로그인이 필요하거나 유효하지 않은 사용자입니다."),
	INVALID_FILE(HttpStatus.BAD_REQUEST, "INVALID_FILE", "잘못된 파일입니다."),
	
	// Roadmap
	POINT_UPDATE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "POINT_UPDATE_ERROR", "포인트 업데이트에 실패했습니다."),
	MISSION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "MISSION_UPDATE_ERROR", "미션 상태 업데이트에 실패했습니다."),
	FORBIDDEN_OPERATION(HttpStatus.FORBIDDEN, "FORBIDDEN_OPERATION", "허용되지 않는 작업입니다."),
	
	// PasswordChange
	PASSWORD_SAME_AS_OLD(HttpStatus.BAD_REQUEST, "PASSWORD_SAME_AS_OLD", "기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다."),
	PASSWORD_UPDATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "PASSWORD_UPDATE_FAILED", "데이터베이스 오류로 비밀번호 변경에 실패했습니다."),

	// Withdrawal
	USER_ALREADY_WITHDRAWN(HttpStatus.BAD_REQUEST, "USER_ALREADY_WITHDRAWN", "이미 탈퇴 처리된 회원입니다."),
	WITHDRAWAL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "WITHDRAWAL_FAILED", "회원 탈퇴 처리 중 오류가 발생했습니다."),
	
	// interestCn
	NO_INTEREST_CN(HttpStatus.NOT_FOUND, "NO_INTEREST_CN", "관심사 키워드가 없습니다.");

	private final HttpStatus status;
	private final String code;
	private final String message;

	ErrorCode(HttpStatus status, String code, String message) {
		this.status = status;
		this.code = code;
		this.message = message;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getCode() {
		return code;
	}

	public String getMessage() {
		return message;
	}
}
