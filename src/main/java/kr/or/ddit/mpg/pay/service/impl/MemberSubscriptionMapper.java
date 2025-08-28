package kr.or.ddit.mpg.pay.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;


@Mapper
public interface MemberSubscriptionMapper {

	// 구독 등록
	public int insertMemberSubscription(MemberSubscriptionVO memberSubscriptionVO);

	// 회원 ID로 구독 정보 조회
	public MemberSubscriptionVO selectByMemberId(int memId);

	// 오늘 결제해야 할 구독 목록 조회
	public List<MemberSubscriptionVO> findSubscriptionsDueForToday();

	// 정기결제 성공 후 구독 정보 업데이트
	public int updateAfterRecurringPayment(int msId);

	// 활성화된 구독 정보 조회
	public MemberSubscriptionVO findActiveSubscriptionByMemberId(int memId);

	// 구독 상태를 '취소'로 변경
	public int updateStatusToCancelled(int msId);

	// 새로운 구독정보를 db에 insert
	public int insertNewSubscription(MemberSubscriptionVO newSub);

	// 예약된 구독 정보 조회
	public MemberSubscriptionVO findReservedSubscriptionByMemberId(int memId);

	// 이전에 취소했던 원래 구독 정보 조회(가장 최신 'n' 상태 구독)
	public MemberSubscriptionVO findCancelledOriginalSubscription(int memId);

	// 예약된 구독은 DB에서 삭제
	public void deleteSubscriptionById(int msId);

	// 원래 구독의 상태를 다시 'Y'로 복원
	public void reactivateSubscriptionById(int msId);

	//내일이 결제일인 구독 목록을 DB에서 조회
	public List<MemberSubscriptionVO> findSubscriptionsDueTomorrow();
}
