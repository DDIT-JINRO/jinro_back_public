package kr.or.ddit.ertds.univ.uvsrch.web;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.empt.ivfb.service.InterviewFeedbackService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/ertds/univ/uvsrch")
@Controller
public class UniversitySearchController {

	@Autowired
	private UniversityService universityService;

	@Autowired
	private InterviewFeedbackService interviewFeedbackService;
	
	// 중분류 대학검색으로 이동
	@GetMapping("/selectUnivList.do")
	public String selectUnivList(
			@RequestParam(required = false) String keyword, 
			@RequestParam(required = false, defaultValue = "1") int currentPage,
			@RequestParam(required = false, defaultValue = "5") int size, 
			UniversityVO universityVO, 
			Model model, 
			Principal principal) {
		
		if (universityVO != null && universityVO.getSize() == 0)
			universityVO.setSize(size);
		if (universityVO != null && universityVO.getCurrentPage() == 0)
			universityVO.setCurrentPage(currentPage);
		
		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			universityVO.setMemId(memId);
		}

		List<UniversityVO> list = this.universityService.selectUniversityList(universityVO);
		int totalCount = this.universityService.selectUniversityTotalCount(universityVO);

		List<ComCodeVO> codeVORegionList = this.universityService.selectCodeVORegionList();
		List<ComCodeVO> codeVOUniversityTypeList = this.universityService.selectCodeVOUniversityTypeList();
		List<ComCodeVO> codeVOUniversityGubunList = this.universityService.selectCodeVOUniversityGubunList();

		ArticlePage<UniversityVO> articlePage = new ArticlePage<>(totalCount, currentPage, size, list, keyword);
		List<BookMarkVO> bookMarkVOList = new ArrayList<>();
		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			BookMarkVO bookMarkVO = new BookMarkVO();
			bookMarkVO.setMemId(memId);
			bookMarkVO.setBmCategoryId("G03001");

			bookMarkVOList = this.universityService.selectBookMarkVO(bookMarkVO);
		}
		model.addAttribute("articlePage", articlePage);
		model.addAttribute("bookMarkVOList", bookMarkVOList);
		model.addAttribute("codeVORegionList", codeVORegionList);
		model.addAttribute("codeVOUniversityTypeList", codeVOUniversityTypeList);
		model.addAttribute("codeVOUniversityGubunList", codeVOUniversityGubunList);

		return "ertds/univ/uvsrch/selectUnivList"; // /WEB-INF/views/erds/univ/list.jsp
	}

	// 대학 디테일
	@GetMapping("/selectDetail.do")
	public String selectDetail(
			@RequestParam("univId") int univId, 
			Model model, 
			Principal principal) {
		
		InterviewReviewVO interviewReview = new InterviewReviewVO();
		interviewReview.setIrType("G02001");
		interviewReview.setTargetId(univId);
		List<InterviewReviewVO> interviewReviewList = interviewFeedbackService.selectInterviewFeedbackList(interviewReview).getContent();

		UniversityDetailVO universityDetail = this.universityService.selectUniversityDetail(univId);

		if (universityDetail == null) {
			log.warn("대학 정보를 찾을 수 없습니다 - univId: {}", univId);
			// 목록 페이지로 리다이렉트
			return "redirect:/ertds/univ/uvsrch/selectUnivList.do";
		}

		List<BookMarkVO> bookMarkVOList = new ArrayList<>();
		if (principal != null && !principal.getName().equals("anonymousUser")) {
			try {
				int memId = Integer.parseInt(principal.getName());
				BookMarkVO bookMarkVO = new BookMarkVO();
				bookMarkVO.setMemId(memId);
				bookMarkVO.setBmCategoryId("G03001");

				bookMarkVOList = this.universityService.selectBookMarkVO(bookMarkVO);
			} catch (NumberFormatException e) {
				log.warn("잘못된 회원 ID 형식 - principal: {}", principal.getName());
			}
		}

		model.addAttribute("universityDetail", universityDetail);
		model.addAttribute("interviewReviewList", interviewReviewList);
		model.addAttribute("bookMarkVOList", bookMarkVOList);

		return "ertds/univ/uvsrch/selectDetail"; // /WEB-INF/views/ertds/univ/uvsrch/detail.jsp
	}

}
