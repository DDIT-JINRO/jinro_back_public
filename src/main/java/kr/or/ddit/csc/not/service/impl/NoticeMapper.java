package kr.or.ddit.csc.not.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.csc.not.service.NoticeVO;

@Mapper
public interface NoticeMapper {
	public List<NoticeVO> getList(Map<String, Object>map);

	public NoticeVO getNoticeDetail(int noticeId);

	public int upNoticeCnt(int noticeId);
	
	public int getAllNotice(Map<String, Object>map);

	public int insertNotice(NoticeVO noticeVo);

	public int updateNotice(NoticeVO noticeVo);

	public int deleteNotice(int noticeId);

	// @Param 쓰면 DB에 삽입이 가능
	void updateNoticeFileGroup(@Param("noticeId") int noticeId, @Param("newGroupId") Long newGroupId);
}
