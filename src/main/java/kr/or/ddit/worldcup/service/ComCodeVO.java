package kr.or.ddit.worldcup.service;

import java.util.Date;

import lombok.Data;

@Data
public class ComCodeVO {
	private String ccId;
	private String clCode;
	private String ccName;
	private String ccEtc;
	private String useYn;
	private Date createdAt;
	private String createdBy;
	private Date updatedAt;
	private String updatedBy;
}
