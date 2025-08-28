package kr.or.ddit.csc.faq.service;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.util.file.service.FileDetailVO;
import lombok.Data;

@Data
public class FaqVO {

	// 기본 파라미티
	private String faqContent;
	private Date faqCreatedAt;
	private int faqId;
	private String faqTitle;
	private Date faqUpdatedAt;
	
	// 파일
	private Long fileGroupNo;
	private List<MultipartFile> files;

	private String rnum;
	
	// 파일 리스트
	private List<FileDetailVO> getFileList;
	
	// 검색 키워드
	private String keyword;
	
	// 연도
	private String status;
	
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
