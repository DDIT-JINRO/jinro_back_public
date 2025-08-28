package kr.or.ddit.cnsLeader.service;

import java.util.List;

import kr.or.ddit.cns.service.CounselingLogVO;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.cns.service.VacationVO;
import kr.or.ddit.util.ArticlePage;

public interface CounselLeaderService {

	/**
	 * 상담일지 작성된 내역들 조회.
	 * 
	 * @param counselingVO
	 * @return
	 */
	ArticlePage<CounselingVO> selectCounselLogList(CounselingVO counselingVO);

	/**
	 * 상담일지 승인, 반려 처리
	 * 
	 * @param counselingLogVO
	 * @return
	 */
	boolean updateCounselLog(CounselingLogVO counselingLogVO);

	/**
	 * 휴가 신청내역 목록 조회
	 * 
	 * @return
	 */
	ArticlePage<VacationVO> selectVacationList(VacationVO vacationVO);

	/**
	 * 휴가 신청내역 상세조회
	 * 
	 * @param vaId
	 * @return
	 */
	VacationVO vacationDetail(int vaId);

	/**
	 * 휴가 승인, 반려 처리
	 * 
	 * @param vacationVO
	 * @return
	 */
	boolean updateVacation(VacationVO vacationVO);

	/**
	 * 휴가 기간 겹치는 상담신청내역 조회
	 * 
	 * @param vacationVO
	 * @return
	 */
	List<CounselingVO> selectRequestedCounselBetweenVacation(int vaId);

	ArticlePage<CounselingVO> selectCounselScheduleList(CounselingVO counselingVO);

	CounselingVO selectCounselDetail(Integer counselId);

	List<CounselingVO> selectMonthlyCounselingData(CounselingVO searchVO);

}
