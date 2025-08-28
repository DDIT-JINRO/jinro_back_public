package kr.or.ddit.empt.enp.service;

import java.util.Date;

import lombok.Data;

@Data
public class InterviewReviewVO {
	private int irId;
	private int memId;
	private String irType;
	private int targetId;
	private String irContent;
	private Date irCreatedAt;
	private Date irModAt;
	private int irRating;
	private String irApplication;
	private Date irInterviewAt;
	private String irStatus = "S06001";

	private String targetName;
	private String memNickname;
	private String memName;
	private String rnum;
	
	private Date veriCreatedAt;
	private Long fileGroupId;
	private String veriReason;

	private String savePath;
	private String fileOrgName;

	// 필터조건
	private String keyword;
	private String status;
	private String sortBy;
	private String order = "DESC";

	private String sortOrder;

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
