package kr.or.ddit.comm.peer.teen.web;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.ddit.comm.peer.teen.service.TeenCommService;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.inq.service.MyInquiryService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

/**
 * 2025/07/21 최초 생성 김석원 입니다. 커뮤니티 또래게시판 파트 작성하시는 분께 주의점 남깁니다 청소년 청년 분리되어있는데 화면에서
 * 또래 게시판 클릭시 청소년으로 이동하게 되어있습니다 회원정보 혹은 권한체크해서 청년이면 청년 게시판으로 이동되도록 구현해야합니다.
 */
@Controller
@Slf4j
@RequestMapping("/comm/peer/teen")
public class CommunityTeenController {

	@Autowired
	TeenCommService teenCommService;
	@Autowired
	MyInquiryService myInquiryService;
	@Autowired
	FileService fileService;
	@Autowired
	AlarmService alarmService;

	@GetMapping("/teenList.do")
	public String selectTeenList(Model model, @ModelAttribute CommBoardVO commBoardVO) {
		
		ArticlePage<CommBoardVO> articlePage = teenCommService.selectTeenList("G09001", commBoardVO);
		
		model.addAttribute("articlePage", articlePage);

		return "comm/peer/teen/teenList";
	}

	@GetMapping("/teenDetail.do")
	public String selectTeenDetail(@RequestParam int boardId, Principal principal,
	        @AuthenticationPrincipal String memId, Model model) {

	    if (principal == null || principal.getName().equals("anonymousUser")) {
	        return "redirect:/error/logReq";
	    }

	    // 현재 사용자가 관리자(ROLE_ADMIN)인지 확인
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    boolean isAdmin = authentication.getAuthorities().stream()
	                                  .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

	    // 관리자가 아니면서 청소년이 아닌 경우 접근 제한
	    if (!isAdmin) {
	        boolean isTeen = teenCommService.isTeen(memId);
	        if (!isTeen) {
	            model.addAttribute("message", "청소년만 접근 가능합니다.");
	            return "comm/peer/alert";
	        }
	    }

	    teenCommService.cntPlus(boardId);

	    CommBoardVO boardVO = teenCommService.selectTeenDetail(boardId, memId);

	    List<CommReplyVO> replyVO = teenCommService.selectBoardReply(boardId, memId);

	    MemberVO memVO = (MemberVO) myInquiryService.selectMyInquiryView(boardVO.getMemId() + "").get("member");
	    memVO = myInquiryService.getProfileFile(memVO);

	    Long fileGruopId = boardVO.getFileGroupId();

	    List<FileDetailVO> fileList = fileService.getFileList(fileGruopId);

	    model.addAttribute("fileList", fileList);
	    model.addAttribute("memId", memId);
	    model.addAttribute("memVO", memVO);
	    model.addAttribute("boardVO", boardVO);
	    model.addAttribute("replyVO", replyVO);

	    return "comm/peer/teen/teenDetail";
	}

	@GetMapping("/teenInsert.do")
	public String insertTeen(Principal principal, Model model) {

		if (principal == null || principal.getName().equals("anonymousUser")) {
			return "redirect:/error/logReq";
		}

		String memId = principal.getName();

		boolean isTeen = teenCommService.isTeen(memId);
		if (!isTeen) {
			model.addAttribute("message", "청소년만 접근 가능합니다.");
			return "comm/peer/alert";
		}

		return "comm/peer/teen/teenInsert";
	}

	@PostMapping("/teenInsert.do")
	@ResponseBody
	public ResponseEntity<String> insertTeenPost(@RequestParam("title") String title,
			@RequestParam("content") String content,
			@RequestParam(value = "files", required = false) MultipartFile[] files, Principal principal) {

		if (principal == null || principal.getName().equals("anonymousUser")) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		int memId = Integer.parseInt(principal.getName());

		Long fileGroupId = null;
		if (files != null) {
			fileGroupId = fileService.createFileGroup();
		}

		CommBoardVO commBoardVO = new CommBoardVO();
		commBoardVO.setMemId(memId);
		commBoardVO.setBoardTitle(title);
		commBoardVO.setBoardContent(content);
		commBoardVO.setFileGroupId(fileGroupId);
		commBoardVO.setCcId("G09001");

		List<MultipartFile> fileList = new ArrayList<MultipartFile>();

		if (files != null) {
			for (MultipartFile file : files) {
				fileList.add(file);
			}
		}

		try {
			fileService.uploadFiles(fileGroupId, fileList);
		} catch (IOException e) {
			return ResponseEntity.ok("파일업로드 실패");
		}

		teenCommService.insertBoard(commBoardVO);

		return ResponseEntity.ok("success");
	}

	@PostMapping("/teenBoardUpdate.do")
	public String goUpdateForm(@RequestParam("boardId") int boardId, Model model) {
		CommBoardVO board = teenCommService.selectTeenBoard(boardId);
		model.addAttribute("board", board);
		return "comm/peer/teen/teenBoardUpdate";
	}

