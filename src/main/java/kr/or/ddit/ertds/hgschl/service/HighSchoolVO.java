package kr.or.ddit.ertds.hgschl.service;

import java.util.List;

import lombok.Data;

@Data
public class HighSchoolVO {
	private int hsId;
	private String hsCode; // 학교코드
	private String hsName; // 학교명
	private String hsRegion; // 시도명
	private String hsFoundType; // 설립유형
	private String hsZipcode; // 우편번호
	private String hsAddr; // 기본주소
	private String hsAddrDetail; // 상세주소
	private String hsTel; // 전화번호
	private String hsHomepage; // 홈페이지 URL
	private String hsCoeduType; // 남녀공학 구분
	private String hsTypeName; // 학교 종류
	private String hsGeneralType; // 일반계/전문계
	private String hsFoundDate; // 설립일자
	private String hsAnnivAt; // 개교기념일
	private Double hsLat; // 위도
	private Double hsLot; // 경도

	// --- 코드를 담는 필드 (INSERT/UPDATE/FILTER 시 사용) ---
	private String hsRegionCode; // 예: "G23001"
	private String hsJurisCode; // 관할 교육청 코드
	private String hsFoundTypeCode; // 예: "G21001"
	private String hsCoeduTypeCode; // 예: "G24001"
	private String hsTypeNameCode; // 예: "G25001"
	private String hsGeneralTypeCode;
	// 필터조건
	// 검색
	private String keyword;

	private String sortOrder;

	// CEG-D02-004: 지역별 필터
	private List<String> regionFilter;

	// CEG-D02-005: 학교 종류 필터
	private List<String> schoolType;

	// CEG-D02-007: 남/녀/공학 필터
	private List<String> coedTypeFilter;

	// 페이징
	private int startRow;
	private int endRow;

}
