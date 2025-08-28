package kr.or.ddit.pse.cat.service.impl;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.admin.las.service.RecommendKeywordVO;
import kr.or.ddit.pse.cat.service.AptitudeTestVO;
import kr.or.ddit.pse.cat.service.TemporarySaveVO;

@Mapper
public interface CareerAptitudeTestMapper {

	public int testSave(TemporarySaveVO temporarySaveVO);

	public TemporarySaveVO getSavingTest(TemporarySaveVO temporarySaveVO);

	public void delTempSaveTest(TemporarySaveVO temporarySaveVO);

	public void insertAptitudeResult(AptitudeTestVO aptitudeTestVO);

	public void insertRecommendKeyword(RecommendKeywordVO recommendKeywordVO);

	
	
	
}
