package kr.or.ddit.cdp.rsm.rsm.web;

import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.cdp.rsm.rsm.service.ResumeSectionVO;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeService;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeVO;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@RequestMapping("/cdp/rsm/rsm")
@Controller
@Slf4j
public class ResumeController {

	private final ResumeService resumeService;

	@GetMapping("/resumeList.do") // resumeList.do
	public String resumePage(Principal principal, Model model, @RequestParam(required = false) String keyword,
			@RequestParam(required = false) String status,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "5") int size,
			@RequestParam(value = "sortOrder", required = false) String sortOrder
			) {

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			String memId = principal.getName();

			ResumeVO resumeVO = new ResumeVO();
			resumeVO.setMemId(Integer.parseInt(memId));
			resumeVO.setCurrentPage(currentPage);
			resumeVO.setSize(5);
			resumeVO.setKeyword(keyword);
			resumeVO.setStatus(status);
			resumeVO.setSortOrder(sortOrder);

			int total = resumeService.selectResumeTotalBymemId(resumeVO);
			// 사용자 자소서 리스트 불러옴
			List<ResumeVO> ResumeVOList = resumeService.selectResumeBymemId(resumeVO);

			ArticlePage<ResumeVO> articlePage = new ArticlePage<ResumeVO>(total, currentPage, 5, ResumeVOList, keyword);
			articlePage.setUrl("/cdp/rsm/rsm/resumeList.do");

			model.addAttribute("articlePage", articlePage);

		} else {
			return "redirect:/login";
		}

		return "cdp/rsm/rsm/resumeList";
	}

	@GetMapping("/resumeWriter.do")
	public String resumedeatilPage(@ModelAttribute ResumeVO resumeVO, Model model, Principal principal) {

		if (principal != null && !principal.getName().equals("anonymousUser")) {

			resumeVO = resumeService.selectResumeByResumeId(resumeVO,principal.getName());

		}else {
			return"redirect:/login";
		}


		model.addAttribute("resumeVO", resumeVO);
		return "cdp/rsm/rsm/resumeWriter";
	}

	@GetMapping("/getElement")
	public ResponseEntity<String> getElement(@ModelAttribute ResumeSectionVO resumeSectionVO) {

		String element = resumeService.getElement(resumeSectionVO);

		return ResponseEntity.ok(element);

	}

	@PostMapping("/insertResume.do")
	@ResponseBody
	public Map<String, Object> insertResume(Principal principal, @ModelAttribute ResumeVO resumeVO, Model model)
			throws UnsupportedEncodingException {
		Map<String, Object> result = new HashMap<>();
		if (principal != null && !principal.getName().equals("anonymousUser")) {
			resumeVO.setMemId(Integer.parseInt(principal.getName()));
			resumeVO = resumeService.mergeIntoResume(resumeVO);

			result.put("status", "success");
			result.put("resumeId", resumeVO.getResumeId());
		} else {
			result.put("status", "unauthorized");
		}
		return result;

	}

	@PostMapping("/deleteResume.do")
	@ResponseBody
	public Map<String, Object> deleteResume(@RequestBody ResumeVO resumeVO) {
		Map<String, Object> result = new HashMap<>();
		try {
			int cnt = resumeService.deleteResumeById(resumeVO.getResumeId()); // 삭제 처리
			if(cnt>0) {

				result.put("status", "success");
			}else {
				result.put("status", "fail");
			}
		} catch (Exception e) {
			result.put("status", "fail");
			result.put("message", e.getMessage());
		}
		return result;
	}

}