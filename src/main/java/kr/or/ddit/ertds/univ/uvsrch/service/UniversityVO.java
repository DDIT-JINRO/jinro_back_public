package kr.or.ddit.ertds.univ.uvsrch.service;

import java.util.List;

import lombok.Data;

@Data
public class UniversityVO {
	private int univId;
	private String univName;
	private String univCampus;
	private String univType;
	private String univGubun;
	private String univUrl;
	private String univRegion;
	private String univAddr;

	private String keyword;
	private List<String> regionIds; // 대학 위치 선택
	private List<String> typeIds; // 대학 타입 선택
	private List<String> gubunIds; // 대학 구분 선택
	private int memId;

	private int deptCount;
	private String rnum;
	
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
