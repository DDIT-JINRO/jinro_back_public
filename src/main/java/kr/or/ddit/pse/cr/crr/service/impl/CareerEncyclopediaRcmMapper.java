package kr.or.ddit.pse.cr.crr.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.worldcup.service.JobsVO;

@Mapper
public interface CareerEncyclopediaRcmMapper {

	List<JobsVO> selectCareerRcmList(JobsVO jobs);

	int selectCareerRcmTotal(JobsVO jobs);

	List<String> selectInterestCnList(int memId);

}
