package kr.or.ddit.prg.act.vol.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.prg.act.service.ActivityVO;
import kr.or.ddit.prg.act.vol.service.ActivityVolunteerService;
import kr.or.ddit.prg.ctt.service.ContestService;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/prg/act/vol")
public class ActivityVolunteerController {

	@Autowired
	ActivityVolunteerService activityVolunteerService;

	@Autowired
	private ContestService contestService;

	@GetMapping("/volList.do")
	public String selectVolList(Model model, @RequestParam(defaultValue = "1") int currentPage,
			@RequestParam(required = false) String keyword,
			@RequestParam(value = "contestGubunFilter", required = false) List<String> contestGubunFilter,
			@RequestParam(value = "contestTargetFilter", required = false) List<String> contestTargetFilter,
			@RequestParam(value = "contestStatusFilter", required = false) List<String> contestStatusFilter,
			@RequestParam(value = "sortOrder", required = false) String sortOrder) {

		ActivityVO activityVO = new ActivityVO();
		activityVO.setKeyword(keyword);
		activityVO.setCurrentPage(currentPage);
		activityVO.setSize(6);
		activityVO.setContestGubunFilter(contestGubunFilter);
		activityVO.setContestTargetFilter(contestTargetFilter);
		activityVO.setContestStatusFilter(contestStatusFilter);
		activityVO.setSortOrder(sortOrder);

		int total = activityVolunteerService.selectVolCount(activityVO);
		List<ActivityVO> contestList = activityVolunteerService.selectVolList(activityVO);

		// 공모전과 동일하게 모집대상(청년/청소년)을 사용하는것이니 만들어둔 매소드를 활용한다
		List<ComCodeVO> contestTargetList = contestService.getContestTargetList();

		// JSP 필터에 사용될 데이터
		model.addAttribute("contestTargetList", contestTargetList);

		ArticlePage<ActivityVO> page = new ArticlePage<>(total, currentPage, 6, contestList, keyword);
		page.setUrl("/prg/ctt/cttList.do");
		model.addAttribute("articlePage", page);
		model.addAttribute("checkedFilters", activityVO);

		return "prg/act/vol/volList";
	}

	@GetMapping("/volDetail.do")
	public String selectVolDetail(@RequestParam String volId, Model model) {
		ActivityVO volDetail = activityVolunteerService.selectVolDetail(volId);
		model.addAttribute("volDetail", volDetail);

		return "prg/act/vol/volDetail";
	}

}
