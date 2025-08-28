package kr.or.ddit.ertds.hgschl.service;

import lombok.Data;

@Data
public class HighSchoolDeptVO {
	private int hsdId;
	private int hsId;
	private String hsdCode;
	private String hsdName;
	private String hsdTrackName;
}