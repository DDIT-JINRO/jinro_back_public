package kr.or.ddit.account.lgn.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.account.join.service.impl.EmailService;

@Service
public class ReissueMailService {

	@Autowired
	EmailService emailService;
	
	public void sendTempPasswordMail(String email) {
		
		emailService.sendReissuePw(email);
		
		
	}
	
	
	
	
	
}
