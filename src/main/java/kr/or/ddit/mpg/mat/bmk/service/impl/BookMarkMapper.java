package kr.or.ddit.mpg.mat.bmk.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;

@Mapper
public interface BookMarkMapper {

	List<BookMarkVO> selectBookmarkList(BookMarkVO bookmarkVO);

	List<Map<String, String>> selectBmCategoryIdList();

	int selectBookmarkTotal(BookMarkVO bookmarkVO);

	void deleteBookmark(BookMarkVO bookmarkVO);

	void insertBookmark(BookMarkVO bookmarkVO);

}
