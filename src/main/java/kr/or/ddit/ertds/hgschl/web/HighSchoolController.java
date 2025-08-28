package kr.or.ddit.ertds.hgschl.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.ertds.hgschl.service.HighSchoolDeptVO;
import kr.or.ddit.ertds.hgschl.service.HighSchoolService;
import kr.or.ddit.ertds.hgschl.service.HighSchoolVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/ertds")
@Controller
@Slf4j
public class HighSchoolController {

	@Autowired
	private HighSchoolService highSchoolService;

	// 고등학교 리스트
	@GetMapping("/hgschl/selectHgschList.do")
	public String highSchoolListPage(@RequestParam(defaultValue = "1") int currentPage,
			@RequestParam(required = false) String keyword,
			@RequestParam(value = "regionFilter", required = false) List<String> regionFilter,
			@RequestParam(value = "schoolType", required = false) List<String> schoolType,
			@RequestParam(value = "coedTypeFilter", required = false) List<String> coedTypeFilter,
			@RequestParam(value = "sortOrder", required = false) String sortOrder,
			 Model model) {

		int size = 5; // 한 페이지에 5개
		int startRow = (currentPage - 1) * size;
		int endRow = currentPage * size;

		if (regionFilter == null) {
			regionFilter = new ArrayList<>();
		}

		HighSchoolVO highSchoolVO = new HighSchoolVO();
		highSchoolVO.setKeyword(keyword);
		highSchoolVO.setRegionFilter(regionFilter);
		highSchoolVO.setSchoolType(schoolType);
		highSchoolVO.setCoedTypeFilter(coedTypeFilter);
		highSchoolVO.setSortOrder(sortOrder);
		highSchoolVO.setStartRow(startRow);
		highSchoolVO.setEndRow(endRow);

		List<ComCodeVO> regionList = highSchoolService.selectRegionList();
		List<ComCodeVO> schoolTypeList = highSchoolService.selectSchoolTypeList();
		List<ComCodeVO> coedTypeList = highSchoolService.selectCoedTypeList();

		model.addAttribute("regionList", regionList);
		model.addAttribute("schoolTypeList", schoolTypeList);
		model.addAttribute("coedTypeList", coedTypeList);

		int total = highSchoolService.selectHighSchoolCount(highSchoolVO);
		List<HighSchoolVO> schoolList = highSchoolService.highSchoolList(highSchoolVO);
		log.info("schoolList", schoolList);

		ArticlePage<HighSchoolVO> page = new ArticlePage<>(total, currentPage, size, schoolList, keyword);
		page.setUrl("/ertds/hgschl/selectHgschList.do");

		model.addAttribute("articlePage", page);
		model.addAttribute("checkedRegionFilter", highSchoolVO);

		return "ertds/hgschl/HighSchoolList"; // /WEB-INF/views/erds/hgschl/list.jsp
	}

	// 고등학교 상세
	@GetMapping("/hgschl/selectHgschDetail.do")
	public String highSchoolDetailPage(@RequestParam("hsId") int hsId, Model model) {

		// 1. 기존 학교 상세 정보 조회
		HighSchoolVO highSchool = highSchoolService.highSchoolDetail(hsId); // DB에서 상세 정보를 조회

		// 2. 해당 학교의 학과 목록 조회
		List<HighSchoolDeptVO> deptList = highSchoolService.selectDeptsBySchoolId(hsId);

		// 3. 모델에 두 가지 정보를 모두 담아서 전달
		model.addAttribute("highSchool", highSchool); // HighSchoolVO 객체 자체를 JSP로 전달
		model.addAttribute("deptList", deptList);

		return "ertds/hgschl/HighSchoolDetail"; // /WEB-INF/views/erds/hgschl/detail.jsp
	}

	// ----------------------------------------------------------------------
	// 고등학교 정보 CRUD
	// ----------------------------------------------------------------------

