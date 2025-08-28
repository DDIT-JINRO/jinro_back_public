package kr.or.ddit.pse.cr.crl.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.ddit.pse.cr.crl.service.CareerEncyclopediaService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.worldcup.service.JobsVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/pse")
@Slf4j
public class CareerEncyclopediaController {
	
	@Autowired
	CareerEncyclopediaService careerEncyclopediaService;
	
	@GetMapping("/cr/crl/selectCareerList.do")
	public String selectCareerList (@AuthenticationPrincipal String memId, @ModelAttribute JobsVO jobs, Model model, RedirectAttributes redirectAttributes) {
		try {
			Map<String, String> jobLclCode = this.careerEncyclopediaService.selectJobLclCode();
			
			ArticlePage<JobsVO> articlePage = this.careerEncyclopediaService.selectCareerList(jobs, memId);
			
			model.addAttribute("jobLclCode", jobLclCode);
			model.addAttribute("articlePage", articlePage);
		} catch (Exception e) {
			log.error("에러 발생 : " + e.getMessage());
			redirectAttributes.addAttribute("errorMessage", "직업 리스트를 불러오는 중 에러가 발생했습니다.");
		}
		return "pse/cr/crl/selectCareerList";
	}
	
	@GetMapping("/cr/crl/selectCareerDetail.do")
	public String selectCareerDetail (@AuthenticationPrincipal String memId, @ModelAttribute JobsVO jobs, Model model, RedirectAttributes redirectAttributes) {
		try {
			jobs = this.careerEncyclopediaService.selectCareerDetail(jobs, memId);
			model.addAttribute("jobs", jobs);
		} catch (Exception e) {
			log.error("에러 발생 : " + e.getMessage());
			redirectAttributes.addAttribute("errorMessage", "직업 정보를 불러오는 중 에러가 발생했습니다.");
		}
		
		return "pse/cr/crl/selectCareerDetail";
	}
	
	@PostMapping("/cr/crl/updateCareer.do")
	public void updateCareer (@RequestBody JobsVO jobs) {
		
		this.careerEncyclopediaService.updateCareer(jobs);
		
	}
}
