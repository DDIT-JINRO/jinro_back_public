package kr.or.ddit.cdp.sint.service;

import lombok.Data;

@Data
public class SelfIntroContentVO {
	private int sicId;
	private int siId;
	private int siqId;
	private String sicContent;
	private int sicLimit;
	private int sicCount;
	private int sicOrder;
}
