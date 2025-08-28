package kr.or.ddit.admin.las.service;

import java.util.List;
import java.util.Map;

public interface ContentStatsService {
	
	// 추가 함수들
	Map<String, Object> getDailySummary();
	
	Map<String, Object> getRoadmapStepDistribution();
	
	Map<String, Object> getCommunityActivityStats(String period);
	
	List<Map<String, Object>> getCommunityUsageStats(Map<String, Object> params);
	
	List<Map<String, Object>> getWorldcupRoadmapUsageStats(Map<String, Object> params);
	
	// 기존 함수들
	List<Map<String, Object>> bookmarkCountsStatistic(Map<String, Object> param);

	List<Map<String,Object>> bookmarkTopN(Map<String, Object> param);

	List<Map<String,Object>> communityPostDailyTrend(Map<String,Object> param);

	List<Map<String,Object>> communityReactionDailyTrend(Map<String,Object> param);

	List<Map<String,Object>> communityTopActiveMembers(Map<String,Object> param);

	List<Map<String,Object>> communityTopPostsByEngage(Map<String,Object> param);

	List<Map<String,Object>> worldcupTopJobs(Map<String,Object> param);

	List<Map<String,Object>> wrSummary(Map<String,Object> param);

	List<Map<String,Object>> wrDailyTrend(Map<String,Object> param);

	List<Map<String,Object>> roadmapCreateCompleteSummary(Map<String,Object> param);

	List<Map<String,Object>> roadmapCreateCompleteDaily(Map<String,Object> param);

	List<Map<String, Object>> selectCommunityTop5PostsByMemBirth(String memId);

}
