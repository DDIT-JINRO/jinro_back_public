package kr.or.ddit.pse.cr.cco.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.ddit.pse.cr.cco.service.CareerComparsionService;
import kr.or.ddit.worldcup.service.JobsVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/pse")
@Slf4j
public class CareerComparisonController {

	@Autowired
	CareerComparsionService careerComparsionService;
	
	@GetMapping("/cr/cco/careerComparisonView.do")
	public String careerComparisonView (@AuthenticationPrincipal String memId, @ModelAttribute JobsVO jobs, Model model) {
		
		List<JobsVO> jobsList = this.careerComparsionService.selectCareerComparsionList(jobs, memId);

		model.addAttribute("jobsList", jobsList);
		
		return "pse/cr/cco/careerComparisonView";
	}
}
