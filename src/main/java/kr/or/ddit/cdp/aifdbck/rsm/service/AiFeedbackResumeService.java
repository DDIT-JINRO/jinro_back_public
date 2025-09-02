package kr.or.ddit.cdp.aifdbck.rsm.service;

import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;

public interface AiFeedbackResumeService {

	// 현재 구독정보가 잇으면 최신 결제 정보(남은 횟수 포함) 가져오기
	public PaymentVO selectLastPaymentInfo(MemberSubscriptionVO currentSub);

	// 횟수 차감 및 AI 피드백을 요청
	public String deductAndGetFeedback(int payId, String html);

	public PaymentVO selectLastMokPaymentInfo(MemberSubscriptionVO memberSubscriptionVO);
}
