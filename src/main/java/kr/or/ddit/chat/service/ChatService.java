package kr.or.ddit.chat.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.main.service.MemberVO;

import java.util.Map;

public interface ChatService {

	/**
	 * 회원아이디로 현재 참여중인 채팅방 정보 불러오기
	 *
	 * @param memId
	 */
	List<ChatRoomVO> findRoomsByMemId(String memId);

	/**
	 * 채팅방 참여 (참여 중이 아니면 삽입, 퇴장한 상태면 재참여로 업데이트)
	 *
	 * @param crId
	 * @param memId
	 */
	void participateChatRoom(ChatMemberVO chatMemberVO);

	/**
	 * 채팅방 퇴장 처리 (IS_EXITED = 'Y', EXITED_AT = 현재시각)
	 *
	 * @param crId
	 * @param memId
	 */
	void exitChatRoom(ChatMemberVO chatMemberVO);

	/**
	 * 특정 유저번호 와 채팅방 번호로 입장시간 이후의 메시지 불러오기.
	 *
	 * @param vo
	 * @return
	 */
	List<ChatMessageVO> selectChatMsgByChatRoomIdAndMemId(ChatMemberVO vo);

	/**
	 * 채팅메시지 DB 삽입
	 *
	 * @param chatMessageVO
	 */
	void saveChatMessage(ChatMessageVO chatMessageVO);

	/**
	 * 수신자 테이블에서 멤버별로 전체 안읽은 갯수 받아오기
	 *
	 * @return
	 */
	List<ChatReceiverVO> selectUnreadCountGroupByMemId();

	/**
	 * 수신자테이블에서 특정회원의 채팅방별 안읽은 갯수 받아오기
	 *
	 * @return
	 */
	List<ChatReceiverVO> selectUnreadCountOfRoomsByMemId(int memId);

	/**
	 * 수신자테이블에서 특정회원의 전체 안읽은 갯수 받아오기
	 *
	 * @param memId
	 * @return
	 */
	ChatReceiverVO selectUnreadCountByMemId(int memId);

	/**
	 * 채팅방 입장 시 해당 채팅방 안읽었던 메시지 전체 읽음 처리
	 *
	 * @param chatMemberVO
	 * @return
	 */
	int receiverReadAtUpdate(ChatMemberVO chatMemberVO);

	/**
	 * 채팅방 개설
	 *
	 * @param chatRoomVO
	 * @return
	 */
	int insertChatRoom(ChatRoomVO chatRoomVO);

	/**
	 * 채팅 입장버튼 등의 제한을 위해 현재 입장해있는지 확인
	 *
	 * @param crId
	 * @param memIdStr
	 * @return
	 */
	boolean isEntered(int crId, String memIdStr);

	/**
	 * 채팅방 삭제 처리
	 * @param chatRoomVO
	 * @return
	 */
	int deleteChatRoom(ChatRoomVO chatRoomVO);


	/**
	 * 채팅방 정보만 조회
	 * @param crId
	 * @return
	 */
	ChatRoomVO selectChatRoom(int crId);

	/**
	 * 채팅방 정보 수정
	 * 입장인원 제한 등의 로직은 화면단에서 수행
	 * @param chatRoomVO
	 * @return
	 */
	int updateChatRoom(ChatRoomVO chatRoomVO);

	/**
	 * 채팅메시지 기본키로 단건 조회
	 * @return
	 */
	ChatMessageVO selectChatMessage(int msgId);

	/**
	 * 채팅상담 채팅방에 회원입장되어있는지 체크.
	 * @param crId
	 * @param memIdStr
	 * @return
	 */
	boolean validateCounselChatRoom(int crId, String memIdStr);

	/**
	 * 채팅상담 채팅방에 회원, 상담사 정보 챙겨오기
	 * @param crId
	 * @return
	 */
	Map<String, MemberVO> getMemberAndCounselorInfo(int crId);

	/**
	 * 채팅상담용 상담정보 불러오기
	 * @param crId
	 * @return
	 */
	CounselingVO selectCounselInfoByCrId(int crId);

	/**
	 * 상담 정보로 상담채팅방 개설
	 * @param counselingVO
	 * @return String url.해당 채팅방 입장 URL 반환
	 */
	String createCounselingChatRoom(CounselingVO counselingVO);

	/**
	 * 채팅메시지 테이블에 삽입.
	 * chat_receiver테이블에 삽입되면 안읽은 메시지 추적해서 모달에 띄우도록됨
	 * 해당 현상 해결하기 위해 상담용으로 분리
	 * @param chatMessageVO
	 */
	void saveChatMessageWithoutReceiver(ChatMessageVO chatMessageVO);


	/**
	 * 파일첨부된 채팅메시지 처리.
	 * 파일첨부완료하고나서 파라미터로 받은 ChatMessageVO에 파일그룹번호세팅
	 * @param chatMessageVO
	 * @return
	 */
	void fileUpload(ChatMessageVO chatMessageVO);

}
