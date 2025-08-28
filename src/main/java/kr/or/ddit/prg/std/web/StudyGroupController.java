package kr.or.ddit.prg.std.web;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.ddit.chat.service.ChatMemberVO;
import kr.or.ddit.chat.service.ChatMessageVO;
import kr.or.ddit.chat.service.ChatRoomVO;
import kr.or.ddit.chat.service.ChatService;
import kr.or.ddit.chat.web.ChatController;
import kr.or.ddit.com.report.web.ReportController;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.prg.std.service.StdBoardVO;
import kr.or.ddit.prg.std.service.StdReplyVO;
import kr.or.ddit.prg.std.service.StudyGroupService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/prg/std")
public class StudyGroupController {

	@Autowired
	StudyGroupService studyGroupService;

	@Autowired
	ChatController chatController;

	@Autowired
	ChatService chatService;

	@Autowired
	AlarmService alarmService;


	@GetMapping("/stdGroupList.do")
	public String selectStdGroupList(@RequestParam(required = false) String region,
		    						@RequestParam(required = false) String gender,
		    						@RequestParam(required = false) String interest,
		    						@RequestParam(required = false) List<String> interestItems,
		    						@RequestParam(required = false) Integer maxPeople,
		    						@RequestParam(required = false) String searchType,
		    						@RequestParam(required = false) String searchKeyword,
		    						@RequestParam(required = false, defaultValue = "1") int currentPage,
		    						@RequestParam(required = false, defaultValue = "5") int size,
		    						@RequestParam(required = false) String sortOrder,
		    						StdBoardVO stdBoardVO,
		    						Principal principal,
		    						Model model) {
		if (stdBoardVO != null && stdBoardVO.getSize() == 0)
			stdBoardVO.setSize(size);
		if (stdBoardVO != null && stdBoardVO.getCurrentPage() == 0)
			stdBoardVO.setCurrentPage(currentPage);

		int totalCount = this.studyGroupService.selectStudyGroupTotalCount(stdBoardVO);
		List<StdBoardVO> list = this.studyGroupService.selectStudyGroupList(stdBoardVO);

		ArticlePage<StdBoardVO> articlePage = new ArticlePage<>(totalCount, currentPage, size, list, searchKeyword);
		String baseUrl = buildQueryString(region, gender, interestItems, maxPeople, searchType, searchKeyword, size, sortOrder);
		articlePage.setUrl(baseUrl);
		articlePage.setPagingArea("");

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			List<ChatRoomVO> roomList = chatService.findRoomsByMemId(principal.getName());
			Set<Integer> myChatRoomIds = roomList.stream().map(ChatRoomVO::getCrId).collect(Collectors.toSet());
			model.addAttribute("myRoomSet", myChatRoomIds);
		}
		// 지역목록맵<지역코드, 지역명> 을 받아와서 지역코드순으로 출력하기 위해 리스트로 변환하고 정렬
		Map<String, String> regionMap = this.studyGroupService.getRegionMap();
		ArrayList<Map.Entry<String, String>> regionList = new ArrayList<>(regionMap.entrySet());
		regionList.sort(Map.Entry.comparingByKey());

		model.addAttribute("articlePage", articlePage);
		model.addAttribute("interestMap", this.studyGroupService.getInterestsMap());
		model.addAttribute("regionList", regionList);

