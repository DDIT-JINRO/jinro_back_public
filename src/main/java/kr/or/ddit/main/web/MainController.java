package kr.or.ddit.main.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.admin.las.service.ContentStatsService;
import kr.or.ddit.comm.peer.teen.service.TeenCommService;
import kr.or.ddit.prg.ctt.service.ContestService;



@Controller
@RequestMapping("/")
public class MainController {

	@Autowired
	private ContentStatsService contentStatsService;

	@Autowired
	private ContestService contestService;

	@Autowired
	private TeenCommService teenCommService;
	
	@GetMapping
	public String main(@AuthenticationPrincipal String memId, Model model) {
		if(memId!="anonymousUser") {
			Boolean isTeen = teenCommService.isTeen(memId); 
			
			model.addAttribute("isTeen",isTeen);
		}
		
		model.addAttribute("memId", memId);
		return "content/main";
	}

	@GetMapping("/bookmark/top")
	@ResponseBody
	public List<Map<String, Object>> bookmarkTopN(@RequestParam Map<String, Object> param){
		return contentStatsService.bookmarkTopN(param);
	}

	@GetMapping("/community/top5/main")
	@ResponseBody
	public List<Map<String, Object>> communityTop5Main(@AuthenticationPrincipal String memId){
		return contentStatsService.selectCommunityTop5PostsByMemBirth(memId);
	}

	@GetMapping("/contest-banner")
	@ResponseBody
	public List<Map<String, Object>> contestBanner(@AuthenticationPrincipal String memId){
		return contestService.contestBanner(memId);
	}
}
