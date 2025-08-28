package kr.or.ddit.account.join.service.impl;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.main.service.MemberVO;

@Mapper
public interface MemberJoinMapper {

	MemberVO selectUserEmail(String email);

	String isNicknameExists(String nickname);

	int memberJoin(MemberVO memberVO);

}
