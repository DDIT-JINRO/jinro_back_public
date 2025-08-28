package kr.or.ddit.mpg.pay.service;

import lombok.Data;

/**
 * 클라이언트(JSP)에서 서버(Controller)로 결제 요청 시 전달되는 데이터를 담는 DTO입니다.
 */
@Data
public class PaymentRequestDto {
	private String impUid; // 아임포트 고유 결제 ID
	private String merchantUid; // 상점 주문 번호
	private String customerUid; // 고객 고유 식별자 (빌링키 용)
	private double amount; // 클라이언트가 요청한 결제 금액 (서버 검증용)
	private int subId; // 클라이언트가 선택한 상품번호


}
