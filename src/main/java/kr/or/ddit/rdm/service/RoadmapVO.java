package kr.or.ddit.rdm.service;

import java.util.Date;

import lombok.Data;

/**
 * 멤버의 로드맵 정보를 담는 VO(Value Object) 클래스.
 */
@Data
public class RoadmapVO {

	/** 멤버 로드맵 미션 정보 식별 번호 */
	private int roadId;
	
	/** 멤버 식별 번호 */
	private int memId;
	
	/** 로드맵 단계 식별 번호 */
	private int rsId;
	
	/** 로드맵 완료 여부 */
	private String roadComplete;
	
	/** 미션 완료일 */
	private Date completeAt;
	
	/** 미션 수락일 */
	private Date createdAt;
	
	/** 완료 예정일 */
	private Date dueDate;
	
	/** 완료 가능 여부 */
	private boolean isComplete;
}
