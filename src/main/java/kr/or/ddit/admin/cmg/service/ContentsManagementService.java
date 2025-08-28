package kr.or.ddit.admin.cmg.service;

import java.util.Map;

import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.util.ArticlePage;

public interface ContentsManagementService {

	ArticlePage<CompanyVO> getEntList(CompanyVO companyVO);

	Map<String, Object> entDetail(String id);

	ArticlePage<InterviewReviewVO> selectReviewList(InterviewReviewVO interviewReviewVO);

	Map<String, String> selectIrStatusList();

	InterviewReviewVO selectReviewDetail(String irId);

	int updateReviewDetail(InterviewReviewVO interviewReviewVO);

}
