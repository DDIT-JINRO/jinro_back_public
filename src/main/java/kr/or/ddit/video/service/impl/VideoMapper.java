package kr.or.ddit.video.service.impl;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VideoMapper {

	// 수정
	int createVideoChatRoom(int counselId,String couUrl, String userUrl);

}
