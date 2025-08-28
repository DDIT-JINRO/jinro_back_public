package kr.or.ddit.cnslt.aicns.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.or.ddit.cnslt.aicns.service.AICounselingService;
import kr.or.ddit.cnslt.resve.crsv.service.CounselingReserveService;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.mpg.pay.service.PaymentVO;

@Controller
@RequestMapping("/cnslt/aicns")
public class AICounselingController {

	@Autowired
	private AICounselingService aiCounselingService;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private CounselingReserveService counselingReserveService;

	@GetMapping("/aicns.do")
	public String aicns(Model model, @AuthenticationPrincipal String loginId) {

		if (loginId != null && !"anonymousUser".equals(loginId)) {
			int memId = Integer.parseInt(loginId);
			MemberSubscriptionVO currentSub = paymentService.selectByMemberId(memId);
			PaymentVO usageCounts = counselingReserveService.selectLastSubcription(currentSub);
			model.addAttribute("usageCounts", usageCounts);
		}

		return "cnslt/aicns/aicns";
	}

	@PostMapping("/aicnsPopUpStart")
	@ResponseBody
	public Map<String, Object> aicnsPopUpStart(HttpSession session, @RequestBody Map<String, Object> param) {
		return aiCounselingService.aicnsPopUpStart(session, param);
	}

	@GetMapping("/aicnsPopUp")
	public String aicnsPopUp(Model model, @RequestParam(required = false) String sid,
			@AuthenticationPrincipal String memId, HttpSession session, HttpServletRequest req) {

		String errorMessage = aiCounselingService.validateForStartAICns(sid, memId, session, req);
		// 정상적인 요청 확인 및 상담횟수 차감 성공시 errorMessage null값 반환됨
		if (errorMessage != null) {
			model.addAttribute("errorMessage", errorMessage);
		}
		return "cnslt/aicns/aicnsPopUp";
	}

}
