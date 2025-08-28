package kr.or.ddit.cdp.sint.qestnlst.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.or.ddit.cdp.sint.service.SelfIntroQVO;
import kr.or.ddit.cdp.sint.service.SelfIntroService;
import kr.or.ddit.cdp.sint.service.SelfIntroVO;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cdp/sint/qestnlst")
@Controller
@Slf4j
@RequiredArgsConstructor
public class QuestionListController {

	private final SelfIntroService selfIntroService;

	@GetMapping("/questionList.do")
	public String questionList(@RequestParam(defaultValue = "1") int currentPage,
			@RequestParam(required = false) String keyword,
			@RequestParam(value = "siqJobFilter", required = false) List<String> siqJobFilter, Model model,
			@AuthenticationPrincipal String memId) {
		log.info("siqJobFilter : " + siqJobFilter);

		int size = 5; // 한 페이지에 5개
		int startRow = (currentPage - 1) * size;
		int endRow = currentPage * size;

		if (siqJobFilter == null || (siqJobFilter.size() == 1 && siqJobFilter.get(0).isEmpty())) {
			siqJobFilter = new ArrayList<>(); 
		}

		SelfIntroQVO selfIntroQVO = new SelfIntroQVO();
		selfIntroQVO.setKeyword(keyword);
		selfIntroQVO.setSiqJobFilter(siqJobFilter);
		selfIntroQVO.setStartRow(startRow);
		selfIntroQVO.setEndRow(endRow);

		List<ComCodeVO> codeVOList = selfIntroService.selectSelfIntroComCodeList();
		log.info("codeVOList", codeVOList);

		Map<String, String> codeMap = new HashMap();

		for (ComCodeVO code : codeVOList) {
			String key = code.getCcId(); 
			String value = code.getCcName();
			codeMap.put(key, value);
		}

		int total = selfIntroService.selectSelfIntroQCount(selfIntroQVO);

		List<SelfIntroQVO> selfIntroQVOList = selfIntroService.selectSelfIntroQList(selfIntroQVO);

		ArticlePage<SelfIntroQVO> page = new ArticlePage<>(total, currentPage, size, selfIntroQVOList, keyword);
		page.setUrl("/cdp/sint/qestnlst/questionList.do");

		model.addAttribute("memId", memId);
		model.addAttribute("codeMap", codeMap);
		model.addAttribute("codeVOList", codeVOList);
		model.addAttribute("articlePage", page);
		model.addAttribute("siqJobFilter", siqJobFilter); 
		return "cdp/sint/qestnlst/questionList"; 
	}

	@PostMapping("/cart")
	public String saveCart(@RequestParam("questionIds") String questionIds, HttpSession session,
			@AuthenticationPrincipal String memId, HttpServletRequest requset) {
		int id = Integer.parseInt(memId);
		List<Integer> questionIdList = Arrays.stream(questionIds.split(",")).filter(s -> !s.isBlank()).map(Integer::valueOf)
				.collect(Collectors.toList());

		log.info("questionIdList" + questionIdList);

		SelfIntroVO selfIntroVO = new SelfIntroVO();
		selfIntroVO.setMemId(id);

		log.info("selfIntroVO" + selfIntroVO);

		int siId = selfIntroService.insertIntroToQList(selfIntroVO, questionIdList);
		log.info("siId : " + siId);

		requset.setAttribute("siId", siId);
		return "redirect:/cdp/sint/sintwrt/selfIntroWriting.do?siId=" + siId;
	}

}
