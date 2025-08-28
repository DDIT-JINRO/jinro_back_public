package kr.or.ddit.cdp.imtintrvw.intrvwqestnmn.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailListVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewQuestionVO;

public interface InterviewQuestionMangementService {

	// 사용자 면접질문 갯수
	public int selectInterviewQuestionTotalBymemId(InterviewDetailListVO interviewDetailListVO);

	// 사용자 면접질문 리스트
	public List<InterviewDetailListVO> selectInterviewQuestionBymemId(InterviewDetailListVO interviewDetailListVO);

	// 면접질문 정보 가져오기
	public InterviewDetailListVO selectByInterviewQuestionId(InterviewDetailListVO interviewDetailListVO);

	public void cheakInterviewQuestionbyMemId(InterviewDetailListVO interviewDetailListVO, String memId);

	// 항목별 자소서내용가져오기
	public List<InterviewDetailVO> selectByInterviewQuestionContentIdList(InterviewDetailListVO interviewDetailListVO);

	// 질문 가져오기
	public InterviewQuestionVO selectByInterviewQuestionQId(InterviewDetailVO interviewDetailVO);

	// 신규 면접 정보 등록
	public int insertInterviewQuestionId(InterviewDetailListVO interviewDetailListVO);

	public void insertInterviewDetails(int newIdlId, List<Integer> iqIdList, List<String> idAnswerList);

	public void updateInterview(InterviewDetailListVO interviewDetailListVO);

	public void updateInterviewDetails(List<Integer> iqIdList, Map<Integer, Integer> qToIdId,
			List<String> idAnswerList);

	// 면접 전체 삭제
	public void deleteInterviewQuestion(InterviewDetailListVO interviewDetailListVO);

}
