package kr.or.ddit.empt.ivfb.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.mpg.mif.inq.service.VerificationVO;

@Mapper
public interface InterviewFeedbackMapper {
	
	List<InterviewReviewVO> selectInterviewFeedbackList(InterviewReviewVO interviewReviewVO);

	int selectInterviewReviewListTotal(InterviewReviewVO interviewReviewVO);
	
	List<CompanyVO> selectCompanyList(String cpName);

	void updateInterviewFeedback(InterviewReviewVO interviewReview);

	void updateVerification(VerificationVO verification);

	void deleteInterviewFeedback(int irId);

	InterviewReviewVO selectInterviewFeedback(int irId);

	List<UniversityVO> selectUniversityList(String univName);

}
