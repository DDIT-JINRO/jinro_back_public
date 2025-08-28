package kr.or.ddit.account.lgn.web;

import java.net.http.HttpResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import kr.or.ddit.account.lgn.service.impl.KakaoCallBackService;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/lgn")
@Slf4j
public class KakaoCallBackController {

	@Autowired
	KakaoCallBackService kakaoCallBackService;
	@Autowired
	LoginService loginService;
	@Autowired
	LoginLogService loginLogService;
	
	
	@PostMapping("kakaoRestApiKey.do")
	@ResponseBody
	public String kakaoRestApiKey() {
		
		String restApiKey = kakaoCallBackService.getRestApiKey();
		
		return restApiKey;
		
	}
	
	
	@GetMapping("/kakaoCallback.do")
	public String KakaoLogin(@RequestParam("code") String code, HttpSession session, HttpServletResponse resp) {
		
		Map<String, Object> userInfo = kakaoCallBackService.loginWithKakao(code);
		Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
		log.info("userInfo : " + userInfo);

		String name = (String) kakaoAccount.get("name");
		String gender = (String) kakaoAccount.get("gender");
		String phone = (String) kakaoAccount.get("phone_number");
		String birthyear = (String) kakaoAccount.get("birthyear");
		String birthday = (String) kakaoAccount.get("birthday");
		String email = (String) kakaoAccount.get("email");
//		String image = (String) kakaoAccount.get("thumbnail_image_url");
		
		MemberVO member = new MemberVO();

		if (gender != null && gender != "") {
			if (gender.equals("male")) {
				member.setMemGen("G11001");
			} else {
				member.setMemGen("G11002");
			}
		}

		String formatPhone = "";
		if (phone.startsWith("+82")) {
			formatPhone = phone.replace("+82", "0").replaceAll("[^0-9]", "");
			if (formatPhone.length() == 11) {
		        formatPhone = formatPhone.replaceFirst("(\\d{3})(\\d{4})(\\d{4})", "$1-$2-$3");
		    } else if (formatPhone.length() == 10) {
		        formatPhone = formatPhone.replaceFirst("(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3");
		    }
			member.setMemPhoneNumber(formatPhone);
		}

		String birthFormatted = "";

		if (birthday != null && birthday.length() == 4) {
			String month = birthday.substring(0, 2);
			String day = birthday.substring(2, 4);
			birthFormatted = birthyear + "/" + month + "/" + day;
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			Date birthDate;
			try {
				birthDate = sdf.parse(birthFormatted);
				member.setMemBirth(birthDate);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		member.setMemName(name);
		member.setMemEmail(email);
		
		Map<String, Object> result = loginService.kakaoLgnProcess(member);
		
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
