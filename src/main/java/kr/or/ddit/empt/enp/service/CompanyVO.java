package kr.or.ddit.empt.enp.service;

import java.util.List;

import lombok.Data;

@Data
public class CompanyVO {
	private int cpId;
	private String cpName;
	private String cpScale;
	private String cpLocationX;
	private String cpLocationY;
	private String cpDescription;
	private String cpWebsite;
	private Long cpBusino;
	private String cpImgUrl;
	private String cpRegion;
	private Long fileGroupId;
	private int memId;

//	새로받는 값
	private String cpHiringStatus; // 현재 채용 여부
	private String ccName; // 기업규모 내용
	private String rnum;

//	필터링할 값
	private String keyword; // 기업이름
	private String status;
	private List<String> scaleId; // 기업 규모 선택
	private List<String> regionId; // 기업 위치 선택
	private List<String> hiringStatus; // 채용 상태 선택
	private boolean hasReview;

	private String sortOrder;

	//
	private List<InterviewReviewVO> interviewReviewList; // 채용 상태 선택

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
