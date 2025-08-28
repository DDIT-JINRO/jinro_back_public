package kr.or.ddit.util.alarm.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.util.alarm.service.AlarmVO;

@Mapper
public interface AlarmMapper {

	/**
	 * 알림테이블에 데이터 삽입
	 * @param alarm
	 * @return
	 */
	int insertAlarm(AlarmVO alarm);

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
	 * 게시글에 댓글 -> 알림대상회원번호 가져오기
	 * @param alarmVO
	 * @return
	 */
	int getReplyToBoardTargetMemId(AlarmVO alarmVO);

	/**
	 * 댓글에 댓글 -> 알림대상회원번호 가져오기
	 * @param alarmVO
	 * @return
	 */
	int getReplyToReplyTargetMemId(AlarmVO alarmVO);

	/**
	 * 게시글에 좋아요 -> 알림대상회원번호 가져오기
	 * @param alarmVO
	 * @return
	 */
	int getLikeToBoardTargetMemId(AlarmVO alarmVO);

	/**
	 * 댓글에 좋아요 -> 알림대상회원번호 가져오기
	 * @param alarmVO
	 * @return
	 */
	int getLikeToReplyTargetMemId(AlarmVO alarmVO);

}
