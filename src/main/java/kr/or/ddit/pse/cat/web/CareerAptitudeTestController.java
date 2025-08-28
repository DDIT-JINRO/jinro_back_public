package kr.or.ddit.pse.cat.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.pse.cat.service.CareerAptitudeTestService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/pse")
@Slf4j
public class CareerAptitudeTestController {

	@Autowired
	CareerAptitudeTestService careerAptitudeTestService;

	@GetMapping("/cat/careerAptitudeTest.do")
	public String careerAptitudeTestView() {
		return "pse/cat/careerAptitudeTestView";
	}

	@PostMapping("/cat/test/start")
	@ResponseBody
	public String testStart() {

		return "success";
	}

	@PostMapping("/cat/aptiTestSubmit.do")
	@ResponseBody
	public Map<String, Object> testSubmit(@RequestBody Map<String, Object> data,
			@AuthenticationPrincipal String memId) {

		String testNo = data.get("testNo") + "";

		if (!("33".equals(testNo)) && !("34".equals(testNo))) {
			return Map.of("result", careerAptitudeTestService.testSubmit(data, memId));
		} else {
			return Map.of("result", careerAptitudeTestService.testV2Submit(data, memId));
		}

	}

	@PostMapping("/cat/aptiTestSave.do")
	@ResponseBody
	public String testSave(@RequestBody Map<String, Object> data, @AuthenticationPrincipal String memId) {

		String saveRes = careerAptitudeTestService.testSave(data, memId);

		return saveRes;
	}

	@PostMapping("/cat/getSavingTest.do")
	@ResponseBody
	public Map<String, Object> getSavingTest(@RequestBody String qno, @AuthenticationPrincipal String memId) {

		String no = qno.split("=")[0];
		Map<String, Object> savingTest = careerAptitudeTestService.getSavingTest(no, memId);

		return savingTest;

	}

	@PostMapping("/cat/delTempSaveTest.do")
	@ResponseBody
	public void delTempSaveTest(@RequestBody String qno, @AuthenticationPrincipal String memId) {

		String no = qno.split("=")[0];
		careerAptitudeTestService.delTempSaveTest(no, memId);

	}
	
}
