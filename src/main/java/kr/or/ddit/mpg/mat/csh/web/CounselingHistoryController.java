package kr.or.ddit.mpg.mat.csh.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.mpg.mat.csh.service.CounselingHistoryService;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class CounselingHistoryController {

	@Autowired
	CounselingHistoryService counselingHistoryService;
	
	@GetMapping("/mat/csh/selectCounselingHistoryList.do")
	public String selectCounselingHistoryList (@AuthenticationPrincipal String memId, @ModelAttribute CounselingVO counselingVO, Model model) {
		
		Map<String, String> counselStatus = this.counselingHistoryService.selectCounselStatusList();
		Map<String, String> counselCategory = this.counselingHistoryService.selectCounselCategoryList();
		Map<String, String> counselMethod = this.counselingHistoryService.selectCounselMethodList();
		ArticlePage<CounselingVO> articlePage = this.counselingHistoryService.selectCounselingList(memId, counselingVO);
		articlePage.setUrl("/mpg/mat/csh/selectCounselingHistoryList.do");
		
		model.addAttribute("counselStatus", counselStatus);
		model.addAttribute("counselCategory", counselCategory);
		model.addAttribute("counselMethod", counselMethod);
		model.addAttribute("articlePage", articlePage);
		
		return "mpg/mat/csh/selectCounselingHistoryList";
	}
	
	@GetMapping("/mat/csh/counselHistory.do")
	public String selectCounselHistoryDetail (@ModelAttribute CounselingVO counselingVO) {
		int counselId = counselingVO.getCounselId(); 
		String counselMethod = counselingVO.getCounselMethod();
		
		switch (counselMethod) {
		case "G08001": {
			return "redirect:/cnslt/off/offlineReservationHistory.do";
		}
		case "G08002": {
			return "redirect:/cnslt/cht/chattingReservationHistory.do";
		}
		case "G08003": {
			return "redirect:/cnslt/vid/videoReservationHistory.do";
		}
		default:
			return "redirect:mpg/mat/csh/selectCounselingHistoryList.do";
		}
	}
	
}
