package kr.or.ddit.worldcup.service;

import java.util.Date;

import lombok.Data;

@Data
public class WorldCupVO {
	private int wdId;
	private String wdResult;
	private Date createdAt;
	private int memId;
}
