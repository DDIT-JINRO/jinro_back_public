package kr.or.ddit.admin.las.service;

import java.util.Date;

import lombok.Data;

@Data
public class PageLogVO {

	private Long plId;
	private String memId;
	private String plUrl;
	private String plTitle;
	private String plRefererUrl;
	private Date plCreatedAt;
	private String memName;
	
	private String rnum;
}
