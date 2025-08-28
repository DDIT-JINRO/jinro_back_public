package kr.or.ddit.util.apr.service;

import java.util.List;
import java.util.Map;

public interface AiProofreadSelfIntroService {

	// 단일 요청으로 모든 첨삭을 처리하고 최종 결과를 반환하는 메서드
	public String proofreadCoverLetter(List<Map<String, String>> selfIntroSections);
}
