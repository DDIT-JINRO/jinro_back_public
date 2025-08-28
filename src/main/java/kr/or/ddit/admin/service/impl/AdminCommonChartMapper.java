package kr.or.ddit.admin.service.impl;



import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.admin.service.AdminCommonChartVO;

@Mapper
public interface AdminCommonChartMapper {

	// 실시간 접속자 수
	int liveUserCount();
	
	// 월별 접속자 수
	AdminCommonChartVO monthUserCount();
	
	// 전체 유저 수
	AdminCommonChartVO allUserCount();

	List<Map<String, Object>> getMonthlyData();

	List<Map<String, Object>> getNewUserData();

	List<Map<String, Object>> getSecessionData();

	List<Map<String, Object>> getContentsUseChart(String param);

}
