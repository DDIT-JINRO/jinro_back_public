package kr.or.ddit.csc.inq.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.csc.inq.service.InqService;
import kr.or.ddit.csc.inq.service.InqVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
//1:1문의 컨트롤러
@RequestMapping("/csc/inq")
public class InqryController {

	// 서비스 
	@Autowired
	InqService inqService;
	
	// 사용자 1:1문의 리스트
	@GetMapping("/inqryList.do")
	public String noticeList(@RequestParam(value="currentPage",required=false,defaultValue="1") int currentPage,
			@RequestParam(value="size",required=false,defaultValue="5") int size,
			@RequestParam(value="com-search-keyword",required=false) String keyword,
			@RequestParam(value="filter-keyword", required = false) List<String> filterKeywords,
			@AuthenticationPrincipal String memId,
			Model model) {
		
		ArticlePage<InqVO> inqList = inqService.getUserInqryPage(currentPage,size,keyword,filterKeywords,memId);

		// 목록
		model.addAttribute("inqList", inqList.getContent());
		// 패이지
		model.addAttribute("articlePage", inqList);
		// 로그인 조회
		model.addAttribute("memId", memId);
		return "csc/inq/inqryList";
	}
	
	// 사용자 1:1 문의 등록 페이지 이동
	@GetMapping("/insertInq.do")
	public String insertInq() {
		return "csc/inq/insertInq";
	}
	
	// 사용자 1:1 문의 등록
	@ResponseBody
	@PostMapping("/insertInqData.do")
	public int insertInqData(@RequestBody InqVO inqVO, @AuthenticationPrincipal String memId ) {
		inqVO.setMemId(Integer.parseInt(memId));
		return inqService.insertInqData(inqVO);
	}
	
	// 관리자 1:1 문의 리스트
	@ResponseBody
	@GetMapping("/admin/inqList.do")
	public ArticlePage<InqVO> inqAdminList(@RequestParam(value="currentPage",required=false,defaultValue="1") int currentPage,
			@RequestParam(value="size",required=false,defaultValue="5") int size,
			@RequestParam(value="keyword",required=false) String keyword,
			//연도별 구분
			@RequestParam(value="status",required = false)String status) {
		
		ArticlePage<InqVO> inqList= inqService.getAdminInqList(currentPage, size, keyword, status);
		
		return inqList;
	}
	
	// 관리자 1:1 문의 상세 조회
	@ResponseBody
	@GetMapping("/admin/inqDetail.do")
	public InqVO admininqDetail(@RequestParam String inqId) {
		return inqService.getAdminInqDetail(Integer.parseInt(inqId));
	}
	

	// 관리자 문의사항 답변 등록
	@ResponseBody
	@PostMapping("/admin/insertInq.do")
	public int adminInsertInq(@ModelAttribute InqVO inqVO) {
		return inqService.insertInq(inqVO);
	}
	
}
