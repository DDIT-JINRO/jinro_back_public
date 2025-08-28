package kr.or.ddit.admin.las.service;

import java.util.Date;

import lombok.Data;

@Data
public class RecommendKeywordVO {

	private int rkId;
	private int memId;
	private String rkName;
	private Date rkCreatedAt;
	
}
