package kr.or.ddit.empt.enp.web;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.EnterprisePostingService;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/empt")
@RequiredArgsConstructor
@Slf4j
public class EnterprisePostingController {

	private final EnterprisePostingService enterprisePostingService;

	@GetMapping("/enp/enterprisePosting.do")
	public String enterprisePosting(@AuthenticationPrincipal String data,@ModelAttribute CompanyVO companyVO,
			@RequestParam(value = "currentPage", defaultValue = "1") int currentPage, Model model,
			Principal principal) {

		companyVO.setCurrentPage(currentPage);
		companyVO.setSize(5);
		int total = enterprisePostingService.selectCompanyListCount(companyVO);
		
		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			companyVO.setMemId(memId);
		}

		List<CompanyVO> companyVOList = enterprisePostingService.selectCompanyList(companyVO);

		for (CompanyVO c : companyVOList) {
			InterviewReviewVO interviewReviewVO = new InterviewReviewVO();
			// 기업리뷴
			interviewReviewVO.setIrType("G02002");
			interviewReviewVO.setTargetId(c.getCpId());
			
			c.setInterviewReviewList(enterprisePostingService.selectEnpInterviewReview(interviewReviewVO));
		}
		
		List<ComCodeVO> codeVOCompanyScaleList = enterprisePostingService.selectCodeVOCompanyScaleList();
		List<ComCodeVO> CodeVORegionList = enterprisePostingService.selectCodeVORegionList();

		ArticlePage<CompanyVO> articlePage = new ArticlePage<CompanyVO>(total, companyVO.getCurrentPage(),
				companyVO.getSize(), companyVOList, companyVO.getKeyword());
		// 북마크 VO
		List<BookMarkVO> bookMarkVOList = new ArrayList<>();

		
		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			BookMarkVO bookMarkVO = new BookMarkVO();
			bookMarkVO.setMemId(memId);
			bookMarkVO.setBmCategoryId("G03002");

			bookMarkVOList = enterprisePostingService.selectBookMarkVO(bookMarkVO);

		}

		articlePage.setUrl("/empt/enp/enterprisePosting.do");
		
		model.addAttribute("bookMarkVOList", bookMarkVOList);
		model.addAttribute("memId", data);
		model.addAttribute("articlePage", articlePage);
		model.addAttribute("codeVOCompanyScaleList", codeVOCompanyScaleList);
		model.addAttribute("CodeVORegionList", CodeVORegionList);
		return "empt/enp/enterprisePosting";
	}

	@PostMapping("/enp/enterprisePostingUpdate.do")
	@ResponseBody
	public ResponseEntity<String> enterprisePostingUpdate(CompanyVO companyVO) {

		int cpId = enterprisePostingService.checkCompanyByCpId(companyVO);

		companyVO.setCpId(cpId);

		int cnt = enterprisePostingService.updateEnterprisePosting(companyVO);

		if (cnt > 0) {
			return ResponseEntity.ok("sucess");
		} else {
			return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("처리중 문제발생");
		}
	}

	@PostMapping("/enp/enterprisePostingDelete.do")
	public ResponseEntity<String> enterprisePostingDelete(@RequestBody CompanyVO companyVO) {
		int cnt = enterprisePostingService.deleteEnterprisePosting(companyVO);
		if (cnt > 0) {
			return ResponseEntity.ok("sucess");
		} else {
			return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("처리중 문제발생");
		}

	}

}
