package kr.or.ddit.cdp.imtintrvw.intrvwqestnlst.web;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.ddit.cdp.imtintrvw.intrvwqestnmn.service.InterviewQuestionMangementService;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailListVO;
import kr.or.ddit.cdp.sint.service.SelfIntroQVO;
import kr.or.ddit.cdp.sint.service.SelfIntroService;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.util.ArticlePage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cdp/imtintrvw/intrvwqestnlst")
@Controller
@Slf4j
@RequiredArgsConstructor
public class InterviewQuestionListController {

	private final SelfIntroService selfIntroService;

	private final InterviewQuestionMangementService interviewQuestionMangementService;

	@GetMapping("/intrvwQuestionList.do")
	public String intrvwQuestionList(@RequestParam(required = false) String keyword,
			@RequestParam(value = "siqJobFilter", required = false) List<String> siqJobFilter,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "5") int size, Principal principal,
			Model model) {

		if (siqJobFilter == null || (siqJobFilter.size() == 1 && siqJobFilter.get(0).isEmpty())) {
			siqJobFilter = new ArrayList<>();
		}

		SelfIntroQVO selfIntroQVO = new SelfIntroQVO();
		selfIntroQVO.setKeyword(keyword);
		selfIntroQVO.setSiqJobFilter(siqJobFilter);
		selfIntroQVO.setStartRow((currentPage - 1) * size);
		selfIntroQVO.setEndRow(currentPage * size);

		List<ComCodeVO> codeVOList = selfIntroService.selectSelfIntroComCodeList();

		Map<String, String> codeMap = new HashMap<>();

		for (ComCodeVO code : codeVOList) {
			String key = code.getCcId();
			String value = code.getCcName();
			codeMap.put(key, value);
		}

		int total = selfIntroService.selectSelfIntroQCount(selfIntroQVO);

		List<SelfIntroQVO> selfIntroQVOList = selfIntroService.selectSelfIntroQList(selfIntroQVO);

		ArticlePage<SelfIntroQVO> page = new ArticlePage<>(total, currentPage, size, selfIntroQVOList, keyword);
		page.setUrl("/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do");

		String memIdStr = (principal != null && !"anonymousUser".equals(principal.getName())) ? principal.getName()	: "";
		model.addAttribute("memId", memIdStr);
		model.addAttribute("codeMap", codeMap);
		model.addAttribute("codeVOList", codeVOList);
		model.addAttribute("articlePage", page);
		model.addAttribute("siqJobFilter", siqJobFilter);

		return "cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList";
	}

	@PostMapping("/cart")
	public String saveCart(@RequestParam("questionIds") String questionIds,
				            Principal principal,
				            HttpServletRequest request) {
		if (principal == null || "anonymousUser".equals(principal.getName())) {
	        return "redirect:/login";
	    }
		int id = Integer.parseInt(principal.getName());
		// 선택 질문 파싱
		List<Integer> iqIdList = Arrays.stream(questionIds.split(",")).filter(s -> !s.isBlank()).map(Integer::valueOf)
				.collect(Collectors.toList());

		if (iqIdList.isEmpty()) {
			// 선택 없으면 리스트로 돌려보내기(경고 플래그 등 필요시 추가)
			return "redirect:/cdp/imtintrvw/intrvwqestnlst/intrvwQuestionList.do";
		}

		// 1) 헤더 생성 (상태는 작성중, 제목은 기본값)
		InterviewDetailListVO header = new InterviewDetailListVO();
		header.setMemId(id);
		header.setIdlTitle("새 면접 질문"); // DB가 NULL 허용이면 생략 가능
		header.setIdlStatus("작성중");

		int newIdlId = interviewQuestionMangementService.insertInterviewQuestionId(header);

		// 2) 디테일 생성 (답변은 빈 문자열로 초기화)
		List<String> idAnswerList = iqIdList.stream().map(x -> "").collect(Collectors.toList());
		interviewQuestionMangementService.insertInterviewDetails(newIdlId, iqIdList, idAnswerList);

		// 3) 작성 페이지로 이동
		request.setAttribute("idlId", newIdlId);
		return "redirect:/cdp/imtintrvw/intrvwqestnmn/detail.do?idlId=" + newIdlId;
	}

}
