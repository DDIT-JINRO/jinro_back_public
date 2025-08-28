package kr.or.ddit.cdp.aifdbck.rsm.web;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.cdp.aifdbck.rsm.service.AiFeedbackResumeService;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeService;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cdp/aifdbck/rsm")
@Controller
@Slf4j
public class AiFeedbackResumeController {

	@Autowired
	private ResumeService resumeService;

	@Autowired
	private AiFeedbackResumeService aiFeedbackResumeService;

	@Autowired
	private PaymentService paymentService;

	@GetMapping("/aiFeedbackResumeList.do")
	public String aiImitationInterviewPage(Principal principal, Model model) {

		// 로그인하지 않은 경우 처리
		if (principal == null || principal.getName().equals("anonymousUser")) {
			return "redirect:/login"; // 로그인 페이지로 리다이렉트
		}

		String memId = principal.getName();

		ResumeVO resumeVO = new ResumeVO();
		resumeVO.setMemId(Integer.parseInt(memId));

		resumeVO.setCurrentPage(1); // 시작 번호
		resumeVO.setSize(9999); // 충분히 큰 값으로 설정하여 모든 데이터를 가져옴

		List<ResumeVO> resumeList = resumeService.selectResumeBymemId(resumeVO);
		
		// 1. 회원 현재 구독정보 가져오기
		MemberSubscriptionVO currentSub = paymentService.selectByMemberId(Integer.parseInt(memId));

		// 2. 현재 구독정보가 잇으면 최신 결제 정보(남은 횟수 포함) 가져오기
		PaymentVO aiCounts = aiFeedbackResumeService.selectLastPaymentInfo(currentSub);
		
		// JSP로 넘겨줄 모델에 담기. JSTL <c:forEach>의 items 속성과 일치하도록 "resumeList"로 명명.
		model.addAttribute("resumeList", resumeList);
		model.addAttribute("aiCounts", aiCounts);
		

		return "cdp/aifdbck/rsm/aiFeedbackResume";
	}

	// 이력서 상세
	@GetMapping("/getResumeDetail.do")
	@ResponseBody
	public ResumeVO getResumeDetail(@RequestParam(value = "resumeId", required = false) String resumeId,
			Principal principal) {
		// 1. 로그인 확인
		if (principal == null || principal.getName().equals("anonymousUser")) {
			// 인증 실패 시 적절한 응답 코드 반환
			log.error("유효하지 않은 memId로 요청이 들어왔습니다.");
			return new ResumeVO(); // 또는 DTO에 에러 메시지를 담아 반환
		}
		int resumeIdInt = Integer.parseInt(resumeId);

		String memid = principal.getName();
		// 2. 서비스 로직을 통해 데이터 조회
		ResumeVO resumeVO = new ResumeVO();
		resumeVO.setResumeId(resumeIdInt);
		resumeVO.setMemId(Integer.parseInt(memid));

		ResumeVO detailVO = resumeService.selectResumeByResumeId(resumeVO, memid);

		return detailVO;
	}

	// 사용자의 구독 상태와 이력서 첨삭 횟수를 확인
	@GetMapping("/checkSubscription.do")
	@ResponseBody
	public ResponseEntity<PaymentVO> checkUserSubscription(Principal principal) {
		if (principal == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		int memId = Integer.parseInt(principal.getName());

		// 1. 회원 현재 구독정보 가져오기
		MemberSubscriptionVO currentSub = paymentService.selectByMemberId(memId);
		if (currentSub == null) {
			PaymentVO paymentVO = new PaymentVO();
			return ResponseEntity.ok(paymentVO);
		}

		// 2. 현재 구독정보가 잇으면 최신 결제 정보(남은 횟수 포함) 가져오기
		PaymentVO paymentVO = aiFeedbackResumeService.selectLastPaymentInfo(currentSub);
		return ResponseEntity.ok(paymentVO);

	}

	// 횟수 차감 및 AI 피드백을 요청
	@PostMapping("/requestFeedback.do")
	@ResponseBody
	public ResponseEntity<String> requestFeedback(@RequestBody Map<String, Object> body) {

		String html = (String) body.get("html");
		Integer payId = (Integer) body.get("payId");

		if (html == null || html.isBlank() || payId == null) {
			return ResponseEntity.badRequest().body("필수 파리미터가 누락되었습니다");
		}

		String feedback = aiFeedbackResumeService.deductAndGetFeedback(payId, html);

		return ResponseEntity.ok(feedback);
	}
}
