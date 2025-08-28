package kr.or.ddit.admin.umg.service;

import lombok.Data;

@Data
public class MemberPenaltyCountVO {
	
	private String memId;
    private int warnCount;
    private int banCount;
	
}
