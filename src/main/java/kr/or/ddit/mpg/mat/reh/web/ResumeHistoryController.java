package kr.or.ddit.mpg.mat.reh.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.cdp.rsm.rsm.service.ResumeService;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class ResumeHistoryController {

	@Autowired
	ResumeService resumeService;
	
	@GetMapping("/mat/reh/selectResumeHistoryList.do") // resumeList.do
	public String resumePage(@AuthenticationPrincipal String memId
			, @RequestParam(required = false) String keyword
			, @RequestParam(required = false) String status
			, @RequestParam(required = false, defaultValue = "1") int currentPage
			, @RequestParam(required = false, defaultValue = "5") int size
			, Model model) {
		
		if (memId != null && !"anonymousUser".equals(memId)) {
			ResumeVO resumeVO = new ResumeVO();
			resumeVO.setMemId(Integer.parseInt(memId));
			resumeVO.setKeyword(keyword);
			resumeVO.setStatus(status);
			resumeVO.setCurrentPage(currentPage);
			resumeVO.setSize(size);

			int total = resumeService.selectResumeTotalBymemId(resumeVO);
			List<ResumeVO> ResumeVOList = resumeService.selectResumeBymemId(resumeVO);

			ArticlePage<ResumeVO> articlePage = new ArticlePage<ResumeVO>(total, currentPage, size, ResumeVOList, keyword);
			articlePage.setUrl("/mpg/mat/reh/selectResumeHistoryList.do");

			if(articlePage != null) {
				model.addAttribute("articlePage", articlePage);
			}

			return "mpg/mat/reh/selectResumeHistoryList";
		} else {
			return "redirect:/login";
		}
	}
}
