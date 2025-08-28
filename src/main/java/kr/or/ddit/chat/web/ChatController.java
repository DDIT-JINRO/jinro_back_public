package kr.or.ddit.chat.web;

import java.security.Principal;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.chat.service.ChatMemberVO;
import kr.or.ddit.chat.service.ChatMessageVO;
import kr.or.ddit.chat.service.ChatReceiverVO;
import kr.or.ddit.chat.service.ChatRoomVO;
import kr.or.ddit.chat.service.ChatService;
import kr.or.ddit.chat.service.impl.ChatRoomSessionManager;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ChatController {

	@Autowired
	ChatRoomSessionManager chatRoomSessionManager;

	@Autowired
	SimpMessageSendingOperations messagingTemplate;

	@Autowired
	ChatService chatService;

	// 특정 채팅방 채팅목록 불러오기 (스터디그룹)
	@GetMapping("/api/chat/message/list")
	public ResponseEntity<List<ChatMessageVO>> getChatMessages(@RequestParam(value = "crId") int crId , @AuthenticationPrincipal String memId){
		// 로그인 안되어 있을 경우 처리
		if(memId==null || memId.equals("anonymousUser")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		}

	    ChatMemberVO vo = new ChatMemberVO();
	    vo.setCrId(crId);
	    vo.setMemId(Integer.parseInt(memId));
	    List<ChatMessageVO> chatMessageVOList = this.chatService.selectChatMsgByChatRoomIdAndMemId(vo);

	    return ResponseEntity.ok(chatMessageVOList);
	}

	// 현재 참여중인 스터디그룹 채팅방 목록 조회하기
	@GetMapping("/api/chat/rooms")
	public ResponseEntity<List<ChatRoomVO>> getMyChatRooms(@AuthenticationPrincipal String memId) {
		// 로그인 안되어 있을 경우 처리
		if(memId==null || memId.equals("anonymousUser")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

	    List<ChatRoomVO> rooms = this.chatService.findRoomsByMemId(memId);
	    return ResponseEntity.ok(rooms);
	}

	// 채팅방 참여 db삽입 -> 스터디그룹 게시글상세 등에서 개설된 채팅방에 참여를 요청.
	@PostMapping("/api/chat/room/participate")
	public ResponseEntity<String> participateChatRoom(@RequestParam int crId, @AuthenticationPrincipal String memId, Principal principal){
	    // 로그인 체크
	    if (memId == null || memId.equals("anonymousUser")) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
	    }

	    // 채팅방 입장 데이터 삽입할 VO 세팅
	    ChatMemberVO vo = new ChatMemberVO();
	    vo.setCrId(crId);
	    vo.setMemId(Integer.parseInt(memId));

	    try {
	        ChatMessageVO chatMessageVO = new ChatMessageVO();
			chatMessageVO.setCrId(vo.getCrId());
			chatMessageVO.setMemId(vo.getMemId());
			chatMessageVO.setMessageType("enter");
			chatMessageVO.setMessage("회원 입장");
			sendMessage(chatMessageVO, principal);

			this.chatService.participateChatRoom(vo);  // 채팅방 참여.
	        return ResponseEntity.ok("채팅방참여성공");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("채팅방참여실패");
	    }
	}

	// 채팅방 목록 가져오기 이후 바로 호출됨. 채팅방별 안읽은 갯수 가져오기.
	@GetMapping("/api/chat/unread")
	public ResponseEntity<List<ChatReceiverVO>> getUnreadState(Principal principal){
		if(principal != null) {
			int memId = Integer.parseInt(principal.getName());
			return ResponseEntity.ok(this.chatService.selectUnreadCountOfRoomsByMemId(memId));
		}else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@PostMapping("/api/chat/updateRead")
	public ResponseEntity<Void> updateRead(@RequestParam int crId, Principal principal){
		if(principal != null) {
			int memId = Integer.parseInt(principal.getName());
			ChatMemberVO chatMemberVO = new ChatMemberVO();
			chatMemberVO.setCrId(crId);
			chatMemberVO.setMemId(memId);
			this.chatService.receiverReadAtUpdate(chatMemberVO);
			return ResponseEntity.noContent().build();
		}else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	// 채팅 메시지 전송 -> 채팅메시지가 발생했을 때 대부분의 로직을 담당
	@MessageMapping("/chat/message")  // 클라이언트에서 /pub/chat/message로 전송 시 매핑
	public void sendMessage(ChatMessageVO chatMessageVO, Principal principal) {
		// 채팅메시지 테이블에 채팅 삽입 및 채팅 수신테이블에 삽입
		this.chatService.saveChatMessage(chatMessageVO);

		// 회원 정보까지 풀 정보 다시 받아오기 위해서 단건 조회
		chatMessageVO = this.chatService.selectChatMessage(chatMessageVO.getMsgId());

		// 채팅방 열어둔 사람들에게 채팅메시지 전송
		this.messagingTemplate.convertAndSend("/sub/chat/room/" + chatMessageVO.getCrId(), chatMessageVO);

		// 채팅 모달을 열어둔 사람들에게 채팅방별 안읽음 갯수 전송
		Set<Integer> openMemList = this.chatRoomSessionManager.getModalOpenUser();
		Iterator<Integer> openMemIt = openMemList.iterator();
		while(openMemIt.hasNext()) {
			int memId = openMemIt.next();
			List<ChatReceiverVO> unreadCntList = this.chatService.selectUnreadCountOfRoomsByMemId(memId);
			this.messagingTemplate.convertAndSend("/sub/chat/unread/detail/"+memId, unreadCntList);
		}

		// 유저의 전체 안읽음 갯수 전송
		// -> 수신테이블에서 전체 null값을 memId를 기준으로 카운팅해서 챙겨오고 해당 멤버들한테 브로드 캐스팅
		// 구독안되어 있으면 (로그인 안되어있으면) 수신안됨.
		List<ChatReceiverVO> unreadVOList = this.chatService.selectUnreadCountGroupByMemId();
		for(ChatReceiverVO unreadVO : unreadVOList) {
			int memId = unreadVO.getReceiverId();
			int unreadCnt = unreadVO.getUnreadCnt();
			if(memId != 0 && unreadCnt >= 1) {
				this.messagingTemplate.convertAndSend("/sub/chat/unread/summary/"+memId, unreadVO);
			}
		}
	}

	// 유저의 전체 안읽음 갯수 전송. MessageMapping("/chat/message") 에 작성된 전송은 채팅이 발생했을 때 적용됨.
	@GetMapping("/api/chat/totalUnread")
	public ResponseEntity<ChatReceiverVO> getTotalUnreadCount(Principal principal) {
		String memIdStr = principal.getName();
		if(memIdStr != null && !memIdStr.equals("anonymousUser")) {
			int memId = Integer.parseInt(memIdStr);
			ChatReceiverVO myUnreadCntVO = this.chatService.selectUnreadCountByMemId(memId);
			if(myUnreadCntVO == null) myUnreadCntVO = new ChatReceiverVO();
			return ResponseEntity.ok(myUnreadCntVO);
		}else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	@PostMapping("/api/chat/exit")
	public ResponseEntity<Boolean> exitChatRoom(@RequestBody ChatMemberVO chatMemberVO, Principal principal){
		try {
			this.chatService.exitChatRoom(chatMemberVO);

			ChatMessageVO chatMessageVO = new ChatMessageVO();
			chatMessageVO.setCrId(chatMemberVO.getCrId());
			chatMessageVO.setMemId(chatMemberVO.getMemId());
			chatMessageVO.setMessageType("exit");
			chatMessageVO.setMessage("회원 퇴장");
			this.sendMessage(chatMessageVO, principal);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/counselChat/{crId}")
	public String counselChat(@PathVariable int crId, @AuthenticationPrincipal String memIdStr, Model model) {
		// 현재 채팅방 주소 crId 받아오기 -> 해당 채팅방에 입장된 멤버 조회, 현재 요청중인 회원 정보 받아오기.
		boolean validateCounselChat = this.chatService.validateCounselChatRoom(crId, memIdStr);
		// 엑세스 확인 후 페이지로 포워딩, 포워딩된 페이지에서 실시간 채팅을 위해 구독상태 만들어주기.
		if(validateCounselChat) {
			// 상담사, 회원정보 챙겨오기 conselor, member
			Map<String, MemberVO> memberInfos = this.chatService.getMemberAndCounselorInfo(crId);
			MemberVO counselor = memberInfos.get("counselor");
			MemberVO member = memberInfos.get("member");
			// 기존 채팅메시지 있으면 챙겨오기
			ChatMemberVO chatMemberVO = new ChatMemberVO();
			chatMemberVO.setMemId(Integer.parseInt(memIdStr));
			List<ChatMessageVO> messages = this.chatService.selectChatMsgByChatRoomIdAndMemId(chatMemberVO);

			CounselingVO counselInfo = this.chatService.selectCounselInfoByCrId(crId);

			model.addAttribute("memberInfos", memberInfos);
			model.addAttribute("messages", messages);
			model.addAttribute("counselInfo", counselInfo);
			model.addAttribute("crId", crId);
			model.addAttribute("memId", memIdStr);

			model.addAttribute("memRole", (member.getMemId()+"").equals(memIdStr) ? "member" : "counselor" );

		}else {
			model.addAttribute("errorMessage", "잘못된 접근입니다");
		}
		return "cns/counselChat";
	}

	// 메시지 매핑 어노테이션 하나, 상담채팅용 구독 연결해줄 메소드 하나 추가하기
	@MessageMapping("/chat/counsel")
	public void counselChatMessage(ChatMessageVO chatMessageVO, Principal principal) {
		// 채팅메시지 테이블에 채팅 삽입 및 채팅 수신테이블에 삽입
		this.chatService.saveChatMessageWithoutReceiver(chatMessageVO);

		// 회원 정보까지 풀 정보 다시 받아오기 위해서 단건 조회
		chatMessageVO = this.chatService.selectChatMessage(chatMessageVO.getMsgId());

		// 같은 채팅방번호에 구독중인 멤버에게 채팅메시지 전송
		this.messagingTemplate.convertAndSend("/sub/chat/counsel/"+chatMessageVO.getCrId(), chatMessageVO);
	}

	@PostMapping(value = "/chat/message/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Void> chatMessageUpload(ChatMessageVO chatMessageVO, Principal principal) {
		this.chatService.fileUpload(chatMessageVO);
		sendMessage(chatMessageVO, principal);
		return ResponseEntity.noContent().build();
	}
}
