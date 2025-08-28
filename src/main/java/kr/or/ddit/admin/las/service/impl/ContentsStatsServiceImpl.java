package kr.or.ddit.admin.las.service.impl;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import kr.or.ddit.config.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.admin.las.service.ContentStatsService;
import kr.or.ddit.comm.peer.teen.service.TeenCommService;

@Service
public class ContentsStatsServiceImpl implements ContentStatsService {

	private final SecurityConfig securityConfig;

	@Autowired
	private ContentStatsMapper contentStatsMapper;

	@Autowired
	private TeenCommService teenCommService;

	ContentsStatsServiceImpl(SecurityConfig securityConfig) {
		this.securityConfig = securityConfig;
	}

	/**
	 * 일일 콘텐츠 활동 통계 (증감률 포함)
	 * 
	 * @return 게시글 작성, 북마크, 채팅방 개설 수의 오늘/어제 비교 데이터
	 */
	@Override
	public Map<String, Object> getDailySummary() {
		Map<String, Object> result = new HashMap<>();

		// 1. 일일 게시글 작성 수 (어제 대비 증감률)
		int dailyPostsToday = contentStatsMapper.selectDailyPostCountToday();
		int dailyPostsYesterday = contentStatsMapper.selectDailyPostCountYesterday();

		Map<String, Object> postsGrowth = calculateGrowthRate(dailyPostsToday, dailyPostsYesterday);

		// 2. 일일 북마크 수 (어제 대비 증감률)
		int dailyBookmarksToday = contentStatsMapper.selectDailyBookmarkCountToday();
		int dailyBookmarksYesterday = contentStatsMapper.selectDailyBookmarkCountYesterday();

		Map<String, Object> bookmarksGrowth = calculateGrowthRate(dailyBookmarksToday, dailyBookmarksYesterday);

		// 3. 일일 채팅방 개설 수 (어제 대비 증감률)
		int dailyChatRoomsToday = contentStatsMapper.selectDailyChatRoomCountToday();
		int dailyChatRoomsYesterday = contentStatsMapper.selectDailyChatRoomCountYesterday();

		Map<String, Object> chatRoomsGrowth = calculateGrowthRate(dailyChatRoomsToday, dailyChatRoomsYesterday);

		// 결과 설정
		result.put("dailyPosts", dailyPostsToday);
		result.put("dailyPostsRate", postsGrowth.get("percentage"));
		result.put("dailyPostsStatus", postsGrowth.get("status"));

		result.put("dailyBookmarks", dailyBookmarksToday);
		result.put("dailyBookmarksRate", bookmarksGrowth.get("percentage"));
		result.put("dailyBookmarksStatus", bookmarksGrowth.get("status"));

		result.put("dailyChatRooms", dailyChatRoomsToday);
		result.put("dailyChatRoomsRate", chatRoomsGrowth.get("percentage"));
		result.put("dailyChatRoomsStatus", chatRoomsGrowth.get("status"));

		return result;
	}

	// 증감률 계산 메서드
	private Map<String, Object> calculateGrowthRate(int currentCount, int previousCount) {
		double percentageChange = 0.0;
		String status = "equal";

		if (previousCount > 0) {
			percentageChange = ((double) (currentCount - previousCount) / previousCount) * 100;

			if (percentageChange > 0) {
				status = "increase";
			} else if (percentageChange < 0) {
				status = "decrease";
			}
		} else if (currentCount > 0) {
			status = "new_entry";
			percentageChange = 100.0;
		}

		DecimalFormat df = new DecimalFormat("#.##");
		String formattedPercentage = df.format(Math.abs(percentageChange));

		Map<String, Object> result = new HashMap<>();
		result.put("percentage", formattedPercentage);
		result.put("status", status);

		return result;
	}

	/**
	 * 로드맵 진행단계별 분포 통계
	 * 
	 * @return 각 단계별 회원 수와 퍼센트 분포
	 */
	@Override
	public Map<String, Object> getRoadmapStepDistribution() {
		Map<String, Object> result = new HashMap<>();

		// 1. 로드맵 참여 회원의 단계별 분포
		List<Map<String, Object>> stepDistribution = contentStatsMapper.selectRoadmapStepDistribution();

		// 2. 로드맵 미참여 회원 통계
		Map<String, Object> nonParticipating = contentStatsMapper.selectNonParticipatingMembers();

		// 3. 월드컵 결과 Top 5 직업
		List<Map<String, Object>> worldcupTop5Jobs = contentStatsMapper.worldcupTopJobs(null);

		// 4. 결과 조합
		result.put("stepDistribution", stepDistribution);
		result.put("nonParticipatingCount", nonParticipating.get("nonParticipatingCount"));
		result.put("nonParticipatingPercentage", nonParticipating.get("nonParticipatingPercentage"));
		result.put("totalMembers", nonParticipating.get("totalMembers"));
		result.put("worldcupTopJobs", worldcupTop5Jobs);

		return result;
	}

