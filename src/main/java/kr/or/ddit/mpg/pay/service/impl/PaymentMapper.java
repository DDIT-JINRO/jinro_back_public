package kr.or.ddit.mpg.pay.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;


/**
 * PAYMENT 테이블에 대한 데이터베이스 작업을 정의하는 매퍼 인터페이스입니다.
 */
@Mapper // 스프링 부트에서 MyBatis 매퍼를 스캔하고 빈으로 등록할 수 있도록 돕습니다.
public interface PaymentMapper {

	/**
	 * 새로운 결제 정보를 데이터베이스에 삽입합니다.
	 *
	 * @param payment 삽입할 Payment VO/엔티티 객체
	 * @return 삽입된 행의 수
	 */
	public int insertPayment(PaymentVO paymentVO);

	// 전체 결제 내역 조회 (구독 결제 내역 표시)
	public List<PaymentVO> selectPaymentHistory(int memId);

	// 구독 월간 기능 횟수 초기화
	public int resetUsageCounts();

	public int minusPayMockCnt(int payId);

	public PaymentVO selectLastSubcription(MemberSubscriptionVO memberSubscriptionVO);

}
