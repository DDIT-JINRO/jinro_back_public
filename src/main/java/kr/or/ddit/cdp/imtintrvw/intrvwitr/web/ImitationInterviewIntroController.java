package kr.or.ddit.cdp.imtintrvw.intrvwitr.web;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cdp/imtintrvw/intrvwitr")
@Controller
@Slf4j
public class ImitationInterviewIntroController {

	@GetMapping("/interviewIntro.do")
	public String interviewIntroPage(@AuthenticationPrincipal String memId) {
		if (memId == null || memId.equals("anonymousUser")) {
			return "redirect:/login"; // 로그인 페이지로 리다이렉트
		}
		return "cdp/imtintrvw/intrvwitr/interviewIntro";
	}
}
