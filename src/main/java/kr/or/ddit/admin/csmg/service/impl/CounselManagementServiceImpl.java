package kr.or.ddit.admin.csmg.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.ddit.admin.csmg.service.CounselManagementService;
import kr.or.ddit.admin.service.AdminCommonChartService;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounselManagementServiceImpl implements CounselManagementService {
	
	private final CounselManagementMapper counselManagementMapper;
	private final AdminCommonChartService adminCommonChartService;
	
	public Map<String, Object> selectMonthlyCounselingStatList(){
		
		Map<String, Object> monthStats = counselManagementMapper.selectMonthlyCounselingStatList();
		
		int currentMonthTotal = ((Number) monthStats.getOrDefault("CURRENT_MONTH_TOTAL",0)).intValue();
		int currentMonthFaceToFace = ((Number) monthStats.getOrDefault("CURRENT_MONTH_FACE_TO_FACE",0)).intValue();
		int currentMonthChat = ((Number) monthStats.getOrDefault("CURRENT_MONTH_CHAT",0)).intValue();
		int currentMonthVideo = ((Number) monthStats.getOrDefault("CURRENT_MONTH_VIDEO",0)).intValue();
		
		int previousMonthTotal = ((Number) monthStats.getOrDefault("PREVIOUS_MONTH_TOTAL",0)).intValue();
		int previousMonthFaceToFace = ((Number) monthStats.getOrDefault("PREVIOUS_MONTH_FACE_TO_FACE",0)).intValue();
		int previousMonthChat = ((Number) monthStats.getOrDefault("PREVIOUS_MONTH_CHAT",0)).intValue();
		int previousMonthvideo = ((Number) monthStats.getOrDefault("PREVIOUS_MONTH_VIDEO",0)).intValue();
		
		Map<String, Object> allTotal = adminCommonChartService.calculateGrowthRate(currentMonthTotal, previousMonthTotal);
		Map<String, Object> faceToFaceTotal = adminCommonChartService.calculateGrowthRate(currentMonthFaceToFace, previousMonthFaceToFace);
		Map<String, Object> chatTotal = adminCommonChartService.calculateGrowthRate(currentMonthChat, previousMonthChat);
		Map<String, Object> videoTotal = adminCommonChartService.calculateGrowthRate(currentMonthVideo, previousMonthvideo);
		
		String allTotalCountRate = (String) allTotal.get("percentage");
		String allTotalCountStatus = (String) allTotal.get("status");
		String faceToFaceTotalCountRate = (String) faceToFaceTotal.get("percentage");
		String faceToFaceTotalCountStatus = (String) faceToFaceTotal.get("status");
		String chatTotalCountRate = (String) chatTotal.get("percentage");
		String chatTotalCountStatus = (String) chatTotal.get("status");
		String videoTotalCountRate = (String) videoTotal.get("percentage");
		String videoTotalCountStatus = (String) videoTotal.get("status");

		Map<String, Object> map = new HashMap<>();
		
		map.put("currentMonthTotal", currentMonthTotal);
		map.put("previousMonthTotal", previousMonthTotal);
		map.put("allTotalCountRate", allTotalCountRate);
		map.put("allTotalCountStatus", allTotalCountStatus);
		
		map.put("currentMonthFaceToFace", currentMonthFaceToFace);
		map.put("previousMonthFaceToFace", previousMonthFaceToFace);
		map.put("faceToFaceTotalCountRate", faceToFaceTotalCountRate);
		map.put("faceToFaceTotalCountStatus", faceToFaceTotalCountStatus);
		
		map.put("currentMonthChat", currentMonthChat);
		map.put("previousMonthChat", previousMonthChat);
		map.put("chatTotalCountRate", chatTotalCountRate);
		map.put("chatTotalCountStatus", chatTotalCountStatus);
		
		map.put("currentMonthVideo", currentMonthVideo);
		map.put("previousMonthvideo", previousMonthvideo);
		map.put("videoTotalCountRate", videoTotalCountRate);
		map.put("videoTotalCountStatus", videoTotalCountStatus);
		
		return map;
	}

	@Override
	public ArticlePage<Map<String, Object>> selectCounselorStatList(Map<String, Object> map) {
		
		int currentPage = Integer.parseInt((String) map.getOrDefault("currentPage",1));
		int size = Integer.parseInt((String)map.getOrDefault("size",10));
		String keyword= (String) map.get("keyword");
		
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;
		
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		
		int total = counselManagementMapper.selectCounselorStatTotalCount(map);
		List<Map<String, Object>> counselorStatList = counselManagementMapper.selectCounselorStatList(map);
		
		ArticlePage<Map<String, Object>> articlePage = new ArticlePage<>(total, currentPage, size, counselorStatList, keyword,10);
		
		return articlePage;
	}

	@Override
	public Map<String, Object> selectCounselorDetail(int counselor) {
		
		Map<String, Object> map = new HashMap<>();
		
		map = counselManagementMapper.selectCounselorDetail(counselor);
		
		return map;
	}

	@Override
	public ArticlePage<Map<String, Object>> selectCounselingList(Map<String, Object> map) {
		
		int currentPage = Integer.parseInt((String) map.getOrDefault("currentPage",1));
		int size = Integer.parseInt((String)map.getOrDefault("size",5));
		
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;
		
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		
		int total = counselManagementMapper.selectCounselingListTotalCount(map);
		List<Map<String, Object>> counselingList = counselManagementMapper.selectCounselingList(map);
		
		ArticlePage<Map<String, Object>> articlePage = new ArticlePage<>(total, currentPage, size, counselingList, null,10);
		
		return articlePage;
	}

	@Override
	public List<Map<String, Object>> selectConsultMethodStatistics(Map<String, Object> map) {
		
		List<Map<String, Object>> methodStatisticsMap = counselManagementMapper.selectConsultMethodStatistics(map);
		
		return methodStatisticsMap;
	}

	@Override
	public List<Map<String, Object>> selectTopCounselorList(Map<String, Object> map) {
		
		List<Map<String, Object>> list = counselManagementMapper.selectTopCounselorList(map);
		
		return list;
	}

	@Override
	public List<Map<String, Object>> selectCounselingStatsByCategory(Map<String, Object> map) {

		List<Map<String, Object>> list = counselManagementMapper.selectCounselingStatsByCategory(map);
		
		return list;
	}

	@Override
	public List<Map<String, Object>> selectCounselingStatsByTime(Map<String, Object> map) {
		
		List<Map<String, Object>> list = counselManagementMapper.selectCounselingStatsByTime(map);
		
		return list;
	}
	
	
	
}
