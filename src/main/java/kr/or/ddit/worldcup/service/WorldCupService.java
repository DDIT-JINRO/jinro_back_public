package kr.or.ddit.worldcup.service;

import java.util.List;

public interface WorldCupService {

	public List<ComCodeVO> selectCategories(String round);

	public List<JobsVO> selectJobsByCategory(ComCodeVO comCodeVO);

	public JobsVO selectJobById(JobsVO jobsVO);

	public int insertWorldcupResult(JobsVO jobsVO,int id);

	public ComCodeVO selectComCodeNameByccId(ComCodeVO comCodeVO);
}
