package kr.or.ddit.cnslt.resve.cnsh.web;

import java.security.Principal;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.mpg.mat.csh.service.CounselingHistoryService;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cnslt/resve")
@Controller
@Slf4j
@RequiredArgsConstructor
public class CounselingReserveHistoryController {

	private final CounselingHistoryService counselingHistoryService;

	@GetMapping("/cnsh/counselingReserveHistory.do")
	public String counselingHistory(@ModelAttribute CounselingVO counselingVO, Principal principal, Model model) {

		if (principal != null && !principal.getName().equals("anonymousUser")) {

			String memId = principal.getName();

			Map<String, String> counselStatus = counselingHistoryService.selectCounselStatusList();
			Map<String, String> counselCategory = counselingHistoryService.selectCounselCategoryList();
			Map<String, String> counselMethod = counselingHistoryService.selectCounselMethodList();
			ArticlePage<CounselingVO> articlePage = counselingHistoryService.selectCounselingList(memId, counselingVO);
			articlePage.setUrl("/cnslt/resve/cnsh/counselingReserveHistory.do");

			model.addAttribute("counselStatus", counselStatus);
			model.addAttribute("counselCategory", counselCategory);
			model.addAttribute("counselMethod", counselMethod);
			model.addAttribute("articlePage", articlePage);

			return "cnslt/resve/cnsh/counselingreservehistory";
		} else {
			return "redirect:/login";
		}
	}

}
