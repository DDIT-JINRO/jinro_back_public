package kr.or.ddit.pse.cat.service;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AptitudeTestVO {

	private int atId;
	private int memId;
	private int atTestNo;
	private Date atDate;
	private String atResultUrl;
	private String atResultText;
	
}