	/**
	 * 커뮤니티 활동 통계 (주간/월간 증감률 포함)
	 * 
	 * @param period 'week' 또는 'month'
	 * @return 각 활동별 현재/이전 기간 데이터와 증감률
	 */
	@Override
	public Map<String, Object> getCommunityActivityStats(String period) {
		Map<String, Object> result = new HashMap<>();

		// 1. 전체 활동 통계 조회
		List<Map<String, Object>> activityStats = contentStatsMapper.selectCommunityActivityStats(null);

		// 2. 기간별 데이터 분류 및 증감률 계산
		Map<String, Map<String, Object>> processedStats = processCommunityActivityStats(activityStats, period);

		result.put("period", period);
		result.put("stats", processedStats);

		return result;
	}

	/**
	 * 커뮤니티 활동 통계 데이터 처리 및 증감률 계산
	 * 
	 * @param rawStats 원본 통계 데이터
	 * @param period   분석할 기간 ('week' 또는 'month')
	 * @return 처리된 통계 데이터
	 */
	private Map<String, Map<String, Object>> processCommunityActivityStats(List<Map<String, Object>> rawStats,
			String period) {
		Map<String, Map<String, Object>> result = new HashMap<>();

		// 활동 타입별로 그룹화
		Map<String, Map<String, Integer>> groupedStats = new HashMap<>();

		for (Map<String, Object> stat : rawStats) {
			String activityType = (String) stat.get("activityType");
			String periodType = (String) stat.get("periodType");
			Integer count = ((Number) stat.get("count")).intValue();

			groupedStats.computeIfAbsent(activityType, k -> new HashMap<>()).put(periodType, count);
		}

		// 각 활동 타입별로 증감률 계산
		for (String activityType : groupedStats.keySet()) {
			Map<String, Integer> periodData = groupedStats.get(activityType);
			Map<String, Object> activityResult = new HashMap<>();

			if ("week".equals(period)) {
				int currentWeek = periodData.getOrDefault("current_week", 0);
				int previousWeek = periodData.getOrDefault("previous_week", 0);

				Map<String, Object> growthData = calculateGrowthRate(currentWeek, previousWeek);

				activityResult.put("currentPeriod", currentWeek);
				activityResult.put("previousPeriod", previousWeek);
				activityResult.put("growthRate", growthData.get("percentage"));
				activityResult.put("growthStatus", growthData.get("status"));
				activityResult.put("periodLabel", "이번 주 vs 지난 주");

			} else if ("month".equals(period)) {
				int currentMonth = periodData.getOrDefault("current_month", 0);
				int previousMonth = periodData.getOrDefault("previous_month", 0);

				Map<String, Object> growthData = calculateGrowthRate(currentMonth, previousMonth);

				activityResult.put("currentPeriod", currentMonth);
				activityResult.put("previousPeriod", previousMonth);
				activityResult.put("growthRate", growthData.get("percentage"));
				activityResult.put("growthStatus", growthData.get("status"));
				activityResult.put("periodLabel", "이번 달 vs 지난 달");
			}

			// 활동 타입별 한글명 설정
			String activityName = getActivityTypeName(activityType);
			activityResult.put("activityName", activityName);

			result.put(activityType, activityResult);
		}

		return result;
	}

	/**
	 * 활동 타입별 한글명 반환
	 * 
	 * @param activityType 활동 타입 코드
	 * @return 영문명
	 */
	private String getActivityTypeName(String activityType) {
		switch (activityType) {
		case "POST":
			return "총 게시글 수";
		case "POST_LIKE":
			return "총 게시글 좋아요 수";
		case "REPLY":
			return "총 댓글 수";
		case "REPLY_LIKE":
			return "총 댓글 좋아요 수";
		default:
			return activityType;
		}
	}

	/**
	 * 커뮤니티 이용통계 (게시판별)
	 * 
	 * @param params 필터 조건 (period, startDate, endDate, gender, ageGroup,
	 *               serviceType)
	 * @return 기간별 각 게시판의 게시글 수 통계
	 */
	@Override
	public List<Map<String, Object>> getCommunityUsageStats(Map<String, Object> params) {
		// 파라미터 유효성 검사 및 기본값 설정
		if (params == null) {
			params = new HashMap<>();
		}

		// period 기본값 설정 (daily)
		if (params.get("period") == null || "".equals(params.get("period"))) {
			params.put("period", "daily");
		}

		List<Map<String, Object>> result = contentStatsMapper.selectCommunityUsageStats(params);

		// 결과에 게시판명 추가 및 데이터 가공
		return processCommunityUsageStats(result);
	}

