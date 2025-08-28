package kr.or.ddit.cnslt.resve.crsv.service;

import java.util.Date;

import lombok.Data;

@Data
public class VacationVO {
	private String vaId;
	private int vaRequestor;
	private int vaApprover;
	private String vaConfirm;
	private Date vaStart;
	private Date vaEnd;
	private String vaReason;
	private String vaEtc;
	private int fileGroupId;
	private Date requestedAt;
}
