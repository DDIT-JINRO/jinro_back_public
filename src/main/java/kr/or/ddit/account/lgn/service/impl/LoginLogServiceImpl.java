package kr.or.ddit.account.lgn.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.account.lgn.service.LoginLogService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LoginLogServiceImpl implements LoginLogService {

	@Autowired
	LoginMapper loginMapper;

	@Override
	public void insertLoginLog(String memId) {
		int intMemId = Integer.parseInt(memId);

		loginMapper.insertLoginLog(intMemId);

	}

	@Override
	public void insertLogoutLog(String memId) {
		int intMemId = Integer.parseInt(memId);

		loginMapper.insertLogoutLog(intMemId);

	}

}
