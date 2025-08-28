package kr.or.ddit.pse.cr.crr.service;

import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.worldcup.service.JobsVO;

public interface CareerEncyclopediaRcmService {

	ArticlePage<JobsVO> selectCareerRcmList(JobsVO jobs, String memId);

}
