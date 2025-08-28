package kr.or.ddit.admin.umg.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.account.join.service.MemberJoinService;
import kr.or.ddit.account.lgn.service.MemberPenaltyVO;
import kr.or.ddit.admin.las.service.PageLogVO;
import kr.or.ddit.admin.umg.service.UserManagementService;
import kr.or.ddit.com.report.service.ReportVO;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin/umg")
@Slf4j
public class UserManagementController {

	@Autowired
	private UserManagementService userManagementService;

	@Autowired
	private MemberJoinService memberJoinService;

	@Autowired
	private AlarmService alarmService;

	@GetMapping("/getMemberList.do")
	public ArticlePage<MemberVO> getMemberList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "memRole") String memRole) {

		return userManagementService.getMemberList(currentPage, size, keyword, status, memRole);
	}

	@PostMapping("/getMemberDetail.do")
	public Map<String, Object> getMemberDetail(@RequestParam("id") String id) {

		return userManagementService.getMemberDetail(id);
	}

	@GetMapping("/getMemberDetailBoardList.do")
	public ArticlePage<CommBoardVO> getMemberDetailBoardList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "5") int size,
			@RequestParam(value = "ccId", required = false) String ccId,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestParam(value = "sortOrder", required = false, defaultValue = "asc") String sortOrder,
			@RequestParam(value = "userId") int userId) {

		return userManagementService.getMemberDetailBoardList(currentPage, size, ccId, sortBy, sortOrder, userId);

	}
	@GetMapping("/getMemberDetailReplyList.do")
	public ArticlePage<CommReplyVO> getMemberDetailReplyList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "5") int size,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestParam(value = "sortOrder", required = false, defaultValue = "asc") String sortOrder,
			@RequestParam(value = "userId") int userId) {

		return userManagementService.getMemberDetailReplyList(currentPage, size, sortBy, sortOrder, userId);

	}

	@PostMapping("/insertUserByAdmin.do")
	public String insertUserByAdmin(MemberVO memberVO, @RequestParam(required = false) MultipartFile profileImage) {

		return userManagementService.insertUserByAdmin(memberVO, profileImage) == 1 ? "success" : "failed";

	}

	@PostMapping("/updateMemberInfo.do")
	public int updateMemberInfo(MemberVO memberVO) {

		int res = userManagementService.updateMemberInfo(memberVO);

		return res;
	}

	@PostMapping("/selectEmailByAdmin.do")
	public String selectEmailByAdmin(@RequestParam("email") String email) {

		MemberVO memberVO = memberJoinService.selectUserEmail(email);

		if (memberVO != null) {
			return "중복된 이메일입니다.";
		} else
			return "사용 가능한 이메일입니다.";
	}

	@PostMapping("/selectNicknameByAdmin.do")
	public String selectNicknameByAdmin(@RequestParam("nickname") String nickname) {

		boolean boolRes = memberJoinService.isNicknameExists(nickname);

		if (boolRes) {
			return "중복된 닉네임입니다.";
		} else
			return "사용 가능한 닉네임입니다.";
	}

	@GetMapping("/getReportList.do")
	public ArticlePage<ReportVO> getReportList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestParam(value = "sortOrder", required = false) String sortOrder,
			@RequestParam(value = "filter", required = false) String filter) {

		return userManagementService.getReportList(currentPage, size, keyword, status, sortBy, sortOrder, filter);

	}

	@PostMapping("/getReportDetail.do")
	public Map<String, Object> getReportDetail(@RequestParam("id") String id) {

		return userManagementService.getReportDetail(id);
	}

	@GetMapping("/getPenaltyList.do")
	public ArticlePage<MemberPenaltyVO> getPenaltyList(
	        @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
	        @RequestParam(value = "size", required = false, defaultValue = "10") int size,
	        @RequestParam(value = "keyword", required = false) String keyword,
	        @RequestParam(value = "status", required = false) String status,
	        @RequestParam(value = "sortBy", required = false) String sortBy,
	        @RequestParam(value = "sortOrder", required = false) String sortOrder,
	        @RequestParam(value = "mpType", required = false) String mpType) {

	    return userManagementService.getPenaltyList(currentPage, size, keyword, status, sortBy, sortOrder, mpType);
	}

	@PostMapping("/submitPenalty.do")
	public String submitPenalty(MemberPenaltyVO memberPenaltyVO,
			@RequestParam(required = false) MultipartFile[] evidenceFiles) {

		int res = userManagementService.submitPenalty(memberPenaltyVO, evidenceFiles);

		AlarmVO alarmVO = new AlarmVO();

		alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_PENALTY);
		alarmVO.setMemId(memberPenaltyVO.getMemId());
		alarmVO.setAlarmTargetUrl("#");
		this.alarmService.sendEvent(alarmVO);

		return res == 1 ? "success" : "failed";

	}

	@PostMapping("/getPenaltyDetail.do")
	public Map<String, Object> getPenaltyDetail(@RequestParam("id") String id) {

		return userManagementService.getPenaltyDetail(id);
	}

	@PostMapping("/reportModify.do")
	public int reportModify(ReportVO reportVO) {

		return userManagementService.reportModify(reportVO);
	}

	@PostMapping("/penaltyModify.do")
	public int penaltyModify(MemberPenaltyVO penaltyVO) {

		return userManagementService.penaltyModify(penaltyVO);
	}

	@PostMapping("/penaltyCancel.do")
	public int penaltyCancel(MemberPenaltyVO penaltyVO) {

		return userManagementService.penaltyCancel(penaltyVO);
	}

	@GetMapping("/getDailyUserStats.do")
	public Map<String, Object> getDailyUserStats() {
		return userManagementService.getDailyUserStats();
	}

	@GetMapping("/getMemberActivityList.do")
	public ArticlePage<MemberVO> getMemberActivityList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "activityStatus", required = false) String activityStatus,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestParam(value = "sortOrder", required = false, defaultValue = "asc") String sortOrder,
			@RequestParam(value = "inFilter", required = false) String inFilter) {

		return userManagementService.getMemberActivityList(currentPage, size, keyword, activityStatus, sortBy,
				sortOrder, inFilter);
	}

	@GetMapping("/getMemberPageLogList.do")
	public ArticlePage<PageLogVO> getMemberPageLogList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "5") int size,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestParam(value = "sortOrder", required = false, defaultValue = "asc") String sortOrder,
			@RequestParam(value = "memId", required = true) String memId) {

		return userManagementService.getMemberPageLogList(currentPage, size, keyword, sortBy, sortOrder, memId);
	}

}
