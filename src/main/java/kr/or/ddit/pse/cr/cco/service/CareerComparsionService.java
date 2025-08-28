package kr.or.ddit.pse.cr.cco.service;

import java.util.List;

import kr.or.ddit.worldcup.service.JobsVO;

public interface CareerComparsionService {

	List<JobsVO> selectCareerComparsionList(JobsVO jobs, String memIdStr);

}
