package kr.or.ddit.cnslt.rvw.service;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class CounselingReviewVO {
	private int crId;
	private int crRate;
	private String crContent;
	private Date crCreatedAt;
	
	// 상담 관련 인원 정보
	private int memId;
	private String memNickname;
	
	private int counsel;
	private String counselName;
	
	private String counselCategory;
	private String counselMethod;
	private String crPublic;
	private Date counselReqDatetime;
	
	// 필터조건
	private String keyword;
	private String status;
	private String sortOrder;

	// 페이징
	private int currentPage = 1;
	private int size = 5;
	private int rum;
	
	private List<String> counselMethods;
	private List<String> counselCategorys;
	
	public int getStartRow() {
		return (this.currentPage - 1) * this.size + 1;
	}
	
	public int getEndRow() {
		return this.currentPage * this.size;
	}
}
