package kr.or.ddit.mpg.pay.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentRequestDto;
import kr.or.ddit.mpg.pay.service.PaymentResponseDto;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import kr.or.ddit.mpg.pay.service.SubscriptionVO;
import kr.or.ddit.util.setle.service.IamportApiClient;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

	// private final SelfIntroHistoryController selfIntroHistoryController;

	@Autowired
	private IamportApiClient iamportApiClient;

	@Autowired
	private PaymentMapper paymentMapper;

	@Autowired
	private MemberSubscriptionMapper memberSubscriptionMapper;

	@Autowired
	private PayMemberMapper payMemberMapper;

	@Autowired
	private SubscriptionMapper subscriptionMapper;

	// 회원id을 기반으로 회원정보 조회
	@Override
	public MemberVO selectMemberById(int memId) {
		return payMemberMapper.selectMemberById(memId);
	}

	@Override
	@Transactional
	public PaymentResponseDto verifyAndProcessPayment(PaymentRequestDto requestDto, String loginId) {

		try {
			// 1. 아임포트 서버로부터 실제 결제 정보 조회
			Map<String, Object> paymentData = iamportApiClient.getPaymentInfo(requestDto.getImpUid());

			if (paymentData == null) {
				System.err.println("paymentData is null - impUid: " + requestDto.getImpUid());
				return new PaymentResponseDto("failure", "결제 정보 조회에 실패했습니다.", requestDto.getMerchantUid());
			}

			// 2. 결제 상태가 '결제완료(paid)' 상태인지 검증
			if (!"paid".equals(paymentData.get("status"))) {
				// 금액이 일치하지 않으면 실패 응답 반환
				return new PaymentResponseDto("failure", "결제가 완료되지 않았습니다.", requestDto.getMerchantUid());
			}

			// 디비저장
			// 1. loginId(문자열 "1")를 숫자로 변환합니다.
			int memId = Integer.parseInt(loginId);

			// 2. ID로 회원을 조회합니다. (selectMemberByEmail -> selectMemberById)
			MemberVO loginUser = payMemberMapper.selectMemberById(memId);

			// 혹시 모를 경우를 대비해 Null 체크를 추가하면 더 좋습니다.
			if (loginUser == null) {
				return new PaymentResponseDto("failure", "회원 정보를 찾을 수 없습니다.", requestDto.getMerchantUid());
			}

			// 3. 구독 정보 생성 및 DB 저장
			MemberSubscriptionVO sub = new MemberSubscriptionVO();
			sub.setMemId(loginUser.getMemId());
			sub.setSubId(requestDto.getSubId()); // 선택 상품 ID
			sub.setCustomerUid(requestDto.getCustomerUid()); // 빌링키
			sub.setSubStatus("Y"); // 구독 상태 활성화
			sub.setSubStartDt(new Date()); // 구독 시작일
			sub.setLastPayDt(new Date()); // 마지막 결제 성공일
			sub.setRecurPayCnt(1); // 첫 결제이므로 1회차

			// 다음 결제일(==구독마지막날)을 한 달 뒤로 설정하여 저장합니다.
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.MONTH, 1);
			sub.setSubEndDt(cal.getTime());

			memberSubscriptionMapper.insertMemberSubscription(sub);

			// 4. 결제 정보 생성
			PaymentVO payment = new PaymentVO();
			payment.setImpUid(requestDto.getImpUid());
			payment.setMerchantUid(requestDto.getMerchantUid());
			payment.setMsId(sub.getMsId());

			// 5. 구독 상품에 따라 기능 횟수 설정
			int subId = requestDto.getSubId();
			SubscriptionVO product = subscriptionMapper.selectProductById(subId);
			payment.setPayAmount(product.getSubPrice());

			if (subId == 1) { // BASIC 상품
				payment.setPayResumeCnt(3);
				payment.setPayCoverCnt(3);
				payment.setPayConsultCnt(3);
				payment.setPayMockCnt(3);
			} else if (subId == 2) { // PLUS 상품
				payment.setPayResumeCnt(5);
				payment.setPayCoverCnt(5);
				payment.setPayConsultCnt(5);
				payment.setPayMockCnt(5);
			} else if (subId == 3) { // PRO 상품
				payment.setPayResumeCnt(8);
				payment.setPayCoverCnt(8);
				payment.setPayConsultCnt(8);
				payment.setPayMockCnt(8);
			}

			paymentMapper.insertPayment(payment);

			String successMessage = "";
			successMessage = "결제가 정상적으로 완료되었습니다. 이용해주셔서 감사합니다.";
			return new PaymentResponseDto("success", successMessage, requestDto.getMerchantUid());

		} catch (Exception e) {
			return new PaymentResponseDto("failure", "서버 오류가 발생했습니다.", null);
		}
	}

	// 구독취소
	@Override
	public boolean cancelSubscription(int memId) {
		// 1. 현재 사용자의 활성화된 구독 정보를 DB에서 조회
		MemberSubscriptionVO activeSub = memberSubscriptionMapper.selectByMemberId(memId);

		if (activeSub != null) {
			// 2. 구독 정보가 있다면, 상태를 '취소'로 변경
			int updateResult = memberSubscriptionMapper.updateStatusToCancelled(activeSub.getMsId());
			return updateResult > 0;
		}

		// 취소할 구독이 없는 경우
		return false;
	}

	// 마이페이지에서 사용할 사용자의 구독정보 조회
	@Override
	public MemberSubscriptionVO selectByMemberId(int memid) {
		return memberSubscriptionMapper.selectByMemberId(memid);
	}

	// 전체 결제 내역 조회 (구독 결제 내역 표시)
	@Override
	public List<PaymentVO> selectPaymentHistory(int memId) {
		return paymentMapper.selectPaymentHistory(memId);
	}

	// 구독 변경
	@Override
	@Transactional
	public boolean changeSubscription(int memId, int newSubId) {
		// 1. 현재 사용자의 활성화된 구독 정보를 조회합니다
		MemberSubscriptionVO memberSubscriptionVO = memberSubscriptionMapper.selectByMemberId(memId);

		// 2. 기존 구독의 자동 갱신 중단
		memberSubscriptionMapper.updateStatusToCancelled(memberSubscriptionVO.getMsId());

		// 3. 새로 구독할 상품 정보를 담을 새 MemberSubscriptionVO 객체를 만듭니다.
		MemberSubscriptionVO newSub = new MemberSubscriptionVO();
		newSub.setMemId(memId);
		newSub.setSubId(newSubId); // 사용자가 새로 선택한 상품 ID
		newSub.setCustomerUid(memberSubscriptionVO.getCustomerUid()); // 빌링키는 그대로 사용
		newSub.setSubStatus("Y"); // 새 구독은 활성 상태
		newSub.setRecurPayCnt(0);
		// 새구독의 시작일/다음결제일/마지막결제일을 기존 구독의 종료일로 설정
		newSub.setSubStartDt(memberSubscriptionVO.getSubStartDt());
		newSub.setSubEndDt(memberSubscriptionVO.getSubEndDt());
		newSub.setLastPayDt(memberSubscriptionVO.getLastPayDt());

		// 새로운 구독정보를 db에 insert
		int insertResult = memberSubscriptionMapper.insertNewSubscription(newSub);

		return insertResult > 0;
	}

	@Override
	public MemberSubscriptionVO findReservedSubscription(int memId) {
		return memberSubscriptionMapper.findReservedSubscriptionByMemberId(memId);
	}

	// 변경예약구독취소
	@Override
	@Transactional
	public boolean cancelSubscriptionChange(int memId) {
		// 1. 예약된 구독 정보 조회 (RECUR_PAY_CNT = 0)
		MemberSubscriptionVO reservedSub = memberSubscriptionMapper.findReservedSubscriptionByMemberId(memId);

		 if (reservedSub != null) {
		        // 2. 예약된 구독은 DB에서 삭제
		        memberSubscriptionMapper.deleteSubscriptionById(reservedSub.getMsId());

		        // 3. 이전에 취소했던 원래 구독 정보 조회
		        MemberSubscriptionVO originalSub = memberSubscriptionMapper.findCancelledOriginalSubscription(memId);

		        // 4. 되살릴 원래 구독이 있다면, 상태를 'Y'로 복원
		        if (originalSub != null) {
		            memberSubscriptionMapper.reactivateSubscriptionById(originalSub.getMsId());
		        }

		        return true; // 예약 건 삭제에 성공했으므로 true 반환
		    }

		return false;
	}

	// 구독 월간 기능 횟수 초기화
	@Override
	public void resetMonthlyUsageCounts() {
		paymentMapper.resetUsageCounts();
	}

	// 스케줄러가 호출할 정기결제 메서드
	@Override
	@Transactional
	public void processScheduledPayments() {
		// 1. 오늘 결제해야 할 구독 목록을 DB에서 조회
		List<MemberSubscriptionVO> dueSubscriptions = this.memberSubscriptionMapper.findSubscriptionsDueForToday();

		for (MemberSubscriptionVO memberSubscriptionVO : dueSubscriptions) {
			try {
				// 2. 이번 결제를 위한 새로운 주문번호 생성
				String newMerchantUid = "sub_due_" + memberSubscriptionVO.getMsId() + "_" + System.currentTimeMillis();

				double amount = memberSubscriptionVO.getSubPrice(); // TODO: sub 정보에 맞는 실제 상품 가격 조회
				String productName = "월간 구독 자동결제";

				// 3. IamportApiClient의 payAgain 메서드 호출
				Map<String, Object> result = iamportApiClient.payAgain(memberSubscriptionVO.getCustomerUid(), // DB에 저장된 빌링키
						newMerchantUid, amount, productName);

				if (result != null && "paid".equals(result.get("status"))) {
					// 4. 결제 성공 시 DB 업데이트
					// 새 결제 내역 저장
					PaymentVO payment = new PaymentVO();
					payment.setMsId(memberSubscriptionVO.getMsId());
					payment.setImpUid((String) result.get("imp_uid"));
					payment.setMerchantUid(newMerchantUid);
					payment.setPayAmount(amount);

					// 5. 구독 상품에 따라 기능 횟수 설정
					int subId = memberSubscriptionVO.getSubId();
					if (subId == 1) { // BASIC 상품
						payment.setPayResumeCnt(3);
						payment.setPayCoverCnt(3);
						payment.setPayConsultCnt(3);
						payment.setPayMockCnt(3);
					} else if (subId == 2) { // PLUS 상품
						payment.setPayResumeCnt(5);
						payment.setPayCoverCnt(5);
						payment.setPayConsultCnt(5);
						payment.setPayMockCnt(5);
					} else if (subId == 3) { // PRO 상품
						payment.setPayResumeCnt(8);
						payment.setPayCoverCnt(8);
						payment.setPayConsultCnt(8);
						payment.setPayMockCnt(8);
					}

					this.paymentMapper.insertPayment(payment);

					// 구독 정보 업데이트 (다음 결제일, 결제 횟수 등)
					this.memberSubscriptionMapper.updateAfterRecurringPayment(memberSubscriptionVO.getMsId());

				} else {
					// 5. 결제 실패 시
					System.err.println("구독 ID " + memberSubscriptionVO.getMsId() + " 정기결제 실패.");
					// 구독 상태를 '미납(UNPAID)' 등으로 변경하는 로직 추가
				}

			} catch (Exception e) {
				System.err.println("구독 ID " + memberSubscriptionVO.getMsId() + " 처리 중 예외 발생: " + e.getMessage());
			}
		}
	}

	//내일이 결제일인 구독 목록을 DB에서 조회
	@Override
	public List<MemberSubscriptionVO> findSubscriptionsDueTomorrow() {
		// TODO Auto-generated method stub
		return memberSubscriptionMapper.findSubscriptionsDueTomorrow();
	}

	@Override
	public boolean minusPayMockCnt(String memId) {
		try {
			int memIdInt =Integer.parseInt(memId);
			// 회원번호로 구독정보
			MemberSubscriptionVO subs = selectByMemberId(memIdInt);
			// 구독정보로 결제정보
			PaymentVO paymentVO = paymentMapper.selectLastSubcription(subs);
			// 결제정보로
			return paymentMapper.minusPayMockCnt(paymentVO.getPayId()) > 0 ? true : false;
		} catch (Exception e) {
			log.error("모의면접 구독 횟수 차감중 오류 발생 : "+e.getMessage());
			return false;
		}
	}
}
