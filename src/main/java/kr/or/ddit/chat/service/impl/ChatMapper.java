package kr.or.ddit.chat.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.chat.service.ChatMemberVO;
import kr.or.ddit.chat.service.ChatMessageVO;
import kr.or.ddit.chat.service.ChatReceiverVO;
import kr.or.ddit.chat.service.ChatRoomVO;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.main.service.MemberVO;


@Mapper
public interface ChatMapper {

	/**
	 * 회원아이디로 현재 참여중인 채팅방 정보 불러오기
	 * @param memId
	 */
	List<ChatRoomVO> findRoomsByMemId(String memId);

	/**
	 * 존재 여부 확인 (참여자 테이블에서)
	 * @param crId
	 * @param memId
	 * @return
	 */
	ChatMemberVO selectChatMember(ChatMemberVO chatMemberVO);

	/**
	 * 최초 참여 및 재입장 -> (IS_EXITED = 'N', JOINED_AT 갱신)
	 * @param member
	 * @return
	 */
	int insertAndUpdateChatMember(ChatMemberVO chatMemberVO);

	/**
	 * 완전 퇴장 (IS_EXITED = 'Y', EXITED_AT 갱신)
	 * @param chatMemberVO
	 * @return
	 */
	int chatMemberExitChatRoomUpdate(ChatMemberVO chatMemberVO);

	List<ChatMessageVO> selectChatMsgByChatRoomIdAndMemId(ChatMemberVO chatMemberVO);

	/**
	 * 채팅메시지를 테이블에 삽입
	 * @param chatMessageVO
	 * @return
	 */
	int insertChatMessage(ChatMessageVO chatMessageVO);


	/**
	 * 채팅메시지에 대해서 수신자 테이블에 삽입
	 * @param chatReceiverVO
	 * @return
	 */
	int insertChatReceiver(ChatReceiverVO chatReceiverVO);


	/**
	 * 채팅방 번호로 해당 채팅방 멤버id 리스트로 뽑아오기 (수신자 테이블 삽입을 위함)
	 * @param crId
	 * @return
	 */
	List<Integer> findChatMemberIdsByCrId(int crId);

	/**
	 * 수신자 테이블에서 멤버별로 전체 안읽은 갯수 받아오기
	 * @return
	 */
	List<ChatReceiverVO> selectUnreadCountGroupByMemId();

	/**
	 * 수신자테이블에서 특정회원의 채팅방별 안읽은 갯수 받아오기
	 * @return
	 */
	List<ChatReceiverVO> selectUnreadCountOfRoomsByMemId(int memId);

	/**
	 * 수신자테이블에서 특정회원의 전체 안읽은 갯수 받아오기
	 * @param memId
	 * @return
	 */
	ChatReceiverVO selectUnreadCountByMemId(int memId);

	/**
	 * 채팅방 입장 시 해당 채팅방 안읽었던 메시지 전체 읽음 처리
	 * @param chatMemberVO
	 * @return
	 */
	int receiverReadAtUpdate(ChatMemberVO chatMemberVO);


	/**
	 * 채팅방 개설
	 * @param chatRoomVO
	 * @return
	 */
	int insertChatRoom(ChatRoomVO chatRoomVO);

	/**
	 * 채팅방 삭제 crId
	 * + 전체 멤버 퇴장처리
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
	 * chatTitle<br/>
	 * crMaxCnt<br/>
	 * crId<br/>
	 * ccId<br/>
	 * @param chatRoomVO
	 * @return
	 */
	int updateChatRoom(ChatRoomVO chatRoomVO);

	/**
	 * 채팅메시지 기본키로 메시지 단건 조회
	 * @param msgId
	 * @return
	 */
	ChatMessageVO selectChatMessage(int msgId);

	/**
	 * 채팅방 상세정보 불러오기.
	 * 클릭 했을 때 채팅방 정보 출력용
	 * @param crId
	 * @return
	 */
	ChatRoomVO selectCrDetail(int crId);

	/**
	 * 채팅상담용 회원 기본정보 불러오기
	 * MEM_ID, MEM_EMAIL, MEM_PHONE_NUMBER, MEM_NAME, MEM_ROLE, FILE_PROFILE
	 * @param memId
	 * @return
	 */
	MemberVO selectMemInfoForCounsel(int memId);

	/**
	 * 채팅상담용 상담정보 불러오기
	 * @param crId
	 * @return
	 */
	CounselingVO selectCounselInfoByCrId(int crId);

}
