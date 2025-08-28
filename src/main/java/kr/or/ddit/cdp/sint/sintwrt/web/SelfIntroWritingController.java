package kr.or.ddit.cdp.sint.sintwrt.web;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.cdp.sint.service.SelfIntroContentVO;
import kr.or.ddit.cdp.sint.service.SelfIntroQVO;
import kr.or.ddit.cdp.sint.service.SelfIntroService;
import kr.or.ddit.cdp.sint.service.SelfIntroVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cdp/sint/sintwrt")
@Controller
@Slf4j
@RequiredArgsConstructor
public class SelfIntroWritingController {

	private final SelfIntroService selfIntroService;

	@GetMapping("/selfIntroWriting.do")
	public String showSelfIntroWrite(@RequestParam(value = "siId", required = false) String siId, Model model,
			Principal principal) {

		if (principal == null || principal.getName().equals("anonymousUser")) {
			return "redirect:/login";
		}

		// 1) 공통 질문: SIQ_JOB IS NULL
		List<SelfIntroQVO> commonQList = Collections.emptyList();

		SelfIntroVO selfIntroVO = new SelfIntroVO();

		String memId = principal.getName();
		selfIntroVO.setMemId(Integer.parseInt(memId));

		// 2) 이미 저장된 자기소개서(siId)가 있으면, 그에 딸린 질문·답변
		List<SelfIntroQVO> selfIntroQVOList = Collections.emptyList();
		List<SelfIntroContentVO> selfIntroContentVOList = Collections.emptyList();

		if (siId != null) {
			int id = Integer.parseInt(siId);
			selfIntroVO.setSiId(id);
			selfIntroVO.setMemId(Integer.parseInt(memId));

			// 자소서가 존재하지 않을 경우 에러 반환
			selfIntroVO = selfIntroService.selectBySelfIntroId(selfIntroVO);

			// 맴버 아이디 확인 후 아닐경우 에러 반환
			selfIntroService.cheakselfIntrobyMemId(selfIntroVO, memId);

			// 자소서 Id로 자소서 내용 리스트 반환
			List<SelfIntroContentVO> contentList = selfIntroService.selectBySelfIntroContentIdList(selfIntroVO);

			// contentList 기반으로 질문 VO 리스트
			List<SelfIntroQVO> qList = contentList.stream().map(c -> selfIntroService.selectBySelfIntroQId(c))
					.collect(Collectors.toList());

			model.addAttribute("selfIntroVO", selfIntroVO);
			model.addAttribute("selfIntroContentVOList", contentList);
			model.addAttribute("selfIntroQVOList", qList);

		} else {
			// 새 글 쓰기일 때 빈 VO 하나
			commonQList = selfIntroService.selectCommonQuestions();
			model.addAttribute("selfIntroVO", selfIntroVO);
			model.addAttribute("commonQList", commonQList);
			model.addAttribute("selfIntroQVOList", selfIntroQVOList);
			model.addAttribute("selfIntroContentVOList", selfIntroContentVOList);
		}

		return "cdp/sint/sintwrt/selfIntroWriting";
	}

	@PostMapping("/save")
	public String saveSelfIntro(@RequestParam("siTitle") String siTitle, @RequestParam("siId") Integer siId,
			@RequestParam("siqIdList") List<Integer> siqIdList,
			@RequestParam("sicContentList") List<String> sicContentList, @RequestParam("memId") String memId,
			@RequestParam("siStatus") String siStatus) {

		
		int memberId = Integer.parseInt(memId);

		// 1) SelfIntroVO 셋팅
		SelfIntroVO selfIntroVO = new SelfIntroVO();
		selfIntroVO.setMemId(memberId);
		selfIntroVO.setSiTitle(siTitle);
		selfIntroVO.setSiStatus(siStatus);

		if (siId == 0) {
			// 신규 저장
			// 1-1) SELF_INTRO INSERT → newSiId 리턴
			// selfIntroVO 에 맴버, 제목, 상태를 넣고 저소서 아이디 구한 후 insert 자소서 아이디 return
			int newSiId = selfIntroService.insertIntroId(selfIntroVO);

			selfIntroService.insertContent(newSiId, siqIdList, sicContentList);

		} else {
			// 기존 글 업데이트
			selfIntroVO.setSiId(siId);
			// 2-1) 제목·상태 업데이트
			selfIntroService.updateIntro(selfIntroVO);

			// 1) 기존 CONTENT 리스트 조회
			List<SelfIntroContentVO> existingList = selfIntroService.selectBySelfIntroContentIdList(selfIntroVO);
			// 2) Map<siqId, sicId> 생성
			Map<Integer, Integer> qToSicId = existingList.stream()
					.collect(Collectors.toMap(SelfIntroContentVO::getSiqId, SelfIntroContentVO::getSicId));

			// 3) 전달받은 siqIdList, sicContentList 순회하며 업데이트
			selfIntroService.updateContent(siqIdList, qToSicId, sicContentList);
		}

		return "redirect:/cdp/sint/sintlst/selfIntroList.do";
	}

	@PostMapping("/delete.do")
	public String selfIntroDelete(@RequestParam(required = true) String siId) {
		SelfIntroVO selfIntroVO = new SelfIntroVO();
		selfIntroVO.setSiId(Integer.parseInt(siId));

		// 자소서 전체 삭제
		selfIntroService.deleteSelfIntro(selfIntroVO);

		return "redirect:/cdp/sint/sintlst/selfIntroList.do";
	}

}
