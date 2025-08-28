package kr.or.ddit.account.lgn.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.main.service.MemberVO;

public interface LoginService {

	public Map<String, Object> loginProcess(MemberVO memVO);

	public MemberVO getRefreshToken(String refreshToken);

	public MemberVO selectById(int userId);

	public Map<String, Object> kakaoLgnProcess(MemberVO member);

	public Map<String, Object> naverLgnProcess(MemberVO member);

	public List<MemberVO> findEmailStringByNameAndPhone(MemberVO member);

	public MemberVO validateUser(MemberVO inputMem);

	public int insertEncodePass(MemberVO memVO);

	public Map<String, Object> cancelWithdrawal(int memId);

}
