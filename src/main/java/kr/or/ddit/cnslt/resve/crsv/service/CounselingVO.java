package kr.or.ddit.cnslt.resve.crsv.service;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class CounselingVO {
	private int counselId;
	private int memId;
	private int counsel;
	private String counselCategory;
	private String counselMethod;
	private String counselTitle;
	private String counselDescription;
	private String counselStatus;

	// 폼 데이터/URL 파라미터 바인딩을 위한 어노테이션
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
	// JSON 데이터 바인딩을 위한 어노테이션 (핵심)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
	private Date counselReqDatetime;
	private String counselUrlUser;
	private String counselUrlCou;
	private String counselReviewd;
	private Date counselCreatedAt;
	private Date counselUpdatedAt;

	// 보람님 사용

	private String memName;
	private String counselName;

	// 필터조건
	private String keyword;
	private String status;
	private String sortOrder;

	// 페이징
	private int currentPage = 1;
	private int size = 5;

	public int getStartRow() {
		return (this.currentPage - 1) * this.size + 1;
	}

	public int getEndRow() {
		return this.currentPage * this.size;
	}
}
