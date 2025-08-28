package kr.or.ddit.ertds.univ.uvsrch.service;

import java.util.List;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;

public interface UniversityService {

	List<UniversityVO> selectUniversityList(UniversityVO universityVO);

	int selectUniversityTotalCount(UniversityVO universityVO);

	List<ComCodeVO> selectCodeVOUniversityTypeList();

	List<ComCodeVO> selectCodeVOUniversityGubunList();

	List<ComCodeVO> selectCodeVORegionList();

	List<BookMarkVO> selectBookMarkVO(BookMarkVO bookmarkVO);

	UniversityDetailVO selectUniversityDetail(int univId);
}
