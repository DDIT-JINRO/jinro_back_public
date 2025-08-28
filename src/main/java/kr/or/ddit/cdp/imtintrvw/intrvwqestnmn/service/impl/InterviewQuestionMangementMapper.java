package kr.or.ddit.cdp.imtintrvw.intrvwqestnmn.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailListVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewQuestionVO;

@Mapper
public interface InterviewQuestionMangementMapper {

	// 사용자 면접질문 갯수
	public int selectInterviewQuestionTotalBymemId(InterviewDetailListVO interviewDetailListVO);

	// 사용자 면접질문 리스트
	public List<InterviewDetailListVO> selectInterviewQuestionBymemId(InterviewDetailListVO interviewDetailListVO);

	// 면접질문 정보 가져오기
	public InterviewDetailListVO selectByInterviewQuestionId(InterviewDetailListVO interviewDetailListVO);

	// 항목별 자소서내용가져오기
	public List<InterviewDetailVO> selectByInterviewQuestionContentIdList(InterviewDetailListVO interviewDetailListVO);

	// 질문 가져오기
	public InterviewQuestionVO selectByInterviewQuestionQId(InterviewDetailVO interviewDetailVO);

	public int selectMaxInterviewQuestionId();

	// 카트 선택한 질문들 저장
	public void insertInterviewQuestion(InterviewDetailListVO interviewDetailListVO);

	public int selectMaxInterviewDetailId();

	public void insertInterviewDetail(InterviewDetailVO interviewDetailListVO);

	public void updateInterview(InterviewDetailListVO interviewDetailListVO);

	public void updateInterviewDetail(@Param("idId") int idId, @Param("iqId") int iqId,
			@Param("idAnswer") String idAnswer, @Param("idOrder") int idOrder);

	// 상세삭제
	public void deleteInterviewQuestionContent(InterviewDetailListVO interviewDetailListVO);

	// 삭제
	public void deleteInterviewQuestion(InterviewDetailListVO interviewDetailListVO);

}
