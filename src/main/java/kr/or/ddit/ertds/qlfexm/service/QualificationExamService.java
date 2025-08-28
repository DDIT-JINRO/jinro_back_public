package kr.or.ddit.ertds.qlfexm.service;

import kr.or.ddit.util.ArticlePage;

public interface QualificationExamService {

	// 사용자 검정고시 목록 조회
	ArticlePage<QualficationExamVO> getList(String keyword, int currentPage, int size, String sortOrder);

	// 사용자 검정고시 상세 조회
	QualficationExamVO getDetail(String examId);

}
