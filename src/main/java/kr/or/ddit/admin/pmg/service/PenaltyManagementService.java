package kr.or.ddit.admin.pmg.service;

import java.util.List;
import java.util.Map;

public interface PenaltyManagementService {

	/**
     * 대시보드 통계 데이터 조회
     * @return 대시보드 통계 맵
     */
    Map<String, Object> getDashboardStats();
    
    /**
     * 제재 유형 분포 데이터 조회
     * @param params 필터링 조건
     * @return 제재 유형별 통계 리스트
     */
    List<Map<String, Object>> getPenaltyTypeStats(Map<String, Object> params);
}
