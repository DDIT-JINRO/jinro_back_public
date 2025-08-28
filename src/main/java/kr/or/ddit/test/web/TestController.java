package kr.or.ddit.test.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.test.service.TestService;
import kr.or.ddit.test.service.TestVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/test")
@Slf4j
@RestController
public class TestController {
	
	@Autowired
	TestService testService;
	
	@GetMapping("/select")
	public String testController () {
		
		log.info("asdf");
		
		System.out.println("dd11");
		
		List<TestVO> testVoList = testService.test();
		
		return testVoList.toString();
		
	}
	
}
