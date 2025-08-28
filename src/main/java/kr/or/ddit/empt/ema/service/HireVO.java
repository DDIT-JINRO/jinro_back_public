package kr.or.ddit.empt.ema.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class HireVO {
	private int hireId;
	private int cpId;
	private String hireTitle;
	private String hireDescription;
	private String hireType;
	private Date hireStartDate;
	private Date hireEndDate;
	private String hireUrl;
	private String hireClassCode;

	// 새로 받는 값
	private String cpName; // 회사이름
	private String cpRegion; // 지역이름
	private String hireTypename;// 고용형태 값
	private String hireClassCodeName; // 직업대분류
	private long dday;
	private int memId;

	// 필터링
	private String keyword; // 검색어 (제목 또는 기업명)
	private List<String> hireTypeNames; // 채용 유형 (체크박스)
	private List<String> hireClassCodeNames; // 직업대분류구분 (체크박스)
	private List<String> regions; // 지역 (체크박스)

	// 페이징
	private int currentPage;
	private int size = 5;
	private int startNo;
	private int endNo;

	private String cpHiringStatus;
	private String sortOrder;

	// D-day를 계산하여 반환하는 getter 메서드
	public long getDday() {
		if (this.hireEndDate == null) {
			return Long.MAX_VALUE;
		}

		LocalDate today = LocalDate.now();
		// java.util.Date를 LocalDate로 안전하게 변환
		LocalDate endDate = this.hireEndDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

		return ChronoUnit.DAYS.between(today, endDate);
	}

	public int getStartNo() {
		this.currentPage = (this.currentPage < 1) ? 1 : this.currentPage;
		return (this.currentPage - 1) * size;
	}

	public int getEndNo() {
		this.currentPage = (this.currentPage < 1) ? 1 : this.currentPage;
		return this.currentPage * size;
	}

}
