package kr.or.ddit.account.lgn.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.account.lgn.service.LoginLogService;
import kr.or.ddit.account.lgn.service.LoginService;
import kr.or.ddit.config.jwt.JwtUtil;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class LoginRestController {

	@Autowired
	LoginService loginService;
	@Autowired
	LoginLogService loginLogService;

	@Autowired
	JwtUtil jwtUtil;

	@PostMapping("/memberLogin")
	public Map<String, Object> testLogin(@RequestBody MemberVO memVO, HttpServletResponse resp) {

		Map<String, Object> resultMap = loginService.loginProcess(memVO);

		if ("success".equals(resultMap.get("status"))) {
			Cookie accessTokenCookie = new Cookie("accessToken", (String) resultMap.get("accessToken"));
			Cookie refreshTokenCookie = new Cookie("refreshToken", (String) resultMap.get("refreshToken"));

			accessTokenCookie.setHttpOnly(true);
//			accessTokenCookie.setSecure(true);
			accessTokenCookie.setPath("/");
			accessTokenCookie.setMaxAge(60 * 60);

			refreshTokenCookie.setHttpOnly(true);
//			refreshTokenCookie.setSecure(true);
			refreshTokenCookie.setPath("/");
			refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);

			resp.addCookie(accessTokenCookie);
			resp.addCookie(refreshTokenCookie);

			String saveId = memVO.getSaveId();
			Cookie saveIdCookie = new Cookie("saveId", memVO.getMemEmail());
			if("Y".equals(saveId)) {
				saveIdCookie.setMaxAge(60 * 60 * 400);
			}else{
				saveIdCookie.setMaxAge(0);
			}

			resp.addCookie(saveIdCookie);

			String memId = (String) resultMap.get("memId");
			resultMap.remove("accessToken");
			resultMap.remove("refreshToken");

			loginLogService.insertLoginLog(memId);

			return resultMap;

		} else {
			return resultMap;
		}

	}

	@PostMapping("/refreshToken")
	public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No cookies found");
		}
		String refreshToken = null;
		for (Cookie cookie : cookies) {
			if ("refreshToken".equals(cookie.getName())) {
				refreshToken = cookie.getValue();
				break;
			}
		}
		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token not found");
		}

		MemberVO memVO = loginService.getRefreshToken(refreshToken);

		if (memVO == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token not found");
		} else {
			String memId = memVO.getMemId() + "";
			String token = jwtUtil.createAccessToken(memId);
			Cookie accessTokenCookie = new Cookie("accessToken", token);
			accessTokenCookie.setHttpOnly(true);
//			accessTokenCookie.setSecure(true);
			accessTokenCookie.setPath("/");
			accessTokenCookie.setMaxAge(60 * 31);
		}

		return ResponseEntity.ok().body("Access token refreshed");
	}

}
