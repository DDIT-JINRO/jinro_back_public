package kr.or.ddit.ertds.univ.dpsrch.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptCompareVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptDetailVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;

@Mapper
public interface UnivDeptMapper {

	List<UnivDeptVO> selectUnivDeptList(UnivDeptVO univDeptVO);

	int selectUniversityTotalCount(UnivDeptVO univDeptVO);

	List<ComCodeVO> selectCodeVOUnivDeptLClassList();

	List<BookMarkVO> selectBookMarkVO(BookMarkVO bookmarkVO);

	UnivDeptDetailVO selectDeptDetail(int uddId);

	List<UnivDeptCompareVO> selectDeptCompareList(List<Integer> uddIdList);

}
