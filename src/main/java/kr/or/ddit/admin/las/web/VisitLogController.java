package kr.or.ddit.admin.las.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.las.service.VisitLogService;

@RestController
@RequestMapping("/admin")
public class VisitLogController {

	@Autowired
	VisitLogService visitLogService;

	@PostMapping("/las/roadMapVisitLog.do")
	public void roadMapVisitLog(@AuthenticationPrincipal String memId) {
		visitLogService.insertPageLog(memId, "로드맵", "/roadmap", null);
	}

	@PostMapping("/las/worldCupVisitLog.do")
	public void worldCupVisitLog(@AuthenticationPrincipal String memId) {
		visitLogService.insertPageLog(memId, "월드컵", "/worldcup", null);
	}

	@PostMapping("/las/chatVisitLog.do")
	public void chatVisitLog(@AuthenticationPrincipal String memId) {
		visitLogService.insertPageLog(memId, "채팅", "/chat", null);
	}

	@PostMapping("/las/aiResumeVisitLog.do")
	public void aiResumeVisitLog(@AuthenticationPrincipal String memId) {
		visitLogService.insertPageLog(memId, "이력서AI요청", "/aiResume", null);
	}

	@PostMapping("/las/aiSelfIntroVisitLog.do")
	public void aiSelfIntroVisitLog(@AuthenticationPrincipal String memId) {
		visitLogService.insertPageLog(memId, "자기소개서AI요청", "/aiSelfIntro", null);
	}

	@PostMapping("/las/aiImitaionInterviewVisitLog.do")
	public void aimitaionInterviewVisitLog(@AuthenticationPrincipal String memId) {
		visitLogService.insertPageLog(memId, "모의면접", "/aiImitaionInterview", null);
	}

	@PostMapping("/las/careerAptitudeTest.do")
	public void careerAptitudeTest(@AuthenticationPrincipal String memId, @RequestBody Map<String, Object> param) {
		int type = (int) param.get("type");
		String title = (String) param.get("title");
		String plTitle = "심리검사"+"-"+type+"-"+title;
		visitLogService.insertPageLog(memId, plTitle, "/careerAptitudeTest", null);
	}

	@PostMapping("/las/aiCounselVisitLog.do")
	public void aiCounselVisitLog(@AuthenticationPrincipal String memId, @RequestBody Map<String, Object> param) {
		String cnsType = (String) param.get("cnsType");
		// 상담목적코드같이 기록
		// G07001:취업상담, G07002:학업상담, G07003:심리상담
		String plTitle = "AI상담"+"-"+cnsType;
		visitLogService.insertPageLog(memId, plTitle, "/aiCounseling", null);
	}

}
