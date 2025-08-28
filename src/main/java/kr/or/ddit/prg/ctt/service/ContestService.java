package kr.or.ddit.prg.ctt.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.com.ComCodeVO;

public interface ContestService {

	// 공모전 목록 조회
	List<ContestVO> selectCttList(ContestVO contestVO);

	// 공모전 총 개수 조회
	int selectCttCount(ContestVO contestVO);

	// 공모전 상세
	ContestVO selectCttDetail(String cttId);

	// 공모전분류(모집 분야) 목록
	List<ComCodeVO> getContestTypeList();

	// 모집 대상 목록
	List<ComCodeVO> getContestTargetList();

	// merge
	public int updateContest(ContestVO contestVO);

	// delete
	public int deleteContest(String contestId);

	// 메인페이지에 출력될 공모전,대외활동 데이터 가져오기
	List<Map<String, Object>> contestBanner(String memId);
}
