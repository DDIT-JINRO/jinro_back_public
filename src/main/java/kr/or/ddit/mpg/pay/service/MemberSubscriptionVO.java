package kr.or.ddit.mpg.pay.service;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberSubscriptionVO {
	private int msId; // PK, MEMBER_SUBSCRIPTION의 고유 ID
	private int memId; // FK, 회원 ID
	private int subId; // FK, 구독 상품 ID
	private String customerUid; // 아임포트 고객 식별자
	private String subStatus; // 구독 상태 (Y/N)
	private Date subStartDt; // 구독 시작일
	private Date subEndDt; // 구독 종료일
	private Date lastPayDt; // 최종 결제 성공일
	private Integer recurPayCnt; // 정기 결제 횟수
	private Date createdDt; // 생성 일시
	private Date updatedDt; // 최종 수정 일시
	private Double subPrice;
}
