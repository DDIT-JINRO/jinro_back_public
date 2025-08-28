package kr.or.ddit.mpg.mif.whdwl.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.account.lgn.service.MemDelVO;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.main.service.MemberVO;

@Mapper
public interface WithdrawalMapper {

	List<ComCodeVO> selectMdcategoryList();

	MemberVO selectDelYN(int memId);
	
	int insertMemDelete(MemDelVO memDel);

	int updateMemDelYN(int memId);

	MemDelVO selectMemDel(int memId);

}
