package kr.or.ddit.cdp.aifdbck.sint.service;

import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class SelfIntroFeedbackRequestDto {
	private Integer payId;
	private List<Map<String, String>> sections;
}