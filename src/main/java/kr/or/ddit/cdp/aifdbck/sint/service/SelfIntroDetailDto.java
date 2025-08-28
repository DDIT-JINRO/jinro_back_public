package kr.or.ddit.cdp.aifdbck.sint.service;

import java.util.List;

import kr.or.ddit.cdp.sint.service.SelfIntroContentVO;
import kr.or.ddit.cdp.sint.service.SelfIntroQVO;
import lombok.Data;

@Data
public class SelfIntroDetailDto {
	private String title;
	private List<SelfIntroQVO> questions;
	private List<SelfIntroContentVO> contents;
}