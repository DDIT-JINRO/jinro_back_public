package kr.or.ddit.mpg.pay.web;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentRequestDto;
import kr.or.ddit.mpg.pay.service.PaymentResponseDto;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import kr.or.ddit.mpg.pay.service.SubscriptionService;
import kr.or.ddit.mpg.pay.service.SubscriptionVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class PaymentController {

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private SubscriptionService subscriptionService;

	@GetMapping("/pay/selectPaymentView.do")
	public String selectPaymentView(Model model, Principal principal) {

		// 1. 로그인 확인
		if (principal == null || principal.getName().equals("anonymousUser")) {
			return "redirect:/login"; // 로그인 페이지로 리다이렉트
		}

		String loginId = principal.getName();

		int memId = Integer.parseInt(loginId);

		// 1. 현재 사용자의 구독 정보조회
		MemberSubscriptionVO currentSub = paymentService.selectByMemberId(memId);
		model.addAttribute("currentSub", currentSub);

		MemberSubscriptionVO reservedSub = paymentService.findReservedSubscription(memId);
		model.addAttribute("reservedSub", reservedSub);

		// 2. JS에서 사용할 로그인 사용자 정보 조회
		MemberVO loginUser = paymentService.selectMemberById(memId);
		model.addAttribute("loginUser", loginUser);

		// 3. 이 사용자의 전체 결제 내역 조회 (구독 결제 내역 표시)
		List<PaymentVO> paymentHistory = paymentService.selectPaymentHistory(memId);
		model.addAttribute("paymentHistory", paymentHistory);

		// 화면에 보여줄 전체 구독 상품 목록 조회
		List<SubscriptionVO> subProducts = subscriptionService.selectAllProducts();
		model.addAttribute("subProducts", subProducts);

		return "mpg/pay/selectPaymentView";
	}

	// 결제 검증
	@PostMapping("/verify")
	@ResponseBody
	public ResponseEntity<PaymentResponseDto> verifyPayment(@RequestBody PaymentRequestDto requestDto,
			@AuthenticationPrincipal String loginId) {

		PaymentResponseDto response = paymentService.verifyAndProcessPayment(requestDto, loginId);

		if ("success".equals(response.getStatus())) {
			return ResponseEntity.ok(response);
		} else {
			// 실패 시, HTTP 400 Bad Request 와 함께 실패 메시지 반환
			return ResponseEntity.badRequest().body(response);
		}
	}

	// 구독 취소
	@PostMapping("/cancel-subscription")
	@ResponseBody
	public ResponseEntity<String> cancelSubscription(@AuthenticationPrincipal String loginId) {

		// 받은 loginId를 실제 숫자(int)로 변환
		int memId = Integer.parseInt(loginId);

		boolean isCancelled = paymentService.cancelSubscription(memId);
		if (isCancelled) {
			return ResponseEntity.ok("구독이 정상적으로 취소되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("취소할 구독 정보가 없거나, 이미 취소된 상태입니다.");
		}
	}

	// 구독 변경
	@PostMapping("/change-subscription")
	@ResponseBody
	public ResponseEntity<String> changeSubscription(@RequestParam("subId") int subId,
			@AuthenticationPrincipal String loginId) {
		boolean result = paymentService.changeSubscription(Integer.parseInt(loginId), subId);
		if (result) {
			return ResponseEntity.ok("다음 결제부터 구독 상품이 변경되도록 예약되었습니다.");
		} else {
			return ResponseEntity.badRequest().body("구독 변경에 실패했습니다.");
		}
	}

	// 예약 취소
	@PostMapping("/cancel-change")
	@ResponseBody
	public ResponseEntity<String> cancelChangeSubscription(@AuthenticationPrincipal String loginId) {

		boolean result = paymentService.cancelSubscriptionChange(Integer.parseInt(loginId));
		if (result) {
			return ResponseEntity.ok("구독 변경 예약이 취소되었습니다.");
		} else {
			return ResponseEntity.badRequest().body("취소할 예약 정보가 없습니다.");
		}
	}

}
