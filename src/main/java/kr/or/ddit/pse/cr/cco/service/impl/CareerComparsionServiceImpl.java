package kr.or.ddit.pse.cr.cco.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.pse.cr.cco.service.CareerComparsionService;
import kr.or.ddit.worldcup.service.JobsVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CareerComparsionServiceImpl implements CareerComparsionService {

	@Autowired
	CareerComparsionMapper careerComparsionMapper;
	
	@Override
	public List<JobsVO> selectCareerComparsionList(JobsVO jobs, String memIdStr) {
		
		if (!"".equals(memIdStr) && !"anonymousUser".equals(memIdStr)) {
			jobs.setMemId(Integer.parseInt(memIdStr));
		}
		
		List<JobsVO> jobsVOList = this.careerComparsionMapper.selectCareerComparsionList(jobs);
				
		return jobsVOList;
	}
	
}
