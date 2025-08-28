package kr.or.ddit.pse.cr.crl.service;

import java.util.Map;

import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.worldcup.service.JobsVO;

public interface CareerEncyclopediaService {

	Map<String, String> selectJobLclCode();

	ArticlePage<JobsVO> selectCareerList(JobsVO jobs, String memId);

	JobsVO selectCareerDetail(JobsVO jobs, String memId);

	void updateCareer(JobsVO jobs);
	
}
