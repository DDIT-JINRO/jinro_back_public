package kr.or.ddit.you.service.impl;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface YoutubeMapper {

	public Map<String, Object> getKeyword(int memId);

}
