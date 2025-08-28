package kr.or.ddit.mpg.mif.pswdchg.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.inq.service.MyInquiryService;
import kr.or.ddit.mpg.mif.pswdchg.service.PasswordChangeService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PasswordChangeServiceImpl implements PasswordChangeService{

	@Autowired
	MyInquiryService myInquiryService;
	
	@Autowired
	PasswordChangeMapper passwordChangeMapper;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	/**
	 * 비밀번호 변경 페이지 진입 전 멤버의 정보를 확인합니다.
	 * 
	 * @param memIdStr
	 * @return
	 */
	@Override
	public MemberVO selectPasswordChangeView(String memIdStr) {
		int memId = myInquiryService.parseMemId(memIdStr);
		MemberVO member = this.passwordChangeMapper.selectPasswordChangeView(memId);
		if (member == null) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}
		return member;
	}
	
	/**
	 * 특정 멤버의 비밀번호를 변경합니다.
	 * 
	 * @param memId 멤버id
	 * @param map 기존비밀번호, 변경비밀번호
	 */
	@Override
	public void updatePasswordChange(String memIdStr, Map<String, Object> map) {
		String oldPassword = (String) map.get("password");
		String newPassword = (String) map.get("newPassword");
		
		// 1. 현재 비밀번호가 맞는지 우선 확인 (틀리면 여기서 예외 발생)
		myInquiryService.checkPassword(memIdStr, oldPassword);
		
		// 2. 기존 비밀번호와 새 비밀번호가 문자열로서 동일한지 확인
		if (oldPassword.equals(newPassword)) {
			throw new CustomException(ErrorCode.PASSWORD_SAME_AS_OLD);
		}
		
		int memId = this.myInquiryService.parseMemId(memIdStr);
		
		newPassword = bCryptPasswordEncoder.encode(newPassword);
		
		map.put("memId", memId);
		map.put("newPassword", newPassword);
		
		int result = this.passwordChangeMapper.updatePasswordChange(map);
		if (result == 0) {
			throw new CustomException(ErrorCode.PASSWORD_UPDATE_FAILED);
		}
	}

}
