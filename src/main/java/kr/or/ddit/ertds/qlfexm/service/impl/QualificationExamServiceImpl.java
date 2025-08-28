package kr.or.ddit.ertds.qlfexm.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.ertds.qlfexm.service.QualficationExamVO;
import kr.or.ddit.ertds.qlfexm.service.QualificationExamService;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class QualificationExamServiceImpl implements QualificationExamService {

	@Autowired
	QualificationExamMapper qualificationExamMapper;

	// 사용자 검정고시 목록 조회
	@Override
	public ArticlePage<QualficationExamVO> getList(String keyword, int currentPage, int size, String sortOrder) {

		// VO set
		QualficationExamVO qualficationExamVO = new QualficationExamVO();
		qualficationExamVO.setKeyword(keyword);
		qualficationExamVO.setCurrentPage(currentPage);
		qualficationExamVO.setSize(size);
		qualficationExamVO.setSortOrder(sortOrder);

		// 사이즈 조회
		int total  = qualificationExamMapper.getTotal(qualficationExamVO.getKeyword());

		// 목록 조회
		List<QualficationExamVO> getList = qualificationExamMapper.getList(qualficationExamVO);

		// ArticlePage 담기
		ArticlePage<QualficationExamVO> articlePage = new ArticlePage<>(total, currentPage, size, getList, keyword);

		return articlePage;
	}
	// 사용자 검정고시 상세 조회
	@Override
	public QualficationExamVO getDetail(String examId) {

		return this.qualificationExamMapper.getDetail(Integer.parseInt(examId));
	}

}
