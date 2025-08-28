package kr.or.ddit.admin.service.impl;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.admin.service.AdminCommonChartService;
import kr.or.ddit.admin.service.AdminCommonChartVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminCommonChartServiceImpl implements AdminCommonChartService {

	@Autowired
	private AdminCommonChartMapper adminDashBoardMapper;

	@Override
	public Map<String, Object> getAdminDashboard() {

		int liveUserCount = adminDashBoardMapper.liveUserCount();
		AdminCommonChartVO monthUserVO = adminDashBoardMapper.monthUserCount();
		AdminCommonChartVO allUserVO = adminDashBoardMapper.allUserCount();

		// 당월 이용자 수 및 비율
		int thisMonthCount = monthUserVO.getThisMonthUserCount();
		int lastMonthCount = monthUserVO.getLastMonthUserCount();
		Map<String, Object> monthTotal = calculateGrowthRate(thisMonthCount, lastMonthCount);
		String monthUserCountRate = (String) monthTotal.get("percentage");
		String monthUserCountStatus = (String) monthTotal.get("status");

		// 전체 이용자 수 및 비율
		int totalCount = allUserVO.getThisMonthTotalCount();
		int lastMonthUseCount = allUserVO.getLastMonthTotalCount();
		Map<String, Object> allTotal = calculateGrowthRate(totalCount, lastMonthUseCount);
		String allUserCountRate = (String) allTotal.get("percentage");
		String allUserCountStatus = (String) allTotal.get("status");

		List<Map<String, Object>> monthlyChart = adminDashBoardMapper.getMonthlyData();

		List<Map<String, Object>> newUserChart = adminDashBoardMapper.getNewUserData();

		List<Map<String, Object>> secessionChart = adminDashBoardMapper.getSecessionData();

		Map<String, Object> map = new HashMap<>();

		map.put("secessionChart", secessionChart);
		map.put("newUserChart", newUserChart);
		map.put("monthlyChart", monthlyChart);
		map.put("liveUserCount", liveUserCount);
		map.put("monthUserCount", thisMonthCount);
		map.put("monthUserCountRate", monthUserCountRate);
		map.put("monthUserCountStatus", monthUserCountStatus);
		map.put("allUserCount", totalCount);
		map.put("allUserCountRate", allUserCountRate);
		map.put("allUserCountStatus", allUserCountStatus);

		return map;
	}

	public Map<String, Object> calculateGrowthRate(int currentCount, int previousCount) {

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

	@Override
	public List<Map<String, Object>> getContentsUseChart(String param) {
		
		return adminDashBoardMapper.getContentsUseChart(param);
	}

}
