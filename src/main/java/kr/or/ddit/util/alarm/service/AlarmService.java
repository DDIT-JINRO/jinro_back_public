package kr.or.ddit.util.alarm.service;

import java.util.Date;
import java.util.List;

public interface AlarmService {

	/**
	 * 알림테이블에 데이터 삽입
	 * @param alarmVO
	 * @return
	 */
	int insertAlarm(AlarmVO alarmVO);

	/**
	 * 멤버아이디로 특정회원 알림 가져오기
	 * @param memId
	 * @return
	 */
	List<AlarmVO> selectAllByMember(int memId);

	/**
	 * 단일 알림건 읽음 처리
	 * @param alarmId
	 * @return
	 */
	int updateMarkRead(int alarmId);

	/**
	 * 단일 알림건 삭제 처리
	 * @param alarmId
	 * @return
	 */
	int deleteById(int alarmId);

	/**
	 * 전체 알림건 삭제 처리
	 * @param memId
	 * @return
	 */
	int deleteAllByMember(int memId);

	/**
	 * 댓글이 생기거나 좋아요가 발생하면 호출. <br/>
	 * 필요 파라미터 3개<br/>
	 *	private int alarmId;			// X<br/>
	 *	private int memId;				// X<br/>
	 *	private AlarmType alarmTargetType;	// O<br/>알림유형(enum으로 정리해둠)<br/>
	 *	private String alarmContent;	// X<br/>
	 *	private String alarmIsRead;		// X<br/>
	 *	private Date alarmCreatedAt;	// X<br/>
	 *	private int alarmTargetId; 		// O<br/>
	 *	게시글에 댓글 -> 달린 댓글 번호(기본키)<br/>
	 *	댓글에 댓글 -> 달린 대댓글 번호(기본키)<br/>
	 *	게시글에 좋아요 -> 게시글 번호<br/>
	 *	댓글에 좋아요 -> 댓글 번호<br/>
	 *	private String alarmTargetUrl;	// 알림대상url (알림클릭시 이동시킬 url)<br/>
	 *
	 *  자기게시글에 자기가 댓글 단 경우에는 이벤트 발생을 안해야 합니다
	 * @param alarmVO
	 */
	void sendEvent(AlarmVO alarmVO);

	/**
	 * 알림 유형 (alarmTargetType)
	 * 알림 타겟id (alarmTargetId)
	 * 값으로 알림을 받아야할 대상 memId 가져오기
	 * @param alarmVO
	 * @return
	 */
	int getTargetMemId(AlarmVO alarmVO);
}