		model.addAttribute("region", region);
		model.addAttribute("gender", gender);
		model.addAttribute("interestItems", interestItems);
		model.addAttribute("maxPeople", maxPeople);
		model.addAttribute("searchType", searchType);
		model.addAttribute("searchKeyword", searchKeyword);
		model.addAttribute("currentPage", currentPage);
		model.addAttribute("size", size);
		model.addAttribute("sortOrder", sortOrder);
		return "prg/std/stdGroupList";
	}

	@GetMapping("/stdGroupDetail.do")
	public String selectStdGroupDetail(@RequestParam int stdGroupId, Model model, Principal principal)  {
		model.addAttribute("stdGroupId", stdGroupId);
		// 단일 게시글 전체 내용에 댓글 리스트 + 채팅방정보 챙겨오기

		this.studyGroupService.increaseViewCnt(stdGroupId);
		StdBoardVO stdBoardVO = this.studyGroupService.selectStudyGroupDetail(stdGroupId);

		// 채팅방 참여했는지 여부를 체크하는 값 가져오기
		ChatRoomVO chatRoomVO = stdBoardVO.getChatRoomVO();
		if (principal != null && !principal.getName().equals("unonymousUser") && chatRoomVO != null) {
			boolean isEntered = this.chatService.isEntered(chatRoomVO.getCrId(), principal.getName());
			model.addAttribute("isEntered", isEntered);
		}

		model.addAttribute("stdBoardVO", stdBoardVO);
		model.addAttribute("interestMap", this.studyGroupService.getInterestsMap());
		return "prg/std/stdGroupDetail";
	}

	// page번호 버튼에 url 입력을 위한 base 쿼리스트링 구성
	private String buildQueryString(String region,String gender, List<String> interestItems, Integer maxPeople
								, String searchType, String searchKeyword, int size, String sortOrder) {
		StringBuilder sb = new StringBuilder();
		sb.append("/prg/std/stdGroupList.do");
		sb.append("?").append("region=").append(region == null ? "" : region);
		sb.append("&").append("gender=").append(gender == null ? "" : gender);
		sb.append("&").append("maxPeople=").append(maxPeople == null ? "" : maxPeople);
		sb.append("&").append("searchType=").append(searchType == null ? "" : searchType);
		sb.append("&").append("searchKeyword=").append(searchKeyword == null ? "" : searchKeyword);
		sb.append("&").append("sortOrder=").append(sortOrder == null ? "" : sortOrder);
		sb.append("&").append("size=").append(size);

		if (interestItems == null || interestItems.size() == 0)
			return sb.toString();
		for (String interest : interestItems) {
			sb.append("&").append("interestItems=").append(interest == null ? "" : interest);
		}

		return sb.toString();
	}

	@PostMapping("/api/enterStdGroup")
	public ResponseEntity<String> enterStdGroup(@RequestBody ChatMemberVO chatMemberVO, Principal principal){
		try {
			this.chatService.participateChatRoom(chatMemberVO);
	        ChatMessageVO chatMessageVO = new ChatMessageVO();
			chatMessageVO.setCrId(chatMemberVO.getCrId());
			chatMessageVO.setMemId(chatMemberVO.getMemId());
			chatMessageVO.setMessageType("enter");
			chatMessageVO.setMessage("회원 입장");
			chatController.sendMessage(chatMessageVO, principal);

			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	@GetMapping("/createStdGroup.do")
	public String createStdGroup(@AuthenticationPrincipal String memId, Model model) {
		// jsp 측에서 막아놨지만 혹시 몰라서 걸어둠.
		if (memId == null || memId.equals("anonymousUser")) {
			return "/login";
		}

		Map<String, String> interestMap = this.studyGroupService.getInterestsMap();
		Map<String, String> regionMap = this.studyGroupService.getRegionMap();

		// 보관되어있는 regionMap<지역코드 : 지역명> 을 순서대로 정렬해서 보내기 위해 리스트로 변환 후 key순 정렬
		ArrayList<Map.Entry<String, String>> regionList = new ArrayList<>(regionMap.entrySet());
		regionList.sort(Map.Entry.comparingByKey());

		model.addAttribute("interestMap", interestMap);
		model.addAttribute("regionList", regionList);

		return "prg/std/createStdGroup";
	}

	@PostMapping("/createStdGroup.do")
	public String createStdGroupPost(StdBoardVO stdBoardVO, RedirectAttributes rttr) {
		Map<String, Integer> resultMap = this.studyGroupService.insertStdBoard(stdBoardVO);
		int resultBoardId = resultMap.get("boardId");
		int resultCrId = resultMap.get("crId");
		if (resultBoardId > 0) {
			rttr.addFlashAttribute("newChatRoom", resultCrId);
			return "redirect:/prg/std/stdGroupDetail.do?stdGroupId=" + resultBoardId;
		}

		return "redirect:/prg/std/createStdGroup.do";
	}

	@PostMapping("/createStdReply.do")
	public ResponseEntity<StdReplyVO> createStdReply(StdReplyVO stdReplyVO, Principal principal) {
		if (principal == null || principal.getName().equals("anonymousUser")) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}
		String memIdStr = principal.getName();
		int memId = Integer.parseInt(memIdStr);
		stdReplyVO.setMemId(memId);
		StdReplyVO newReplyVO = this.studyGroupService.insertReply(stdReplyVO);

		if (newReplyVO == null) {
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}

		AlarmVO alarmVO = new AlarmVO();
		if (newReplyVO.getReplyParentId() == 0) {
			alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_BOARD);
			alarmVO.setAlarmTargetId(newReplyVO.getReplyId());
			alarmVO.setAlarmTargetUrl("/prg/std/stdGroupDetail.do?stdGroupId=" + newReplyVO.getBoardId() + "#" + "reply-" + newReplyVO.getBoardId() + "-"
					+ newReplyVO.getReplyId());
		} else {
			alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_REPLY);
			alarmVO.setAlarmTargetId(newReplyVO.getReplyId());
			alarmVO.setAlarmTargetUrl("/prg/std/stdGroupDetail.do?stdGroupId=" + newReplyVO.getBoardId() + "#" + "reply-" + newReplyVO.getBoardId() + "-"
					+ newReplyVO.getReplyParentId());
		}
		int targetMemId = alarmService.getTargetMemId(alarmVO);
		if (memId != targetMemId) {
			this.alarmService.sendEvent(alarmVO);
		}

		return ResponseEntity.ok(newReplyVO);
	}

	@PostMapping("/deleteStdReply.do")
	public ResponseEntity<Boolean> deleteStdReply(@RequestBody StdReplyVO stdReplyVO, Principal principal){
		if(principal==null || principal.getName().equals("anonymousUser")) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		int memId = Integer.parseInt(principal.getName());
		stdReplyVO.setMemId(memId);

		boolean result = this.studyGroupService.deleteReply(stdReplyVO);
		if(!result) {
			log.error("잘못된 댓글 삭제 요청. 회원번호 : {}, 댓글번호 : {}", stdReplyVO.getMemId(), stdReplyVO.getReplyId());
		}

		return ResponseEntity.ok(result);
	}

	@PostMapping("/deleteStdBoard.do")
	public ResponseEntity<Boolean> deleteStdBoard(@RequestBody Map<String, Object> map, Principal principal){
		if (principal == null || principal.getName().equals("anonymousUser") || !principal.getName().equals(map.get("memId")))
			throw new CustomException(ErrorCode.INVALID_USER);

		try {
			boolean result = this.studyGroupService.deleteStdBoard(map);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/updateStdReply.do")
	public ResponseEntity<Boolean> updateStdReply(@RequestBody StdReplyVO stdReplyVO, Principal principal) {
		if (principal == null || principal.getName().equals("anonymousUser") || !principal.getName().equals(stdReplyVO.getMemId() + "")) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		boolean result = this.studyGroupService.updateStdReply(stdReplyVO);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/updateStdBoard.do")
	public String updateStdBoard(StdBoardVO stdBoardVO, Model model) {
		// boardCnt 에다가 연계된 채팅방번호 (crId) 값 넣어둠.
		// boardId, memId, crId값 넘어옴
		StdBoardVO currentStdBoardVO = this.studyGroupService.selectStudyGroupDetail(stdBoardVO.getBoardId());
		model.addAttribute("csbVO", currentStdBoardVO);

		Map<String, String> interestMap = this.studyGroupService.getInterestsMap();
		Map<String, String> regionMap = this.studyGroupService.getRegionMap();
		// 보관되어있는 regionMap<지역코드 : 지역명> 을 순서대로 정렬해서 보내기 위해 리스트로 변환 후 key순 정렬
		ArrayList<Map.Entry<String, String>> regionList = new ArrayList<>(regionMap.entrySet());
		regionList.sort(Map.Entry.comparingByKey());
		Map<String, String> genderMap = new HashMap<>();
		genderMap.put("all", "성별제한 없음");
		genderMap.put("men", "남자만");
		genderMap.put("women", "여자만");

		model.addAttribute("interestMap", interestMap);
		model.addAttribute("regionList", regionList);
		model.addAttribute("genderMap", genderMap);
		model.addAttribute("regionMap", regionMap);

		return "prg/std/updateStdBoard";
	}

	@PostMapping("/updateStdBoardAct.do")
	public String updateStdBoardAct(@AuthenticationPrincipal String memId, StdBoardVO stdBoardVO, Model model) {
		// jsp 측에서 막아놨지만 혹시 몰라서 걸어둠.
		if (memId == null || memId.equals("anonymousUser")) {
			return "/login";
		}

		int resultBoardId = this.studyGroupService.updateStdBoard(stdBoardVO);
		if (resultBoardId > 0) {
			// 성공시 상세페이지로 이동시킴
			return "redirect:/prg/std/stdGroupDetail.do?stdGroupId=" + resultBoardId;
		}

		// 실패 시 다시 forward
		StdBoardVO currentStdBoardVO = this.studyGroupService.selectStudyGroupDetail(stdBoardVO.getBoardId());
		model.addAttribute("csbVO", currentStdBoardVO);
		Map<String, String> interestMap = this.studyGroupService.getInterestsMap();
		Map<String, String> regionMap = this.studyGroupService.getRegionMap();
		ArrayList<Map.Entry<String, String>> regionList = new ArrayList<>(regionMap.entrySet());
		regionList.sort(Map.Entry.comparingByKey());
		Map<String, String> genderMap = new HashMap<>();
		genderMap.put("all", "성별제한 없음");
		genderMap.put("men", "남자만");
		genderMap.put("women", "여자만");

		model.addAttribute("interestMap", interestMap);
		model.addAttribute("regionList", regionList);
		model.addAttribute("genderMap", genderMap);
		model.addAttribute("regionMap", regionMap);

		return "prg/std/updateStdBoard";
	}

}
