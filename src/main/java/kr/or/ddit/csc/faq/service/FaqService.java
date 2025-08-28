package kr.or.ddit.csc.faq.service;

import java.util.List;

import kr.or.ddit.util.ArticlePage;

public interface FaqService {

	// 사용자 FAQ 리스트
	public List<FaqVO> getUserFaqList(String keyword);
	
	// 관리자 FAQ 리스트
	public ArticlePage<FaqVO> getAdminFaqList(int currentPage, int size, String keyword, String status);

	// 관리자 FAQ 상세조회
	public FaqVO getAdminFaqDetail(String faqId);

	// 관리자 FAQ 등록
	public int insertFaq(FaqVO faqVO);

	// 관리자 FAQ 수정
	public int updateFaq(FaqVO faqVO);
	
	// 관리자 FAQ 삭제
	public int deleteFaq(FaqVO faqVO);

}
