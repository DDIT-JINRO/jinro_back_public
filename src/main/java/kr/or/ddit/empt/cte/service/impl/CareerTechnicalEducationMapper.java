package kr.or.ddit.empt.cte.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.empt.cte.service.CareerTechnicalEducationVO;

@Mapper
public interface CareerTechnicalEducationMapper {

	public int getTotal(CareerTechnicalEducationVO educationVO);

	public List<CareerTechnicalEducationVO> getList(CareerTechnicalEducationVO educationVO);
	
}
