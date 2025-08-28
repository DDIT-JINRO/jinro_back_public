package kr.or.ddit.mpg.mat.csh.service;

import java.util.Map;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.util.ArticlePage;

public interface CounselingHistoryService {

	Map<String, String> selectCounselStatusList();

	Map<String, String> selectCounselCategoryList();

	Map<String, String> selectCounselMethodList();

	ArticlePage<CounselingVO> selectCounselingList(String memId, CounselingVO counselingVO);

}
