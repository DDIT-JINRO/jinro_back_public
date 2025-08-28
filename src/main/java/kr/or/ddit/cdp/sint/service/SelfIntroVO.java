package kr.or.ddit.cdp.sint.service;

import java.util.Date;

import lombok.Data;

@Data
public class SelfIntroVO {
	private int siId;
	private int memId;
	private String siTitle;
	private String siStatus;
	private Date siCreatedAt;
	private Date siUpdatedAt;
	private int fileGroupNo;

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
