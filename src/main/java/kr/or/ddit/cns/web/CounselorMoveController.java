package kr.or.ddit.cns.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/cns")
@Slf4j
public class CounselorMoveController {
	
	@GetMapping
	public String movePage() {

		return "cns/scheduleManagement";
	}
	
	// counselor의 move페이지의 jsp로 forward
	@GetMapping("/cnsMoveController.do")
	public String movePage(@RequestParam String target) {

		log.info("movePage : "+target);

		return "cns/"+target;
	}
	
}
