package kr.or.ddit.admin.csmg.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.util.ArticlePage;

public interface CounselManagementService {
	Map<String, Object> selectMonthlyCounselingStatList();
	
	ArticlePage<Map<String, Object>> selectCounselorStatList(Map<String, Object> map);
	
	Map<String, Object> selectCounselorDetail(int counselor);
	
	ArticlePage<Map<String, Object>> selectCounselingList(Map<String, Object> map);
	
	List<Map<String, Object>> selectConsultMethodStatistics(Map<String, Object> map);
	
	List<Map<String, Object>> selectTopCounselorList(Map<String, Object> map);
	
	List<Map<String, Object>> selectCounselingStatsByCategory(Map<String, Object> map);
	
	List<Map<String, Object>> selectCounselingStatsByTime(Map<String, Object> map);
}
