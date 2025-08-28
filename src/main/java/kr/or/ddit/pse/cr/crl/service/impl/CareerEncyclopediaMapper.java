package kr.or.ddit.pse.cr.crl.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.worldcup.service.JobsVO;

@Mapper
public interface CareerEncyclopediaMapper {

	List<Map<String, String>> selectJobLclCode();

	List<JobsVO> selectCareerList(JobsVO jobs);

	int selectCareerTotal(JobsVO jobs);

	JobsVO selectCareerDetail(JobsVO jobs);

	void updateCareer(JobsVO jobs);

}
