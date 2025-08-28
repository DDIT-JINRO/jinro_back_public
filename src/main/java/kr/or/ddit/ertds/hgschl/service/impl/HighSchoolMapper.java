package kr.or.ddit.ertds.hgschl.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.hgschl.service.HighSchoolDeptVO;
import kr.or.ddit.ertds.hgschl.service.HighSchoolVO;

@Mapper
public interface HighSchoolMapper {
	// 모든 고등학교 정보를 조회하는 메서드 (주소 포함)
	public List<HighSchoolVO> highSchoolList(HighSchoolVO highSchoolVO);

	// 특정 고등학교 상세 정보를 조회
	public HighSchoolVO highSchoolDetail(@Param("hsId") int hsId);

	// 전체 개수를 조회
	public int selectHighSchoolCount(HighSchoolVO highSchoolVO);

	// 지역 필터 옵션 목록 조회
	public List<ComCodeVO> selectRegionList();

	// 학교 유형 필터 옵션 목록 조회
	public List<ComCodeVO> selectSchoolTypeList();

	// 공학 여부 필터 옵션 목록 조회
	public List<ComCodeVO> selectCoedTypeList();

	// 특정 고등학교의 학과 목록 조회
	public List<HighSchoolDeptVO> selectDeptsBySchoolId(int hsId);

	// 고등학교 정보 논리적 삭제
	public int highSchoolDelete(int hsId);

	// 학과 정보 논리적 삭제
	public int highSchoolDeptDelete(int hsdId);

	// 고등학교 정보 입력
	public int highSchoolInsert(HighSchoolVO highSchoolVO);

	// 고등학교 학과 입력
	public int highSchoolDeptInsert(HighSchoolDeptVO highSchoolDeptVO);

	// 고등학교 정보 수정
	public int highSchoolUpdate(HighSchoolVO highSchoolVO);

	// 고등학교 학과 수정
	public int highSchoolDeptUpdate(HighSchoolDeptVO highSchoolDeptVO);

	// 공통 코드를 이름과 분류코드로 조회
	public ComCodeVO selectCommonCodeByCcNameAndClCode(@Param("ccName") String ccName, @Param("clCode") String clCode);

	// 모든 공통 코드를 조회 (캐싱 로직에 필요)
	public List<ComCodeVO> selectAllCommonCodes();

	// 관할 교육청 코드를 이름으로 조회
	String selectJurisCodeByRegionName(@Param("regionName") String regionName);
}
