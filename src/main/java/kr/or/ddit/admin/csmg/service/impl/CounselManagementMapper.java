package kr.or.ddit.admin.csmg.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CounselManagementMapper {
	//상담사관리 통계 상단 4개
	Map<String, Object> selectMonthlyCounselingStatList();
	
	//상담사별 처리건수 및 만족도 평가 total
	int selectCounselorStatTotalCount(Map<String, Object> map);
	
	//상담사별 처리건수 및 만족도 평가
	List<Map<String, Object>> selectCounselorStatList(Map<String, Object> map);
	
	//상담사별 디테일
	Map<String, Object> selectCounselorDetail(int counselor);
	
	//상담사별 디테일 상담 total
	int selectCounselingListTotalCount(Map<String, Object> map);
	
	//상담사별 디테일 상담
	List<Map<String, Object>> selectCounselingList(Map<String, Object> map);
	
	//상담 유형별 통계
	List<Map<String, Object>> selectConsultMethodStatistics(Map<String, Object> map);
	
	//상담사 top3
	List<Map<String, Object>> selectTopCounselorList(Map<String, Object> map);
	
	//상담종류별 통계
	List<Map<String, Object>> selectCounselingStatsByCategory(Map<String, Object> map);
	
	//상담유형별 시간대 통계
	List<Map<String, Object>> selectCounselingStatsByTime(Map<String, Object> map);
}
