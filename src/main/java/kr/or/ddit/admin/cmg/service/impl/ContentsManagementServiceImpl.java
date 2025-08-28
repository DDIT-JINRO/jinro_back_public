package kr.or.ddit.admin.cmg.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.admin.cmg.service.ContentsManagementService;
import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ContentsManagementServiceImpl implements ContentsManagementService {

	@Autowired
	ContentsManagementMapper contentsManagementMapper;
	@Autowired
	FileService fileService;

	@Override
	public ArticlePage<CompanyVO> getEntList(CompanyVO companyVO) {

		List<CompanyVO> companyList = contentsManagementMapper.getEntList(companyVO);

		int total = contentsManagementMapper.getAllEntList(companyVO);

		return new ArticlePage<CompanyVO>(total, companyVO.getCurrentPage(), companyVO.getSize(), companyList,
				companyVO.getKeyword(),10);
	}

	@Override
	public Map<String, Object> entDetail(String id) {
		CompanyVO companyVO = contentsManagementMapper.entDetail(id);
		String filePath = "";

		if (companyVO != null) {
			
			if (null != companyVO.getFileGroupId()) {
				FileDetailVO file = fileService.getFileDetail(companyVO.getFileGroupId(), 0);
				filePath = fileService.getSavePath(file);
			}
		}

		return Map.of("companyVO", companyVO, "filePath", filePath);
	}

	@Override
	public ArticlePage<InterviewReviewVO> selectReviewList(InterviewReviewVO interviewReviewVO) {
		List<InterviewReviewVO> interviewReviewList = contentsManagementMapper.selectReviewList(interviewReviewVO);
		
		int total = contentsManagementMapper.selectReviewListTotal(interviewReviewVO);
		
		ArticlePage<InterviewReviewVO> articlePage = new ArticlePage<>(total, interviewReviewVO.getCurrentPage(), interviewReviewVO.getSize(), interviewReviewList, interviewReviewVO.getKeyword(),10);
		
		return articlePage;
	}

	@Override
	public Map<String, String> selectIrStatusList() {
		Map<String, String> response = new HashMap<>();
		
		List<Map<String, String>> irStatusList = contentsManagementMapper.selectIrStatusList();
		
		for(Map<String, String> irStatus : irStatusList) {
			response.put(irStatus.get("CC_ID"), irStatus.get("CC_NAME"));
		}
		
		return response;
	}

	@Override
	public InterviewReviewVO selectReviewDetail(String irId) {
		InterviewReviewVO interviewReview = contentsManagementMapper.selectReviewDetail(irId);
		Long fileGroupId = interviewReview.getFileGroupId();
		
		if(null != fileGroupId && fileGroupId != 0) {
			FileDetailVO fileDetail = fileService.getFileDetail(fileGroupId, 1);
			
			interviewReview.setFileOrgName(fileDetail.getFileOrgName());
			interviewReview.setSavePath(fileService.getSavePath(fileDetail));
		}
		
		return interviewReview;
	}
	
    @Override
    @Transactional
    public int updateReviewDetail(InterviewReviewVO interviewReviewVO) {
        int result = 0;
        
        result += contentsManagementMapper.updateInterviewReviewStatus(interviewReviewVO);
        
        result += contentsManagementMapper.updateVerification(interviewReviewVO);
        
        return result;
    }
}