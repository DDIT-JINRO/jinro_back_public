package kr.or.ddit.mpg.mat.bmk.service;

import java.util.Date;

import lombok.Data;

@Data
public class BookMarkVO {
	private int bmId;
	private int memId;
	private String bmCategoryId;
	private int bmTargetId;
	private Date bmCreatedAt;

	// 북마크 표시내용
	private String categoryName;
	private String title;
	private String content1;
	private String content2;
	
	private String jobCode;
	
	// 필터조건
	private String keyword;
	private String status;

	// 페이징
	private int currentPage = 1;
	private int size = 5;
	private int rum;
	
	public int getStartRow() {
		return (this.currentPage - 1) * this.size + 1;
	}
	
	public int getEndRow() {
		return this.currentPage * this.size;
	}
}
