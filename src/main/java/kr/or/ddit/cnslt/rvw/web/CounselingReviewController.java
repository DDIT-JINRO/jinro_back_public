package kr.or.ddit.cnslt.rvw.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.cnslt.rvw.service.CounselingReviewService;
import kr.or.ddit.cnslt.rvw.service.CounselingReviewVO;
import kr.or.ddit.mpg.mat.csh.service.CounselingHistoryService;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/cnslt/rvw")
public class CounselingReviewController {

	@Autowired
	private CounselingReviewService counselingReviewService;
	
	@Autowired
	private CounselingHistoryService counselingHistoryService;

	@GetMapping("/cnsReview.do")
	public String cnsReview(@ModelAttribute CounselingReviewVO counselingReview, Model model) {
		ArticlePage<CounselingReviewVO> articlePage = counselingReviewService.selectCounselingReviewList(counselingReview);
		Map<String, String> counselCategoryList = counselingHistoryService.selectCounselCategoryList();
		Map<String, String> counselMethodList = counselingHistoryService.selectCounselMethodList();

		model.addAttribute("articlePage", articlePage);
		model.addAttribute("counselCategory", counselCategoryList);
		model.addAttribute("counselMethod", counselMethodList);

		return "cnslt/rvw/cnsReview";
	}

	@GetMapping("/insertCnsReviewView.do")
	public String insertCnsReviewView(@AuthenticationPrincipal String memId, Model model) {
		return "cnslt/rvw/insertCnsReviewView";
	}

	@GetMapping("/updateCnsReviewView.do")
	public String updateCnsReviewView(@RequestParam int crId, Model model) {
		CounselingReviewVO counselingReview = counselingReviewService.selectCounselingReview(crId);

		model.addAttribute("counselingReview", counselingReview);

		return "cnslt/rvw/updateCnsReviewView";
	}

	@ResponseBody
	@GetMapping("/selectCounselingHistory.do")
	public ResponseEntity<Map<String, Object>> selectCounselingHistory(@AuthenticationPrincipal String memId, String counselName) {
		Map<String, Object> response = new HashMap<String, Object>();

		if (memId == null || "anonymousUser".equals(memId)) {
			response.put("success", false);
			response.put("message", "로그인 후 이용해주세요.");
			return ResponseEntity.ok(response);
		}

		List<CounselingVO> counselingList = counselingReviewService.selectCounselingHistory(memId, counselName);
		response.put("success", true);
		response.put("counselingList", counselingList);

		return ResponseEntity.ok(response);
	}

	@ResponseBody
	@PostMapping("/insertCnsReview.do")
	public ResponseEntity<Map<String, Object>> insertCnsReview(@AuthenticationPrincipal String memId, @ModelAttribute CounselingReviewVO counselingReview) {
		Map<String, Object> response = new HashMap<>();

		if (memId == null || "anonymousUser".equals(memId)) {
			response.put("success", false);
			response.put("message", "로그인 후 이용해주세요.");
			return ResponseEntity.ok(response);
		}

		counselingReviewService.updateCnsReview(counselingReview);
		response.put("success", true);
		return ResponseEntity.ok(response);
	}
	
	@ResponseBody
	@PostMapping("/updateCnsReview.do")
	public ResponseEntity<Map<String, Object>> updateCnsReview(@AuthenticationPrincipal String memId, @ModelAttribute CounselingReviewVO counselingReview) {
		Map<String, Object> response = new HashMap<>();
		
		if (memId == null || "anonymousUser".equals(memId)) {
			response.put("success", false);
			response.put("message", "로그인 후 이용해주세요.");
			return ResponseEntity.ok(response);
		}
		
		counselingReviewService.updateCnsReview(counselingReview);
		response.put("success", true);
		return ResponseEntity.ok(response);
	}
	
	@ResponseBody
	@PostMapping("/deleteCnsReview.do")
	public ResponseEntity<Map<String, Object>> deleteCnsReview(@AuthenticationPrincipal String memId, @RequestParam int crId) {
		Map<String, Object> response = new HashMap<>();
		
		if (memId == null || "anonymousUser".equals(memId)) {
			response.put("success", false);
			response.put("message", "로그인 후 이용해주세요.");
			return ResponseEntity.ok(response);
		}
		
		counselingReviewService.deleteCnsReview(crId);
		response.put("success", true);
		return ResponseEntity.ok(response);
	}
}
