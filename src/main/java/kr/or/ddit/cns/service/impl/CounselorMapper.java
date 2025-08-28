package kr.or.ddit.cns.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.cns.service.CounselingLogVO;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.cns.service.VacationVO;

@Mapper
public interface CounselorMapper {

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
	public List<CounselingVO> selectCompletedCounselList(CounselingVO counselingVO);

	/**
	 * 상담사 측에서 본인 상담리스트 중 상담완료된 리스트 조회. 갯수 카운트 상담일지 작성 페이징용
	 * 
	 * @param counselingVO
	 * @return
	 */
	public int selectTotalCompletedCounselList(CounselingVO counselingVO);

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
	public int updateCnsLog(CounselingLogVO counselingLogVO);

	/**
	 * 현재 상담사 회원 휴가내역 가져오기
	 * 
	 * @param vacationVO
	 * @return
	 */
	public List<VacationVO> selectMyVationList(VacationVO vacationVO);

	/**
	 * 현재 상담사 회원 휴가내역 갯수. 페이징용
	 * 
	 * @param vacationVO
	 * @return
	 */
	public int selectTotalMyVationList(VacationVO vacationVO);

	/**
	 * 휴가 신청.
	 * 
	 * @param vacationVO
	 * @return
	 */
	public int insertVacation(VacationVO vacationVO);

	/**
	 * 휴가 날짜 제한용.<br/>
	 * 현재 날짜 포함. 이후로 상담확정된 정보 받아오기
	 * 
	 * @param requestor
	 * @return
	 */
	public List<CounselingVO> selectMyDeterminedCounselList(int requestor);

	/**
	 * 휴가 날짜 제한용<br/>
	 * 현재 날짜 포함. 이후로 이미 신청 혹은 승인된 휴가 정보 받아오기
	 * 
	 * @param requestor
	 * @return
	 */
	public List<VacationVO> selectMyInProgressVacationList(int requestor);

	/**
	 * 상담 에약 확인<br/>
	 * 상담사 Id, 요청 날짜 포함 상담 정보 받아오기
	 * 
	 * @param counselingVO
	 * @return
	 */
	public List<CounselingVO> selectCounselingSchedules(CounselingVO counselingVO);

	public int updateCounselStatus(CounselingVO counselingVO);

	public int plusPayConsultCnt(int payId);

	public List<CounselingVO> selectMonthlyCounselingData(CounselingVO searchVO);

}
