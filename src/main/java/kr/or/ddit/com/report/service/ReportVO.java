package kr.or.ddit.com.report.service;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ReportVO {
	private int reportId;
	private String targetType;
	private int targetId;
	private String reportReason;
	private String reportStatus;
	private Date reportCreatedAt;
	private Date reportCompleteAt;
	private int reportCompleteId;
	private int memId;
	private Long fileGroupNo;

	
	private String rnum;
	// 신고당한사람의 id 조회를 위한 필드 추가
	private int reportedMemId;
	
	// 신고자명
	private String reporterName;
	// 신고대상명
	private String reportedName;
	
	
	private List<MultipartFile> reportFile;

	private String keyword;
	private String status;

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