	/**
	 * 커뮤니티 이용통계 데이터 후처리
	 * 
	 * @param rawStats 원본 통계 데이터
	 * @return 가공된 통계 데이터 (게시판명 포함)
	 */
	private List<Map<String, Object>> processCommunityUsageStats(List<Map<String, Object>> rawStats) {
		List<Map<String, Object>> processedStats = new ArrayList<>();

		for (Map<String, Object> stat : rawStats) {
			Map<String, Object> processedStat = new HashMap<>(stat);

			// 각 게시판별 데이터를 배열 형태로 구성
			List<Map<String, Object>> boardStats = new ArrayList<>();

			// 청소년 커뮤니티
			Map<String, Object> teenBoard = new HashMap<>();
			teenBoard.put("boardId", "G09001");
			teenBoard.put("boardName", "청소년 커뮤니티");
			teenBoard.put("count", stat.get("teenCnt"));
			boardStats.add(teenBoard);

			// 공지사항
			Map<String, Object> noticeBoard = new HashMap<>();
			noticeBoard.put("boardId", "G09002");
			noticeBoard.put("boardName", "공지사항");
			noticeBoard.put("count", stat.get("noticeCnt"));
			boardStats.add(noticeBoard);

			// 이력서 템플릿
			Map<String, Object> resumeBoard = new HashMap<>();
			resumeBoard.put("boardId", "G09004");
			resumeBoard.put("boardName", "이력서 템플릿");
			resumeBoard.put("count", stat.get("resumeTemplateCnt"));
			boardStats.add(resumeBoard);

			// 스터디그룹
			Map<String, Object> studyBoard = new HashMap<>();
			studyBoard.put("boardId", "G09005");
			studyBoard.put("boardName", "스터디그룹");
			studyBoard.put("count", stat.get("studyGroupCnt"));
			boardStats.add(studyBoard);

			// 청년 커뮤니티
			Map<String, Object> youthBoard = new HashMap<>();
			youthBoard.put("boardId", "G09006");
			youthBoard.put("boardName", "청년 커뮤니티");
			youthBoard.put("count", stat.get("youthCnt"));
			boardStats.add(youthBoard);

			// 전체 게시글 수 계산
			int totalCount = ((Number) stat.get("teenCnt")).intValue() + ((Number) stat.get("noticeCnt")).intValue()
					+ ((Number) stat.get("resumeTemplateCnt")).intValue()
					+ ((Number) stat.get("studyGroupCnt")).intValue() + ((Number) stat.get("youthCnt")).intValue();

			processedStat.put("boardStats", boardStats);
			processedStat.put("totalCount", totalCount);

			processedStats.add(processedStat);
		}

		return processedStats;
	}

	/**
	 * 월드컵/로드맵 이용현황 통계
	 * 
	 * @param params 필터 조건 (period, startDate, endDate, gender, ageGroup,
	 *               serviceType)
	 * @return 기간별 월드컵/로드맵 이용 현황 통계
	 */
	@Override
	public List<Map<String, Object>> getWorldcupRoadmapUsageStats(Map<String, Object> params) {
		// 파라미터 유효성 검사 및 기본값 설정
		if (params == null) {
			params = new HashMap<>();
		}

		// period 기본값 설정 (daily)
		if (params.get("period") == null || "".equals(params.get("period"))) {
			params.put("period", "daily");
		}

		List<Map<String, Object>> result = contentStatsMapper.selectWorldcupRoadmapUsageStats(params);

		// 결과 데이터 후처리
		return processWorldcupRoadmapUsageStats(result);
	}

