package kr.or.ddit.worldcup.service;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.pse.cr.crl.service.JobsRelVO;
import lombok.Data;

@Data
public class JobsVO {
	private String jobCode;
	private String jobName;
	private String jobLcl;
	private String jobMcl;
	private String jobSal;
	private int jobSatis;
	private String jobWay;
	private String jobRelatedMajor;
	private String jobRelatedCert;
	private String jobMainDuty;
	private Date jobCreatedAt;
	private Long fileGroupNo;
	private int edubgMgraduUndr;
	private int edubgHgradu;
	private int edubgCgraduUndr;
	private int edubgUgradu;
	private int edubgGgradu;
	private int edubgDgradu;
	private int outlookIncrease;
	private int outlookSlightIncrease;
	private int outlookStable;
	private int outlookSlightDecrease;
	private int outlookDecrease;
	private int jobTargetId;

	private String sortOrder;

	private List<String> jobsRel;
	private List<String> jobSals;
	private List<String> jobLcls;
	private List<String> jobCodes;
	private List<JobsRelVO> jobsRelVOList;

	private List<MultipartFile> files;

	// 북마크 확인값
	private String isBookmark;
	private int memId;

	// 추가 출력값
	private String prospect;
	private String averageSal;
	private String education;

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
