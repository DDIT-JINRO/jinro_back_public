package kr.or.ddit.csc.not.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import kr.or.ddit.csc.not.service.NoticeService;
import kr.or.ddit.csc.not.service.NoticeVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/csc/not")
// 공지사항 컨트롤러
public class NoticeController {

	@Autowired
	NoticeService noticeService;
	
	@Autowired
	FileService fileService;
	
	// 공지사항 리스트
	@GetMapping("/noticeList.do")
	public String noticeList(Model model,
			@RequestParam(value="currentPage",required=false,defaultValue="1") int currentPage,
			@RequestParam(value="size",required=false,defaultValue="5") int size,
			@RequestParam(value="keyword",required=false) String keyword,
			@RequestParam(value="sortOrder", required=false, defaultValue="latest") String sortOrder,
			@AuthenticationPrincipal String memId) {

		
	    ArticlePage<NoticeVO> articlePage = noticeService.getUserNoticePage(currentPage, size, keyword, sortOrder);
	    model.addAttribute("articlePage", articlePage);
	    model.addAttribute("getAllNotice", articlePage.getTotal());
	    model.addAttribute("getList", articlePage.getContent());
		model.addAttribute("memId", memId);
		
		return "csc/not/noticeList";
	}
	
	// 공지사항 세부 화면
	@GetMapping("/noticeDetail.do")
	public String noticeDetail(@RequestParam String noticeId, Model model) {

		NoticeVO noticeDetail = noticeService.getUserNoticeDetail(noticeId);
		model.addAttribute("noticeDetail", noticeDetail);

		return "csc/not/noticeDetail";
	}
	
	// 관리자 목록 조회
	@ResponseBody
	@GetMapping("/admin/noticeList.do")
	public ArticlePage<NoticeVO> adminNoticeList(@RequestParam(value="currentPage",required=false,defaultValue="1") int currentPage,
			@RequestParam(value="size",required=false,defaultValue="5") int size,
			@RequestParam(value="keyword",required=false) String keyword,
			//연도별 구분
			@RequestParam(value="status",required = false)String status) {

		return noticeService.getAdminNoticePage(currentPage, size, keyword, status);
	}
	
	// 관리자 공지사항 세부 화면
	@ResponseBody
	@GetMapping("/admin/noticeDetail.do")
	public NoticeVO adminNoticeDetail(@RequestParam String noticeId) {
		
		return noticeService.getAdminNoticeDetail(noticeId);
	}

	// 관리자 공지사항 등록
	// consumes = MediaType.MULTIPART_FORM_DATA_VALUE => 멀티파트 요청임을 명시하면 MultipartResolver 가 동작해서 List<MultipartFile> 을 채워 줍니다.
	// @ModelAttribute => 파일(MultipartFile)과 폼 필드를 섞어 받을 땐 무조건 @ModelAttribute 로 바인딩해야 합니다.
	@ResponseBody
	@PostMapping(value = "/admin/insertNotice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public int insertNotice(@ModelAttribute NoticeVO noticeVo) {
		log.info(noticeVo.toString()+"");
		return noticeService.insertNotice(noticeVo);
	}
	
	//파일삭제
	@ResponseBody
	@GetMapping("/admin/deleteFile")
	public boolean deleteFile(@RequestParam Long groupId, @RequestParam int seq, @RequestParam int noticeId) {

		return noticeService.deleteFile(groupId, seq, noticeId);
	}
	
	//파일 수정
	@ResponseBody
	@PostMapping(value = "/admin/updateNotice", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public int updateNotice(@ModelAttribute NoticeVO noticeVo) {
        
		return noticeService.updateNotice(noticeVo);
	}
	
	@ResponseBody
	@PostMapping("/admin/deleteNotice")
	public int deleteNotice(@ModelAttribute NoticeVO noticeVO) {
				
		return noticeService.deleteNotice(noticeVO);
	}
}