	/**
	 * 월드컵/로드맵 이용현황 데이터 후처리
	 * 
	 * @param rawStats 원본 통계 데이터
	 * @return 가공된 통계 데이터 (서비스명 포함)
	 */
	private List<Map<String, Object>> processWorldcupRoadmapUsageStats(List<Map<String, Object>> rawStats) {
		List<Map<String, Object>> processedStats = new ArrayList<>();

		for (Map<String, Object> stat : rawStats) {
			Map<String, Object> processedStat = new HashMap<>(stat);

			// 각 서비스별 데이터를 배열 형태로 구성
			List<Map<String, Object>> serviceStats = new ArrayList<>();

			// 월드컵 서비스
			Map<String, Object> worldcupService = new HashMap<>();
			worldcupService.put("serviceId", "worldcup");
			worldcupService.put("serviceName", "월드컵");
			worldcupService.put("count", stat.get("worldcupCnt"));
			serviceStats.add(worldcupService);

			// 로드맵 서비스
			Map<String, Object> roadmapService = new HashMap<>();
			roadmapService.put("serviceId", "roadmap");
			roadmapService.put("serviceName", "로드맵");
			roadmapService.put("count", stat.get("roadmapCnt"));
			serviceStats.add(roadmapService);

			// 전체 이용 수 계산
			int totalCount = ((Number) stat.get("worldcupCnt")).intValue()
					+ ((Number) stat.get("roadmapCnt")).intValue();

			processedStat.put("serviceStats", serviceStats);
			processedStat.put("totalCount", totalCount);

			// 비율 계산 (백분율)
			if (totalCount > 0) {
				double worldcupPercentage = (((Number) stat.get("worldcupCnt")).doubleValue() / totalCount) * 100;
				double roadmapPercentage = (((Number) stat.get("roadmapCnt")).doubleValue() / totalCount) * 100;

				processedStat.put("worldcupPercentage", Math.round(worldcupPercentage * 100.0) / 100.0);
				processedStat.put("roadmapPercentage", Math.round(roadmapPercentage * 100.0) / 100.0);
			} else {
				processedStat.put("worldcupPercentage", 0.0);
				processedStat.put("roadmapPercentage", 0.0);
			}

			processedStats.add(processedStat);
		}

		return processedStats;
	}

	@Override
	public List<Map<String, Object>> bookmarkCountsStatistic(Map<String, Object> param) {
		return contentStatsMapper.bookmarkCountsStatistic(param);
	}

	@Override
	public List<Map<String, Object>> bookmarkTopN(Map<String, Object> param) {
		if (param == null) {
			param = new HashMap<>();
		}
		if (param.get("limit") == null) {
			param.put("limit", 5); // 기본 TOP 5
		}
		return contentStatsMapper.bookmarkTopN(param);
	}

	@Override
	public List<Map<String, Object>> communityPostDailyTrend(Map<String, Object> param) {
		return contentStatsMapper.communityPostDailyTrend(param);
	}

	@Override
	public List<Map<String, Object>> communityReactionDailyTrend(Map<String, Object> param) {
		return contentStatsMapper.communityReactionDailyTrend(param);
	}

	@Override
	public List<Map<String, Object>> communityTopActiveMembers(Map<String, Object> param) {
		return contentStatsMapper.communityTopActiveMembers(param);
	}

	@Override
	public List<Map<String, Object>> communityTopPostsByEngage(Map<String, Object> param) {
		return contentStatsMapper.communityTopPostsByEngage(param);
	}

	@Override
	public List<Map<String, Object>> worldcupTopJobs(Map<String, Object> param) {
		return contentStatsMapper.worldcupTopJobs(param);
	}

	@Override
	public List<Map<String, Object>> wrSummary(Map<String, Object> param) {
		return contentStatsMapper.wrSummary(param);
	}

	@Override
	public List<Map<String, Object>> wrDailyTrend(Map<String, Object> param) {
		return contentStatsMapper.wrDailyTrend(param);
	}

	@Override
	public List<Map<String, Object>> roadmapCreateCompleteSummary(Map<String, Object> param) {
		return contentStatsMapper.roadmapCreateCompleteSummary(param);
	}

	@Override
	public List<Map<String, Object>> roadmapCreateCompleteDaily(Map<String, Object> param) {
		return contentStatsMapper.roadmapCreateCompleteDaily(param);
	}

	@Override
	public List<Map<String, Object>> selectCommunityTop5PostsByMemBirth(String memId) {

		Map<String, Object> param = new HashMap<>();
		LocalDate to = LocalDate.now();
		LocalDate from = to.minusDays(7);

		param.put("from", from.toString());
		param.put("to", to.toString());
		if (memId == null || "anonymousUser".equals(memId)) {
			return contentStatsMapper.selectCommunityTop5PostsByMemBirth(param);
		}
		// 로그인이 되어있는경우 청년인지 청소년인지 확인해서 해당 커뮤니티 게시글로 제공
		boolean isTeen = teenCommService.isTeen(memId);
		if (isTeen) {
			param.put("ccId", "G09001");
		} else {
			param.put("ccId", "G09006");
		}
		return contentStatsMapper.selectCommunityTop5PostsByMemBirth(param);
	}

}
