package kr.or.ddit.worldcup.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.ddit.worldcup.service.ComCodeVO;
import kr.or.ddit.worldcup.service.JobsVO;
import kr.or.ddit.worldcup.service.WorldCupService;
import kr.or.ddit.worldcup.service.WorldCupVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorldCupServiceImpl implements WorldCupService {

	private final WorldCupMapper worldCupMapper;

	@Override
	public List<ComCodeVO> selectCategories(String round) {
		// TODO Auto-generated method stub
		return worldCupMapper.selectCategories(round);
	}

	@Override
	public List<JobsVO> selectJobsByCategory(ComCodeVO comCodeVO) {
		// TODO Auto-generated method stub
		return worldCupMapper.selectJobsByCategory(comCodeVO);
	}

	@Override
	public JobsVO selectJobById(JobsVO jobsVO) {
		
		jobsVO = worldCupMapper.selectJobById(jobsVO);
		List<String> relatedJobs = worldCupMapper.selectRelatedJobNames(jobsVO);
		jobsVO.setJobsRel(relatedJobs);
		return jobsVO;
	}

	@Override
	public int insertWorldcupResult(JobsVO jobsVO,int id) {
		
		WorldCupVO worldCupVO= new WorldCupVO();
		worldCupVO.setMemId(id);
		worldCupVO.setWdResult(jobsVO.getJobCode());
		
		return worldCupMapper.insertWorldcupResult(worldCupVO);
	}

	@Override
	public ComCodeVO selectComCodeNameByccId(ComCodeVO comCodeVO) {
		// TODO Auto-generated method stub
		return worldCupMapper.selectComCodeNameByccId(comCodeVO);
	}
}
