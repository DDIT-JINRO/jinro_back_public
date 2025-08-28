package kr.or.ddit.mpg.pay.service;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PAYMENT 테이블과 매핑되는 엔티티 클래스입니다. 결제 정보를 담고 있습니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVO {
	private int payId; // PAY_ID (결제 고유 ID, PK)
	private int msId; // FK, MEMBER_SUBSCRIPTION의 MS_ID 참조
	private Date payDate; // PAY_DATE (결제일)
	private Double payAmount; // PAY_AMOUNT (결제 금액)
	private String impUid; // IMP_UID (아임포트 결제 고유 번호)
	private String merchantUid; // MERCHANT_UID(주문번호)
	private Integer payResumeCnt; // PAY_RESUME_CNT (결제 재개 횟수)
	private Integer payCoverCnt; // PAY_COVER_CNT (결제 커버 횟수)
	private Integer payConsultCnt; // PAY_CONSULT_CNT (결제 상담 횟수)
	private Integer payMockCnt; // PAY_MOCK_CNT (모의면접 횟수)

	private String subName;
}
