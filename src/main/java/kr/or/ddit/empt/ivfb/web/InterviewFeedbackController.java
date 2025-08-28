package kr.or.ddit.empt.ivfb.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.empt.ivfb.service.InterviewFeedbackService;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/empt")
public class InterviewFeedbackController {

	@Autowired
	private InterviewFeedbackService interviewFeedbackService;
	
	@GetMapping("/ivfb/interViewFeedback.do")
	public String interViewFeedbackList(InterviewReviewVO interviewReviewVO, Model model) {
		try {
			interviewReviewVO.setIrType("G02002");
			ArticlePage<InterviewReviewVO> articlePage = interviewFeedbackService.selectInterviewFeedbackList(interviewReviewVO);
			articlePage.setUrl("/empt/ivfb/interViewFeedback.do");
			model.addAttribute("articlePage", articlePage);
		} catch (CustomException e) {
			log.error("면접 후기 리스트 조회 중 에러 발생 : {}", e.getMessage());
			model.addAttribute("errorMessage", e.getMessage());
		} catch (Exception e) {
			log.error("면접 후기 리스트 조회 중 에러 발생 : {}", e.getMessage());
			model.addAttribute("errorMessage", "면접 후기 리스트 조회 중 에러가 발생했습니다.");
		}
		
		return "empt/ivfb/interviewFeedback";
	}
	
	@GetMapping("/ivfb/insertInterViewFeedbackView.do")
	public String insertInterViewFeedbackView() {
		return "empt/ivfb/insertInterViewFeedbackView";
	}
	
	@ResponseBody
	@GetMapping("/ivfb/selectCompanyList.do")
	public ResponseEntity<Map<String, Object>> selectCompanyList(@RequestParam String cpName) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			List<CompanyVO> companyList = interviewFeedbackService.selectCompanyList(cpName);
			response.put("success", true);
			response.put("companyList", companyList);
			return ResponseEntity.ok(response);
		} catch(CustomException e) {
			log.error("기업 정보 리스트 조회 중 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "기업 정보 조회 중 오류가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
		} catch(Exception e) {
			log.error("알 수 없는 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "알 수 없는 에러가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	@ResponseBody
	@PostMapping("/ivfb/insertInterViewFeedback.do")
	public ResponseEntity<Map<String, Object>> insertInterviewFeedback(@AuthenticationPrincipal String memId, @ModelAttribute InterviewReviewVO interviewReview, @RequestParam MultipartFile file) {
		Map<String, Object> response = new HashMap<>();
		
		String veriCategory = "G38003";
		
		try {
			interviewFeedbackService.updateInterviewFeedback(memId, interviewReview, file, veriCategory);
			response.put("success", true);
			return ResponseEntity.ok(response);
		} catch(CustomException e) {
			log.error("면접 후기 요청 등록 중 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "면접 후기 요청 중 오류가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
		} catch(Exception e) {
			log.error("알 수 없는 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "알 수 없는 에러가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	@ResponseBody
	@PostMapping("/ivfb/deleteInterviewFeedback.do")
	public ResponseEntity<Map<String, Object>> deleteInterviewFeedback(@AuthenticationPrincipal String memId, @RequestParam int irId) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			interviewFeedbackService.deleteInterviewFeedback(memId, irId);
			response.put("success", true);
			return ResponseEntity.ok(response);
		} catch(CustomException e) {
			log.error("면접 후기 삭제 요청 중 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", e.getMessage());
			return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
		} catch(Exception e) {
			log.error("알 수 없는 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "알 수 없는 에러가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	@GetMapping("/ivfb/updateInterviewFeedbackView.do")
	public String updateInterviewFeedbackView(Model model, @AuthenticationPrincipal String memId, @RequestParam int irId) {
		try {
			InterviewReviewVO interviewReview = interviewFeedbackService.selectInterviewFeedback(memId, irId);
			model.addAttribute("interviewReview", interviewReview);
		} catch (CustomException e) {
			log.error("면접 후기 조회 중 에러 발생 : {}", e.getMessage());
			model.addAttribute("errorMessage", e.getMessage());
		} catch (Exception e) {
			log.error("면접 후기 조회 중 에러 발생 : {}", e.getMessage());
			model.addAttribute("errorMessage", "면접 후기 조회 중 에러가 발생했습니다.");
		}
		
		return "empt/ivfb/updateInterViewFeedbackView";
	}
	
	@ResponseBody
	@PostMapping("/ivfb/updateInterViewFeedback.do")
	public ResponseEntity<Map<String, Object>> updateInterViewFeedback(@AuthenticationPrincipal String memId, @ModelAttribute InterviewReviewVO interviewReview) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			interviewFeedbackService.updateInterviewFeedback(memId, interviewReview);
			response.put("success", true);
			return ResponseEntity.ok(response);
		} catch(CustomException e) {
			log.error("면접 후기 수정 중 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "면접 후기 수정 중 오류가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
		} catch(Exception e) {
			log.error("알 수 없는 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "알 수 없는 에러가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
}
