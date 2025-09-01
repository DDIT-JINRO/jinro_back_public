package kr.or.ddit.admin.umg.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.account.lgn.service.MemberPenaltyVO;
import kr.or.ddit.admin.las.service.PageLogVO;
import kr.or.ddit.com.report.service.ReportVO;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.ArticlePage;

public interface UserManagementService {

	ArticlePage<MemberVO> getMemberList(int currentPage, int size, String keyword, String status, String memRole);

	Map<String, Object> getMemberDetail(String id);

	int updateMemberInfo(MemberVO memberVO);

	ArticlePage<ReportVO> getReportList(int currentPage, int size, String keyword, String status, String sortBy, String sortOrder, String filter);

	Map<String, Object> getReportDetail(String id);

	ArticlePage<MemberPenaltyVO> getPenaltyList(int currentPage, int size, String keyword, String status,
	        String sortBy, String sortOrder, String mpType);

	Map<String, Object> getPenaltyDetail(String id);

	int reportModify(ReportVO reportVO);

	int submitPenalty(MemberPenaltyVO memberPenaltyVO, MultipartFile[] evidenceFiles);

	int insertUserByAdmin(MemberVO memberVO, MultipartFile profileImage);

	Map<String, Object> getDailyUserStats();

	ArticlePage<MemberVO> getMemberActivityList(int currentPage, int size, String keyword, String activityStatus, String sortBy, String sortOrder, String inFilter);

	ArticlePage<CommBoardVO> getMemberDetailBoardList(int currentPage, int size, String ccId, String sortBy, String sortOrder, int userId);

	ArticlePage<CommReplyVO> getMemberDetailReplyList(int currentPage, int size, String ccId, String sortBy,
			int userId);

	ArticlePage<PageLogVO> getMemberPageLogList(int currentPage, int size, String keyword, String sortBy,
			String sortOrder, String memId);

	int penaltyModify(MemberPenaltyVO penaltyVO);

	int penaltyCancel(MemberPenaltyVO penaltyVO);

	// 스케줄링 돌려서 로그인 후 시간이 너무 길면 로그아웃처리
	void logoutManaging();

}
