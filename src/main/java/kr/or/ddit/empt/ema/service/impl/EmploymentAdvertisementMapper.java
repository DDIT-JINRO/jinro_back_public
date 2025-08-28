package kr.or.ddit.empt.ema.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.ema.service.HireVO;

@Mapper
public interface EmploymentAdvertisementMapper {

	// 필터링한 채용리스트 개수
	int selectFilteredHireTotalCount(HireVO hireVO);

	// 필터링한 채용리스트
	List<HireVO> selectFilteredHireList(HireVO hireVO);

	// 공통코드 얻어오기
	List<ComCodeVO> selectCodeVOList(ComCodeVO comCodeVO);

	// 채용공고 북마크한 회원 id 얻어오기
	List<HireVO> selectHireByBookMarkMemId(String memId);

	List<String> getAllUserIds();

	HireVO checkHireByHireId(HireVO hireVO);

	int getMaxHireId();

	int updateEmploymentAdvertisement(HireVO hireVO);

	int deleteEmploymentAdvertisement(HireVO hireVO);

}
