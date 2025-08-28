package kr.or.ddit.admin.las.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.ArticlePage;

public interface UsageStatsService {

	// 현재 로그인한 사용자 정보 조회
	public ArticlePage<MemberVO> liveUserList(int currentPage, int size, String keyword, String gen, String loginType);

	// 일별/월별/기간별 사용자 구하기
	public List<UsageStatsVO> userInqury(String selectUserInquiry, String startDate, String endDate, String gender, String ageGroup);

	// 일별/월별/기간별 페이지 방문자 수 조회 TOP10
	public List<VisitVO> visitCount(String selectVisitCount, String startDate, String endDate, String gender, String ageGroup);

	public List<Map<String, Object>> getSingleUserActivityYoY(String memId, String type, String startDate, String endDate);

}
