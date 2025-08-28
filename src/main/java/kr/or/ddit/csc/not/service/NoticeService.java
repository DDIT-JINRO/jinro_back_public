package kr.or.ddit.csc.not.service;

import kr.or.ddit.util.ArticlePage;

public interface NoticeService {
	
	// 1. 사용자 목록 조회
	public ArticlePage<NoticeVO> getUserNoticePage(int currentPage, int size, String keyword, String sortOrder);
	
	// 2. 관리자 목록 조회
	public ArticlePage<NoticeVO> getAdminNoticePage(int currentPage, int size, String keyword, String status);
	
	// 3. 사용자 공지사항 세부 조회
	public NoticeVO getUserNoticeDetail(String noticeIdStr);
	
	// 4. 관리자 공지사항 세부 조회
	public NoticeVO getAdminNoticeDetail(String noticeIdStr);
	
	// 5. 관리자 공지사항 등록
	public int insertNotice(NoticeVO noticeVO);
	
	// 6. 공지사항 수정
	public int updateNotice(NoticeVO noticeVo);
	
	// 7. 공지사항 삭제
	public int deleteNotice(NoticeVO noticeVo);

	public boolean deleteFile(Long groupId, int seq, int noticeId);
}
