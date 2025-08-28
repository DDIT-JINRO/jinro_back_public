package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service;

import java.util.List;

import kr.or.ddit.main.service.MemberVO;

public interface AiImitationInterviewService {

	/**
	 * 사용자 정의 질문 리스트 조회
	 */
	List<InterviewDetailListVO> getCustomQuestionList(MemberVO memberVO);

	/**
	 * 업종별 질문 리스트 조회 (IQ_GUBUN과 ComCodeVO 조인)
	 */
	List<InterviewQuestionVO> getIndustryList();

	/**
	 * 선택된 질문 리스트의 ID로 실제 질문들 조회
	 */
	List<InterviewQuestionVO> getQuestionsByDetailListId(String idlId);

	/**
	 * 업종별 랜덤 질문 조회
	 */
	List<InterviewQuestionVO> getRandomQuestionsByIndustry(String industryCode, int questionCount);

}
