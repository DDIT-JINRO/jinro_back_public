package kr.or.ddit.admin.las.service.impl;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.admin.las.service.PageLogVO;

@Mapper
public interface VisitLogMapper {

	void insertPageLog(PageLogVO pageLogVO);

}
