package kr.or.ddit.mpg.mif.pswdchg.service;

import java.util.Map;

import kr.or.ddit.main.service.MemberVO;

public interface PasswordChangeService {

	MemberVO selectPasswordChangeView(String memId);

	void updatePasswordChange(String memId, Map<String, Object> map);

}
