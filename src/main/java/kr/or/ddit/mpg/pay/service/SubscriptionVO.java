package kr.or.ddit.mpg.pay.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SUBSCRIBE 테이블과 매핑되는 엔티티 클래스입니다. 사용자 구독 정보를 담고 있습니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionVO {
	private int subId; // SUB_ID (구독 고유 ID, PK)
	private String subName; // SUB_NAME (구독 상품명)
	private String subRole; // SUB_ROLE (해당 역할)
	private String subBenefit; // SUB_BENEFIT (구독 혜택)
	private String subActiveYn; // SUB_ACTIVE_YN (구독 활성화 여부 Y/N)
	private Double subPrice; // SUB_PRICE (구독 가격)
	private int fileGroupId; // FILE_GROUP_ID (파일 그룹 ID)

}
