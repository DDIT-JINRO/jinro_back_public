package kr.or.ddit.csc.faq.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.csc.faq.service.FaqService;
import kr.or.ddit.csc.faq.service.FaqVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
//FAQ컨트롤러
@RequestMapping("/csc/faq")
public class FAQController {

	//FAQ 서비스
	@Autowired
	FaqService faqService;
	
	//파일 서비스
	@Autowired
	FileService fileService;
	
	// 사용자 FAQ 조회
	@GetMapping("/faqList.do")
	public String faqUserList(Model model,@RequestParam(value="keyword",required=false) String keyword,@AuthenticationPrincipal String memId) {
		
		List<FaqVO> faqList= faqService.getUserFaqList(keyword);
		
		log.info(faqList.toString());
		
		model.addAttribute("faqList", faqList);
		model.addAttribute("memId", memId);
		
		return "csc/faq/faqList";
	}
	
	// 관리자 FAQ 조회
	@ResponseBody
	@GetMapping("/admin/faqList.do")
	public ArticlePage<FaqVO> faqAdminList(@RequestParam(value="currentPage",required=false,defaultValue="1") int currentPage,
			@RequestParam(value="size",required=false,defaultValue="5") int size,
			@RequestParam(value="keyword",required=false) String keyword,
			//연도별 구분
			@RequestParam(value="status",required = false)String status) {
		
		ArticlePage<FaqVO> faqList= faqService.getAdminFaqList(currentPage, size, keyword, status);
		log.info("사용자 FAQ 리스트 조회 : "+faqList);
		
		return faqList;
	}
	
	// 관리자 FAQ 상세 조회
	@ResponseBody
	@GetMapping("/admin/faqDetail.do")
	public FaqVO adminFaqDetail(@RequestParam String faqId) {
		
		return faqService.getAdminFaqDetail(faqId);
	}
	
	// 관리자 FAQ 삽입
	@ResponseBody
	@PostMapping(value ="/admin/insertFaq", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public int adminInsertFaq(@ModelAttribute FaqVO faqVO) {
		
		return faqService.insertFaq(faqVO);
	}
	
	// 관리자 FAQ 수정
	@ResponseBody
	@PostMapping(value ="/admin/updateFaq", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public int adminUpdateFaq(@ModelAttribute FaqVO faqVO) {
		
		return faqService.updateFaq(faqVO);
	}
	
	// 관리자 파일 삭제
	@ResponseBody
	@GetMapping("/admin/deleteFile")
	public boolean adminDeleteFile(@RequestParam Long groupId,@RequestParam int seq) {
		
		return fileService.deleteFile(groupId, seq);
	}
	
	// 관리자 FAQ 삭제
	@ResponseBody
	@PostMapping("/admin/deleteFaq")
	public int adminDeleteFaq(@ModelAttribute FaqVO faqVO) {
		
		return faqService.deleteFaq(faqVO);
	}
}
