package kr.or.ddit.empt.cte.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.empt.cte.service.CareerTechnicalEducationService;
import kr.or.ddit.empt.cte.service.CareerTechnicalEducationVO;
import kr.or.ddit.util.ArticlePage;

@Controller
@RequestMapping("/empt")
public class CareerTechnicalEducationController {

	@Autowired
	private CareerTechnicalEducationService educationService;

	@GetMapping("/cte/careerTechnicalEducation.do")
	public String careerTechEduList( @RequestParam(required = false) String keyword,
		    @RequestParam(required = false) String region,
		    @RequestParam(required = false) String status,
		    @RequestParam(value="currentPage",required=false, defaultValue="1") int currentPage,
		    @RequestParam(value="size",required=false, defaultValue = "5")int size,
		    @RequestParam(value="sortOrder",required=false)String sortOrder,
		     Model model) {

			ArticlePage<CareerTechnicalEducationVO> articlePage = educationService.getList(keyword,region,status,currentPage,size,sortOrder);
			articlePage.setUrl("/empt/cte/careerTechnicalEducation.do");
			model.addAttribute("articlePage", articlePage);

		return "empt/cte/careerTechnicalEducation";
	}

}
