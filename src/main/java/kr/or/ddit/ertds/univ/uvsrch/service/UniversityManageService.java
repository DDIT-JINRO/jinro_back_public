package kr.or.ddit.ertds.univ.uvsrch.service;

import java.util.List;

import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO.DeptInfo;
import kr.or.ddit.util.ArticlePage;

public interface UniversityManageService {

	// 대학 관련 메서드
	int updateUniversity(UniversityVO universityVO);

	int deleteUniversity(int univId);

	UniversityVO selectUniversityById(int univId);

	// 학과 관련 메서드
	int updateDepartment(DeptInfo deptInfo);

	int deleteDepartment(int udId);

	int deleteDepartmentsByUnivId(int univId);

	DeptInfo selectDepartmentById(int udId);
	
    // 대학 목록 조회 (페이징)
	ArticlePage<UniversityVO> getUniversityList(UniversityVO universityVO);

	List<DeptInfo> selectUniversityDeptList(int univId);

}
