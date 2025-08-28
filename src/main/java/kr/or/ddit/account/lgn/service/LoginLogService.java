package kr.or.ddit.account.lgn.service;

public interface LoginLogService {

	
	public void insertLoginLog(String memId);

	public void insertLogoutLog(String memId);
	
}
