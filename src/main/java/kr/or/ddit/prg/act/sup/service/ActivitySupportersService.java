package kr.or.ddit.prg.act.sup.service;

import java.util.List;

import kr.or.ddit.prg.act.service.ActivityVO;

public interface ActivitySupportersService {

	//서포터즈 목록 조회
	public List<ActivityVO> selectSupList(ActivityVO activityVO);

    //서포터즈 총 개수 조회
	public int selectSupCount(ActivityVO activityVO);

    //서포터즈 상세
	public ActivityVO selectSupDetail(String supId);

}
