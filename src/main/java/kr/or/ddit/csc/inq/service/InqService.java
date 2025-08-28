package kr.or.ddit.csc.inq.service;

import java.util.List;

import kr.or.ddit.util.ArticlePage;

public interface InqService {
	
	// 사용자 1:1문의 목록 조회
	public ArticlePage<InqVO> getUserInqryPage(int currentPage, int size, String keyword, List<String> filterKeywords, String memId);

	// 사용자 1:1문의 등록
	public int insertInqData(InqVO inqVO);

	// 관리자 1:1문의 목록 조회
	public ArticlePage<InqVO> getAdminInqList(int currentPage, int size, String keyword, String status);

	// 관리자 1:1문의 상세 조회	
	public InqVO getAdminInqDetail(int inqId);
	
	// 관리자 1:1문의 등록
	public int insertInq(InqVO inqVO);
}
