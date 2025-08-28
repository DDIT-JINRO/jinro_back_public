package kr.or.ddit.admin.las.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ContentStatsMapper {

	/**
	 * 북마크 카테고리별 횟수 <br/>
	 * 요구파라미터 <br/>
	 * 1.from 북마크생성 날짜 기간 필터<br/>
	 * 2.to 북마크생성 날짜 기간 필터 <br/>
	 * 날짜는 문자열 yyyy-MM-dd 값으로 전달<br/>
	 * 3.gender 성별필터 <br/>
	 * 남자 G11001<br/>
	 * 여자 G11002<br/>
	 * 4.ageBand 연령필터 <br/>
	 * ALL, U15, 15-19, 20-24, 25-29, 30+ .6종류의 문자열값.<br/>
	 * <br/>
	 * 반환컬럼 : categoryId, categoryName, maleCnt, femaleCnt
	 * @param Map<String, Object> param
	 * @return List<Map<String, Object>>
	 */
	List<Map<String, Object>> bookmarkCountsStatistic(Map<String, Object> param);


	/**
	 * 북마크 상세 TOP N <br/>
	 * 요구 파라미터:<br/>
	 *  - from, to: 문자열 'yyyy-MM-dd'<br/>
	 *  - gender: 'ALL' | 'G11001'(남) | 'G11002'(여)<br/>
	 *  - ageBand: 'ALL' | 'U15' | '15-19' | '20-24' | '25-29' | '30+'<br/>
	 *  - categoryId: 'ALL' | 'G03001'(대학) | 'G03002'(기업) | 'G03004'(직업) | 'G03005'(이력서템플릿) | 'G03006'(학과)<br/>
	 *  - limit: 가져올 개수 (기본 5 권장)<br/>
	 * 반환 컬럼: categoryId, categoryName, targetId, targetName, cnt
	 * @param Map<String, Object> param
	 * @return List<Map<String, Object>>
	 */
	List<Map<String,Object>> bookmarkTopN(Map<String, Object> param);

	List<Map<String,Object>> communityPostDailyTrend(Map<String,Object> param);     // 게시글 작성 추이
	List<Map<String,Object>> communityReactionDailyTrend(Map<String,Object> param); // 댓글/좋아요 추이 (타입별)
	List<Map<String,Object>> communityTopActiveMembers(Map<String,Object> param);   // 활동 회원 TOP N
	List<Map<String,Object>> communityTopPostsByEngage(Map<String,Object> param);   // 반응 높은 글 TOP N

	List<Map<String,Object>> wrSummary(Map<String,Object> param);

	List<Map<String,Object>> wrDailyTrend(Map<String,Object> param);

	// (옵션) 월드컵 인기 직업 TOP N
	List<Map<String,Object>> worldcupTopJobs(Map<String,Object> param);

	List<Map<String,Object>> roadmapCreateCompleteSummary(Map<String,Object> param);
	List<Map<String,Object>> roadmapCreateCompleteDaily(Map<String,Object> param);

	// 청소년/청년 커뮤니티 인기TOP5 -> 파라미터 : 카테고리번호 ccId (G09001, G09006)
	List<Map<String,Object>> selectCommunityTop5PostsByMemBirth(Map<String, Object> param);
	
	// 상단 증감률 보여주는 데이터
	int selectDailyPostCountToday();
	int selectDailyPostCountYesterday();
	int selectDailyBookmarkCountToday();
	int selectDailyBookmarkCountYesterday();
	int selectDailyChatRoomCountToday();
	int selectDailyChatRoomCountYesterday();
	
	// 로드맵 관련 데이터
	List<Map<String, Object>> selectRoadmapStepDistribution();
	Map<String, Object> selectNonParticipatingMembers();
	
	// 커뮤니티 내용
	List<Map<String, Object>> selectCommunityActivityStats(Map<String, Object> params);

	// 커뮤니티 사용량 차트
	List<Map<String, Object>> selectCommunityUsageStats(Map<String, Object> params);
	
	// 월드컵, 로드맵 이용량 차트
	List<Map<String, Object>> selectWorldcupRoadmapUsageStats(Map<String, Object> params);

}
