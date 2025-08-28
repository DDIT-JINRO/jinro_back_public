package kr.or.ddit.admin.cmg.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;

@Mapper
public interface ContentsManagementMapper {

	List<CompanyVO> getEntList(CompanyVO companyVO);

	int getAllEntList(CompanyVO companyVO);

	CompanyVO entDetail(String id);

	List<InterviewReviewVO> selectReviewList(InterviewReviewVO interviewReviewVO);

	int selectReviewListTotal(InterviewReviewVO interviewReviewVO);

	List<Map<String, String>> selectIrStatusList();

	InterviewReviewVO selectReviewDetail(String irId);

    int updateInterviewReviewStatus(InterviewReviewVO interviewReviewVO);
    
    int updateVerification(InterviewReviewVO interviewReviewVO);

}
