package kr.or.ddit.rdm.service;

import lombok.Data;

/**
 * 로드맵 각 단계별 정보를 담는 VO(Value Object) 클래스.
 */
@Data
public class RoadmapStepVO {
	
	/** 로드맵 단계 식별 번호 */
	private int rsId;
	
	/** 로드맵 단계 구분 공통코드 */
	private String rsStep;
	
	/** 로드맵 활동 구분 공통코드 */
	private String rsType;
	
	/** 단계별 미션 이름 */
	private String stepName;
}
