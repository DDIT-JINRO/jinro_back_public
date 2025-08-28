package kr.or.ddit.mpg.mat.bmk.web;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.mpg.mat.bmk.service.BookMarkService;
import kr.or.ddit.mpg.mat.bmk.service.BookMarkVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class BookMarkController {

	@Autowired
	BookMarkService bookmarkService;
	
	@GetMapping("/mat/bmk/selectBookMarkList.do")
	public String selectBookMarkList (@AuthenticationPrincipal String memId, @ModelAttribute BookMarkVO bookmarkVO, Model model) {
		
		Map<String, String> bmCategoryId = this.bookmarkService.selectBmCategoryIdList();
		
		ArticlePage<BookMarkVO> articlePage = this.bookmarkService.selectBookmarkList(memId, bookmarkVO);
		articlePage.setUrl("/mpg/mat/bmk/selectBookMarkList.do");
		
		model.addAttribute("articlePage", articlePage);
		model.addAttribute("bmCategoryId", bmCategoryId);
		
		return "mpg/mat/bmk/selectBookmarkList";
	}
	
	@GetMapping("/mat/bmk/selectBookMarkDetail.do")
	public String selectBookMarkDetail (@ModelAttribute BookMarkVO bookMarkVO) {
		int bmTargetId = bookMarkVO.getBmTargetId();
		String bmCategoryId = bookMarkVO.getBmCategoryId();
		String bmTitle = URLEncoder.encode(bookMarkVO.getTitle());
		
		switch (bmCategoryId) {
		case "G03001": {
			return "redirect:/ertds/univ/uvsrch/selectDetail.do?univId=" + bmTargetId;
		}
		case "G03002": {
			return "redirect:/empt/enp/enterprisePosting.do?keyword=" + bmTitle;
		}
		case "G03003": {
			return "redirect:/empt/ema/employmentAdvertisement.do?keyword=" + bmTitle;
		}
		case "G03004": {
			return "redirect:/pse/cr/crl/selectCareerDetail.do?jobCode=" + bookMarkVO.getJobCode();
		}
		case "G03005": {
			return "redirect:/cdp/rsm/rsmb/resumeBoardDetail.do?boardId=" + bmTargetId;
		}
		case "G03006": {
			return "redirect:/ertds/univ/dpsrch/selectDetail.do?uddId=" + bmTargetId;
		}
		default:
			return "mpg/mat/bmk/selectBookmarkList";
		}
	}
	
	@ResponseBody
	@PostMapping("/mat/bmk/deleteBookmark.do")
	public ResponseEntity<Map<String, Object>> deleteBookmark (@AuthenticationPrincipal String memId, @RequestBody BookMarkVO bookmarkVO) {

        Map<String, Object> response = new HashMap<String, Object>();
        
        try {
            bookmarkService.deleteBookmark(memId, bookmarkVO);
            
            response.put("success", true);
            response.put("message", "북마크가 삭제되었습니다.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "북마크 삭제에 실패했습니다.");
            return ResponseEntity.status(500).body(response);
        }
        
	}
	
	@ResponseBody
	@PostMapping("/mat/bmk/insertBookmark.do")
	public ResponseEntity<Map<String, Object>> insertBookmark (@AuthenticationPrincipal String memId, @RequestBody BookMarkVO bookmarkVO) {
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		try {
			bookmarkService.insertBookmark(memId, bookmarkVO);
			response.put("success", true);
			response.put("message", "북마크가 등록되었습니다.");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("success", false);
			response.put("message", "북마크 등록에 실패했습니다.");
			return ResponseEntity.status(500).body(response);
		}
		
	}
}
