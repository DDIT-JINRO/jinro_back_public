package kr.or.ddit.admin.service;

import lombok.Data;

@Data
public class AdminCommonChartVO {
	
	// 당월 이용자 전체 수
	private int thisMonthUserCount;
	// 저번달 이용자 전체 수
	private int lastMonthUserCount;
	
	// 당월 기준 전체 인원수
	private int thisMonthTotalCount;
	// 지난달 전체 인원수
	private int lastMonthTotalCount;
	
}
