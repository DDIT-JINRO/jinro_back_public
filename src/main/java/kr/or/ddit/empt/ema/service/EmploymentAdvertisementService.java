package kr.or.ddit.empt.ema.service;

import java.util.List;

import kr.or.ddit.com.ComCodeVO;

public interface EmploymentAdvertisementService {

	int selectFilteredHireTotalCount(HireVO hireVO);

	List<HireVO> selectFilteredHireList(HireVO hireVO);

	List<ComCodeVO> selectCodeVOList(ComCodeVO comCodeVO);

	// 채용공고 북마크한 회원 id 얻어오기
	void sendDeadlineReminders();

	int checkHireByHireId(HireVO hireVO);

	int updateEmploymentAdvertisement(HireVO hireVO);

	int deleteEmploymentAdvertisement(HireVO hireVO);
}
