package kr.or.ddit.ertds.qlfexm.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.ertds.qlfexm.service.QualficationExamVO;

@Mapper
public interface QualificationExamMapper {
	
	// 전체 목록 건수 조회
	public int getTotal(String keyword);
	// 목록 조회
	public List<QualficationExamVO> getList(QualficationExamVO qualficationExamVO);
	// 사용자 검정고시 상세 조회
	public QualficationExamVO getDetail(int examId);
}
