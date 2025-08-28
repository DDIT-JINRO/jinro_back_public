package kr.or.ddit.ertds.univ.ubivfb.web;

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

import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.empt.ivfb.service.InterviewFeedbackService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/ertds")
public class UniversityInterviewFeedbackController {

	@Autowired
	private InterviewFeedbackService interviewFeedbackService;

	// 중분류 학과정보로 이동
	@GetMapping("/univ/uvivfb/selectInterviewList.do")
	public String selectInterviewList(InterviewReviewVO interviewReviewVO, Model model) {
		try {
			interviewReviewVO.setIrType("G02001");
			ArticlePage<InterviewReviewVO> articlePage = interviewFeedbackService.selectInterviewFeedbackList(interviewReviewVO);
			articlePage.setUrl("/ertds/univ/uvivfb/selectInterviewList.do");
			model.addAttribute("articlePage", articlePage);
		} catch (CustomException e) {
			log.error("면접 후기 리스트 조회 중 에러 발생 : {}", e.getMessage());
			model.addAttribute("errorMessage", e.getMessage());
		} catch (Exception e) {
			log.error("면접 후기 리스트 조회 중 에러 발생 : {}", e.getMessage());
			model.addAttribute("errorMessage", "면접 후기 리스트 조회 중 에러가 발생했습니다.");
		}
		
		return "ertds/univ/uvivfb/selectInterviewList";
	}
	
	@GetMapping("/univ/uvivfb/insertInterviewFeedbackView.do")
	public String insertInterViewFeedbackView() {
		return "ertds/univ/uvivfb/insertInterviewFeedbackView";
	}
	
	@ResponseBody
	@GetMapping("/univ/uvivfb/selectUniversityList.do")
	public ResponseEntity<Map<String, Object>> selectUniversityList(@RequestParam String univName) {
		Map<String, Object> response = new HashMap<>();
		
		try {
			List<UniversityVO> universityList = interviewFeedbackService.selectUniversityList(univName);
			response.put("success", true);
			response.put("universityList", universityList);
			return ResponseEntity.ok(response);
		} catch(CustomException e) {
			log.error("대학 정보 리스트 조회 중 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "대학 정보 조회 중 오류가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
		} catch(Exception e) {
			log.error("알 수 없는 에러 발생 : {}", e.getMessage());
			response.put("success", false);
			response.put("message", "알 수 없는 에러가 발생했습니다 : " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	@ResponseBody
	@PostMapping("/univ/uvivfb/insertInterViewFeedback.do")
	public ResponseEntity<Map<String, Object>> insertInterviewFeedback(@AuthenticationPrincipal String memId, @ModelAttribute InterviewReviewVO interviewReview, @RequestParam MultipartFile file) {
		Map<String, Object> response = new HashMap<>();
		
		String veriCategory = "G38002";
		
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
	@PostMapping("/univ/uvivfb/deleteInterviewFeedback.do")
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
	
	@GetMapping("/univ/uvivfb/updateInterviewFeedbackView.do")
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
		
		return "ertds/univ/uvivfb/updateInterViewFeedbackView";
	}
	
	@ResponseBody
	@PostMapping("/univ/uvivfb/updateInterViewFeedback.do")
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