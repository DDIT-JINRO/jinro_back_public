package kr.or.ddit.cnsLeader.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/cnsLeader")
@Slf4j
public class CnsLeaderMoveController {
	
	@GetMapping
	public String movePage() {

		return "cnsLeader/scheduleManagement";
	}
	
	// counselor의 move페이지의 jsp로 forward
	@GetMapping("/cnsLeaderMoveController.do")
	public String movePage(@RequestParam String target) {

		log.info("movePage : "+target);

		return "cnsLeader/"+target;
	}
	
}
