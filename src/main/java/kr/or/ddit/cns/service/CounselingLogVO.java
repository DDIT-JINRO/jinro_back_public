package kr.or.ddit.cns.service;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.util.file.service.FileDetailVO;
import lombok.Data;

@Data
public class CounselingLogVO {
	private int clIdx;
	private int counselId;
	private String clContent;
	private String clDifficulty;
	private String clContinue;
	private String clConfirm;
	private Date createdAt;
	private Date updatedAt;

	private String clEtc;

	private Long fileGroupId;
	private List<FileDetailVO> fileDetailList;

	private List<MultipartFile> files;
}
