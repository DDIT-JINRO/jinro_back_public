package kr.or.ddit.chat.service;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatReceiverVO {
	private int msgId;				// 메시지번호
	private int receiverId;			// 수신자번호
	private LocalDateTime readAt;	// 읽음 시각
	
	// 안읽은 갯수 조회용
	private int crId;
	private int unreadCnt;
}
