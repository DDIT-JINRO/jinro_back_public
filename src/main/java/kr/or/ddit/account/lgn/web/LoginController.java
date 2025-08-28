package kr.or.ddit.account.lgn.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.account.lgn.service.LoginLogService;
import kr.or.ddit.account.lgn.service.LoginService;
import kr.or.ddit.account.lgn.service.impl.ReissueMailService;
import kr.or.ddit.config.jwt.JwtUtil;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class LoginController {

    private final BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	LoginService loginService;
	@Autowired
	LoginLogService loginLogService;
	
	@Autowired
	JwtUtil jwtUtil;
	
	@Autowired
	ReissueMailService reissueMailService;

    LoginController(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
	
	// 로그인 페이지 이동
	@GetMapping("/login")
	public String login() {
		
		log.info("login arrive");
		
		return "account/login";
	}
	
	@GetMapping("/test")
	public String testPg() {
		return "account/test";
	}
	
	@GetMapping("/error/logReq")
	public String errorLogReq() {
		
		return ("account/loginReq");
	}
	
	@GetMapping("lgn/findId.do")
	public String viewFindIdPage() {
		
		return "account/findId";
	}
	
	@PostMapping("/lgn/findId.do")
	@ResponseBody
	public Map<String, Object> findId(@RequestBody Map<String, String> body) {
		String name = body.get("name");
	    String rawPhone = body.get("phone");
	    String phone = "";
	    MemberVO member = new MemberVO();
	    
	    if (rawPhone.length() == 11) {
	         phone = rawPhone.replaceFirst("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
	    } else if (rawPhone.length() == 10) {
	        phone = rawPhone.replaceFirst("(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3");
	    } else {
	        phone = rawPhone;
	    }
	    
	    log.info("phone : "+phone);
	    member.setMemName(name);
	    member.setMemPhoneNumber(phone);
	    
	    List<MemberVO> memList = loginService.findEmailStringByNameAndPhone(member);
	    
	    log.info(""+memList);
	    
	    Map<String, Object> result = new HashMap<>();
	    result.put("count", memList.size());
	    result.put("memList", memList);    
	    return result;
	}
	
	@GetMapping("/lgn/findPw.do")
	public String viewFindPwPage() {
		return "account/findPw";
	}
	
	@PostMapping("/lgn/findPw.do")
	@ResponseBody
	public String findPw(@RequestBody Map<String, String> data) {
	    String email = data.get("email");
	    String name = data.get("name");
	    
	    MemberVO inputMem = new MemberVO();
	    
	    inputMem.setMemEmail(email);
	    inputMem.setMemName(name);
	    
	    MemberVO resultMem = loginService.validateUser(inputMem);
	    if (resultMem !=null) {
	    	reissueMailService.sendTempPasswordMail(email);
	        return "success";
	    } else {
	        return "fail";
	    }
	}
	
	@GetMapping("/lgn/reissuePwPage.do")
	public String reissuePwPage(@RequestParam String email, Model model) {
		
		String uuid = UUID.randomUUID().toString().substring(0, 8);
		String savedPw = passwordEncoder.encode(uuid);
		
		MemberVO memVO = new MemberVO();
		
		memVO.setMemEmail(email);
		memVO.setMemPassword(savedPw);
		
		int result = loginService.insertEncodePass(memVO);
		
		model.addAttribute("tempPw", uuid);
	    model.addAttribute("email", email);
		
		return "account/reissuePw";
	}
	
	@GetMapping("/logoutProcess")
	public String logoutProcess(@AuthenticationPrincipal String memId) {
		
		loginLogService.insertLogoutLog(memId);
		
		return "redirect:/logout";
	}
	
	@PostMapping("/lgn/cancelWithdrawal.do")
	@ResponseBody
	public Map<String, Object> cancelWithdrawal(@RequestBody Map<String, Object> requestData){
	    int memId = (int) requestData.get("memId");
	    
	    return loginService.cancelWithdrawal(memId);
	}
}
