package kr.or.ddit.empt.ivfb.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.util.ArticlePage;

public interface InterviewFeedbackService {

	ArticlePage<InterviewReviewVO> selectInterviewFeedbackList(InterviewReviewVO interviewReviewVO);

	List<CompanyVO> selectCompanyList(String cpName);

	void updateInterviewFeedback(String memId, InterviewReviewVO interviewReview, MultipartFile file, String veriCategory);

	void deleteInterviewFeedback(String memId, int irId);

	InterviewReviewVO selectInterviewFeedback(String memId, int irId);

	void updateInterviewFeedback(String memId, InterviewReviewVO interviewReview);

	List<UniversityVO> selectUniversityList(String univName);

}
