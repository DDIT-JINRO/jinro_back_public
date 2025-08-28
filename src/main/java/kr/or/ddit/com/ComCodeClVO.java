package kr.or.ddit.com;

import java.util.Date;

import lombok.Data;

@Data
public class ComCodeClVO {
	private String clId;
	private String clName;
	private String clDesc;
	private String useYn;
	private Date createdAt;
	private String createdBy;
	private Date updatedAt;
	private String updatedBy;
}
