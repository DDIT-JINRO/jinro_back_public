package kr.or.ddit.csc.inq.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.csc.inq.service.InqVO;

@Mapper
public interface InqMapper {

	// 사용자 1:1문의 등록
	public int insertInqData(InqVO inqVO);
	
	// 사용자 1:1문의 목록 조회
	public List<InqVO> getInqList(Map<String, Object> map);
	
	// 건수 조회
	public int getAllInq(Map<String, Object> map);

	// 멤버별 건수 조회
	public int getAllInqByMemId(Map<String, Object> map);

	// 관리자 1:1문의 목록 조회
	public List<InqVO> getAdminInqList(Map<String, Object> map);
	
	// 관리자 1:1문의 상세 조회
	public InqVO getAdminInqDetail(int inqId);
	
	// 관리자 1:1문의 답변 등록
	public int insertInq(InqVO inqVO);

	// 1:1 문의에 대한 작성자 ID 찾기
	public int getMemId(int contactId);
	
}
