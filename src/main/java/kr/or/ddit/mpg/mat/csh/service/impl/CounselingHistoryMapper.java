package kr.or.ddit.mpg.mat.csh.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;

@Mapper
public interface CounselingHistoryMapper {

	List<Map<String, String>> selectCounselStatusList();

	List<Map<String, String>> selectCounselCategoryList();

	List<Map<String, String>> selectCounselMethodList();

	List<CounselingVO> selectCounselingList(CounselingVO counselingVO);

	int selectCounselingTotal(CounselingVO counselingVO);

}
