package kr.or.ddit.comm.path.web;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
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

@Controller
@RequestMapping("/comm/path")
public class CommunityPathController {

	@Autowired
	MyInquiryService myInquiryService;
	@Autowired
	TeenCommService teenCommService;
	@Autowired
	FileService fileService;
	@Autowired
	AlarmService alarmService;

	@GetMapping("/pathList.do")
	public String selectPathList(Model model, @ModelAttribute CommBoardVO commBoardVO) {

		ArticlePage<CommBoardVO> articlePage = teenCommService.selectTeenList("G09002", commBoardVO);

		model.addAttribute("articlePage", articlePage);

		return "comm/path/pathList";
	}

	@GetMapping("/pathDetail.do")
	public String selectPathDetail(@RequestParam int boardId, Model model, @AuthenticationPrincipal String memId, Principal principal) {
		
		if (principal == null || principal.getName().equals("anonymousUser")) {
			return "redirect:/error/logReq";
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

		return "comm/path/pathDetail";
	}

	@GetMapping("/pathInsert.do")
	public String insertPath(Principal principal) {
		if (principal == null || principal.getName().equals("anonymousUser")) {
			return "redirect:/error/logReq";
		}

		return "comm/path/pathInsert";
	}

	@PostMapping("/pathInsert.do")
	@ResponseBody
	public ResponseEntity<String> insertPathPost(@RequestParam("title") String title,
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
		commBoardVO.setCcId("G09002");

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

	@PostMapping("/createPathReply.do")
	@ResponseBody
	public ResponseEntity<CommReplyVO> createYouthReply(CommReplyVO commReplyVO, Principal principal,
			HttpServletRequest request) {
		if (principal == null || principal.getName().equals("anonymousUser")) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

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
			alarmVO.setAlarmTargetUrl("/comm/path/pathDetail.do?boardId=" + newReplyVO.getBoardId());
		} else {

			alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_REPLY);
			alarmVO.setAlarmTargetId(newReplyVO.getReplyId());
			alarmVO.setAlarmTargetUrl("/comm/path/pathDetail.do?boardId=" + newReplyVO.getBoardId());
		}
		int targetMemId = alarmService.getTargetMemId(alarmVO);
		if (memId != targetMemId) {
			this.alarmService.sendEvent(alarmVO);
		}

		return ResponseEntity.ok(newReplyVO);
	}
	
	@PostMapping("/pathBoardUpdate.do")
	public String goUpdateForm(@RequestParam("boardId") int boardId, Model model) {
		CommBoardVO board = teenCommService.selectTeenBoard(boardId);
		model.addAttribute("board", board);
		return "comm/path/pathBoardUpdate";
	}
}
