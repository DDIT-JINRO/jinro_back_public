package kr.or.ddit.pse.cat.service;

import java.util.Date;

import lombok.Data;

@Data
public class TemporarySaveVO {

	private int tsId;
	private int memId;
	private Date tsCreatedAt;
	private String tsContent;
	private String tsType;

}
