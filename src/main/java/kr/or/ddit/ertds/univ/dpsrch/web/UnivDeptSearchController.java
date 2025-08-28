package kr.or.ddit.ertds.univ.dpsrch.web;

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
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptCompareVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptDetailVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptService;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/ertds")
public class UnivDeptSearchController {

	@Autowired
	UnivDeptService univDeptService;

	// 중분류 학과정보로 이동
	@GetMapping("univ/dpsrch/selectDeptList.do")
	public String selectDeptList(
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false, defaultValue = "1") int currentPage,
			@RequestParam(required = false, defaultValue = "5") int size,
			@RequestParam(required = false) String sortOrder,
			UnivDeptVO univDeptVO, Model model,
			Principal principal) {

		if (univDeptVO != null && univDeptVO.getSize() == 0)
			univDeptVO.setSize(size);
		if (univDeptVO != null && univDeptVO.getCurrentPage() == 0)
			univDeptVO.setCurrentPage(currentPage);

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			univDeptVO.setMemId(memId);
		}

		List<UnivDeptVO> list = this.univDeptService.selectUnivDeptList(univDeptVO);
		int totalCount = this.univDeptService.selectUniversityTotalCount(univDeptVO);

		List<ComCodeVO> lClass = this.univDeptService.selectCodeVOUnivDeptLClassList();

		ArticlePage<UnivDeptVO> articlePage = new ArticlePage<>(totalCount, currentPage, size, list, keyword);
		List<BookMarkVO> bookMarkVOList = new ArrayList<>();

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			BookMarkVO bookMarkVO = new BookMarkVO();
			bookMarkVO.setMemId(memId);
			bookMarkVO.setBmCategoryId("G03006");

			bookMarkVOList = this.univDeptService.selectBookMarkVO(bookMarkVO);
		}

		model.addAttribute("articlePage", articlePage);
		model.addAttribute("bookMarkVOList", bookMarkVOList);
		model.addAttribute("lClass", lClass);

		return "ertds/univ/dpsrch/selectDeptList";
	}

	// 대학비교
	@GetMapping("/univ/dpsrch/selectCompare.do")
	public String selectCompare(
			@RequestParam(value = "uddIds", required = false) List<Integer> uddIdList,
			Principal principal,
			Model model) {
		// URL 파라미터로 학과 ID가 전달된 경우 미리 조회
		if (uddIdList != null && !uddIdList.isEmpty()) {
			try {
				List<BookMarkVO> bookMarkVOList = new ArrayList<>();

				if (principal != null && !principal.getName().equals("anonymousUser")) {
					int memId = Integer.parseInt(principal.getName());
					BookMarkVO bookMarkVO = new BookMarkVO();
					bookMarkVO.setMemId(memId);
					bookMarkVO.setBmCategoryId("G03006");

					bookMarkVOList = this.univDeptService.selectBookMarkVO(bookMarkVO);
				}

				List<UnivDeptCompareVO> compareList = univDeptService.getDeptCompareList(uddIdList);
				model.addAttribute("compareList", compareList);
				model.addAttribute("bookMarkVOList", bookMarkVOList);
				model.addAttribute("preloadedDepts", uddIdList);

			} catch (Exception e) {
				log.error("학과 비교 데이터 조회 오류: {}", uddIdList, e);
			}
		}
		return "ertds/univ/dpsrch/selectCompare"; // /WEB-INF/views/erds/univ/compare.jsp
	}

	// 대학
	@GetMapping("/univ/dpsrch/selectDetail.do")
	public String selectDetail(
			@RequestParam int uddId,
			Model model,
			Principal principal) {
		UnivDeptDetailVO deptDetail = this.univDeptService.selectDeptDetail(uddId);
		List<BookMarkVO> bookMarkVOList = new ArrayList<>();

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			int memId = Integer.parseInt(principal.getName());
			BookMarkVO bookMarkVO = new BookMarkVO();
			bookMarkVO.setMemId(memId);
			bookMarkVO.setBmCategoryId("G03006");

			bookMarkVOList = this.univDeptService.selectBookMarkVO(bookMarkVO);
		}

		model.addAttribute("deptDetail", deptDetail);
		model.addAttribute("bookMarkVOList", bookMarkVOList);
		return "ertds/univ/dpsrch/selectDetail"; // /WEB-INF/views/erds/univ/detail.jsp
	}

}
