package kr.or.ddit.empt.enp.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;

@Mapper
public interface EnterprisePostingMapper {

	int selectCompanyListCount(CompanyVO companyVO);

	List<CompanyVO> selectCompanyList(CompanyVO companyVO);

	List<ComCodeVO> selectCodeVOCompanyScaleList();

	List<ComCodeVO> selectCodeVORegionList();

	int updateEnterprisePosting(CompanyVO companyVO);

	CompanyVO checkCompanyByCpId(CompanyVO companyVO);

	int getMaxCpId();

	int deleteEnterprisePosting(CompanyVO companyVO);

	List<BookMarkVO> selectBookMarkVO(BookMarkVO bookMarkVO);

	List<InterviewReviewVO> selectEnpInterviewReview(InterviewReviewVO interviewReviewVO);
}
