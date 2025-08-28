package kr.or.ddit.cns.service;

import java.util.List;

import kr.or.ddit.util.ArticlePage;

public interface CounselorService {

	/**
	 * 상담사 측에서 본인 상담리스트 조회.
	 * 
	 * @return
	 */
	public List<CounselingVO> selectCounselList();

	/**
	 * 상담사 측에서 본인 상담리스트 중 상담완료된 리스트 조회. 상담일지 작성용
	 * 
	 * @return
	 */
	public ArticlePage<CounselingVO> selectCompletedCounselList(CounselingVO counselingVO);

	/**
	 * 상담번호 파라미터로 상세조회
	 * 
	 * @param counselId
	 * @return
	 */
	public CounselingVO selectCounselDetail(int counselId);

	/**
	 * 상담일지 삽입, 이미 존재하는 상담일지번호면 수정
	 * 
	 * @param counselingLogVO
	 * @return
	 */
	public boolean updateCnsLog(CounselingLogVO counselingLogVO);

	/**
	 * 상담일지에 첨부된 파일 중 단일 파일 삭제.
	 * 
	 * @param groupId
	 * @param seq
	 * @return
	 */
	public boolean deleteFile(Long fileGroupId, int seq);

	/**
	 * 상담사회원 휴가 신청내역 가져오기
	 * 
	 * @param vacationVO
	 * @return
	 */
	public ArticlePage<VacationVO> myVacationList(VacationVO vacationVO);

	/**
	 * 휴가 신청
	 * 
	 * @param vacationVO
	 * @return
	 */
	public boolean insertVacation(VacationVO vacationVO);

	/**
	 * 휴가신청 불가능한 날짜 목록 반환 String format(yyyy-MM-dd)<br/>
	 * 상담확정날짜, 이미 휴가신청된 날짜
	 * 
	 * @param requestor
	 * @return
	 */
	public List<String> disabledDateList(int requestor);

	/**
	 * 상담 에약 확인<br/>
	 * 상담사 Id, 요청 날짜 포함 상담 정보 받아오기
	 * 
	 * @param counselingVO
	 * @return
	 */
	public List<CounselingVO> selectCounselingSchedules(CounselingVO counselingVO);

	public String updateCounselStatus(CounselingVO counselingVO, Integer payId);

	public List<CounselingVO> selectMonthlyCounselingData(CounselingVO searchVO);

}
