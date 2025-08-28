package kr.or.ddit.admin.pmg.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.pmg.service.PenaltyManagementService;

@RequestMapping("/admin/pmg")
@RestController
public class PenaltyManagementController {

	@Autowired
    private PenaltyManagementService penaltyManagementService;

    /**
     * 대시보드 기본 통계 조회
     * @return ResponseEntity
     */
    @GetMapping("/getDashboardStats.do")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = penaltyManagementService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 제재 유형 분포 통계 조회
     * @param filterType 필터 타입 (daily/monthly)
     * @param startDate 시작일 (YYYY-MM-DD)
     * @param endDate 종료일 (YYYY-MM-DD)
     * @param month 월 (1-12)
     * @param gender 성별 (M/F)
     * @return ResponseEntity
     */
    @GetMapping("/getPenaltyStats.do")
    public ResponseEntity<Map<String, Object>> getPenaltyTypeStats(
            @RequestParam(value = "filterType", defaultValue = "monthly") String filterType,
            @RequestParam(value = "startDate", required = false) String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "ageGroup", required = false) String ageGroup) {

        Map<String, Object> response = new HashMap<>();

        if("male".equals(gender)) gender = "G11001";
        if("female".equals(gender)) gender = "G11002";

        try {
            Map<String, Object> params = new HashMap<>();
            params.put("filterType", filterType);
            params.put("startDate", startDate);
            params.put("endDate", endDate);
            params.put("gender", gender);
            params.put("ageGroup", ageGroup);

            List<Map<String, Object>> stats = penaltyManagementService.getPenaltyTypeStats(params);

            response.put("success", true);
            response.put("data", stats);
            response.put("totalCount", stats.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "제재 통계 조회 중 오류가 발생했습니다.");
            return ResponseEntity.ok(response);
        }
    }
}
