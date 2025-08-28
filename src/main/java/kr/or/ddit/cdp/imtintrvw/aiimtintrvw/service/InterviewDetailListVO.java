package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service;

import java.util.Date;

import lombok.Data;

@Data
public class InterviewDetailListVO {
	private int idlId;
	private int memId;
	private String idlTitle;
	private Date idlCreatedAt;
	private String idlDelYN;

	private int questionCount;

	private String idlStatus;
	private Date idlUpdatedAt;

	// 필터조건
	private String keyword;
	private String status;

	private String sortOrder;

	// 페이징
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
