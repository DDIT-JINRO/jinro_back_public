package kr.or.ddit.admin.service;

import java.util.List;
import java.util.Map;

public interface AdminCommonChartService {

	Map<String, Object> getAdminDashboard();

	List<Map<String, Object>> getContentsUseChart(String param);

	Map<String, Object> calculateGrowthRate(int currentCount, int previousCount);
}
