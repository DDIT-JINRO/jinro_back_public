package kr.or.ddit.empt.cte.service;

import java.util.Date;

import lombok.Data;

@Data
public class CareerTechnicalEducationVO {

	private String jtAddress;
	private Date jtEndDate;
	private int jtFee;
	private int jtId;
	private String jtName;
	private int jtQuota;
	private String jtSchool;
	private double jtScore;
	private Date jtStartDate;
	private String jtTarget;
	private String jtUrl;

	// 필터조건
	private String keyword;
	private String status;
	private String region;

	private String sortOrder;

	//페이징
	private int currentPage;
	private int size;
	private int startNo;
	private int endNo;

	public int getStartNo() {
		return (this.currentPage - 1) * size;
	}

	public int getEndNo() {
		return this.currentPage * size;
	}

}
