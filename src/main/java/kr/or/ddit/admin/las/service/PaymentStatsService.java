package kr.or.ddit.admin.las.service;

import java.util.List;
import java.util.Map;

public interface PaymentStatsService {

    // 총 구독자 수와 신규 구독자 수 통합
    public Map<String, Object> getSubscriberSummary();

    // 당일 기준 총 구독자 수
    public int getTotalSubscriberCount();

    // 당일 새로운 구독자 수
    public int getNewSubscriberCountToday();

    // 구독 결제 매출
    public List<Map<String, Object>> getRevenueStats(Map<String, Object> params);

    // 구독자 수
    public List<Map<String, Object>> getSubscriberCountStats(Map<String, Object> params);

    // 상품별 인기 통계 (기간별, 성별, 나이별 필터링 지원)
    public List<Map<String, Object>> getProductPopularityStats(Map<String, Object> params);

    // AI 기능 이용 내역 (기간별, 성별, 나이별 필터링 지원)
    public List<Map<String, Object>> getAiServiceUsageStats(Map<String, Object> params);

    // 일일 구독 결제 매출 - 대시보드용
    public List<Map<String, Object>> getDailyRevenueForDashboard();

    // 회원 가입 수 대비하여 구독 비율 - 대시보드용
    public List<Map<String, Object>> selectNewUserRevenueRate(Map<String, Object> params);

    // 총 구독 결제 대비하여 신규 구독 결제 비율 - 대시보드용
    public List<Map<String, Object>> selectNewRevenueRateStats(Map<String, Object> params);

    // 대시보드 상단 숫자 통계 (평균매출 vs 예상매출)
    public Map<String, Object> getRevenueSummaryForDashboard();

    // 대시보드 하단 그래프 통계 (전체사용자 vs 구독자)
    public List<Map<String, Object>> getMonthlyUserStatsForDashboard();
}