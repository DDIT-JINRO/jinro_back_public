package kr.or.ddit.ertds.qlfexm.service;

import java.util.Date;

import lombok.Data;

@Data
public class QualficationExamVO {
	private int examId; 			//검정고시 식별번호
	private String examTitle;       //검정고시공고제목
	private String examContent;     //검정고시공고내용
	private Date examApplyStart;    //현장접수시작일
	private Date examApplyEnd;      //현장접수종료일
	private String examOnlineStart; //온라인접수시작일
	private String examOnlineEnd;	//온라인접수종료일
	private String examUrl;			//공고URL
	private Date examNotiDate; 		//공고일
	private String examAreaCode;	//관할교육청코드
	private int examYear;			//시행년도
	private int examAttempt;		//시행회차

	// 필터조건
	private String keyword;

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
