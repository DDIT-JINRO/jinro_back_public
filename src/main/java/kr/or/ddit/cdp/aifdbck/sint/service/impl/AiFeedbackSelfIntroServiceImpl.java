package kr.or.ddit.cdp.aifdbck.sint.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import kr.or.ddit.cdp.aifdbck.sint.service.AiFeedbackSelfIntroService;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import kr.or.ddit.util.apr.service.AiProofreadSelfIntroService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiFeedbackSelfIntroServiceImpl implements AiFeedbackSelfIntroService {

	private final AiFeedbackSelfIntroMapper aiFeedbackSelfIntroMapper;

	private final AiProofreadSelfIntroService aiProofreadSelfIntroService;

	// 현재 구독정보가 잇으면 최신 결제 정보(남은 횟수 포함) 가져오기
	@Override
	public PaymentVO selectLastPaymentInfo(MemberSubscriptionVO currentSub) {

		return aiFeedbackSelfIntroMapper.selectLastPaymentInfo(currentSub);
	}

	// 횟수 차감 및 AI 피드백을 요청
	@Override
	@Transactional
	public String deductAndGetFeedback(int payId, List<Map<String, String>> selfIntroSections) {

		// 1. 횟수 차감 시도
		int updateRows = aiFeedbackSelfIntroMapper.deductCoverLetterCount(payId);

		// 2. 횟수가 부족한 경우
		if (updateRows <= 0) {
			throw new RuntimeException("자기소개서 첨삭 횟수를 모두 사용했습니다.");
		}

		try {
			// ai 피드백 요청
			String feedback = aiProofreadSelfIntroService.proofreadCoverLetter(selfIntroSections);

			return feedback;
		} catch (Exception e) {
			log.error("자소서 AI 피드백 생성 중 서비스 오류 발생. Pay ID: {}", payId, e);

			throw new RuntimeException("AI 피드백을 생성하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
		}
	}

}
