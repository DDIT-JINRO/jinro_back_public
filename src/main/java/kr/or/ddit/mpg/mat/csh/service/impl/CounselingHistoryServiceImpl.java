package kr.or.ddit.mpg.mat.csh.service.impl;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.mpg.mat.csh.service.CounselingHistoryService;
import kr.or.ddit.mpg.mif.inq.service.MyInquiryService;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CounselingHistoryServiceImpl implements CounselingHistoryService{

	@Autowired
	CounselingHistoryMapper counselingHistoryMapper;
	
	@Autowired
	MyInquiryService myInquiryService;
	
	@Override
	public Map<String, String> selectCounselStatusList() {
		
		List<Map<String, String>> counselStatusList = this.counselingHistoryMapper.selectCounselStatusList();
		
		Map<String, String> counselStatus = parseMap(counselStatusList);
		
		return counselStatus;
	}
	
	@Override
	public Map<String, String> selectCounselCategoryList() {
		
		List<Map<String, String>> counselCategoryList = this.counselingHistoryMapper.selectCounselCategoryList();
		
		Map<String, String> counselCategory = parseMap(counselCategoryList);
		
		return counselCategory;
	}
	
	@Override
	public Map<String, String> selectCounselMethodList() {
		
		List<Map<String, String>> counselMethodList = this.counselingHistoryMapper.selectCounselMethodList();
		
		Map<String, String> counselCategory = parseMap(counselMethodList);
		
		return counselCategory;
	}
	
	@Override
	public ArticlePage<CounselingVO> selectCounselingList(String memIdStr, CounselingVO counselingVO) {
		
		if (!"".equals(memIdStr) && !"anonymousUser".equals(memIdStr)) {
			int memId = Integer.parseInt(memIdStr);
			counselingVO.setMemId(memId);
			
			List<CounselingVO> counselingVOList = this.counselingHistoryMapper.selectCounselingList(counselingVO);
			
			int total = this.counselingHistoryMapper.selectCounselingTotal(counselingVO);
			
			ArticlePage<CounselingVO> articlePage = new ArticlePage<>(total, counselingVO.getCurrentPage(), counselingVO.getSize(), counselingVOList, counselingVO.getKeyword());
			
			return articlePage;
		}
		
		return null;
	}
	
	public Map<String, String> parseMap (List<Map<String, String>> mapList) {
		
		Map<String, String> result = new LinkedHashMap<>();
		
		for(Map<String, String> map : mapList) {
			String key = map.get("CC_ID");
			String value = map.get("CC_NAME");
			
			result.put(key, value);
		}
		
		return result;
	}

}
