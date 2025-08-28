package kr.or.ddit.admin.cmg.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.cmg.service.ContentsManagementService;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.enp.service.CompanyVO;
import kr.or.ddit.empt.enp.service.InterviewReviewVO;
import kr.or.ddit.prg.act.cr.service.ActivityCareerExpService;
import kr.or.ddit.prg.act.service.ActivityVO;
import kr.or.ddit.prg.act.sup.service.ActivitySupportersService;
import kr.or.ddit.prg.act.vol.service.ActivityVolunteerService;
import kr.or.ddit.prg.ctt.service.ContestService;
import kr.or.ddit.prg.ctt.service.ContestVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.impl.FileServiceImpl;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin/cmg")
@Slf4j
public class ContentsManagementController {

	@Autowired
	ContentsManagementService contentsManagementService;
	
	@Autowired
	private ActivityVolunteerService activityVolunteerService;
	
	@Autowired
	private ContestService contestService;
	
	@Autowired
	private FileServiceImpl fileServiceImpl;
	
	@Autowired
	private ActivityCareerExpService activityCareerExpService;
	
	@Autowired
	private ActivitySupportersService activitySupportersService;

	@GetMapping("/getEntList.do")
	public ArticlePage<CompanyVO> getEntList(CompanyVO companyVO) {

		companyVO.setStartNo(1);
		return contentsManagementService.getEntList(companyVO);

	}

	@PostMapping("/entDetail.do")
	public Map<String, Object> entDetail(@RequestParam String id) {

		return contentsManagementService.entDetail(id);
	}
	
