package kr.or.ddit.prg.act.vol.service;

import java.util.List;

import kr.or.ddit.prg.act.service.ActivityVO;

public interface ActivityVolunteerService {

	// 봉사활동 총 개수 조회
	public int selectVolCount(ActivityVO activityVO);

	// 봉사활동 목록 조회
	public List<ActivityVO> selectVolList(ActivityVO activityVO);

	// 봉사활동 상세
	public ActivityVO selectVolDetail(String volId);

}
