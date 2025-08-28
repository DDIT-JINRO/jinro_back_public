package kr.or.ddit.prg.ctt.service;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class ContestVO {

	private String contestId; // 공모전번호
	private String contestTitle; // 제목
	private String contestGubunCode; // 공모전구분코드(G25001 등)
	private String contestGubunName; // 공모전구분명(공모전, 봉사활동, 서포터즈, 인턴십)
	private String contestDescription; // 설명
	private String contestType; // 공모전분류 코드 (G35001 등)
	private String contestTypeName; // 공모전분류명 (건축, 게임/소프트웨어 등)
	private String contestTarget; // 모집 대상 코드 (G34001 등)
	private String contestTargetName; // 모집 대상명 (전체, 청소년, 청년 등)
	private Date contestStartDate; // 시작일
	private Date contestEndDate; // 종료일
	private Date contestCreatedAt; // 게시일
	private int contestRecruitCount; // 조회수
	private String contestUrl; // 원본 URL
	private Long fileGroupId; // 이미지 파일 그룹 ID
	private String contestHost; // 주최
	private String contestOrganizer; // 주관
	private String contestSponsor; // 후원사
	private String applicationMethod; // 접수방법
	private String awardType; // 시상종류

	// 가공된 상세 설명을 담을 리스트
	private List<String> descriptionSections;
	private String rnum;
	
	private String savePath;

	// 필터조건
	private String keyword;

	// HighSchoolVO의 필터 방식을 참고하여 List<String> 타입의 필터 변수 추가
	private List<String> contestStatusFilter;
	private List<String> contestGubunFilter;
	private List<String> contestTargetFilter;
	private List<String> contestTypeFilter;
	private String sortOrder; // d-day 정렬기준

	// 페이징
	private int currentPage;
	private int size = 6;
	private int startRow;
	private int endRow;

	public int getStartNo() {
		return (this.currentPage - 1) * size;
	}

	public int getEndNo() {
		return this.currentPage * size;
	}
}