package kr.or.ddit.chat.service;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatMemberVO {
	private int memId;					//	참여자 번호
	private int crId;					//	채팅방 번호
	private String lastReadTime;		//	채팅방에서 마지막 읽음 시각
	private LocalDateTime joinedAt;		//	입장 일시 (입장 시각 이후 부터 채팅을 받아오기 위함)
	private LocalDateTime exitedAt;		//	퇴장 일시
	private String isExited;			//	퇴장 여부

	private Long fileBadge;
	private Long fileProfile;
	private Long fileSub;

	private String fileBadgeStr;
	private String fileProfileStr;
	private String fileSubStr;
}
