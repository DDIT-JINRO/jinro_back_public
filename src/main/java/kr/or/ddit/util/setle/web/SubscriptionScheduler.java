package kr.or.ddit.util.setle.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentService;
import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;

@Component
public class SubscriptionScheduler {


	@Autowired
	private PaymentService paymentService;
	
	@Autowired
	private AlarmService alarmService;

	// 정기결제를 위한 스케줄러
	// 매일 새벽0시에 실행 (서버 부하가 적은 시간)
	@Scheduled(cron = "0 0 0 * * *") // 매일0시
	public void scheduleDailyPayments() {
		paymentService.processScheduledPayments();

	}

	// 구독기간이 지난 기능 초기화를 위한 스케줄러
	@Scheduled(cron = "0 0 1 * * *") // 매일 1시
	// @Scheduled(cron = "0 0/1 * * * *") //1분마다
	public void resetMonthlyCounts() {

		paymentService.resetMonthlyUsageCounts();

	}
	
	// 매일 자정에 실행되는 결제일 임박 알림 스케줄러
	@Scheduled(cron = "0 0 0 * * *") // 매일0시
	public void notifyPaymentDue() {
		
		//1 내일이 결제일인 구독 목록을 DB에서 조회
		List<MemberSubscriptionVO> dueTomorrow = paymentService.findSubscriptionsDueTomorrow();
		
		for(MemberSubscriptionVO memberSubscriptionVO : dueTomorrow) {
			AlarmVO alarmVO = new AlarmVO();
			alarmVO.setMemId(memberSubscriptionVO.getMemId());
			alarmVO.setAlarmTargetType(AlarmType.SUBSCRIPTION_PAYMENT_DUE);
			alarmVO.setAlarmTargetId(memberSubscriptionVO.getMsId()); // 대상 ID는 구독 ID
			alarmVO.setAlarmTargetUrl("/mpg/pay/selectPaymentView.do");
			
			alarmService.sendEvent(alarmVO);
		}
	}
}