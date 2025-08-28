package kr.or.ddit.ertds.univ.dpsrch.service;

import java.util.List;

import lombok.Data;

@Data
public class UnivDeptVO {
	private int uddId;
	private String uddLClass; // 계열(대분류)
	private String uddMClass; // 학과분류(중분류)
	private String uddSum; // 학과 개요
	private String uddInterest; // 흥미, 적성
	private String uddProperty; // 학과 특성
	private String uddJobList; // 관련 직업
	private String uddLiList; // 관련 자격
	private String admissionRate;
	private String empRate;
	private String avgSalary;
	private int memId;

	private String keyword;
	private List<String> lClassIds; // 대학 위치 선택

	// 목록 조회시 페이징 처리를 위한 필드 추가
	private int currentPage;
	private int size;
	private int startNo;
	private int endNo;

	private String sortOrder;

	public int getStartNo() {
		return (this.currentPage - 1) * size;
	}

	public int getEndNo() {
		return this.currentPage * size;
	}
}
