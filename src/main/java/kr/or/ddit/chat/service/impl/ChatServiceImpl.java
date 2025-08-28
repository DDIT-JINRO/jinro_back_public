package kr.or.ddit.chat.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.chat.service.ChatMemberVO;
import kr.or.ddit.chat.service.ChatMessageVO;
import kr.or.ddit.chat.service.ChatReceiverVO;
import kr.or.ddit.chat.service.ChatRoomVO;
import kr.or.ddit.chat.service.ChatService;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.inq.service.MyInquiryService;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

	@Autowired
	ChatRoomSessionManager chatRoomSessionManager;

	@Autowired
	ChatMapper chatMapper;

	@Autowired
	FileService fileService;

	@Autowired
	MyInquiryService myInquiryService;

	@Override
	public List<ChatRoomVO> findRoomsByMemId(String memId) {
		return this.chatMapper.findRoomsByMemId(memId);
	}

	@Override
	public void participateChatRoom(ChatMemberVO chatMemberVO) {
		ChatMemberVO participatedMember = this.chatMapper.selectChatMember(chatMemberVO);
		// 이 객체가 null 값이면 최초입장. 객체가 있으면 퇴장했던 멤버의 재입장.

		int result = this.chatMapper.insertAndUpdateChatMember(chatMemberVO);

		ChatMessageVO chatMessageVO = new ChatMessageVO();
	}

	@Override
	public void exitChatRoom(ChatMemberVO chatMemberVO) {

		this.chatMapper.chatMemberExitChatRoomUpdate(chatMemberVO);
	}

	@Override
	public List<ChatMessageVO> selectChatMsgByChatRoomIdAndMemId(ChatMemberVO vo) {
		List<ChatMessageVO> chatList = this.chatMapper.selectChatMsgByChatRoomIdAndMemId(vo);

		for (ChatMessageVO chatVO : chatList) {
			setChatMessageMemberFileStr(chatVO);
			Long fileGroupId = chatVO.getFileGroupId();
			if(fileGroupId != null && fileGroupId != 0) {
				List<FileDetailVO> list = fileService.getFileList(fileGroupId);
				for(FileDetailVO f : list) {
					String realPath = fileService.getSavePath(f);
					f.setFilePath(realPath);
					chatVO.setFileDetailList(list);
				}
			}

		}
		return chatList;
	}

	@Override
	public void saveChatMessage(ChatMessageVO chatMessageVO) {
		if (chatMessageVO.getMessageType() == null) {
			chatMessageVO.setMessageType("TEXT");
		}
		// 1. 메시지 insert
		this.chatMapper.insertChatMessage(chatMessageVO);

		// 2. 채팅방 참여자 전체 목록 불러오기
		List<Integer> enteredMemList = this.chatMapper.findChatMemberIdsByCrId(chatMessageVO.getCrId());
		// 3. 채팅방 구독중(채팅방을 오픈한 유저) 목록 불러오기
		Set<Integer> subscribeMemList = this.chatRoomSessionManager.getOpendUser(chatMessageVO.getCrId());

		// 4. 수신자 테이블 처리 (구독중인 사람은 현재시간, 아닌사람은 null)
		for (int receiverId : enteredMemList) {
			ChatReceiverVO chatReceiverVO = new ChatReceiverVO();
			chatReceiverVO.setMsgId(chatMessageVO.getMsgId());
			chatReceiverVO.setReceiverId(receiverId);

			if (receiverId == chatMessageVO.getMemId() || subscribeMemList.contains(receiverId)) {
				chatReceiverVO.setReadAt(LocalDateTime.now());
			} else {
				chatReceiverVO.setReadAt(null);
			}

			this.chatMapper.insertChatReceiver(chatReceiverVO);
		}

	}

	@Override
	public List<ChatReceiverVO> selectUnreadCountGroupByMemId() {
		return this.chatMapper.selectUnreadCountGroupByMemId();
	}

	@Override
	public List<ChatReceiverVO> selectUnreadCountOfRoomsByMemId(int memId) {
		return this.chatMapper.selectUnreadCountOfRoomsByMemId(memId);
	}

	@Override
	public int receiverReadAtUpdate(ChatMemberVO chatMemberVO) {
		return this.chatMapper.receiverReadAtUpdate(chatMemberVO);
	}

	@Override
	public ChatReceiverVO selectUnreadCountByMemId(int memId) {
		return this.chatMapper.selectUnreadCountByMemId(memId);
	}

	@Override
	public int insertChatRoom(ChatRoomVO chatRoomVO) {
		return this.chatMapper.insertChatRoom(chatRoomVO);
	}

	@Override
	public boolean isEntered(int crId, String memIdStr) {
		List<ChatRoomVO> rooms = this.findRoomsByMemId(memIdStr);
		if (rooms == null || rooms.size() == 0)
			return false;

		for (ChatRoomVO chatRoomVO : rooms) {
			if (chatRoomVO.getCrId() == crId) {
				return true;
			}
		}

		return false;
	}

	@Override
	@Transactional
	public int deleteChatRoom(ChatRoomVO chatRoomVO) {
		int crId = chatRoomVO.getCrId();
		List<Integer> enterMemList = this.chatMapper.findChatMemberIdsByCrId(crId);

		for (int memId : enterMemList) {
			ChatMemberVO chatMemberVO = new ChatMemberVO();
			chatMemberVO.setCrId(crId);
			chatMemberVO.setMemId(memId);
			this.exitChatRoom(chatMemberVO);
		}

		int result = this.chatMapper.deleteChatRoom(chatRoomVO);

		return result;
	}

	@Override
	public ChatRoomVO selectChatRoom(int crId) {
		return this.chatMapper.selectChatRoom(crId);
	}

	@Override
	public int updateChatRoom(ChatRoomVO chatRoomVO) {
		return this.chatMapper.updateChatRoom(chatRoomVO);
	}

	@Override
	public ChatMessageVO selectChatMessage(int msgId) {
		ChatMessageVO selectedChatMessageVO = this.chatMapper.selectChatMessage(msgId);
		setChatMessageMemberFileStr(selectedChatMessageVO);

		String messageType = selectedChatMessageVO.getMessageType();
		if("FILE".equals(messageType) || "IMAGE".equals(messageType)) {
			// fileDetailVOList 불러와서 넣어주기.
			Long fileGroupId = selectedChatMessageVO.getFileGroupId();
			List<FileDetailVO> list = fileService.getFileList(fileGroupId);
			for(FileDetailVO f : list) {
				String realPath = fileService.getSavePath(f);
				f.setFilePath(realPath);
			}

			selectedChatMessageVO.setFileDetailList(list);
		}

		return selectedChatMessageVO;
	}

	private void setChatMessageMemberFileStr(ChatMessageVO chatMessageVO) {
		Long fileBadgeId = chatMessageVO.getFileBadge();
		Long fileProfileId = chatMessageVO.getFileProfile();
		Long fileSubId = chatMessageVO.getFileSub();

		FileDetailVO fileBadgeDetail = this.fileService.getFileDetail(fileBadgeId, 1);
		FileDetailVO fileProfileDetail = this.fileService.getFileDetail(fileProfileId, 1);
		FileDetailVO fileSubDetail = this.fileService.getFileDetail(fileSubId, 1);

		if (fileBadgeDetail != null) {
			chatMessageVO.setFileBadgeStr(this.fileService.getSavePath(fileBadgeDetail));
		}
		if (fileProfileDetail != null) {
			chatMessageVO.setFileProfileStr(this.fileService.getSavePath(fileProfileDetail));
		}
		if (fileSubDetail != null) {
			chatMessageVO.setFileSubStr(this.fileService.getSavePath(fileSubDetail));
		}
	}

	@Override
	public boolean validateCounselChatRoom(int crId, String memIdStr) {
		try {
			ChatRoomVO chatRoomVO = selectChatRoom(crId);
			if (!"G04002".equals(chatRoomVO.getCcId()))
				return false; // 채팅방 정보 조회 후 상담목적 채팅방이 아니면 false

			ChatMemberVO chatMemberVO = new ChatMemberVO();
			chatMemberVO.setCrId(crId);
			chatMemberVO.setMemId(Integer.parseInt(memIdStr));
			ChatMemberVO target = this.chatMapper.selectChatMember(chatMemberVO); // 해당 채팅방에 현재 요청한 회원이 없으면 false
			if (target != null) {
				return true;
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			return false;
		}
		return false;
	}

	@Override
	public Map<String, MemberVO> getMemberAndCounselorInfo(int crId) {
		List<Integer> members = this.chatMapper.findChatMemberIdsByCrId(crId);
		Map<String, MemberVO> counselMembers = new HashMap<>();
		for (int memId : members) {
			MemberVO memberVO = this.chatMapper.selectMemInfoForCounsel(memId);
			myInquiryService.getProfileFile(memberVO);
			String role = memberVO.getMemRole();
			if ("R01003".equals(role)) {
				counselMembers.put("counselor", memberVO);
			} else {
				counselMembers.put("member", memberVO);
			}
		}
		return counselMembers;
	}

	@Override
	public CounselingVO selectCounselInfoByCrId(int crId) {
		return this.chatMapper.selectCounselInfoByCrId(crId);
	}

	@Override
	@Transactional
	public String createCounselingChatRoom(CounselingVO counselingVO) {
		String returningURL = "";

		int counselorId = counselingVO.getCounsel();
		int memId = counselingVO.getMemId();

		// 상담 채팅방 개설
		ChatRoomVO chatRoomVO = new ChatRoomVO();
		chatRoomVO.setCcId("G04002");
		chatRoomVO.setTargetId(counselingVO.getCounselId());
		chatRoomVO.setCrMaxCnt(2);
		chatRoomVO.setCrTitle(counselingVO.getCounselTitle());
		int result1 = this.chatMapper.insertChatRoom(chatRoomVO);

		// 상담사 및 회원 입장처리
		ChatMemberVO chatMemCounselor = new ChatMemberVO();
		chatMemCounselor.setCrId(chatRoomVO.getCrId());
		chatMemCounselor.setMemId(counselorId);
		ChatMemberVO chatMemMember = new ChatMemberVO();
		chatMemMember.setCrId(chatRoomVO.getCrId());
		chatMemMember.setMemId(memId);
		int result2 = this.chatMapper.insertAndUpdateChatMember(chatMemCounselor);
		int result3 = this.chatMapper.insertAndUpdateChatMember(chatMemMember);

		if (result1 > 0 && result2 > 0 && result3 > 0) {
			returningURL = "/counselChat/" + chatRoomVO.getCrId();
		}

		return returningURL;
	}

	@Override
	public void saveChatMessageWithoutReceiver(ChatMessageVO chatMessageVO) {
		if (chatMessageVO.getMessageType() == null) {
			chatMessageVO.setMessageType("TEXT");
		}
		this.chatMapper.insertChatMessage(chatMessageVO);
	}

	@Override
	public void fileUpload(ChatMessageVO chatMessageVO) {
		try {
			Long fileGroupId =  this.fileService.createFileGroup();
			this.fileService.uploadFiles(fileGroupId, chatMessageVO.getFiles());
			chatMessageVO.setFileGroupId(fileGroupId);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}

}
