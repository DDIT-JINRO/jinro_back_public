package kr.or.ddit.util.alarm.service.impl;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;

@Service
public class AlarmServiceImpl implements AlarmService {

	@Autowired
	AlarmMapper alarmMapper;

	@Autowired
	AlarmEmitterManager emitterManager;

	@Override
	public int insertAlarm(AlarmVO alarmVO) {
		return this.alarmMapper.insertAlarm(alarmVO);
	}

	@Override
	public List<AlarmVO> selectAllByMember(int memId) {
		List<AlarmVO> list = this.alarmMapper.selectAllByMember(memId);
		for (AlarmVO vo : list) {
			String str = getAlarmCreateTimeGapStr(vo.getAlarmCreatedAt());
			vo.setDisplayTime(str);
		}
		return list;
	}

	@Override
	public int updateMarkRead(int alarmId) {
		return this.alarmMapper.updateMarkRead(alarmId);
	}

	@Override
	public int deleteById(int alarmId) {
		return this.alarmMapper.deleteById(alarmId);
	}

	@Override
	public int deleteAllByMember(int memId) {
		return this.alarmMapper.deleteAllByMember(memId);
	}

	@Override
	public void sendEvent(AlarmVO alarmVO) {
		// 알림 내용 설정
		int targetMemId = alarmVO.getMemId();
		if (targetMemId == 0) {
			targetMemId = getTargetMemId(alarmVO);
		}
		String content = createContent(alarmVO.getAlarmTargetType());
		alarmVO.setMemId(targetMemId);
		alarmVO.setAlarmContent(content);
		if (alarmVO.getAlarmIsRead() == null) {
			alarmVO.setAlarmIsRead("N");
		}
		// DB에 저장.
		this.alarmMapper.insertAlarm(alarmVO);

		String displayTime = getAlarmCreateTimeGapStr(new Date());
		alarmVO.setDisplayTime(displayTime);
		// alarm 대상 꺼내서 emitter에서 확인
		SseEmitter sseEmitter = this.emitterManager.getEmitter(targetMemId);
		// 있으면 전송
		if (sseEmitter != null) {
			try {
				sseEmitter.send(SseEmitter.event().name("alarm").data(alarmVO).build());
			} catch (IOException e) {
				// 클라이언트의 EventSource 객체와 sseEmitter 연결이 끊겨서
				// 가지고 있는 객체가 send 할 수 없을경우 에러 발생
				// sseEmitter를 종료시킴.
				saveComplete(sseEmitter);
				emitterManager.getConnectedEmitterMap().remove(sseEmitter);
			} catch (Exception e) {
			}
		}
	}

	private void saveComplete(SseEmitter emitter) {
		try {
			emitter.complete();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String createContent(AlarmType type) {
		switch (type) {
		case REPLY_TO_BOARD:
			return "게시글에 새 댓글이 달렸습니다";
		case REPLY_TO_REPLY:
			return "댓글에 새 댓글이 달렸습니다";
		case LIKE_TO_BOARD:
			return "게시글에 좋아요가 눌렸습니다";
		case LIKE_TO_REPLY:
			return "댓글에 좋아요가 눌렸습니다";
		case REPLY_TO_CONTACT:
			return "문의에 대한 답변이 도착했습니다.";
		case DEADLINE_HIRE:
			return "채용공고 마감 임박!!";
		case REPLY_TO_PENALTY:
			return "정책 위반에 대한 경고를 받았습니다.";
        case SUBSCRIPTION_PAYMENT_DUE:
            return "내일 정기결제가 예정되어 있습니다.";
		default:
			throw new IllegalArgumentException("정의되지 않은 알림 유형 : " + type);
		}
	}

	@Override
	public int getTargetMemId(AlarmVO alarmVO) {
		AlarmType type = alarmVO.getAlarmTargetType();

		// 타입이 REPLY_TO_BOARD REPLY테이블, BOARD테이블, 조인해서 BOARD테이블의 memId 챙겨오기
		// 타입이 REPLY_TO_REPLY REPLY테이블에서 부모REPLY의 memId 챙겨오기
		// 타입이 LIKE_TO_BOARD BOARD_LIKE테이블과 BOARD테이블 JOIN해서 BOARD테이블의 memId 챙겨오기
		// 타입이 LIKE_TO_REPLY REPLY_LIKE테이블과 REPLY테이블 JOIN해서 REPLY테이블의 memId 챙겨오기
		switch (type) {
		case REPLY_TO_BOARD:
			return this.alarmMapper.getReplyToBoardTargetMemId(alarmVO);
		case REPLY_TO_REPLY:
			return this.alarmMapper.getReplyToReplyTargetMemId(alarmVO);
		case LIKE_TO_BOARD:
			return this.alarmMapper.getLikeToBoardTargetMemId(alarmVO);
		case LIKE_TO_REPLY:
			return this.alarmMapper.getLikeToReplyTargetMemId(alarmVO);
		default:
			throw new IllegalArgumentException("정의되지 않은 알림 유형 : " + type);
		}
	}

	private String getAlarmCreateTimeGapStr(Date alarmCreatedAt) {

		long now = new Date().getTime();
		long createdAt = alarmCreatedAt.getTime();

		long gapOfMills = now - createdAt;
		long gapOfSec = gapOfMills / 1000;
		long gapOfMin = gapOfSec / 60;
		long gapOfHour = gapOfMin / 60;
		long gapOfDay = gapOfHour / 24;

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		if (gapOfDay > 0) {
			return sdf.format(alarmCreatedAt);
		} else if (gapOfHour > 0) {
			return gapOfHour + "시간 전";
		} else if (gapOfMin > 0) {
			return gapOfMin + "분 전";
		} else {
			return "방금 전";
		}
	}

}
