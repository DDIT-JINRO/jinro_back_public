package kr.or.ddit.empt.ivfb.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.empt.ivfb.service.InterviewFeedbackService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.mpg.mif.inq.service.VerificationVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class InterviewFeedbackServiceImpl implements InterviewFeedbackService{

	@Autowired
	private InterviewFeedbackMapper interviewFeedbackMapper;
	
	@Autowired
	private FileService fileService;

	@Override
	public ArticlePage<InterviewReviewVO> selectInterviewFeedbackList(InterviewReviewVO interviewReviewVO) {
		List<InterviewReviewVO> interviewReviewList = interviewFeedbackMapper.selectInterviewFeedbackList(interviewReviewVO);
		
		int interviewReviewListTotal = interviewFeedbackMapper.selectInterviewReviewListTotal(interviewReviewVO);
		
		ArticlePage<InterviewReviewVO> articlePage = new ArticlePage<>(interviewReviewListTotal, interviewReviewVO.getCurrentPage(), interviewReviewVO.getSize(), interviewReviewList, interviewReviewVO.getKeyword());
		
		return articlePage;
	}
	
	@Override
	public List<CompanyVO> selectCompanyList(String cpName) {
		List<CompanyVO> companyList = interviewFeedbackMapper.selectCompanyList(cpName);
		
		if(companyList == null || companyList.isEmpty()) {
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		
		return companyList;
	}

	@Override
	@Transactional
	public void updateInterviewFeedback(String memIdStr, InterviewReviewVO interviewReview, MultipartFile file, String veriCategory) {
		if (null == memIdStr || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		int memId = Integer.parseInt(memIdStr);
		interviewReview.setMemId(memId);
		
		Long fileGroupId = fileService.createFileGroup();
		
		VerificationVO verification = VerificationVO.builder()
											.memId(memId)
											.fileGroupId(fileGroupId)
											.veriStatus("S05001")
											.veriCategory(veriCategory)
											.build();
		
		List<MultipartFile> files = new ArrayList<MultipartFile>();
		files.add(file);
		
		try {
			interviewFeedbackMapper.updateInterviewFeedback(interviewReview);
			verification.setVeriId(interviewReview.getIrId());
			fileService.uploadFiles(fileGroupId, files);
			interviewFeedbackMapper.updateVerification(verification);
		} catch (IOException e) {
			log.error("면접 후기 요청 중 에러 발생 : {}", e.getMessage());
			throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
		} catch (Exception e) {
			log.error("면접 후기 요청 중 에러 발생 : {}", e.getMessage());
			fileService.deleteFileGroup(fileGroupId);
			throw e;
		}
	}

	@Override
	public void deleteInterviewFeedback(String memIdStr, int irId) {
		if (null == memIdStr || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		
		try {
			interviewFeedbackMapper.deleteInterviewFeedback(irId);
		} catch (Exception e) {
			log.error("면접 후기 요청 중 에러 발생 : {}", e.getMessage());
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public InterviewReviewVO selectInterviewFeedback(String memIdStr, int irId) {
		if (null == memIdStr || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		
		try {
			InterviewReviewVO interviewReview = interviewFeedbackMapper.selectInterviewFeedback(irId);
			
			if(interviewReview.getMemId() != Integer.parseInt(memIdStr)){
				throw new CustomException(ErrorCode.INVALID_AUTHORIZE);
			};
			
			return interviewReview;
		} catch (Exception e) {
			log.error(memIdStr);
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public void updateInterviewFeedback(String memIdStr, InterviewReviewVO interviewReview) {
		if (null == memIdStr || "anonymousUser".equals(memIdStr)) {
			throw new CustomException(ErrorCode.INVALID_USER);
		}
		int memId = Integer.parseInt(memIdStr);
		interviewReview.setMemId(memId);
		
		try {
			interviewFeedbackMapper.updateInterviewFeedback(interviewReview);
		} catch (Exception e) {
			log.error("면접 후기 요청 중 에러 발생 : {}", e.getMessage());
			throw e;
		}
	}

	@Override
	public List<UniversityVO> selectUniversityList(String univName) {
		List<UniversityVO> universityList = interviewFeedbackMapper.selectUniversityList(univName);
		
		if(universityList == null || universityList.isEmpty()) {
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		
		return universityList;
	}

}
