package kr.or.ddit.cns.service;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.util.file.service.FileDetailVO;
import lombok.Data;

@Data
public class VacationVO {
	private int vaId;
	private int vaRequestor;
	private int vaApprover;
	private String vaConfirm;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date vaStart;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date vaEnd;
	private String vaReason;
	private String vaEtc;
	private Long fileGroupId;
	private Date requestedAt;

	// 센터장측에 출력될 상담사 정보
	private String memName;
	private String memPhoneNumber;

	private List<MultipartFile> files;
	private List<FileDetailVO> fileDetailList;

	// 센터장측 상담사명 검색용
	private String keyword;
	private String status;

	// 필터링 (전체, 신청, 승인, 반려)
	private String filter;
	// 정렬 (신청일 최신, 신청일 과거, 시작일빠름, 시작일느림)
	private String sortBy;

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
