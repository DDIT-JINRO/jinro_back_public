package kr.or.ddit.prg.act.cr.service;

import java.util.List;

import kr.or.ddit.prg.act.service.ActivityVO;

public interface ActivityCareerExpService {

	// 인터십 총 개수 조회
	public int selectCrCount(ActivityVO activityVO);

	// 인터십 목록 조회
	public List<ActivityVO> selectCrList(ActivityVO activityVO);

	// 인터십 상세
	public ActivityVO selectCrDetail(String crId);

}
