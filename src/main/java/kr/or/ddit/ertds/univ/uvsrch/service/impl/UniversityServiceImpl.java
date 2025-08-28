package kr.or.ddit.ertds.univ.uvsrch.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UniversityServiceImpl implements UniversityService {

	@Autowired
	UniversityMapper universityMapper;

	@Override
	public List<UniversityVO> selectUniversityList(UniversityVO universityVO) {
		List<UniversityVO> list = this.universityMapper.selectUniversityList(universityVO);
		int deptCount = 0;
		for (UniversityVO univ : list) {
			deptCount = this.universityMapper.selectUnivDeptCount(univ.getUnivId());
			univ.setDeptCount(deptCount);
		}
		return list;
	}

	@Override
	public int selectUniversityTotalCount(UniversityVO universityVO) {
		return this.universityMapper.selectUniversityTotalCount(universityVO);
	}

	@Override
	public List<BookMarkVO> selectBookMarkVO(BookMarkVO bookmarkVO) {
		return this.universityMapper.selectBookMarkVO(bookmarkVO);
	}

	@Override
	public List<ComCodeVO> selectCodeVOUniversityTypeList() {
		return this.universityMapper.selectCodeVOUniversityTypeList();
	}

	@Override
	public List<ComCodeVO> selectCodeVOUniversityGubunList() {
		return this.universityMapper.selectCodeVOUniversityGubunList();
	}

	@Override
	public List<ComCodeVO> selectCodeVORegionList() {
		return this.universityMapper.selectCodeVORegionList();
	}

	@Override
	public UniversityDetailVO selectUniversityDetail(int univId) {
		// 기본 대학 정보 조회
		UniversityDetailVO universityDetail = this.universityMapper.selectUniversityDetailInfo(univId);

		if (universityDetail != null) {
			// 학과 목록 조회 (전국 평균값 포함) - 쿼리 이름 변경
			List<UniversityDetailVO.DeptInfo> deptList = this.universityMapper.selectUniversityDeptStats(univId);
			universityDetail.setDeptList(deptList);

			// 전체 학과 수 설정
			universityDetail.setTotalDeptCount(deptList != null ? deptList.size() : 0);

		} else {
			log.warn("대학 정보를 찾을 수 없습니다 - univId: {}", univId);
		}

		return universityDetail;
	}

}
