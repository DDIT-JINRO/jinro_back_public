package kr.or.ddit.admin.pmg.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PenaltyManagementMapper {

	// 오늘 접수된 신고 수
    Long selectTodayReportCount();
    
    // 처리 대기중 신고 수
    Long selectPendingReportCount();
    
    // 전체 회원 수
    Long selectTotalMemberCount();
    
    // 정지된 회원 수
    Long selectSuspendedMemberCount();
    
    // 제재 유형 분포 (일별/월별 통합)
    List<Map<String, Object>> selectPenaltyTypeStats(Map<String, Object> params);
}
