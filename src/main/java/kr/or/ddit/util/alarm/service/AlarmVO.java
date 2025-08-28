package kr.or.ddit.util.alarm.service;

import java.util.Date;

import lombok.Data;

@Data
public class AlarmVO {
	private int alarmId;			// 알림번호
	private int memId;				// 회원번호(알림받을 대상)
	private AlarmType alarmTargetType;	// 알림유형(공통코드)
	private String alarmContent;	// 알림메시지,내용
	private String alarmIsRead;		// 알림읽음 여부. 삭제처리는 delete
	private Date alarmCreatedAt;	// 알림생성일시
	private int alarmTargetId;		// 알림대상번호
	private String alarmTargetUrl;	// 알림대상url (알림클릭시 이동시킬 url)

	// 화면단으로 넘겨줄 때 출력할 시간정보를 가져가는 용도
	private String displayTime;
}

