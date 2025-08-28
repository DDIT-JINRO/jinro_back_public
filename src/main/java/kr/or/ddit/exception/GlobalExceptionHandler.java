package kr.or.ddit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// 커스텀 예외 처리
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ErrorResponse> handleCustomException(CustomException e, HttpServletRequest request) {
		ErrorCode errorCode = e.getErrorCode();

		ErrorResponse response = new ErrorResponse(errorCode.getStatus().value(), errorCode.getStatus().name(),
				errorCode.getCode(), errorCode.getMessage(), e.getMessage());

		return ResponseEntity.status(errorCode.getStatus()).body(response);
	}

	// 예상치 못한 모든 예외 처리
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {
		ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

		ErrorResponse response = new ErrorResponse(errorCode.getStatus().value(), errorCode.getStatus().name(),
				errorCode.getCode(), errorCode.getMessage(), e.getMessage()

		);

		return ResponseEntity.status(errorCode.getStatus()).contentType(MediaType.APPLICATION_JSON).body(response);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e) {
		ErrorResponse response = new ErrorResponse(HttpStatus.METHOD_NOT_ALLOWED.value(),
				HttpStatus.METHOD_NOT_ALLOWED.name(), "METHOD_NOT_ALLOWED", "허용되지 않은 요청 방식입니다: " + e.getMethod(),
				e.getMessage());
		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFound(NoHandlerFoundException e) {
		ErrorResponse response = new ErrorResponse(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.name(),
				"NOT_FOUND", "요청한 URL을 찾을 수 없습니다: " + e.getRequestURL(), e.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

}
