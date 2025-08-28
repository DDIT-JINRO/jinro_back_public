package kr.or.ddit.com.report.service;

public interface ReportService {

	/**
	 * 단일조회, 있는지 없는지 조회용
	 * 파라미터 MemIdAndTargetTypeAndTargetId
	 * @param reportVO
	 * @return
	 */
	ReportVO selectReport(ReportVO reportVO);

	/**
	 * 신고하기
	 * 파라미터 7<br/>
	 * targetType G10의 구분. enum타입<br/>
	 * targetId 타입에 따른 대상 기본키ex.게시글번호<br/>
	 * reportReason 신고 사유<br/>
	 * reportStatus	S03의 3가지 상태. enum타입<br/>
	 * reportCompleteId	처리한 관리자 ID 0으로 삽입<br/>
	 * memId	신고자 번호<br/>
	 * fileGroupNo	null허용<br/>
	 * @param reportVO
	 * @return
	 */
	boolean insertReport(ReportVO reportVO);

}