	@PostMapping("/teenBoardInUpdate.do")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> teenBoardInUpdate(@RequestParam("title") String title,
			@RequestParam("content") String content, @RequestParam("boardId") int boardId,
			@RequestParam(value = "files", required = false) MultipartFile[] files, Principal principal) {
		int memId = Integer.parseInt(principal.getName());

		Long fileGroupId = null;
		if (files != null) {
			fileGroupId = fileService.createFileGroup();
		}

		CommBoardVO commBoardVO = new CommBoardVO();
		commBoardVO.setBoardId(boardId);
		commBoardVO.setMemId(memId);
		commBoardVO.setBoardTitle(title);
		commBoardVO.setBoardContent(content);
		commBoardVO.setFileGroupId(fileGroupId);

		List<MultipartFile> fileList = new ArrayList<MultipartFile>();

		if (files != null) {
			for (MultipartFile file : files) {
				fileList.add(file);
			}
		}

		try {
			fileService.uploadFiles(fileGroupId, fileList);
		} catch (IOException e) {
			return ResponseEntity.ok(Map.of("success", false));
		}

		String ccId = teenCommService.updateBoard(commBoardVO);
		return ResponseEntity.ok(Map.of("success", true, "ccId", ccId));
	}

	@PostMapping("/createTeenReply.do")
	@ResponseBody
	public ResponseEntity<CommReplyVO> createCommReply(CommReplyVO commReplyVO, Principal principal,
			HttpServletRequest request) {
		if (principal == null || principal.getName().equals("anonymousUser")) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		log.info("@@@@@" + request.getParameter("redirectUrl"));

		String memIdStr = principal.getName();
		int memId = Integer.parseInt(memIdStr);
		commReplyVO.setMemId(memId);
		CommReplyVO newReplyVO = this.teenCommService.insertReply(commReplyVO);

		if (newReplyVO == null) {
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		AlarmVO alarmVO = new AlarmVO();
		if (newReplyVO.getReplyParentId() == 0) {

			alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_BOARD);
			alarmVO.setAlarmTargetId(newReplyVO.getReplyId());
			alarmVO.setAlarmTargetUrl("/comm/peer/teen/teenDetail.do?boardId=" + newReplyVO.getBoardId());
		} else {

			alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_REPLY);
			alarmVO.setAlarmTargetId(newReplyVO.getReplyId());
			alarmVO.setAlarmTargetUrl("/comm/peer/teen/teenDetail.do?boardId=" + newReplyVO.getBoardId());
		}
		int targetMemId = alarmService.getTargetMemId(alarmVO);
		if (memId != targetMemId) {
			this.alarmService.sendEvent(alarmVO);
		}

		return ResponseEntity.ok(newReplyVO);
	}

	@PostMapping("/deleteteenBoard.do")
	@ResponseBody
	public ResponseEntity<String> deleteteenBoard(@RequestBody CommBoardVO commBoardVO) {

		try {
			teenCommService.deleteteenBoard(commBoardVO);
			return ResponseEntity.ok("success");
		} catch (Exception e) {
			return (ResponseEntity<String>) ResponseEntity.badRequest();
		}

	}

	@PostMapping("/deleteTeenReply.do")
	public ResponseEntity<Boolean> deleteTeenReply(@RequestBody CommReplyVO commReplyVO, Principal principal) {
		if (principal == null || principal.getName().equals("anonymousUser")) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		int memId = Integer.parseInt(principal.getName());
		commReplyVO.setMemId(memId);

		boolean result = this.teenCommService.deleteReply(commReplyVO);
		if (!result) {
			log.error("잘못된 댓글 삭제 요청. 회원번호 : {}, 댓글번호 : {}", commReplyVO.getMemId(), commReplyVO.getReplyId());
		}

		return ResponseEntity.ok(result);
	}

	@PostMapping("/likeBoard.do")
	@ResponseBody
	public Map<String, Object> likeBoard(@RequestParam("boardId") int boardId, Principal principal) {
		String memId = principal.getName();
		int isLiked = teenCommService.updateBoardLiked(boardId, memId);
		int likeCnt = teenCommService.selectBoardLikedCnt(boardId);

		return Map.of("isLiked", isLiked, "likeCnt", likeCnt);
	}

	@PostMapping("/likeReply.do")
	@ResponseBody
	public Map<String, Object> likeReply(@RequestParam("replyId") int replyId, @RequestParam("boardId") int boardId,
			Principal principal) {
		String memId = principal.getName();
		int isLiked = teenCommService.updateReplyLiked(boardId, replyId, memId);
		int likeCnt = teenCommService.selectReplyLikedCnt(boardId, replyId);

		return Map.of("isLiked", isLiked, "likeCnt", likeCnt);
	}

}
