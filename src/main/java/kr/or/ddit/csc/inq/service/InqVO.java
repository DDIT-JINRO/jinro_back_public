package kr.or.ddit.csc.inq.service;

import java.util.Date;

import lombok.Data;

@Data
public class InqVO {

	private int contactId; // 문의 ID
	private int memId; // 문의자 ID
	private String contactTitle; // 제목
	private String contactContent; // 내용
	private String contactIsPublic; // 공개여부
	private String contactReply; // 답변
	private Date contactAt; // 작성일자
	private Date contactReplyAt; // 답변일자      
	
	private String rnum;
	
	private String memName;

}
