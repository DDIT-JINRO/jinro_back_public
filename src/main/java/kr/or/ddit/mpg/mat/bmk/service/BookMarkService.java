package kr.or.ddit.mpg.mat.bmk.service;

import java.util.Map;

import kr.or.ddit.util.ArticlePage;

public interface BookMarkService {

	ArticlePage<BookMarkVO> selectBookmarkList(String memId, BookMarkVO bookmarkVO);

	Map<String, String> selectBmCategoryIdList();

	void deleteBookmark(String memId, BookMarkVO bookmarkVO);

	void insertBookmark(String memId, BookMarkVO bookmarkVO);

}
