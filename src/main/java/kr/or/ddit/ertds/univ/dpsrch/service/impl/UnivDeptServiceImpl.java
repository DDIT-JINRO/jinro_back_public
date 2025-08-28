package kr.or.ddit.ertds.univ.dpsrch.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptCompareVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptDetailVO;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptService;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UnivDeptServiceImpl implements UnivDeptService {

	@Autowired
	UnivDeptMapper univDeptMapper;

	@Override
	public List<UnivDeptVO> selectUnivDeptList(UnivDeptVO univDeptVO) {
		List<UnivDeptVO> list = this.univDeptMapper.selectUnivDeptList(univDeptVO);

		return list;
	}

	@Override
	public int selectUniversityTotalCount(UnivDeptVO univDeptVO) {
		return this.univDeptMapper.selectUniversityTotalCount(univDeptVO);
	}

	@Override
	public List<ComCodeVO> selectCodeVOUnivDeptLClassList() {
		return this.univDeptMapper.selectCodeVOUnivDeptLClassList();
	}

	@Override
	public List<BookMarkVO> selectBookMarkVO(BookMarkVO bookmarkVO) {
		return this.univDeptMapper.selectBookMarkVO(bookmarkVO);
	}

	@Override
	public UnivDeptDetailVO selectDeptDetail(int uddId) {
		return this.univDeptMapper.selectDeptDetail(uddId);
	}

	@Override
	public List<UnivDeptCompareVO> getDeptCompareList(List<Integer> uddIdList) {
		if (uddIdList == null || uddIdList.isEmpty()) {
			return new ArrayList<>();
		}

		// 최대 5개 학과까지만 비교 허용
		if (uddIdList.size() > 5) {
			uddIdList = uddIdList.subList(0, 5);
			log.warn("비교 학과 수가 5개를 초과하여 처음 5개만 조회합니다.");
		}

		return univDeptMapper.selectDeptCompareList(uddIdList);
	}
	
	// 추가: 학과 목록 조회 (페이징)
    @Override
    public ArticlePage<UnivDeptVO> getUnivDeptList(UnivDeptVO univDeptVO) {
        
        List<UnivDeptVO> univDeptList = this.univDeptMapper.selectUnivDeptList(univDeptVO);
        
        int total = this.univDeptMapper.selectUniversityTotalCount(univDeptVO);
        
        return new ArticlePage<UnivDeptVO>(total, univDeptVO.getCurrentPage(), univDeptVO.getSize(), univDeptList,
                univDeptVO.getKeyword());
    }

}
