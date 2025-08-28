package kr.or.ddit.cnslt.resve.crsv.service;

import java.util.Date;
import java.util.List;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;

public interface CounselingReserveService {

	/**
	 * 상담 예약에 Redis 분산 락을 임시로 등록하는 메소드.
	 * 
	 * @param counselingVO 상담 예약 정보
	 * @return 락 획득 성공시 turem 실패시 false
	 */
	boolean tryHoldCounsel(CounselingVO counselingVO);

	/**
	 * 등록한 락을 해제하는 메소드
	 */
	void releaseCounselHold(CounselingVO counselingVO);

	/**
	 * 상담 예약을 시도하는 메서드. Redis 분산 락을 사용하여 동시성을 제어합니다.
	 * 
	 * @param counselingVO 상담 예약 정보
	 * @return 예약 성공 시 true, 실패 시 false
	 */
	boolean tryReserveCounsel(CounselingVO counselingVO);

	/**
	 * 상담사 예약 가능 시간 가져오는 메소드
	 */
	List<String> getAvailableTimes(int counselId, Date counselReqDate, int memId);

	/**
	 * 상담사 목록 가져오는 메소드
	 */
	List<MemberVO> selectCounselorList();

	/**
	 * 상담목적 가져오는 메소드
	 */
	List<ComCodeVO> selectCounselCategoryList();

	/**
	 * 상담방법 가져오는 메소드
	 */
	List<ComCodeVO> selectCounselMethodList();

	/**
	 * 회원정보 가져오는 메소드
	 */
	MemberVO selectMemberInfo(MemberVO memberVO);

	/**
	 * 현재 사용중인 마지막 구독결제 정보 가져오기 (상담횟수)
	 */
	PaymentVO selectLastSubcription(MemberSubscriptionVO currentSub);

	/**
	 * 예약확정 신청시 상담 예약 1개 차감
	 */
	int minusPayConsultCnt(int payId);
}
