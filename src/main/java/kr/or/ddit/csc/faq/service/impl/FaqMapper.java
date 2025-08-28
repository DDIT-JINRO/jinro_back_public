package kr.or.ddit.csc.faq.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.csc.faq.service.FaqVO;

@Mapper
public interface FaqMapper {

	public List<FaqVO> getUserFaqList();

	public List<FaqVO> getAdminFaqList(Map<String, Object> map);

	public int getAllFaq(Map<String, Object> map);

	public FaqVO getAdminFaqDetail(String faqId);

	public int insertFaq(FaqVO faqVO);

	public int updateFaq(FaqVO faqVO);

	public int deleteFaq(int faqId);

	public List<FaqVO> getUserFaqList(String keyword);

	public void updateFaqFileGroupID(@Param("faqId") int faqId, @Param("newGroupId") Long newGroupId);

}
