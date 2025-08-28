package kr.or.ddit.ertds.qlfexm.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.ddit.ertds.qlfexm.service.QualficationExamVO;
import kr.or.ddit.ertds.qlfexm.service.QualificationExamService;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/ertds")
@Controller
@Slf4j
public class QualificationExamController {

	@Autowired
	QualificationExamService qualificationExamService;

	// 검정고시
	@GetMapping("/qlfexm/selectQlfexmList.do")
	public String qlfexmListPage(Model model,
		    @RequestParam(required = false) String keyword,
		    @RequestParam(value="currentPage",required=false,defaultValue="1") int currentPage,
		    @RequestParam(value="size",required=false,defaultValue="5") int size,
		    @RequestParam(value="sortOrder",required=false) String sortOrder) {

		// 목록 조회
		ArticlePage<QualficationExamVO> articlePage= qualificationExamService.getList(keyword,currentPage,size,sortOrder);
	    model.addAttribute("articlePage", articlePage);
	    model.addAttribute("getTotal", articlePage.getTotal());
	    model.addAttribute("getList", articlePage.getContent());

		return "ertds/qlfexm/selectQlfexmList"; // /WEB-INF/views/erds/qlfexm/list.jsp
	}

	@GetMapping("/qlfexm/selectQlfexmDetail.do")
	public String selectQlfexmDetail(@RequestParam String examId,Model model) {

		// 상세 조회
		QualficationExamVO qualficationExamVO = qualificationExamService.getDetail(examId);
	    model.addAttribute("qualficationExamVO", qualficationExamVO);
		return "ertds/qlfexm/selectQlfexmDetail"; // /WEB-INF/views/erds/qlfexm/list.jsp
	}

}
