package kr.or.ddit.ertds.univ.dpsrch.service;

import lombok.Data;

/**
 * 학과 비교 전용 VO 6개 핵심 비교 지표를 담는 클래스
 */
@Data
public class UnivDeptCompareVO {

	// === 기본 식별 정보 ===
	private int uddId; // 학과 ID
	private String uddMClass; // 학과명 (중분류)
	private String uddLClass; // 계열명 (대분류)

	// === 비교 지표 6개 ===
	private String admissionRate; // 입학 경쟁률 (예: "9.6:1")
	private String empRate; // 취업률 (예: "85.6")
	private String avgSalary; // 평균 급여
	private Integer avgTuition; // 전국 평균 등록금
	private Integer avgScholar; // 전국 평균 장학금
	private Double satisfactionAvg; // 만족도 평균 (1~5점)

	// === 추가 표시용 필드 ===
	private String admissionRateFormatted; // 포맷된 입학률
	private String empRateFormatted; // 포맷된 취업률 (%)
	private String avgSalaryFormatted; // 포맷된 평균 급여
	private String avgTuitionFormatted; // 포맷된 등록금 (만원)
	private String avgScholarFormatted; // 포맷된 장학금 (만원)
	private String satisfactionGrade; // 만족도 등급 (A+, A, B+ 등)

	/**
	 * 만족도 점수를 등급으로 변환
	 */
	public String getSatisfactionGrade() {
		if (satisfactionAvg == null)
			return "정보없음";

		if (satisfactionAvg >= 4.5)
			return "A+";
		else if (satisfactionAvg >= 4.0)
			return "A";
		else if (satisfactionAvg >= 3.5)
			return "B+";
		else if (satisfactionAvg >= 3.0)
			return "B";
		else if (satisfactionAvg >= 2.5)
			return "C+";
		else if (satisfactionAvg >= 2.0)
			return "C";
		else
			return "D";
	}

	/**
	 * 포맷된 취업률 반환
	 */
	public String getEmpRateFormatted() {
		return empRate != null ? empRate + "%" : "정보없음";
	}

	/**
	 * 포맷된 등록금 반환 (만원 단위)
	 */
	public String getAvgTuitionFormatted() {
		return avgTuition != null ? String.format("%,d만원", avgTuition / 10000) : "정보없음";
	}

	/**
	 * 포맷된 장학금 반환 (만원 단위)
	 */
	public String getAvgScholarFormatted() {
		return avgScholar != null ? String.format("%,d만원", avgScholar / 10000) : "정보없음";
	}

	/**
	 * 포맷된 만족도 반환
	 */
	public String getSatisfactionFormatted() {
		return satisfactionAvg != null ? String.format("%.1f점 (%s)", satisfactionAvg, getSatisfactionGrade()) : "정보없음";
	}
}