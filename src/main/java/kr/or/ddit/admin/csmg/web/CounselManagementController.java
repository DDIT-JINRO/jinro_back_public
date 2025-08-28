package kr.or.ddit.admin.csmg.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.csmg.service.CounselManagementService;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/csmg")
public class CounselManagementController {
	private final CounselManagementService counselManagementService;
	
	@GetMapping("/selectMonthlyCounselingStatList.do")
	public Map<String, Object> selectMonthlyCounselingStatList() {
		Map<String, Object> map = counselManagementService.selectMonthlyCounselingStatList();
		
		return map;
	}
	
	@GetMapping("/selectCounselorStatList.do")
	public ArticlePage<Map<String, Object>> selectCounselorStatList(
			@RequestParam(defaultValue = "1") String currentPage,
			@RequestParam(defaultValue = "10") String size,
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String status,
			@RequestParam(defaultValue = "MEM_ID", required = false) String sortBy,
			@RequestParam(defaultValue = "asc",required = false) String sortOrder,
			@RequestParam(required = false) String userListInFilter
			) {
		
		Map<String, Object> map = new HashMap<>();
		map.put("currentPage", currentPage);
		map.put("size", size);
		map.put("keyword", keyword);
		map.put("status", status);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);
		map.put("userListInFilter", userListInFilter);
		
		ArticlePage<Map<String, Object>> articlePage = counselManagementService.selectCounselorStatList(map);
		
		return articlePage;
	}
	
	@GetMapping("/selectCounselorDetail.do")
	public Map<String, Object> selectCounselorDetail(
			@RequestParam int counselor){
		
		Map<String, Object> map = counselManagementService.selectCounselorDetail(counselor);
		return map;
	}
	
	@GetMapping("/selectCounselingList.do")
	public ArticlePage<Map<String, Object>> selectCounselingList(
			@RequestParam int counselor,
			@RequestParam(defaultValue = "1") String currentPage,
			@RequestParam(defaultValue = "5") String size,
			@RequestParam(defaultValue = "counselId", required = false) String sortBy,
			@RequestParam(defaultValue = "asc",required = false) String sortOrder,
			@RequestParam(required = false) String counselCategory,
			@RequestParam(required = false) String counselMethod,
			@RequestParam(required = false) String counselStatus
			) {
		
		Map<String, Object> map = new HashMap<>();
		map.put("counselor", counselor);
		map.put("currentPage", currentPage);
		map.put("size", size);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);
		map.put("counselCategory", counselCategory);
		map.put("counselMethod", counselMethod);
		map.put("counselStatus", counselStatus);
		
		ArticlePage<Map<String, Object>> articlePage = counselManagementService.selectCounselingList(map);
		
		return articlePage;
	}
	
	@GetMapping("/selectConsultMethodStatistics.do")
	public List<Map<String, Object>> selectConsultMethodStatistics(
			@RequestParam String selectUserInquiry,
			@RequestParam String gender,
			@RequestParam String ageGroup,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate
			){
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("selectUserInquiry", selectUserInquiry);
		paramMap.put("gender", gender);
		paramMap.put("ageGroup", ageGroup);
		if(paramMap.get("selectUserInquiry").equals("selectDays")) {
			paramMap.put("startDate", startDate);
			paramMap.put("endDate", endDate);
		}
		
		List<Map<String, Object>> list = counselManagementService.selectConsultMethodStatistics(paramMap);
		
		return list;
	}
	
	@GetMapping("/selectTopCounselorList.do")
	public List<Map<String, Object>> selectTopCounselorList(
			@RequestParam String selectUserInquiry,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate,
			@RequestParam(defaultValue = "satisfaction") String filter
			){
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("selectUserInquiry", selectUserInquiry);
		paramMap.put("filter", filter);
		
		if(paramMap.get("selectUserInquiry").equals("selectDays")) {
			paramMap.put("startDate", startDate);
			paramMap.put("endDate", endDate);
		}
		
		List<Map<String, Object>> list = counselManagementService.selectTopCounselorList(paramMap);
		
		return list;
	}
	
	@GetMapping("/selectCounselingStatsByCategory.do")
	public List<Map<String, Object>> selectCounselingStatsByCategory(
			@RequestParam String selectUserInquiry,
			@RequestParam String gender,
			@RequestParam String ageGroup,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate
			){
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("selectUserInquiry", selectUserInquiry);
		paramMap.put("gender", gender);
		paramMap.put("ageGroup", ageGroup);
		
		if(paramMap.get("selectUserInquiry").equals("selectDays")) {
			paramMap.put("startDate", startDate);
			paramMap.put("endDate", endDate);
		}
		
		List<Map<String, Object>> list = counselManagementService.selectCounselingStatsByCategory(paramMap);
		
		return list;
	}
	
	@GetMapping("/selectCounselingStatsByTime.do")
	public List<Map<String, Object>> selectCounselingStatsByTime(
			@RequestParam String selectUserInquiry,
			@RequestParam String gender,
			@RequestParam String ageGroup,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate
			){
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("selectUserInquiry", selectUserInquiry);
		paramMap.put("gender", gender);
		paramMap.put("ageGroup", ageGroup);
		
		if(paramMap.get("selectUserInquiry").equals("selectDays")) {
			paramMap.put("startDate", startDate);
			paramMap.put("endDate", endDate);
		}
		
		List<Map<String, Object>> list = counselManagementService.selectCounselingStatsByTime(paramMap);
		
		return list;
	}
	
}
