package kr.or.ddit.account.join.service;

import java.util.Map;

import kr.or.ddit.main.service.MemberVO;

public interface MemberJoinService {

	MemberVO selectUserEmail(String email);

	boolean isNicknameExists(String nickname);

	Map<String, Object> identityCheck(String imp_uid);

	int memberJoin(MemberVO memberVO);
	
	String formatPhoneNumber(String phoneNum);

	Map<String, Object> getImpChannelKeyAndIdentificationCode();
}
