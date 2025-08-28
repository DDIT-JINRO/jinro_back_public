package kr.or.ddit.pse.cr.cco.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.worldcup.service.JobsVO;

@Mapper
public interface CareerComparsionMapper {

	List<JobsVO> selectCareerComparsionList(JobsVO jobs);

}
