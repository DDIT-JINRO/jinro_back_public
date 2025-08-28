package kr.or.ddit.mpg.mif.pswdchg.service.impl;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.main.service.MemberVO;

@Mapper
public interface PasswordChangeMapper {

	MemberVO selectPasswordChangeView(int memId);

	int updatePasswordChange(Map<String, Object> map);

}
