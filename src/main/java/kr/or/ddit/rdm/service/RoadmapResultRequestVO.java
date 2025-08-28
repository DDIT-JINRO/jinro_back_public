package kr.or.ddit.rdm.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoadmapResultRequestVO {
	
	private String memName;
	private int memAge;
	private String interestCn;
	private String siqJob;
	private String wdResult;
	private String bookmarkJob;
	private String aptitudeTestName;
	private String aptitudeResult;
	private String recommendKeyword;
	
}
