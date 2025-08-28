package kr.or.ddit.admin.umg.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.account.lgn.service.MemberPenaltyVO;
import kr.or.ddit.admin.las.service.PageLogVO;
import kr.or.ddit.admin.umg.service.MemberPenaltyCountVO;
import kr.or.ddit.com.report.service.ReportVO;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.main.service.MemberVO;

@Mapper
public interface UserManagementMapper {

	List<MemberVO> getMemberList(String memRole);

	List<MemberVO> getUserList(Map<String, Object> map);

	int getAlluserList(Map<String, Object> map);

	MemberVO getMemberVO(String id);

	List<String> getMemberInterest(String id);

	MemberPenaltyCountVO selectPenaltyCountByMemberId(String id);

	int insertUserByAdmin(MemberVO member);

	int updateMemberInfo(MemberVO memberVO);

	int selectVacByCns(String id);

	int selectCounseling(String id);

	double selectAvgRate(String id);

	List<ReportVO> getReportList(Map<String, Object> map);

	int getAllReportList(Map<String, Object> map);

	ReportVO getReportVO(String id);

	List<MemberPenaltyVO> getPenaltyList(Map<String, Object> map);

	int getAllMemberPenaltyList(Map<String, Object> map);

	int getMemIdByReport(int reportedId);

	int submitPenalty(MemberPenaltyVO memberPenaltyVO);

	MemberPenaltyVO getPenaltyDetail(String id);

	void updateReport(int reportedId);

	int reportModify(ReportVO reportVO);

	void updateMemDelYn(int memId);

	int getDailyActiveUsers();

	Double getDailyAverageUsageTime();

	int getCurrentOnlineUsers();

	List<MemberVO> getMemberActivityList(Map<String, Object> map);

	int getAllMemberActivityList(Map<String, Object> map);

	int getYesterdayActiveUsers();

	Double getYesterdayAverageUsageTime();

	List<CommBoardVO> getMemberDetailBoardList(Map<String, Object> map);

	int selectBoardCountByMemId(Map<String, Object> map);

	int getDailySignUpUsers();

	int getYesterdaySignUpUsers();

	int getMonthlyWithdrawalUsers();

	int getLastMonthWithdrawalUsers();

	int getMockInterviewCount(String memId);

	int getAiFeedbackCount(String memId);

	int getCounselingCompletedCount(String memId);

	int getWorldcupCount(String memId);

	int getRoadmapCount(String memId);

	int getPsychTestCount(String memId);

	String getRecentLoginDate(String memId);

	String getRecentPenaltyDate(String memId);

	List<CommReplyVO> getMemberDetailReplyList(Map<String, Object> map);

	int selectReplyCountByMemId(Map<String, Object> map);

	List<PageLogVO> getMemberPageLogList(Map<String, Object> map);

	int getAllMemberPageLogList(Map<String, Object> map);

	int penaltyModify(MemberPenaltyVO penaltyVO);

	int resetMemDelYn(int memId);

	int penaltyCancel(MemberPenaltyVO penaltyVO);

	int resetReportStatus(int reportId);
}
