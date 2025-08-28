package kr.or.ddit.account.lgn.service;

import java.util.Date;

import lombok.Data;

@Data
public class MemDelVO {
	
	private int mdId;
	private int memId;
	private String memEmail;
	private String mdReason;
	private String mdCategory;
	private Date mdReqAt;
	private String mdStatus;
	private Date mdDeletedAt;
	
}
