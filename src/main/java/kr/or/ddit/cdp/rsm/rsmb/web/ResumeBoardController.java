package kr.or.ddit.cdp.rsm.rsmb.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

@RequestMapping("/cdp/rsm/rsmb")
@Controller
@Slf4j
public class ResumeBoardController {
	
	@Autowired
	TeenCommService teenCommService;
	
	@Autowired
	MyInquiryService myInquiryService;
	
	@Autowired
	FileService fileService;
	
	@Autowired
	AlarmService alarmService;
	
	@GetMapping("/resumeBoardList.do")
	public String resumeBoardPage(@ModelAttribute CommBoardVO board, @AuthenticationPrincipal String memId, Model model) {
		if(null != memId && !"anonymousUser".equals(memId)) {
			board.setMemId(Integer.parseInt(memId));
		}
		
		ArticlePage<CommBoardVO> articlePage = this.teenCommService.selectTeenList("G09004", board);
		
		articlePage.setUrl("/cdp/rsm/rsmb/resumeBoardList.do");
		
		model.addAttribute("articlePage", articlePage);
		
		return "cdp/rsm/rsmb/resumeBoardList";
	}
	
	@GetMapping("/resumeBoardDetail.do")
	public String resumeBoardDetailPage(@AuthenticationPrincipal String memId, @RequestParam int boardId, Model model) {
		
		if (memId == null || "anonymousUser".equals(memId)) {
			return "redirect:/error/logReq";
		}

		teenCommService.cntPlus(boardId);

		CommBoardVO boardVO = teenCommService.selectTeenDetail(boardId, memId);

		List<CommReplyVO> replyVO = teenCommService.selectBoardReply(boardId, memId);

		MemberVO memVO = (MemberVO) myInquiryService.selectMyInquiryView(boardVO.getMemId()+"").get("member");
		memVO = myInquiryService.getProfileFile(memVO);

		Long fileGruopId = boardVO.getFileGroupId();

		List<FileDetailVO> fileList = fileService.getFileList(fileGruopId);
		
		for(FileDetailVO f : fileList) {
			String filePath = fileService.getSavePath(f);
			f.setFilePath(filePath);
		}

		model.addAttribute("fileList", fileList);
		model.addAttribute("memId", memId);
		model.addAttribute("memVO", memVO);
		model.addAttribute("boardVO", boardVO);
		model.addAttribute("replyVO", replyVO);

		return "cdp/rsm/rsmb/resumeBoardDetail";
	}
	
	@GetMapping("/resumeBoardInsertView.do")
	public String insertTeen(@AuthenticationPrincipal String memIdStr, Model model) {

		if (memIdStr == null || "anonymousUser".equals(memIdStr)) {
			return "redirect:/error/logReq";
		}

		return "cdp/rsm/rsmb/resumeBoardInsertView";
	}

	@PostMapping("/resumeBoardInsert.do")
	@ResponseBody
	public ResponseEntity<String> insertTeenPost(
			@RequestParam String title
			, @RequestParam String content
			, @RequestParam(required = false) MultipartFile[] files
			, @AuthenticationPrincipal String memIdStr) {

		if (memIdStr == null || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		int memId = Integer.parseInt(memIdStr);

		Long fileGroupId = null;
		if (files != null) {
			fileGroupId = fileService.createFileGroup();
		}

		CommBoardVO commBoardVO = new CommBoardVO();
		commBoardVO.setMemId(memId);
		commBoardVO.setBoardTitle(title);
		commBoardVO.setBoardContent(content);
		commBoardVO.setFileGroupId(fileGroupId);
		commBoardVO.setCcId("G09004");

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
	
	@PostMapping("/resumeBoardUpdateView.do")
	public String resumeBoardUpdateView(@RequestParam int boardId, Model model) {
		CommBoardVO board = teenCommService.selectTeenBoard(boardId);
		
		Long fileGruopId = board.getFileGroupId();

		List<FileDetailVO> fileList = fileService.getFileList(fileGruopId);
		
		for(FileDetailVO f : fileList) {
			String filePath = fileService.getSavePath(f);
			f.setFilePath(filePath);
		}

		model.addAttribute("fileList", fileList);
		model.addAttribute("board", board);
		return "cdp/rsm/rsmb/resumeBoardUpdateView";
	}

	@PostMapping("/resumeBoardUpdate.do")
	@ResponseBody
	public ResponseEntity<String> teenBoardInUpdate(
			@RequestParam String title
			, @RequestParam String content
			, @RequestParam int boardId
			, @RequestParam(required = false) MultipartFile[] files
			, @AuthenticationPrincipal String memIdStr) {

		int memId = Integer.parseInt(memIdStr);

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
			return ResponseEntity.ok("파일업로드 실패");
		}

		teenCommService.updateBoard(commBoardVO);

		return ResponseEntity.ok("success");
	}
	
	@PostMapping("/createResumeReply.do")
	@ResponseBody
	public ResponseEntity<CommReplyVO> createCommReply(CommReplyVO commReplyVO, @AuthenticationPrincipal String memIdStr) {
		if (memIdStr == null || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

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
			alarmVO.setAlarmTargetUrl("/cdp/rsm/rsmb/resumeBoardDetail.do?boardId=" + newReplyVO.getBoardId());
		} else {
			alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_REPLY);
			alarmVO.setAlarmTargetId(newReplyVO.getReplyId());
			alarmVO.setAlarmTargetUrl("/cdp/rsm/rsmb/resumeBoardDetail.do?boardId=" + newReplyVO.getBoardId());
		}
		int targetMemId = alarmService.getTargetMemId(alarmVO);
		if (memId != targetMemId) {
			this.alarmService.sendEvent(alarmVO);
		}

		return ResponseEntity.ok(newReplyVO);
	}
	
	@PostMapping("/deleteResumeBoard.do")
	@ResponseBody
	public ResponseEntity<String> deleteteenBoard(@RequestBody CommBoardVO commBoardVO) {
		try {
			teenCommService.deleteteenBoard(commBoardVO);
			return ResponseEntity.ok("success");
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	@PostMapping("/deleteResumeReply.do")
	public ResponseEntity<Boolean> deleteTeenReply(@RequestBody CommReplyVO commReplyVO, @AuthenticationPrincipal String memIdStr) {
		if (memIdStr == null || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		int memId = Integer.parseInt(memIdStr);
		commReplyVO.setMemId(memId);

		boolean result = this.teenCommService.deleteReply(commReplyVO);
		if (!result) {
			log.error("잘못된 댓글 삭제 요청. 회원번호 : {}, 댓글번호 : {}", commReplyVO.getMemId(), commReplyVO.getReplyId());
		}

		return ResponseEntity.ok(result);
	}

	@PostMapping("/likeBoard.do")
	@ResponseBody
	public Map<String, Object> likeBoard(@RequestParam int boardId, @AuthenticationPrincipal String memId) {
		int isLiked = teenCommService.updateBoardLiked(boardId, memId);
		int likeCnt = teenCommService.selectBoardLikedCnt(boardId);

		return Map.of("isLiked", isLiked, "likeCnt", likeCnt);
	}

	@PostMapping("/likeReply.do")
	@ResponseBody
	public Map<String, Object> likeReply(@RequestParam int replyId, @RequestParam int boardId, @AuthenticationPrincipal String memId) {
		int isLiked = teenCommService.updateReplyLiked(boardId, replyId, memId);
		int likeCnt = teenCommService.selectReplyLikedCnt(boardId, replyId);

		return Map.of("isLiked", isLiked, "likeCnt", likeCnt);
	}
}
