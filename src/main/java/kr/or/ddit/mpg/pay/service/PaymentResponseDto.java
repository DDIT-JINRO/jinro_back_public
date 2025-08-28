package kr.or.ddit.mpg.pay.service;

import lombok.Data;

/**
 * 서버(Controller)에서 클라이언트(JSP)로 결제 처리 결과를 응답할 때 사용되는 DTO입니다.
 */
@Data
public class PaymentResponseDto {
	private String status; // "success" 또는 "failure"
	private String message; // 사용자에게 보여줄 상세 메시지
	private String orderId; // 처리된 주문의 고유 ID
	
	public PaymentResponseDto(String status, String message, String orderId) {
		this.status = status;
		this.message = message;
		this.orderId = orderId;
	}

}
