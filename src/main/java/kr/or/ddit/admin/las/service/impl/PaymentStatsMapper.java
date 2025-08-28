package kr.or.ddit.admin.las.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PaymentStatsMapper {

    // 당일 기준 총 구독자 수
    int selectTotalSubscriberCount();

    // 당일 새로운 구독자 수
    int selectNewSubscriberCountToday();

    // 구독 결제 매출
    List<Map<String, Object>> selectRevenueStats(Map<String, Object> params);

    // 구독자 수
    List<Map<String, Object>> selectSubscriberCountStats(Map<String, Object> params);

    // 상품별 인기 통계 (기간별, 성별, 나이별 필터링 지원)
    List<Map<String, Object>> selectProductPopularityStats(Map<String, Object> params);

    // AI 기능 이용 내역 (기간별, 성별, 나이별 필터링 지원)
    List<Map<String, Object>> selectAiServiceUsageStats(Map<String, Object> params);

    // 일일 구독 결제 매출 - 대시보드용
    List<Map<String, Object>> selectDailyRevenueForDashboard();

    // 회원 가입 수 대비하여 구독 비율 - 대시보드용
    List<Map<String, Object>> selectNewUserRevenueRate(Map<String, Object> params);

    // 총 구독 결제 대비하여 신규 구독 결제 비율 - 대시보드용
    List<Map<String, Object>> selectNewRevenueRateStats(Map<String, Object> params);

    // 대시보드 상단 숫자 통계 (평균매출 vs 예상매출)
    Map<String, Object> getRevenueSummaryForDashboard();

    // 대시보드 하단 그래프 통계 (전체사용자 vs 구독자)
    List<Map<String, Object>> getMonthlyUserStatsForDashboard();
    
    // 지난달 총 구독자 수
    int selectTotalSubscriberCountLastMonth();
    
    // 어제 새로운 구독자 수
    int selectNewSubscriberCountYesterday();
}