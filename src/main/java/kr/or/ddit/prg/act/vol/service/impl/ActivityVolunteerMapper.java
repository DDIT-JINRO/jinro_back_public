package kr.or.ddit.prg.act.vol.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.prg.act.service.ActivityVO;

@Mapper
public interface ActivityVolunteerMapper {

	// 봉사활동 총 개수 조회
	public int selectVolCount(ActivityVO activityVO);

	// 봉사활동 목록 조회
	public List<ActivityVO> selectVolList(ActivityVO activityVO);

	// 봉사활동 상세
	public ActivityVO selectSupDetail(String volId);

	// 조회수 증가
	public void updateVolViewCount(String volId);

}
