package kr.or.ddit.admin.las.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.las.service.ContentStatsService;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/admin/las/cont")
public class ContentStatsController {

	@Autowired
	private ContentStatsService contentStatsService;
	
	// 상단 증감 내용들
	@GetMapping("/daily-summary")
	public Map<String, Object> getDailySummary() {
	    return contentStatsService.getDailySummary();
	}
	
	// 로드맵 진행단계별 분포 통계
	@GetMapping("/roadmap/step-distribution")
	public Map<String, Object> getRoadmapStepDistribution() {
	    return contentStatsService.getRoadmapStepDistribution();
	}
	
	/**
	 * 커뮤니티 활동 통계 (주간/월간 증감률 포함)
	 * @param period 'week' 또는 'month' (기본값: week)
	 */
	@GetMapping("/community/activity-stats")
	public Map<String, Object> getCommunityActivityStats(@RequestParam(defaultValue = "week") String period) {
	    return contentStatsService.getCommunityActivityStats(period);
	}
	
	/**
	 * 커뮤니티 이용통계 (게시판별)
	 * @param params 필터 조건 파라미터
	 * @return 기간별 각 게시판의 게시글 수 통계
	 */
	@GetMapping("/community/usage-stats")
	public List<Map<String, Object>> getCommunityUsageStats(@RequestParam Map<String, Object> params) {
	    return contentStatsService.getCommunityUsageStats(params);
	}
	
	/**
	 * 월드컵/로드맵 이용현황 통계
	 * @param params 필터 조건 파라미터
	 * @return 기간별 월드컵/로드맵 이용 현황 통계
	 */
	@GetMapping("/worldcup-roadmap/usage-stats")
	public List<Map<String, Object>> getWorldcupRoadmapUsageStats(@RequestParam Map<String, Object> params) {
	    return contentStatsService.getWorldcupRoadmapUsageStats(params);
	}

	@GetMapping("/bookmark/category-stacked")
	public List<Map<String, Object>> bookmarkCategoryCounts(@RequestParam Map<String, Object> param){
		return contentStatsService.bookmarkCountsStatistic(param);
	}

	@GetMapping("/bookmark/top")
	public List<Map<String, Object>> bookmarkTopN(@RequestParam Map<String, Object> param){
		return contentStatsService.bookmarkTopN(param);
	}
	//============
	@GetMapping("/community/postDaily")
	public List<Map<String, Object>> communityPostDaily(Map<String, Object> param){
		return contentStatsService.communityPostDailyTrend(param);
	}

	@GetMapping("/community/reactionDaily")
	public List<Map<String, Object>> communityReactionDaily(Map<String, Object> param){
		return contentStatsService.communityReactionDailyTrend(param);
	}

	@GetMapping("/worldcup-roadmap/summary")
	public List<Map<String, Object>> communityTopMem(Map<String, Object> param){
		return contentStatsService.communityTopActiveMembers(param);
	}

	@GetMapping("/worldcup-roadmap/daily")
	public List<Map<String, Object>> communityTopPost(Map<String, Object> param){
		return contentStatsService.communityTopPostsByEngage(param);
	}

	@GetMapping("/community/top-members")
	public List<Map<String, Object>> worldcupTopJobs(Map<String, Object> param){
		return contentStatsService.worldcupTopJobs(param);
	}

	@GetMapping("/community/top-posts")
	public List<Map<String, Object>> wrSummary(Map<String, Object> param){
		return contentStatsService.wrSummary(param);
	}

	@GetMapping("/worldcup/top-jobs")
	public List<Map<String, Object>> wrDailyTrend(Map<String, Object> param){
		return contentStatsService.wrDailyTrend(param);
	}

	@GetMapping("/roadmap/create-complete/summary")
	public List<Map<String, Object>> roadmapCreateCompleteSummary(Map<String, Object> param){
		return contentStatsService.roadmapCreateCompleteSummary(param);
	}

	@GetMapping("/roadmap/create-complete/daily")
	public List<Map<String, Object>> roadmapCreateCompleteDaily(Map<String, Object> param){
		return contentStatsService.roadmapCreateCompleteDaily(param);
	}

	@GetMapping("/community/top5/main")
	public List<Map<String, Object>> communityTop5Main(@AuthenticationPrincipal String memId){
		return contentStatsService.selectCommunityTop5PostsByMemBirth(memId);
	}

}
