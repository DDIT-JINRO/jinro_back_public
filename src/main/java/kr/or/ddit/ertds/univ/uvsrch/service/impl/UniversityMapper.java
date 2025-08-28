package kr.or.ddit.ertds.univ.uvsrch.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO.DeptInfo;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;

@Mapper
public interface UniversityMapper {

	// 기존 조회 관련 메서드
	List<UniversityVO> selectUniversityList(UniversityVO universityVO);

	int selectUniversityTotalCount(UniversityVO universityVO);

	List<ComCodeVO> selectCodeVOUniversityTypeList();

	List<ComCodeVO> selectCodeVOUniversityGubunList();

	List<ComCodeVO> selectCodeVORegionList();

	List<BookMarkVO> selectBookMarkVO(BookMarkVO bookMarkVO);

	int selectUnivDeptCount(int univId);

	UniversityDetailVO selectUniversityDetailInfo(int univId);

	List<UniversityDetailVO.DeptInfo> selectUniversityDeptStats(int univId);

	// CRUD 메서드
	// 대학 관련
	int updateUniversity(UniversityVO universityVO);

	int deleteUniversity(int univId);

	UniversityVO selectUniversityById(int univId);

	// 학과 관련
	int updateDepartment(DeptInfo deptInfo);

	int deleteDepartment(int udId);

	int deleteDepartmentsByUnivId(int univId);

	DeptInfo selectDepartmentById(int udId);
	
	List<DeptInfo> selectUniversityDeptList(int univId);
}
