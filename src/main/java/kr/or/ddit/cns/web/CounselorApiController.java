package kr.or.ddit.cns.web;

import java.security.Principal;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.cns.service.CounselingLogVO;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.cns.service.CounselorService;
import kr.or.ddit.cns.service.VacationVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/cns")
public class CounselorApiController {

	@Autowired
	CounselorService counselorService;

	/**
	 * 상담일지 출력을 위해 상담완료된 상담 목록 조회
	 * 
	 * @param counselingVO
	 * @param counselStr
	 * @return
	 */
	@GetMapping("/counselList.do")
	public ResponseEntity<ArticlePage<CounselingVO>> counselList(CounselingVO counselingVO,
			@AuthenticationPrincipal String counselStr) {
		counselingVO.setCounsel(Integer.parseInt(counselStr));
		ArticlePage<CounselingVO> articlePage = this.counselorService.selectCompletedCounselList(counselingVO);
		return ResponseEntity.ok(articlePage);
	}

	@GetMapping("/counselDetail.do")
	public ResponseEntity<CounselingVO> counselDetail(@RequestParam int counselId) {
		CounselingVO counselingVO = counselorService.selectCounselDetail(counselId);
		return ResponseEntity.ok(counselingVO);
	}

	@PostMapping(value = "/updateCnsLog.do", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> updateCnsLog(@ModelAttribute CounselingLogVO counselingLogVO) {
		boolean result = this.counselorService.updateCnsLog(counselingLogVO);
		String status = counselingLogVO.getClConfirm();

		if (result && status == null) {
			return ResponseEntity.ok("저장완료");
		}
		if (result && status.equals("S03001")) {
			return ResponseEntity.ok("제출완료");
		}

		return ResponseEntity.internalServerError().build();
	}

	@GetMapping("/counsel/deleteFile.do")
	public ResponseEntity<Boolean> deleteFile(@RequestParam Long fileGroupId, @RequestParam int seq) {
		return ResponseEntity.ok(this.counselorService.deleteFile(fileGroupId, seq));
	}

	@GetMapping("/myVacationList.do")
	public ResponseEntity<ArticlePage<VacationVO>> myVacationList(VacationVO vacationVO,
			@AuthenticationPrincipal String requestorStr) {
		vacationVO.setVaRequestor(Integer.parseInt(requestorStr));
		ArticlePage<VacationVO> list = this.counselorService.myVacationList(vacationVO);
		return ResponseEntity.ok(list);
	}

	@PostMapping(value = "/insertVacation.do", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Boolean> insertVacation(@ModelAttribute VacationVO vacationVO,
			@AuthenticationPrincipal String requestorStr) {
		vacationVO.setVaRequestor(Integer.parseInt(requestorStr));
		return ResponseEntity.ok(this.counselorService.insertVacation(vacationVO));
	}

	@GetMapping("/disabledDateList.do")
	public ResponseEntity<List<String>> disabledDateList(@AuthenticationPrincipal String requestorStr) {
		List<String> disabledDateList = this.counselorService.disabledDateList(Integer.parseInt(requestorStr));
		return ResponseEntity.ok(disabledDateList);
	}

	@GetMapping("/bookedScheduleList.do")
	public ResponseEntity<List<CounselingVO>> bookedScheduleList(
			@RequestParam("counselReqDatetime") @DateTimeFormat(pattern = "yyyy-MM-dd") Date counselReqDatetime,
			Principal principal) {

		if (principal != null && !principal.getName().equals("anonymousUser")) {
			CounselingVO counselingVO = new CounselingVO();
			String counselorStr = principal.getName();
			int counselor = Integer.parseInt(counselorStr);

			counselingVO.setCounsel(counselor);
			counselingVO.setCounselReqDatetime(counselReqDatetime);

			List<CounselingVO> counselingVOList = this.counselorService.selectCounselingSchedules(counselingVO);
			return ResponseEntity.ok(counselingVOList);
		} else {
			return null;
		}
	}

	@GetMapping("/updateCounselStatus.do")
	public ResponseEntity<String> updateCounselStatus(@ModelAttribute CounselingVO counselingVO,Integer payId) {
		String result = this.counselorService.updateCounselStatus(counselingVO,payId);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping("/counseling/monthly-counts.do")
	public ResponseEntity<List<CounselingVO>> getMonthlyCounselingCounts(
			Principal principal,
			@RequestParam("counselReqDatetime") @DateTimeFormat(pattern = "yyyy-MM") Date counselReqDatetime
			) {
	    if (principal == null || principal.getName().equals("anonymousUser")) {
	        return ResponseEntity.status(401).build(); // Unauthorized
	    }
	    String counselorStr = principal.getName();
	    int counselor = Integer.parseInt(counselorStr);
	    
	    // 이 객체를 Mapper로 넘겨서 해당 상담사의 월별 상담 데이터를 조회
	    CounselingVO searchVO = new CounselingVO();
	    searchVO.setCounsel(counselor);
	    searchVO.setCounselReqDatetime(counselReqDatetime);
	    List<CounselingVO> counselingList = counselorService.selectMonthlyCounselingData(searchVO);

	    return ResponseEntity.ok(counselingList);
	}
}
