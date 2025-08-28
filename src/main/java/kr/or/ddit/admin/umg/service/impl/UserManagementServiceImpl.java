package kr.or.ddit.admin.umg.service.impl;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.account.lgn.service.MemberPenaltyVO;
import kr.or.ddit.admin.las.service.PageLogVO;
import kr.or.ddit.admin.umg.service.MemberPenaltyCountVO;
import kr.or.ddit.admin.umg.service.UserManagementService;
import kr.or.ddit.com.report.service.ReportVO;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserManagementServiceImpl implements UserManagementService {

	@Autowired
	private FileService fileService;
	@Autowired
	private UserManagementMapper userManagementMapper;

	private final BCryptPasswordEncoder passwordEncoder;

	public UserManagementServiceImpl(BCryptPasswordEncoder passwordEncoder) {
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public ArticlePage<MemberVO> getMemberList(int currentPage, int size, String keyword, String status,
			String memRole) {
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("keyword", keyword);
		map.put("status", status);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("memRole", memRole);

		// 리스트 불러오기
		List<MemberVO> list = userManagementMapper.getUserList(map);
		// 건수
		int total = userManagementMapper.getAlluserList(map);
		// 페이지 네이션
		ArticlePage<MemberVO> articlePage = new ArticlePage<MemberVO>(total, currentPage, size, list, keyword,10);
		return articlePage;
	}

	@Override
	public Map<String, Object> getMemberDetail(String id) {

		// 그냥 vo
		MemberVO memberDetail = userManagementMapper.getMemberVO(id);

		// 관심키워드 리스트
		List<String> interestCn = userManagementMapper.getMemberInterest(id);

		String filePath = null;
		if (memberDetail.getFileProfile() != null) {
			FileDetailVO file = fileService.getFileDetail(memberDetail.getFileProfile(), 1);
			filePath = fileService.getSavePath(file);
		}

		// 정지 경고 횟수 이력
		MemberPenaltyCountVO countVO = userManagementMapper.selectPenaltyCountByMemberId(id);

		// 새로 추가되는 8개 정보
		// 1. 모의면접 횟수
		int mockInterviewCount = userManagementMapper.getMockInterviewCount(id);

		// 2. AI 피드백 횟수
		int aiFeedbackCount = userManagementMapper.getAiFeedbackCount(id);

		// 3. 상담횟수 (기존 counseling과 동일하지만 별도로 조회)
		int counselingCompletedCount = userManagementMapper.getCounselingCompletedCount(id);

		// 4. 월드컵 횟수
		int worldcupCount = userManagementMapper.getWorldcupCount(id);

		// 5. 로드맵 횟수
		int roadmapCount = userManagementMapper.getRoadmapCount(id);

		// 6. 심리검사 횟수
		int psychTestCount = userManagementMapper.getPsychTestCount(id);

		// 7. 최근 로그인 기록
		String recentLoginDate = userManagementMapper.getRecentLoginDate(id);

		// 8. 최근 제재 기록
		String recentPenaltyDate = userManagementMapper.getRecentPenaltyDate(id);

		Map<String, Object> map = new HashMap<String, Object>();

		if ("R01003".equals(memberDetail.getMemRole())) {
			int vacByCns = userManagementMapper.selectVacByCns(id);
			int counseling = userManagementMapper.selectCounseling(id);
			double avgRate = userManagementMapper.selectAvgRate(id);

			map.put("vacByCns", vacByCns);
			map.put("counseling", counseling);
			map.put("avgRate", avgRate);
		}

		// 기존 정보
		map.put("memberDetail", memberDetail);
		map.put("interestCn", interestCn);
		map.put("filePath", filePath);
		map.put("countVO", countVO);

		// 새로 추가되는 8개 정보
		map.put("mockInterviewCount", mockInterviewCount);
		map.put("aiFeedbackCount", aiFeedbackCount);
		map.put("counselingCompletedCount", counselingCompletedCount);
		map.put("worldcupCount", worldcupCount);
		map.put("roadmapCount", roadmapCount);
		map.put("psychTestCount", psychTestCount);
		map.put("recentLoginDate", recentLoginDate);
		map.put("recentPenaltyDate", recentPenaltyDate);

		return map;
	}

	@Override
	@Transactional
	public int insertUserByAdmin(MemberVO member, MultipartFile profileImage) {

		Long fileGroupId = null;

		if (profileImage != null) {
			List<MultipartFile> profileImages = new ArrayList<MultipartFile>();
			profileImages.add(profileImage);
			fileGroupId = fileService.createFileGroup();
			try {
				fileService.uploadFiles(fileGroupId, profileImages);
			} catch (IOException e) {

				e.printStackTrace();
			}
		}

		member.setFileProfile(fileGroupId);

		String memberPw = member.getMemPassword();
		member.setMemPassword(passwordEncoder.encode(memberPw));

		int res = userManagementMapper.insertUserByAdmin(member);

		return res;
	}

	@Override
	public int updateMemberInfo(MemberVO memberVO) {

		int res = userManagementMapper.updateMemberInfo(memberVO);

		return res;
	}

	@Override
	public ArticlePage<ReportVO> getReportList(int currentPage, int size, String keyword, String status, String sortBy, String sortOrder, String filter) {

		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("keyword", keyword);
		map.put("status", status);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);
		map.put("filter", filter);

		// 리스트 불러오기
		List<ReportVO> list = userManagementMapper.getReportList(map);

		// 건수
		int total = userManagementMapper.getAllReportList(map);
//		// 페이지 네이션
		ArticlePage<ReportVO> articlePage = new ArticlePage<ReportVO>(total, currentPage, size, list, keyword,10);

		return articlePage;
	}

	@Override
	public Map<String, Object> getReportDetail(String id) {

		ReportVO reportVO = userManagementMapper.getReportVO(id);

		Map<String, Object> map = new HashMap<String, Object>();

		String filePath = "";
		if (reportVO.getFileGroupNo() != null) {
			FileDetailVO file = fileService.getFileDetail(reportVO.getFileGroupNo(), 1);
			filePath = fileService.getSavePath(file);
			map.put("filePath", filePath);
			map.put("fileOrgName", file.getFileOrgName());
		}

		map.put("reportVO", reportVO);

		return map;
	}

	@Override
	public ArticlePage<MemberPenaltyVO> getPenaltyList(int currentPage, int size, String keyword, String status,
	        String sortBy, String sortOrder, String mpType) {

	    int startNo = (currentPage - 1) * size + 1;
	    int endNo = currentPage * size;

	    Map<String, Object> map = new HashMap<String, Object>();
	    map.put("keyword", keyword);
	    map.put("status", status);
	    map.put("currentPage", currentPage);
	    map.put("startNo", startNo);
	    map.put("endNo", endNo);

	    // 새로운 파라미터들 추가
	    map.put("sortBy", sortBy);
	    map.put("sortOrder", sortOrder);
	    map.put("mpType", mpType);

	    List<MemberPenaltyVO> penaltyVOList = userManagementMapper.getPenaltyList(map);

	    // 건수
	    int total = userManagementMapper.getAllMemberPenaltyList(map);
	    // 페이지 네이션
	    ArticlePage<MemberPenaltyVO> articlePage = new ArticlePage<MemberPenaltyVO>(total, currentPage, size,
	            penaltyVOList, keyword,10);

	    return articlePage;
	}

	@Override
	@Transactional
	public int submitPenalty(MemberPenaltyVO memberPenaltyVO, MultipartFile[] evidenceFiles) {

		Long fileGroupId = null;

		if (evidenceFiles != null) {
			List<MultipartFile> evidenceFilesList = new ArrayList<MultipartFile>();
			for (MultipartFile file : evidenceFiles) {
				evidenceFilesList.add(file);
			}
			fileGroupId = fileService.createFileGroup();
			try {
				fileService.uploadFiles(fileGroupId, evidenceFilesList);
			} catch (IOException e) {

				e.printStackTrace();
			}

		}

		memberPenaltyVO.setFileGroupNo(fileGroupId);

		int reportedId = memberPenaltyVO.getReportId();

		int memId = userManagementMapper.getMemIdByReport(reportedId);

		memberPenaltyVO.setMemId(memId);

		int res = userManagementMapper.submitPenalty(memberPenaltyVO);
		userManagementMapper.updateReport(reportedId);
		if("G14002".equals(memberPenaltyVO.getMpType())) {
			userManagementMapper.updateMemDelYn(memId);
		}

		return res;
	}

	@Override
	public Map<String, Object> getPenaltyDetail(String id) {

		MemberPenaltyVO memberPenaltyVO = userManagementMapper.getPenaltyDetail(id);

		Map<String, Object> map = new HashMap<String, Object>();

		String filePath = "";
		if (memberPenaltyVO.getFileGroupNo() != null) {
			FileDetailVO file = fileService.getFileDetail(memberPenaltyVO.getFileGroupNo(), 1);
			filePath = fileService.getSavePath(file);
			map.put("filePath", filePath);
			map.put("fileOrgName", file.getFileOrgName());
		}

		log.info("map + @@@@@" + map);

		map.put("penaltyVO", memberPenaltyVO);

		return map;
	}

	@Override
	public int reportModify(ReportVO reportVO) {

		int res = userManagementMapper.reportModify(reportVO);

		return res;
	}

	@Override
	public Map<String, Object> getDailyUserStats() {
		Map<String, Object> stats = new HashMap<>();

		// 1. 일일 사용자 현황
		int todayActiveUsers = userManagementMapper.getDailyActiveUsers();
		int yesterdayActiveUsers = userManagementMapper.getYesterdayActiveUsers();

		// 전날 대비 일일 사용자 증감률 계산
		Map<String, Object> userGrowth = calculateGrowthRate(todayActiveUsers, yesterdayActiveUsers);

		// 2. 일일 평균 홈페이지 이용 현황
		Double todayAvgUsageTime = userManagementMapper.getDailyAverageUsageTime();
		Double yesterdayAvgUsageTime = userManagementMapper.getYesterdayAverageUsageTime();

		if (todayAvgUsageTime == null)
			todayAvgUsageTime = 0.0;
		if (yesterdayAvgUsageTime == null)
			yesterdayAvgUsageTime = 0.0;

		// 전날 대비 평균 이용시간 증감률 계산
		Map<String, Object> usageTimeGrowth = calculateGrowthRate(todayAvgUsageTime.intValue(),
				yesterdayAvgUsageTime.intValue());

		// 3. 현재 온라인 사용자 수
		int currentOnlineUsers = userManagementMapper.getCurrentOnlineUsers();

		// 4. 일일 가입자 수 현황 (새로 추가)
		int todaySignUpUsers = userManagementMapper.getDailySignUpUsers();
		int yesterdaySignUpUsers = userManagementMapper.getYesterdaySignUpUsers();

		// 전날 대비 일일 가입자 수 증감률 계산
		Map<String, Object> signUpGrowth = calculateGrowthRate(todaySignUpUsers, yesterdaySignUpUsers);

		// 5. 월간 탈퇴자 수 현황 (새로 추가)
		int monthlyWithdrawalUsers = userManagementMapper.getMonthlyWithdrawalUsers();
		int lastMonthWithdrawalUsers = userManagementMapper.getLastMonthWithdrawalUsers();

		// 지난 달 대비 월간 탈퇴자 수 증감률 계산
		Map<String, Object> withdrawalGrowth = calculateGrowthRate(monthlyWithdrawalUsers, lastMonthWithdrawalUsers);

		// 기존 데이터
		stats.put("dailyActiveUsers", todayActiveUsers);
		stats.put("dailyActiveUsersRate", userGrowth.get("percentage"));
		stats.put("dailyActiveUsersStatus", userGrowth.get("status"));

		stats.put("avgUsageTimeMinutes", Math.round(todayAvgUsageTime));
		stats.put("avgUsageTimeRate", usageTimeGrowth.get("percentage"));
		stats.put("avgUsageTimeStatus", usageTimeGrowth.get("status"));

		stats.put("currentOnlineUsers", currentOnlineUsers);

		// 새로 추가된 데이터
		stats.put("dailySignUpUsers", todaySignUpUsers);
		stats.put("dailySignUpUsersRate", signUpGrowth.get("percentage"));
		stats.put("dailySignUpUsersStatus", signUpGrowth.get("status"));

		stats.put("monthlyWithdrawalUsers", monthlyWithdrawalUsers);
		stats.put("monthlyWithdrawalUsersRate", withdrawalGrowth.get("percentage"));
		stats.put("monthlyWithdrawalUsersStatus", withdrawalGrowth.get("status"));

		return stats;
	}

	private Map<String, Object> calculateGrowthRate(int currentCount, int previousCount) {
		double percentageChange = 0.0;
		String status = "equal";

		if (previousCount > 0) {
			percentageChange = ((double) (currentCount - previousCount) / previousCount) * 100;

			if (percentageChange > 0) {
				status = "increase";
			} else if (percentageChange < 0) {
				status = "decrease";
			}
		} else if (currentCount > 0) {
			status = "new_entry";
			percentageChange = 100.0;
		}

		DecimalFormat df = new DecimalFormat("#.##");
		String formattedPercentage = df.format(Math.abs(percentageChange));

		Map<String, Object> result = new HashMap<>();
		result.put("percentage", formattedPercentage);
		result.put("status", status);

		return result;
	}

	@Override
	public ArticlePage<MemberVO> getMemberActivityList(int currentPage, int size, String keyword, String activityStatus,
			String sortBy, String sortOrder, String inFilter) {
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<>();
		map.put("keyword", keyword);
		map.put("activityStatus", activityStatus);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);
		map.put("inFilter", inFilter);

		List<MemberVO> list = userManagementMapper.getMemberActivityList(map);
		int total = userManagementMapper.getAllMemberActivityList(map);
		log.info(size+"");
		ArticlePage<MemberVO> articlePage = new ArticlePage<>(total, currentPage, size, list, keyword,10);
		log.info(articlePage.getContent()+"");
		return articlePage;
	}

	@Override
	public ArticlePage<CommBoardVO> getMemberDetailBoardList(int currentPage, int size, String ccId,
			String sortBy, String sortOrder, int userId) {
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<>();
		map.put("memId", userId);
		map.put("ccId", ccId);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);

		List<CommBoardVO> list = userManagementMapper.getMemberDetailBoardList(map);
		int total = userManagementMapper.selectBoardCountByMemId(map);

		ArticlePage<CommBoardVO> articlePage = new ArticlePage<>(total, currentPage, size, list, "",10);

		return articlePage;
	}

	@Override
	public ArticlePage<CommReplyVO> getMemberDetailReplyList(int currentPage, int size, String sortBy,
			String sortOrder, int userId) {

		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<>();
		map.put("memId", userId);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);

		List<CommReplyVO> list = userManagementMapper.getMemberDetailReplyList(map);
		int total = userManagementMapper.selectReplyCountByMemId(map);

		ArticlePage<CommReplyVO> articlePage = new ArticlePage<>(total, currentPage, size, list, "",10);

		return articlePage;
	}

	@Override
	public ArticlePage<PageLogVO> getMemberPageLogList(int currentPage, int size, String keyword, String sortBy,
			String sortOrder, String memId) {
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<>();
		map.put("memId", memId);
		map.put("currentPage", currentPage);
		map.put("size", size);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("keyword", keyword);
		map.put("sortBy", sortBy);
		map.put("sortOrder", sortOrder);

		List<PageLogVO> list = userManagementMapper.getMemberPageLogList(map);
		int total = userManagementMapper.getAllMemberPageLogList(map);

		return new ArticlePage<>(total, currentPage, size, list, keyword,10);

	}

	@Override
	@Transactional
	public int penaltyModify(MemberPenaltyVO penaltyVO) {
		int result = this.userManagementMapper.penaltyModify(penaltyVO);

		String mpType = penaltyVO.getMpType();
		if("G14001".equals(mpType)) {
			// 경고로 변경시 회원 delYn값 N
			this.userManagementMapper.resetMemDelYn(penaltyVO.getMemId());
		}else if("G14002".equals(mpType)) {
			// 정지로 변경시 회원 delYn값 Y
			this.userManagementMapper.updateMemDelYn(penaltyVO.getMemId());
		}

		return result;
	}

	@Override
	@Transactional
	public int penaltyCancel(MemberPenaltyVO penaltyVO) {
		// 취소대상 먼저 선택
		penaltyVO = this.userManagementMapper.getPenaltyDetail(penaltyVO.getMpId()+"");

		int result = this.userManagementMapper.penaltyCancel(penaltyVO);
		if(result > 0) {
			// 회원 delYn값 N 으로 복구
			this.userManagementMapper.resetMemDelYn(penaltyVO.getMemId());
			// 신고기록 접수상태로 복구
			this.userManagementMapper.resetReportStatus(penaltyVO.getReportId());
		}
		return result;
	}

}
