package kr.or.ddit.prg.act.cr.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.prg.act.service.ActivityVO;

@Mapper
public interface ActivityCareerExpMapper {

	// 인턴십 총 개수 조회
	public int selectCrCount(ActivityVO activityVO);

	// 인턴십 목록 조회
	public List<ActivityVO> selectCrList(ActivityVO activityVO);

	// 인턴십 상세
	public ActivityVO selectCrDetail(String crId);

	// 조회수 증가
	public void updateCrViewCount(String crId);

}
