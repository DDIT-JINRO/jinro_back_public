package kr.or.ddit.util.alarm.service;

public enum AlarmType {
	REPLY_TO_BOARD("G28001"),	// 게시글에 새 댓글
	REPLY_TO_REPLY("G28002"),	// 댓글에 새 댓글
	LIKE_TO_BOARD("G28003"),	// 게시글에 좋아요
	LIKE_TO_REPLY("G28004"),	// 댓글에 좋아요
	REPLY_TO_CONTACT("G28005"), // 문의사항 답변
	DEADLINE_HIRE("G28006"),	// 채용공고 마감
	REPLY_TO_PENALTY("G28007"), // 경고 제재 알림  
	SUBSCRIPTION_PAYMENT_DUE("G28008");   // 정기결제일 임박 알림

	
	private final String code; 
	
	AlarmType(String code) {
		this.code = code;
	}
	
	public String getCode() {
		return this.code;
	}
	
	public static AlarmType fromCode(String code) {
		for(AlarmType type : values()) {
			if(type.code.equals(code)) {
				return type;
			}
		}
		throw new IllegalArgumentException("잘못된 코드 입력값 : "+code);
	}
}
