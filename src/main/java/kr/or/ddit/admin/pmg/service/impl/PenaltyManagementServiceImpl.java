package kr.or.ddit.admin.pmg.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.admin.pmg.service.PenaltyManagementService;

@Service
public class PenaltyManagementServiceImpl implements PenaltyManagementService {
	
	@Autowired
    private PenaltyManagementMapper penaltyManagementMapper;
    
    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 오늘 접수된 신고 수
            Long todayReportCount = penaltyManagementMapper.selectTodayReportCount();
            
            // 처리 대기중 신고 수
            Long pendingReportCount = penaltyManagementMapper.selectPendingReportCount();
            
            // 정지 회원 비율 계산
            Long totalMembers = penaltyManagementMapper.selectTotalMemberCount();
            Long suspendedMembers = penaltyManagementMapper.selectSuspendedMemberCount();
            
            Double suspendedMemberRatio = 0.0;
            if (totalMembers != null && totalMembers > 0) {
                suspendedMemberRatio = (suspendedMembers.doubleValue() / totalMembers.doubleValue()) * 100;
                suspendedMemberRatio = Math.round(suspendedMemberRatio * 10.0) / 10.0; // 소수점 1자리까지
            }
            
            result.put("todayReportCount", todayReportCount != null ? todayReportCount : 0);
            result.put("pendingReportCount", pendingReportCount != null ? pendingReportCount : 0);
            result.put("suspendedMemberRatio", suspendedMemberRatio);
            result.put("success", true);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "대시보드 통계 조회 중 오류가 발생했습니다.");
        }
        
        return result;
    }
    
    @Override
    public List<Map<String, Object>> getPenaltyTypeStats(Map<String, Object> params) {        
        return penaltyManagementMapper.selectPenaltyTypeStats(params);
    }
}
