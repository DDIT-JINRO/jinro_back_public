package kr.or.ddit.cdp.rsm.rsm.service;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ResumeVO {
	private int resumeId;
	private int memId;
	private String resumeTitle;
	private String resumeIsTemp;
	private Date createdAt;
	private Date updatedAt;
	private Long fileGroupId;
	List<MultipartFile> files;
	private String resumeContent;

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
