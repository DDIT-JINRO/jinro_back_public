package kr.or.ddit.pse.cr.crr.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.ddit.exception.CustomException;
import kr.or.ddit.pse.cr.crl.service.CareerEncyclopediaService;
import kr.or.ddit.pse.cr.crr.service.CareerEncyclopediaRcmService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.worldcup.service.JobsVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/pse")
@Slf4j
public class CareerEncyclopediaRcmController {
	
	@Autowired
	CareerEncyclopediaRcmService careerEncyclopediaRcmService;
	
	@Autowired
	CareerEncyclopediaService careerEncyclopediaService;
	
	@GetMapping("/cr/crr/selectCareerRcmList.do")
	public String selectCareerRcmList (@AuthenticationPrincipal String memId, @ModelAttribute JobsVO jobs, Model model) {
		try {
			Map<String, String> jobLclCode = this.careerEncyclopediaService.selectJobLclCode();
			
			ArticlePage<JobsVO> articlePage = this.careerEncyclopediaRcmService.selectCareerRcmList(jobs, memId);
			
			model.addAttribute("jobLclCode", jobLclCode);
			model.addAttribute("articlePage", articlePage);
		} catch (CustomException e) {
			log.error("에러 발생 : " + e.getMessage());
			model.addAttribute("errorMessage", e.getMessage());
		} catch (Exception e) {
			log.error("에러 발생 : " + e.getMessage());
			model.addAttribute("serverError", "직업 리스트를 불러오는 중 에러가 발생했습니다.");
		}
		return "pse/cr/crr/careerEncyclopediaRcmList";
	}
}
