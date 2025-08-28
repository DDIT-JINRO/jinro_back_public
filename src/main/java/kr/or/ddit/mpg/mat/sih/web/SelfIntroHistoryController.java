package kr.or.ddit.mpg.mat.sih.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.cdp.sint.service.SelfIntroService;
import kr.or.ddit.cdp.sint.service.SelfIntroVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class SelfIntroHistoryController {
	
	@Autowired
	SelfIntroService selfIntroService;
	
	@GetMapping("/mat/sih/selectSelfIntroHistoryList.do")
	public String selectSelfIntroHistoryList(@AuthenticationPrincipal String memId
			, @RequestParam(required = false) String keyword
			, @RequestParam(required = false) String status
			, @RequestParam(required = false, defaultValue = "1") int currentPage
			, @RequestParam(required = false, defaultValue = "5") int size
			, Model model) {
		
		if (memId != null && !"anonymousUser".equals(memId)) {
			SelfIntroVO selfIntroVO = new SelfIntroVO();
			selfIntroVO.setMemId(Integer.parseInt(memId));
			selfIntroVO.setKeyword(keyword);
			selfIntroVO.setStatus(status);
			selfIntroVO.setCurrentPage(currentPage);
			selfIntroVO.setSize(size);
			
			int total = this.selfIntroService.selectSelfIntroTotalBymemId(selfIntroVO);
			List<SelfIntroVO> selfIntroVOList = this.selfIntroService.selectSelfIntroBymemId(selfIntroVO);
			
			ArticlePage<SelfIntroVO> articlePage = new ArticlePage<SelfIntroVO>(total, currentPage, size, selfIntroVOList, keyword);
			
			articlePage.setUrl("/mpg/mat/sih/selectSelfIntroHistoryList.do");

			if(articlePage != null) {
				model.addAttribute("articlePage", articlePage);
			}

			return "mpg/mat/sih/selectSelfIntroHistoryList";
		} else {
			return "redirect:/login";
		}
	}
}
