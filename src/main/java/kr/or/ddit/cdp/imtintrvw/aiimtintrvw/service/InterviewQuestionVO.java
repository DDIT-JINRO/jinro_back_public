package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service;

import java.util.List;

import lombok.Data;

@Data
public class InterviewQuestionVO {
	private int iqId;
	private String iqGubun;
	private String iqContent;

	private String industryName;

	// 조회용 필드 추가
	private String keyword;
	private List<String> iqGubunFilter;
	private int startRow;
	private int endRow;
}
