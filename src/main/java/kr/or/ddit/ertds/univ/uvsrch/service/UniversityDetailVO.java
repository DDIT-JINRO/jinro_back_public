package kr.or.ddit.ertds.univ.uvsrch.service;

import java.util.List;
import lombok.Data;

@Data
public class UniversityDetailVO {
	// 기본 대학 정보
	private int univId;
	private String univName;
	private String univCampus;
	private String univType;
	private String univGubun;
	private String univUrl;
	private String univRegion;
	private String univAddr;

	// 학과 관련 정보
	private List<DeptInfo> deptList; // 개별 학과 목록
	private int totalDeptCount; // 전체 학과 수

	// 학과 정보를 담는 내부 클래스
	@Data
	public static class DeptInfo {
		private int udId; // 학과 ID
		private int univId; // 대학 ID
		private String uddId; // 학과 구분 ID
		private String udName; // 학과명
		private Integer udTuition; // 등록금
		private Integer udScholar; // 1인당 평균 장학금
		private String udCompetition; // 경쟁률 (예: "5.6:1")
		private String udEmpRate; // 취업률 (예: "88.6")

		private double avgTuition; // 해당 학과 분류의 전국 평균 등록금
		private double avgScholar; // 해당 학과 분류의 전국 평균 장학금
		private String avgCompetition; // 해당 학과 분류의 전국 평균 경쟁률 (예: "9.6:1")
		private double avgEmpRate;
	}
}