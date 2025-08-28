package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.AiImitationInterviewService;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailListVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewQuestionVO;
import kr.or.ddit.main.service.MemberVO;

@Service
public class AiImitationInterviewServiceImpl implements AiImitationInterviewService {

	@Autowired
	InterviewListMapper interviewListMapper;

	@Override
	public List<InterviewDetailListVO> getCustomQuestionList(MemberVO memberVO) {
		return interviewListMapper.getCustomQuestionList(memberVO);
	}

	@Override
	public List<InterviewQuestionVO> getIndustryList() {
		return interviewListMapper.getIndustryList();
	}

	@Override
	public List<InterviewQuestionVO> getQuestionsByDetailListId(String idlId) {
		return interviewListMapper.getQuestionsByDetailListId(idlId);
	}

	@Override
	public List<InterviewQuestionVO> getRandomQuestionsByIndustry(String industryCode, int questionCount) {
		return interviewListMapper.getRandomQuestionsByIndustry(industryCode, questionCount);
	}

}
