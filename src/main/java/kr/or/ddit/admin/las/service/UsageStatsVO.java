package kr.or.ddit.admin.las.service;


import lombok.Data;

// 접속 이용 통계 VO
@Data
public class UsageStatsVO {
	
	// 일별 사용자 VO
	private String loginDate;
	private int userCount;
	private String weekType;
	private String periodType;
}
