package kr.or.ddit.cnslt.rvw.service;

import java.util.List;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.util.ArticlePage;

public interface CounselingReviewService {

	ArticlePage<CounselingReviewVO> selectCounselingReviewList(CounselingReviewVO counselingReview);

	CounselingReviewVO selectCounselingReview(int crId);

	List<CounselingVO> selectCounselingHistory(String memId, String counselName);

	void updateCnsReview(CounselingReviewVO counselingReview);

	void deleteCnsReview(int crId);

}
