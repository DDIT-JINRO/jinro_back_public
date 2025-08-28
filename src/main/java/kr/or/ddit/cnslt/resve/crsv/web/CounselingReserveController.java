package kr.or.ddit.cnslt.resve.crsv.web;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingReserveService;
import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/cnslt/resve")
public class CounselingReserveController {

	private final CounselingReserveService counselingReserveService;
	private final PaymentService paymentService;

	@GetMapping("/crsv/reservation.do")
	public String counselingReservation(Model model) {

		List<MemberVO> counselorList = counselingReserveService.selectCounselorList();
		List<ComCodeVO> counselMethodList = counselingReserveService.selectCounselMethodList();
		List<ComCodeVO> counselCategoryList = counselingReserveService.selectCounselCategoryList();

		model.addAttribute("counselorList", counselorList);
		model.addAttribute("counselMethodList", counselMethodList);
		model.addAttribute("counselCategoryList", counselCategoryList);

		return "cnslt/resve/crsv/counselingreserve";
	}

	/**
	 * 특정 상담사의 특정 날짜 예약 가능 시간 목록을 반환하는 API
	 */
	@GetMapping("/availableTimes")
	@ResponseBody
	public ResponseEntity<List<String>> getAvailableTimes(@RequestParam int counsel,
			@RequestParam String counselReqDatetime, @RequestParam int memId) {

		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			Date counselReqDate = dateFormat.parse(counselReqDatetime);

			List<String> availableTimes = counselingReserveService.getAvailableTimes(counsel, counselReqDate, memId);

			return ResponseEntity.ok(availableTimes);
		} catch (Exception e) {
			return ResponseEntity.status(500).build();
		}
	}

	/**
	 * 상담 시간 임시 점유를 시도하고, 성공하면 상세 페이지로 리디렉션하는 API
	 * 
	 * @return 성공 시 상세 페이지 리디렉션, 실패 시 에러 응답
	 */
	@PostMapping("/holdAndRedirect")
	public String holdAndRedirect(@ModelAttribute CounselingVO counselingVO, @RequestParam int payId,
			Principal principal, RedirectAttributes redirectAttributes) {

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			String memIdString = principal.getName();
			counselingVO.setMemId(Integer.parseInt(memIdString));

			boolean isHeld = counselingReserveService.tryHoldCounsel(counselingVO);

			if (isHeld) {
				// FlashAttribute에 VO 객체 전체를 담아 다음 요청으로 전달
				redirectAttributes.addFlashAttribute("counselingVO", counselingVO);
				redirectAttributes.addAttribute("payId", payId);
				
				redirectAttributes.addAttribute("memId", memIdString);
				
				// 리다이렉트할 경로만 반환
				return "redirect:/cnslt/resve/crsv/reservationDetail.do";
			} else {
				redirectAttributes.addFlashAttribute("errorMessage", "다른 사람이 방금 예약했습니다. 다른 시간을 선택해주세요.");
				return "redirect:/cnslt/resve/crsv/reservation.do";
			}
		} else {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
	}

	/**
	 * 상담 예약을 최종적으로 확정하는 API
	 */
	@PostMapping("/reserve")
	public String reserveCounsel(@ModelAttribute CounselingVO counselingVO, @RequestParam int payId,
			RedirectAttributes redirectAttributes) {
		boolean isReserved = counselingReserveService.tryReserveCounsel(counselingVO);

		if (isReserved) {
			int cnt = counselingReserveService.minusPayConsultCnt(payId);
			if (cnt > 0) {
				return "redirect:/cnslt/resve/cnsh/counselingReserveHistory.do";
			} else {
				redirectAttributes.addFlashAttribute("errorMessage", "남은 상담 횟수가 부족합니다");
				return "redirect:/cnslt/resve/crsv/reservation.do";
			}
		} else {
			redirectAttributes.addFlashAttribute("errorMessage", "예약 시간이 초과하였습니다.");
			return "redirect:/cnslt/resve/crsv/reservation.do";
		}
	}

	/**
	 * 상세 페이지 뷰를 반환하는 메서드
	 */
	@GetMapping("/crsv/reservationDetail.do")
	public String reservationDetail(@ModelAttribute CounselingVO counselingVO, @RequestParam int payId, Model model,
			@RequestParam int memId) {
		if (counselingVO == null || counselingVO.getCounsel() <= 0) {
			// FlashAttribute가 없을 경우의 예외 처리
			return "redirect:/cnslt/resve/crsv/reservation.do";
		}
		MemberVO memberVO = new MemberVO();
		memberVO.setMemId(counselingVO.getMemId());
		memberVO = counselingReserveService.selectMemberInfo(memberVO);
		// 3. 생년월일(memBirth)을 통해 나이 계산
		if (memberVO != null && memberVO.getMemBirth() != null) {
			Date birthDate = memberVO.getMemBirth();
			LocalDate birthLocalDate = new java.sql.Date(birthDate.getTime()).toLocalDate();
			LocalDate today = LocalDate.now();

			// java.time.Period를 사용하여 나이 계산
			int age = Period.between(birthLocalDate, today).getYears();

			// 계산된 나이를 memberVO에 추가 (예: memAge 필드)
			memberVO.setMemAge(age);
		}

		MemberSubscriptionVO currentSub = paymentService.selectByMemberId(memId);

		// 현재 구독 정보가 있으면 구독결제 최신 가져오기
		PaymentVO aiCounts = counselingReserveService.selectLastSubcription(currentSub);

		model.addAttribute("payId", payId);
		model.addAttribute("memberVO", memberVO);
		model.addAttribute("counselingVO" + counselingVO);
		model.addAttribute("aiCounts", aiCounts);

		return "cnslt/resve/crsv/counselingreserveDetail";
	}

	@GetMapping("/checkSubscription")
	public ResponseEntity<PaymentVO> checkSubscription(@RequestParam int memId) {

		// 회원 현재 구독 정보 가져오기
		MemberSubscriptionVO currentSub = paymentService.selectByMemberId(memId);
		if (currentSub == null) {
			PaymentVO paymentVO = new PaymentVO();
			return ResponseEntity.ok(paymentVO);
		}

		// 현재 구독 정보가 있으면 구독결제 최신 가져오기
		PaymentVO paymentVO = counselingReserveService.selectLastSubcription(currentSub);
		return ResponseEntity.ok(paymentVO);
	}

}
