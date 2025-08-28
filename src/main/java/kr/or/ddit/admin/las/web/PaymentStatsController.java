package kr.or.ddit.admin.las.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.las.service.PaymentStatsService;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/admin/las/payment")
public class PaymentStatsController {

    @Autowired
    private PaymentStatsService paymentStatsService;

    /**
     * 총 구독자 수와 신규 구독자 수 통합 API (증감률 포함)
     * - 총 구독자 수: 지난달 대비 증감률
     * - 신규 구독자 수: 어제 대비 증감률
     * @return 구독자 요약 정보 (수치, 증감률, 상태)
     */
    @GetMapping("/subscriber-summary")
    public ResponseEntity<Map<String, Object>> subscriberSummary() {
        try {
            log.debug("구독자 요약 정보 조회 시작");
            Map<String, Object> result = paymentStatsService.getSubscriberSummary();
            log.debug("구독자 요약 정보 조회 완료: totalSubscribers={}, newSubscribersToday={}", 
                     result.get("totalSubscribers"), result.get("newSubscribersToday"));
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("구독자 요약 정보 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 구독 결제 매출 통계
     * @param params 조회 조건 (period, gender, months 등)
     * @return 매출 통계 리스트
     */
    @GetMapping("/revenue-stats")
    public ResponseEntity<List<Map<String, Object>>> revenueStats(@RequestParam Map<String, Object> params) {
        try {
            log.debug("매출 통계 조회 시작, params: {}", params);
            List<Map<String, Object>> result = paymentStatsService.getRevenueStats(params);
            log.debug("매출 통계 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("매출 통계 조회 중 오류 발생, params: {}", params, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 구독자 수 통계
     * @param params 조회 조건 (period, gender, months 등)
     * @return 구독자 수 통계 리스트
     */
    @GetMapping("/subscriber-stats")
    public ResponseEntity<List<Map<String, Object>>> subscriberStats(@RequestParam Map<String, Object> params) {
        try {
            log.debug("구독자 수 통계 조회 시작, params: {}", params);
            List<Map<String, Object>> result = paymentStatsService.getSubscriberCountStats(params);
            log.debug("구독자 수 통계 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("구독자 수 통계 조회 중 오류 발생, params: {}", params, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 상품별 인기 통계 (기간별, 성별, 나이별 필터링 지원)
     * @param params 조회 조건 (period, gender, ageGroup 등)
     * @return 상품별 인기 통계 리스트
     */
    @GetMapping("/product-popularity")
    public ResponseEntity<List<Map<String, Object>>> productPopularity(@RequestParam Map<String, Object> params) {
        try {
            log.debug("상품별 인기 통계 조회 시작, params: {}", params);
            List<Map<String, Object>> result = paymentStatsService.getProductPopularityStats(params);
            log.debug("상품별 인기 통계 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("상품별 인기 통계 조회 중 오류 발생, params: {}", params, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * AI 기능 이용 내역 통계 (기간별, 성별, 나이별 필터링 지원)
     * @param params 조회 조건 (period, gender, ageGroup 등)
     * @return AI 서비스 이용 통계 리스트
     */
    @GetMapping("/ai-service-usage")
    public ResponseEntity<List<Map<String, Object>>> aiServiceUsage(@RequestParam Map<String, Object> params) {
        try {
            log.debug("AI 서비스 이용 통계 조회 시작, params: {}", params);
            List<Map<String, Object>> result = paymentStatsService.getAiServiceUsageStats(params);
            log.debug("AI 서비스 이용 통계 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("AI 서비스 이용 통계 조회 중 오류 발생, params: {}", params, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 일일 구독 결제 매출 - 대시보드용
     * @return 일일 매출 통계 리스트
     */
    @GetMapping("/daily-revenue")
    public ResponseEntity<List<Map<String, Object>>> dailyRevenueForDashboard() {
        try {
            log.debug("대시보드용 일일 매출 조회 시작");
            List<Map<String, Object>> result = paymentStatsService.getDailyRevenueForDashboard();
            log.debug("대시보드용 일일 매출 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("대시보드용 일일 매출 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 회원 가입 수 대비 구독 비율 - 대시보드용
     * @param params 조회 조건
     * @return 신규 사용자 구독 전환율 통계
     */
    @GetMapping("/newUser-revenueRate")
    public ResponseEntity<List<Map<String, Object>>> newUserRevenueRate(@RequestParam Map<String, Object> params) {
        try {
            log.debug("신규 사용자 구독 전환율 조회 시작, params: {}", params);
            List<Map<String, Object>> result = paymentStatsService.selectNewUserRevenueRate(params);
            log.debug("신규 사용자 구독 전환율 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("신규 사용자 구독 전환율 조회 중 오류 발생, params: {}", params, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 총 구독 결제 대비 신규 구독 결제 비율 - 대시보드용
     * @param params 조회 조건
     * @return 신규 구독 결제 비율 통계
     */
    @GetMapping("/newRevenue-rateStats")
    public ResponseEntity<List<Map<String, Object>>> newRevenueRateStats(@RequestParam Map<String, Object> params) {
        try {
            log.debug("신규 구독 결제 비율 통계 조회 시작, params: {}", params);
            List<Map<String, Object>> result = paymentStatsService.selectNewRevenueRateStats(params);
            log.debug("신규 구독 결제 비율 통계 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("신규 구독 결제 비율 통계 조회 중 오류 발생, params: {}", params, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 대시보드 상단 숫자 통계 (평균매출 vs 예상매출)
     * @return 매출 요약 정보
     */
    @GetMapping("/revenue-summary")
    public ResponseEntity<Map<String, Object>> revenueSummary() {
        try {
            log.debug("대시보드용 매출 요약 조회 시작");
            Map<String, Object> result = paymentStatsService.getRevenueSummaryForDashboard();
            log.debug("대시보드용 매출 요약 조회 완료");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("대시보드용 매출 요약 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 대시보드 하단 그래프 통계 (전체사용자 vs 구독자)
     * @return 월간 사용자 통계
     */
    @GetMapping("/monthly-users")
    public ResponseEntity<List<Map<String, Object>>> monthlyUserStats() {
        try {
            log.debug("대시보드용 월간 사용자 통계 조회 시작");
            List<Map<String, Object>> result = paymentStatsService.getMonthlyUserStatsForDashboard();
            log.debug("대시보드용 월간 사용자 통계 조회 완료, 결과 수: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("대시보드용 월간 사용자 통계 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}