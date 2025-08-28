package kr.or.ddit.worldcup.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.worldcup.service.ComCodeVO;
import kr.or.ddit.worldcup.service.JobsVO;
import kr.or.ddit.worldcup.service.WorldCupVO;

@Mapper
public interface WorldCupMapper {
	
	public List<ComCodeVO> selectCategories(String round);

	public List<JobsVO> selectJobsByCategory(ComCodeVO comCodeVO);

	public JobsVO selectJobById(JobsVO jobsVO);

	public int insertWorldcupResult(WorldCupVO worldCupVO);
	
	public List<String> selectRelatedJobNames(JobsVO jobsVO);

	public ComCodeVO selectComCodeNameByccId(ComCodeVO comCodeVO);
}
