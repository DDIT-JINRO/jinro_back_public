package kr.or.ddit.cnslt.resve.crsv.service.impl;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.cnslt.resve.crsv.service.VacationVO;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;

@Mapper
public interface CounselingReserveMapper {

	// 1. 상담 예약 정보 삽입
	int insertReservation(CounselingVO counselingVO);

	// 2. 회원의 특정 시간대 중복 예약 확인(상태 : 신청, 확정) count로 중복 확인
	int selectDuplicateCounselingByMemId(CounselingVO counselingVO);

	// 3. 상담사의 특정 시간대 예약 가능 여부 확인
	int selectReservationByCounselorAndTime(CounselingVO counselingVO);

	// 4. 상담사의 휴가 기간 조회 (휴가 테이블 사용)
	int selectCounselorVacations(VacationVO vacationVO);

	// 5. 상담 예약 상태 업데이트
	int updateReservationStatus(CounselingVO counselingVO);

	// 6. 상담사 상담예약 날짜
	List<Date> selectBookedTimesByCounselorAndDate(CounselingVO counselingVO);

	// 7. 상담사 목록 가져오기
	List<MemberVO> selectCounselorList();

	// 8. 상담목적 가져오기
	List<ComCodeVO> selectCounselCategoryList();

	// 9. 상담방법 가져오기
	List<ComCodeVO> selectCounselMethodList();

	MemberVO counselingReserveMapper(MemberVO memberVO);

	PaymentVO selectLastSubcription(MemberSubscriptionVO currentSub);

	int minusPayConsultCnt(int payId);
}