	@GetMapping("/selectActList.do")
	public ResponseEntity<Map<String, Object>> selectActList(
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "1") int currentPage,
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String category,
			@RequestParam(required = false) List<String> contestGubunFilter,
			@RequestParam(required = false) List<String> contestTargetFilter,
			@RequestParam(required = false) List<String> contestStatusFilter) {
		Map<String, Object> response = new HashMap<>();
		
		ActivityVO activityVO = new ActivityVO();
		activityVO.setKeyword(keyword);
		activityVO.setCurrentPage(currentPage);
		activityVO.setSize(size);
		activityVO.setContestGubunFilter(contestGubunFilter);
		activityVO.setContestTargetFilter(contestTargetFilter);
		activityVO.setContestStatusFilter(contestStatusFilter);
		activityVO.setSortOrder("id");
		
		List<ActivityVO> activityList = new ArrayList<>();
		int total = 0;
		
		switch (category) {
		case "vol": {
			total = activityVolunteerService.selectVolCount(activityVO);
			activityList = activityVolunteerService.selectVolList(activityVO);
			break;
		}
		case "cr": {
			total = activityCareerExpService.selectCrCount(activityVO);
			activityList = activityCareerExpService.selectCrList(activityVO);
			break;
		}
		case "sup": {
			total = activitySupportersService.selectSupCount(activityVO);
			activityList = activitySupportersService.selectSupList(activityVO);
			break;
		}
		default:
			throw new IllegalArgumentException("Unexpected value: " + category);
		}
		
		if(activityList == null || activityList.isEmpty()) {
			response.put("success", false);
			response.put("message", "리스트 로딩 중 에러 발생");
			return ResponseEntity.ok(response);
		}

		// 공모전과 동일하게 모집대상(청년/청소년)을 사용하는것이니 만들어둔 매소드를 활용한다
		List<ComCodeVO> contestTargetList = contestService.getContestTargetList();
		List<ComCodeVO> contestTypeList = contestService.getContestTypeList();
		
		ArticlePage<ActivityVO> articlePage = new ArticlePage<>(total, currentPage, 10, activityList, keyword);
		response.put("success", true);
		response.put("contestTargetList", contestTargetList);
		response.put("articlePage", articlePage);
		response.put("activityVO", activityVO);
		response.put("contestTypeList", contestTypeList);
		
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/selectActDetail.do")
	public ResponseEntity<Map<String, Object>> selectActDetail(@RequestParam String id) {
		Map<String, Object> response = new HashMap<>();
	
		ActivityVO activity = activityVolunteerService.selectVolDetail(id);
		
		if(activity == null) {
			response.put("success", false);
			response.put("message", "데이터 로딩 중 에러 발생");
			return ResponseEntity.ok(response);
		}
		
		Long fileId = activity.getFileGroupId();
		FileDetailVO fileDetail = fileServiceImpl.getFileDetail(fileId, 1);
		String savePath = fileServiceImpl.getSavePath(fileDetail);
		activity.setSavePath(savePath);
		
		response.put("success", true);
		response.put("activity", activity);
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/selectCttList.do")
	public ResponseEntity<Map<String, Object>> selectCttList(
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "1") int currentPage,
			@RequestParam(required = false) String keyword,
			@RequestParam(required = false) List<String> contestGubunFilter,
			@RequestParam(required = false) List<String> contestTargetFilter,
			@RequestParam(required = false) List<String> contestTypeFilter,
			@RequestParam(required = false) List<String> contestStatusFilter) {
		Map<String, Object> response = new HashMap<>();
	
		ContestVO contestVO = new ContestVO();
		contestVO.setKeyword(keyword);
		contestVO.setCurrentPage(currentPage);
		contestVO.setSize(size);
		contestVO.setContestGubunFilter(contestGubunFilter);
		contestVO.setContestTargetFilter(contestTargetFilter);
		contestVO.setContestTypeFilter(contestTypeFilter);
		contestVO.setContestStatusFilter(contestStatusFilter);
		contestVO.setSortOrder("id");

		List<ContestVO> contestList = contestService.selectCttList(contestVO);
		
//		if(contestList == null || contestList.isEmpty()) {
//			response.put("success", false);
//			response.put("message", "리스트 불러오는 중 에러 발생");
//			return ResponseEntity.ok(response);
//		}
		
		int total = contestService.selectCttCount(contestVO);
		List<ComCodeVO> contestTypeList = contestService.getContestTypeList();
		List<ComCodeVO> contestTargetList = contestService.getContestTargetList();
		ArticlePage<ContestVO> articlePage = new ArticlePage<>(total, currentPage, size, contestList, keyword,10);

		response.put("success", true);
		response.put("contestTypeList", contestTypeList);
		response.put("contestTargetList", contestTargetList);
		response.put("articlePage", articlePage);

		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/selectCctDetail.do")
	public ResponseEntity<Map<String, Object>> selectCctDetail(@RequestParam String id) {
		Map<String, Object> response = new HashMap<>();
		ContestVO cttDetail = contestService.selectCttDetail(id);
		
		if(cttDetail == null) {
			response.put("success", false);
			response.put("message", "데이터 로딩 중 에러 발생");
			return ResponseEntity.ok(response);
		}
		
		Long fileId = cttDetail.getFileGroupId();
		FileDetailVO fileDetail = fileServiceImpl.getFileDetail(fileId, 1);
		String savePath = fileServiceImpl.getSavePath(fileDetail);
		cttDetail.setSavePath(savePath);
		
		response.put("success", true);
		response.put("cttDetail", cttDetail);
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/selectReviewList")
	public ResponseEntity<Map<String, Object>> selectReviewList(@ModelAttribute InterviewReviewVO interviewReviewVO) {
		Map<String, Object> response = new HashMap<>();
		
		ArticlePage<InterviewReviewVO> articlePage = contentsManagementService.selectReviewList(interviewReviewVO);
		Map<String, String> irStatus = contentsManagementService.selectIrStatusList();
		
		response.put("articlePage", articlePage);
		response.put("irStatus", irStatus);
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/selectReviewDetail")
	public ResponseEntity<InterviewReviewVO> selectReviewDetail(@RequestParam String irId) {
		
		InterviewReviewVO interviewReview = contentsManagementService.selectReviewDetail(irId);
		
		return ResponseEntity.ok(interviewReview);
	}
	
	@PostMapping("/updateReviewDetail")
	public ResponseEntity<Map<String, Object>> updateReviewDetail(@RequestBody InterviewReviewVO interviewReviewVO) {
	    Map<String, Object> response = new HashMap<>();
	    
	    int result = contentsManagementService.updateReviewDetail(interviewReviewVO);
	    
	    if (result > 0) {
	        response.put("success", true);
	    } else {
	        response.put("success", false);
	    }
	    
	    return ResponseEntity.ok(response);
	}
}
