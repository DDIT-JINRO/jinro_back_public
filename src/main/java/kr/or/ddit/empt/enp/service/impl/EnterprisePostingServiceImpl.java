package kr.or.ddit.empt.enp.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.EnterprisePostingService;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnterprisePostingServiceImpl implements EnterprisePostingService {

	private final EnterprisePostingMapper enterprisePostingMapper;

	@Override
	public int selectCompanyListCount(CompanyVO companyVO) {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.selectCompanyListCount(companyVO);
	}

	@Override
	public List<CompanyVO> selectCompanyList(CompanyVO companyVO) {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.selectCompanyList(companyVO);
	}

	@Override
	public List<ComCodeVO> selectCodeVOCompanyScaleList() {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.selectCodeVOCompanyScaleList();
	}

	@Override
	public List<ComCodeVO> selectCodeVORegionList() {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.selectCodeVORegionList();
	}

	@Override
	public int updateEnterprisePosting(CompanyVO companyVO) {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.updateEnterprisePosting(companyVO);
	}

	@Override
	public int checkCompanyByCpId(CompanyVO companyVO) {
		int cpId = 0;
		companyVO = enterprisePostingMapper.checkCompanyByCpId(companyVO);

		if (companyVO == null) {
			cpId = enterprisePostingMapper.getMaxCpId();
		} else {
			cpId = companyVO.getCpId();
		}

		return cpId;
	}

	@Override
	public int deleteEnterprisePosting(CompanyVO companyVO) {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.deleteEnterprisePosting(companyVO);
	}

	@Override
	public List<BookMarkVO> selectBookMarkVO(BookMarkVO bookMarkVO) {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.selectBookMarkVO(bookMarkVO);
	}

	@Override
	public List<InterviewReviewVO> selectEnpInterviewReview(InterviewReviewVO interviewReviewVO) {
		// TODO Auto-generated method stub
		return enterprisePostingMapper.selectEnpInterviewReview(interviewReviewVO);
	}

}
