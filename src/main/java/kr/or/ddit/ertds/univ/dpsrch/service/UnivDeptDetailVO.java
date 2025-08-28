// 1. 디테일 페이지 전용 통합 VO 생성
package kr.or.ddit.ertds.univ.dpsrch.service;

import lombok.Data;

/**
 * 학과 상세 정보 통합 VO (디테일 페이지 전용)
 */
@Data
public class UnivDeptDetailVO {

	// === 기본 정보 (UnivDeptVO에서) ===
	private int uddId;
	private String uddLClass; // 계열(대분류)
	private String uddMClass; // 학과분류(중분류)
	private String uddSum; // 학과 개요
	private String uddInterest; // 흥미, 적성
	private String uddProperty; // 학과 특성
	private String uddJobList; // 관련 직업
	private String uddLiList; // 관련 자격

	// === 통계 정보 (UnivDeptStatVO에서) ===
	private int udsId;

	// 지원자 및 입학 관련
	private Double udsTotalApplicants;
	private Double udsTotalAdmitted;
	private Double udsMaleAdmissionRate;
	private Double udsFemaleAdmissionRate;
	private String udsAdmissionRate;

	// 취업률 관련
	private Double udsEmploymentRateTotal;
	private Double udsEmploymentRateMale;
	private Double udsEmploymentRateFemale;

	// 급여 분포 관련
	private Double udsSalary0150Rate;
	private Double udsSalary151200Rate;
	private Double udsSalary201250Rate;
	private Double udsSalary251300Rate;
	private Double udsSalary301PlusRate;

	// 취업 분야 관련
	private Double udsFieldConstructionRate;
	private Double udsFieldManagementRate;
	private Double udsFieldEducationRate;
	private Double udsFieldBeautyRate;
	private Double udsFieldWelfareRate;
	private Double udsFieldResearchRate;
	private Double udsFieldTransportRate;
	private Double udsFieldArtRate;
	private Double udsFieldProductRate;
	private Double udsFieldFarmerRate;

	// 만족도 관련
	private Double udsSatisfactionVeryDissatisfied;
	private Double udsSatisfactionDissatisfied;
	private Double udsSatisfactionNeutral;
	private Double udsSatisfactionSatisfied;
	private Double udsSatisfactionVerySatisfied;

	/**
	 * 관련 직업 리스트로 변환
	 */
	public String[] getJobListArray() {
		return uddJobList != null ? uddJobList.split(",") : new String[0];
	}

	/**
	 * 관련 자격 리스트로 변환
	 */
	public String[] getLicenseListArray() {
		return uddLiList != null ? uddLiList.split(",") : new String[0];
	}

	/**
	 * 전체 취업률 (백분율)
	 */
	public String getEmploymentRatePercent() {
		return udsEmploymentRateTotal != null ? String.format("%.1f", udsEmploymentRateTotal) + "%" : "0%";
	}

	/**
	 * 입학 경쟁률
	 */
	public String getAdmissionRateFormatted() {
		if (udsTotalApplicants != null && udsTotalAdmitted != null && udsTotalAdmitted > 0) {
			double rate = udsTotalApplicants / udsTotalAdmitted;
			return String.format("%.1f:1", rate);
		}
		return "정보없음";
	}
}