package kr.or.ddit.mpg.mif.inq.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.inq.service.VerificationVO;

@Mapper
public interface MyInquiryMapper {

	MemberVO selectMyInquiryView(int memId);

	MemberVO checkPassword(int memId);

	int updateMyInquiryView(MemberVO member);

	int updateFileGroup(MemberVO member);

	List<ComCodeVO> selectInteretsKeywordList();

	void deleteInterestList(int memId);

	void insertInterestList(Map<String, Object> of);

	void insertEmptyInterest(int memId);

	int insertVerification(VerificationVO studentVerification);

	MemberVO getProfileFile(int memId);

	int updateMemberPhone(MemberVO memberVO);

}
