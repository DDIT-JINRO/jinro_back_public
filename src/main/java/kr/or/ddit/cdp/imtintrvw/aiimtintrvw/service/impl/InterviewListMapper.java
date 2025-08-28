package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailListVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewQuestionVO;
import kr.or.ddit.main.service.MemberVO;

@Mapper
public interface InterviewListMapper {

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
	 * 
	 * @param idlId 질문 리스트 ID
	 * @return 질문 목록
	 */
	List<InterviewQuestionVO> getQuestionsByDetailListId(@Param("idlId") String idlId);

	/**
	 * 업종별 랜덤 질문 조회
	 * 
	 * @param industryCode  업종 코드
	 * @param questionCount 질문 개수
	 * @return 랜덤 질문 목록
	 */
	List<InterviewQuestionVO> getRandomQuestionsByIndustry(@Param("industryCode") String industryCode, @Param("questionCount") int questionCount);

}