	/**
	 * 고등학교 정보를 DB에 추가하는 메서드
	 *
	 * @param highSchoolVO JSON 형식의 HighSchoolVO 객체
	 * @return 성공 여부를 담은 ResponseEntity
	 */
	@PostMapping("/hgschl/highSchoolinsert.do")
	@ResponseBody
	public ResponseEntity<String> highSchoolInsert(@RequestBody HighSchoolVO highSchoolVO) {
		log.info("highSchoolInsert 요청 수신: {}", highSchoolVO);
		int cnt = highSchoolService.highSchoolInsert(highSchoolVO);

		if (cnt > 0) {
			return ResponseEntity.ok("성공적으로 추가되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("고등학교 정보 추가 실패");
		}
	}

	/**
	 * 고등학교 정보를 수정하는 메서드
	 *
	 * @param highSchoolVO JSON 형식의 HighSchoolVO 객체
	 * @return 성공 여부를 담은 ResponseEntity
	 */
	@PostMapping("/hgschl/highSchoolupdate.do")
	@ResponseBody
	public ResponseEntity<String> highSchoolUpdate(@RequestBody HighSchoolVO highSchoolVO) {
		log.info("highSchoolUpdate 요청 수신: {}", highSchoolVO);
		int cnt = highSchoolService.highSchoolUpdate(highSchoolVO);

		if (cnt > 0) {
			return ResponseEntity.ok("성공적으로 수정되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("고등학교 정보 수정 실패");
		}
	}

	/**
	 * 고등학교 정보를 논리적으로 삭제하는 메서드
	 *
	 * @param highSchoolVO JSON 형식의 HighSchoolVO 객체 (hsId 포함)
	 * @return 성공 여부를 담은 ResponseEntity
	 */
	@PostMapping("/hgschl/highSchooldelete.do")
	@ResponseBody
	public ResponseEntity<String> highSchoolDelete(@RequestBody HighSchoolVO highSchoolVO) {
		log.info("highSchoolDelete 요청 수신: {}", highSchoolVO);
		int cnt = highSchoolService.highSchoolDelete(highSchoolVO.getHsId());

		if (cnt > 0) {
			return ResponseEntity.ok("성공적으로 삭제되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("고등학교 정보 삭제 실패");
		}
	}

	/**
	 * 고등학교 학과 정보를 DB에 추가하는 메서드
	 *
	 * @param highSchoolDeptVO JSON 형식의 HighSchoolDeptVO 객체
	 * @return 성공 여부를 담은 ResponseEntity
	 */
	@PostMapping("/hgschl/highSchoolDeptInsert.do")
	@ResponseBody
	public ResponseEntity<String> highSchoolDeptInsert(@RequestBody HighSchoolDeptVO highSchoolDeptVO) {
		log.info("highSchoolDeptInsert 요청 수신: {}", highSchoolDeptVO);
		int cnt = highSchoolService.highSchoolDeptInsert(highSchoolDeptVO);

		if (cnt > 0) {
			return ResponseEntity.ok("성공적으로 학과가 추가되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("고등학교 학과 추가 실패");
		}
	}

	/**
	 * 고등학교 학과 정보를 수정하는 메서드
	 *
	 * @param highSchoolDeptVO JSON 형식의 HighSchoolDeptVO 객체
	 * @return 성공 여부를 담은 ResponseEntity
	 */
	@PostMapping("/hgschl/highSchoolDeptUpdate.do")
	@ResponseBody
	public ResponseEntity<String> highSchoolDeptUpdate(@RequestBody HighSchoolDeptVO highSchoolDeptVO) {
		log.info("highSchoolDeptUpdate 요청 수신: {}", highSchoolDeptVO);
		int cnt = highSchoolService.highSchoolDeptUpdate(highSchoolDeptVO);

		if (cnt > 0) {
			return ResponseEntity.ok("성공적으로 학과가 수정되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("고등학교 학과 수정 실패");
		}
	}

	/**
	 * 고등학교 학과 정보를 논리적으로 삭제하는 메서드
	 *
	 * @param hsdId 삭제할 학과의 ID
	 * @return 성공 여부를 담은 ResponseEntity
	 */
	@PostMapping("/hgschl/highSchoolDeptDelete.do")
	@ResponseBody
	public ResponseEntity<String> highSchoolDeptDelete(@RequestBody HighSchoolDeptVO highSchoolDeptVO) {
		log.info("highSchoolDeptDelete 요청 수신: {}", highSchoolDeptVO);
		int cnt = highSchoolService.highSchoolDeptDelete(highSchoolDeptVO.getHsdId());

		if (cnt > 0) {
			return ResponseEntity.ok("성공적으로 학과가 삭제되었습니다.");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("고등학교 학과 삭제 실패");
		}
	}

}
