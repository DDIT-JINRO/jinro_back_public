package kr.or.ddit.prg.act.sup.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.prg.act.service.ActivityVO;

@Mapper
public interface ActivitySupportersMapper {

	// 서포터즈 목록 조회
	public List<ActivityVO> selectSupList(ActivityVO activityVO);

	// 서포터즈 총 개수 조회
	public int selectSupCount(ActivityVO activityVO);

	// 서포터즈 상세
	public ActivityVO selectSupDetail(String supId);

	// 조회수 증가
	public int updateSupViewCount(String supId);

}
