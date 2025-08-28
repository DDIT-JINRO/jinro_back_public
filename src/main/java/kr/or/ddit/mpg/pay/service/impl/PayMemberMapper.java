package kr.or.ddit.mpg.pay.service.impl;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.main.service.MemberVO;

@Mapper
public interface PayMemberMapper {

	// 회원id을 기반으로 회원정보 조회
	public MemberVO selectMemberById(int memId);
}
