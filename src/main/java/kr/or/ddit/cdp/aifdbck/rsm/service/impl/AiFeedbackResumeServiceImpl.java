package kr.or.ddit.cdp.aifdbck.rsm.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.cdp.aifdbck.rsm.service.AiFeedbackResumeService;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import kr.or.ddit.util.apr.service.AiProofreadResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiFeedbackResumeServiceImpl implements AiFeedbackResumeService {

	private final AiFeedbackResumeMapper aiFeedbackResumeMapper;

	private final AiProofreadResumeService aiProofreadResumeService;

	// 현재 구독정보가 잇으면 최신 결제 정보(남은 횟수 포함) 가져오기
	@Override
	public PaymentVO selectLastPaymentInfo(MemberSubscriptionVO currentSub) {

		return aiFeedbackResumeMapper.selectLastPaymentInfo(currentSub);
	}

	// 횟수 차감 및 AI 피드백을 요청
	@Override
	@Transactional
	public String deductAndGetFeedback(int payId, String html) {
		// 1. 횟수 차감 시도
		int updatedRows = aiFeedbackResumeMapper.deductAndGetFeedback(payId);

		// 2. 횟수가 부족한 경우
		if (updatedRows <= 0) {
			throw new RuntimeException("이력서 첨삭 횟수를 모두 사용했습니다.");
		}

		try {
			// ai피드백 요청
			String feedback = aiProofreadResumeService.proofreadResume(html);
			return feedback;
		} catch (Exception e) {
			log.error("AI 피드백 생성 중 서비스 오류 발생. Pay ID: {}", payId, e);

			throw new RuntimeException("AI 피드백을 생성하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
		}
	}

}
