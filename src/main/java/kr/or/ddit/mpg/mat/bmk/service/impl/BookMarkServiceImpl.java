package kr.or.ddit.mpg.mat.bmk.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.mpg.mat.bmk.service.BookMarkService;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import kr.or.ddit.mpg.mat.csh.service.impl.CounselingHistoryServiceImpl;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BookMarkServiceImpl implements BookMarkService{

	@Autowired
	CounselingHistoryServiceImpl counselingHistoryServiceImpl;
	
	@Autowired
	BookMarkMapper bookmarkMapper;
	
	@Override
	public Map<String, String> selectBmCategoryIdList() {
		
		List<Map<String, String>> bmCategoryIdList = this.bookmarkMapper.selectBmCategoryIdList();
		
		Map<String, String> bmCategoryId = counselingHistoryServiceImpl.parseMap(bmCategoryIdList);
		
		return bmCategoryId;
	}
	
	@Override
	public ArticlePage<BookMarkVO> selectBookmarkList(String memIdStr, BookMarkVO bookmarkVO) {
		
		if (!"".equals(memIdStr) && !"anonymousUser".equals(memIdStr)) {
			int memId = Integer.parseInt(memIdStr);
			bookmarkVO.setMemId(memId);
			
			List<BookMarkVO> selectBookmark = this.bookmarkMapper.selectBookmarkList(bookmarkVO);
			
			int total = this.bookmarkMapper.selectBookmarkTotal(bookmarkVO);
			
			ArticlePage<BookMarkVO> articlePage = new ArticlePage<>(total, bookmarkVO.getCurrentPage(), bookmarkVO.getSize(), selectBookmark, bookmarkVO.getKeyword());
			
			return articlePage;
		}
		
		return null;
	}

	@Override
	public void deleteBookmark(String memIdStr, BookMarkVO bookmarkVO) {
		if("".equals(memIdStr) && "anonymousUser".equals(memIdStr)) {
			throw new RuntimeException();
		}
		
		int memId = Integer.parseInt(memIdStr);
		bookmarkVO.setMemId(memId);
		this.bookmarkMapper.deleteBookmark(bookmarkVO);
	}
	
	@Override
	public void insertBookmark(String memIdStr, BookMarkVO bookmarkVO) {
		if("".equals(memIdStr) && "anonymousUser".equals(memIdStr)) {
			throw new RuntimeException();
		}
		
		int memId = Integer.parseInt(memIdStr);
		bookmarkVO.setMemId(memId);
		this.bookmarkMapper.insertBookmark(bookmarkVO);
	}


}
