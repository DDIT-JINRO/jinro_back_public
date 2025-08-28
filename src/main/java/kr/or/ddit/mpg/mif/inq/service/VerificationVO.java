package kr.or.ddit.mpg.mif.inq.service;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerificationVO {
	private int veriId;
	private int memId;
	private Date veriCreatedAt;
	private Long fileGroupId;
	private String veriStatus;
	private String veriReason;
	private String veriCategory;
}
