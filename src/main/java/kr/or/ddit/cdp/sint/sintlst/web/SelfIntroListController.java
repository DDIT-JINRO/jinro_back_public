package kr.or.ddit.cdp.sint.sintlst.web;

import java.security.Principal;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.cdp.sint.service.SelfIntroService;
import kr.or.ddit.cdp.sint.service.SelfIntroVO;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cdp/sint/sintlst")
@Controller
@Slf4j
@RequiredArgsConstructor
public class SelfIntroListController {

	private final SelfIntroService selfIntroService;

	@GetMapping("/selfIntroList.do")
	public String selfIntroListPage(Principal principal, Model model, @RequestParam(required = false) String keyword,
			@RequestParam(required = false) String status,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "5") int size,
			@RequestParam(value = "sortOrder", required = false) String sortOrder
			) {

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			String memId = principal.getName();

			SelfIntroVO selfIntroVO = new SelfIntroVO();
			selfIntroVO.setMemId(Integer.parseInt(memId));
			selfIntroVO.setCurrentPage(currentPage);
			selfIntroVO.setSize(5);
			selfIntroVO.setKeyword(keyword);
			selfIntroVO.setStatus(status);
			selfIntroVO.setSortOrder(sortOrder);

			int total = selfIntroService.selectSelfIntroTotalBymemId(selfIntroVO);
			// 사용자 자소서 리스트 불러옴
			List<SelfIntroVO> SelfIntroVOList = selfIntroService.selectSelfIntroBymemId(selfIntroVO);

			ArticlePage<SelfIntroVO> articlePage = new ArticlePage<SelfIntroVO>(total, currentPage, 5,
					SelfIntroVOList, keyword);
			articlePage.setUrl("/cdp/sint/sintlst/selfIntroList.do");

			model.addAttribute("articlePage", articlePage);

		} else {
			return "redirect:/login";
		}

		return "cdp/sint/sintlst/selfIntroList";
	}

}
