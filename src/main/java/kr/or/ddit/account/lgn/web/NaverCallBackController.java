package kr.or.ddit.account.lgn.web;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.or.ddit.account.lgn.service.LoginLogService;
import kr.or.ddit.account.lgn.service.LoginService;
import kr.or.ddit.account.lgn.service.impl.NaverCallBackService;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/lgn")
@Slf4j
public class NaverCallBackController {
	
	@Autowired
	LoginService loginService;
	@Autowired
	LoginLogService loginLogService;
	
	@Autowired
	NaverCallBackService naverCallBackService;
	
	
	@PostMapping("/naverClientKey.do")
	@ResponseBody
	public String naverClientKey() {
		
		String clientKey = naverCallBackService.getClientKey();
		
		return clientKey;
	}
	
	@GetMapping("/naverCallback.do")
	public String naverLgnPage(@RequestParam("code") String code, HttpSession session, HttpServletResponse resp) {
		
		
		Map<String, Object> userInfo = naverCallBackService.loginWithNaver(code);
		
		Map<String, Object> responseMap = (Map<String, Object>) userInfo.get("response");

		String email = (String) responseMap.get("email");
		String name = (String) responseMap.get("name");
//		String profileImage = (String) responseMap.get("profile_image");
		String phone = (String) responseMap.get("mobile");
		String gender = (String) responseMap.get("gender");
		String birthyear = (String) responseMap.get("birthyear");
		String birthday = (String) responseMap.get("birthday"); // MM-DD
		
		String genderText = "";
		if ("M".equals(gender)) {
		    genderText = "G11001";
		} else if ("F".equals(gender)) {
		    genderText = "G11002";
		}
		
		MemberVO member = new MemberVO();
		
		String fullBirth = birthyear + "-" + birthday;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date birthDateAsDate = sdf.parse(fullBirth);
			member.setMemBirth(birthDateAsDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		member.setMemName(name);
		member.setMemEmail(email);
		member.setMemPhoneNumber(phone);
		member.setMemGen(genderText);
		
		Map<String, Object> result = loginService.naverLgnProcess(member);
		
		Cookie accessTokenCookie = new Cookie("accessToken", (String) result.get("accessToken"));
		Cookie refreshTokenCookie = new Cookie("refreshToken", (String) result.get("refreshToken"));

		accessTokenCookie.setHttpOnly(true);
//		accessTokenCookie.setSecure(true);
		accessTokenCookie.setPath("/");
		accessTokenCookie.setMaxAge(60 * 60);

		refreshTokenCookie.setHttpOnly(true);
//		refreshTokenCookie.setSecure(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);
		
		String memId = (String) result.get("memId");
		resp.addCookie(accessTokenCookie);
		resp.addCookie(refreshTokenCookie);
		
		result.remove("accessToken");
		result.remove("refreshToken");
		
		loginLogService.insertLoginLog(memId);
		
		return "redirect:/";
	}
}
