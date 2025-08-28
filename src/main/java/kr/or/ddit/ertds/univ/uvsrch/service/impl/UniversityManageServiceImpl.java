package kr.or.ddit.ertds.univ.uvsrch.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO.DeptInfo;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityManageService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.util.ArticlePage;

@Service
public class UniversityManageServiceImpl implements UniversityManageService {

	@Autowired
	UniversityMapper universityMapper;
	
	@Override
	public ArticlePage<UniversityVO> getUniversityList(UniversityVO universityVO) {
	    
	    List<UniversityVO> universityList = universityMapper.selectUniversityList(universityVO);
	    
	    int total = universityMapper.selectUniversityTotalCount(universityVO);
	    
	    return new ArticlePage<UniversityVO>(total, universityVO.getCurrentPage(), universityVO.getSize(), universityList,
	            universityVO.getKeyword(),10);
	}

	@Override
	public int updateUniversity(UniversityVO universityVO) {
		return universityMapper.updateUniversity(universityVO);
	}

	@Override
	@Transactional
	public int deleteUniversity(int univId) {
		universityMapper.deleteDepartmentsByUnivId(univId);
		return universityMapper.deleteUniversity(univId);
	}

	@Override
	public UniversityVO selectUniversityById(int univId) {
		return universityMapper.selectUniversityById(univId);
	}

	@Override
	public int updateDepartment(DeptInfo deptInfo) {
		return universityMapper.updateDepartment(deptInfo);
	}

	@Override
	public int deleteDepartment(int udId) {
		return universityMapper.deleteDepartment(udId);
	}

	@Override
	public int deleteDepartmentsByUnivId(int univId) {
		return universityMapper.deleteDepartmentsByUnivId(univId);
	}

	@Override
	public DeptInfo selectDepartmentById(int udId) {
		return universityMapper.selectDepartmentById(udId);
	}

	@Override
	public List<DeptInfo> selectUniversityDeptList(int univId) {
		return universityMapper.selectUniversityDeptList(univId);
	}

}
