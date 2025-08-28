package kr.or.ddit.cnslt.aicns.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.or.ddit.cnslt.aicns.service.AICounselingService;
import kr.or.ddit.cnslt.resve.crsv.service.CounselingReserveService;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.mpg.pay.service.PaymentVO;

@Service
public class AICounselingServiceImpl implements AICounselingService{

	@Autowired
	private CounselingReserveService counselingReserveService;

	@Autowired
	private PaymentService paymentService;

	@Override
	public Map<String, Object> aicnsPopUpStart(HttpSession session, Map<String, Object> param){
		String topic = (String) param.get("topic");
		String topicKr = null;
		switch (topic) {
		case "MIND": {
			topicKr = "심리상담";
			break;
		}
		case "JOB": {
			topicKr = "취업상담";
			break;
		}
		case "STUDY": {
			topicKr = "학업상담";
			break;
		}
		default:
			throw new IllegalArgumentException("Unexpected value: " + topic);
		}

		session.setAttribute("topic", topic);
		session.setAttribute("topicKr", topicKr);

		Map<String, Object> responseData = new HashMap<>();
		String sessionId = session.getId();
		responseData.put("ok", true);
		responseData.put("message", "success");
		responseData.put("sessionId", sessionId);
		responseData.put("popupUrl", "/cnslt/aicns/aicnsPopUp?sid="+sessionId);

		return responseData;
	}

	@Override
	public String validateForStartAICns(String sid, String memId, HttpSession session, HttpServletRequest req) {
		String sessionId = session.getId();
		if(!sessionId.equals(sid) || memId==null || "anonymousUser".equals(memId)) {
			return "잘못된 접근입니다";
		}
		String referer = req.getHeader("Referer");
		if(referer==null || !referer.contains("/cnslt/aicns/aicns.do")) {
			return "비정상적인 경로입니다";
		}

		// 접근방식 및 요청경로체크 후 횟수 차감시도
		MemberSubscriptionVO currentSub = paymentService.selectByMemberId(Integer.parseInt(memId));
		PaymentVO paymentVO = counselingReserveService.selectLastSubcription(currentSub);
		int cnt = counselingReserveService.minusPayConsultCnt(paymentVO.getPayId());
		if(cnt <= 0) {
			return "상담가능 잔여횟수가 없습니다";
		}

		return null;
	}

}
