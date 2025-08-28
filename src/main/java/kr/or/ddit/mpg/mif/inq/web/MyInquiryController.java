package kr.or.ddit.mpg.mif.inq.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.inq.service.MyInquiryService;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class MyInquiryController {

	@Autowired
	MyInquiryService myInquiryService;
	
	@Autowired
	FileService fileService;

	/**
	 * 마이페이지 진입 전 멤버의 정보를 확인합니다.
	 * 
	 * @param memId 멤버id
	 * @param model 모델
	 * @return url 페이지 이동
	 */
	@GetMapping("/mif/inq/selectMyInquiryView.do")
	public String selectMyInquiryView(@AuthenticationPrincipal String memId, Model model, RedirectAttributes redirectAttributes) {
		try {
			Map<String, Object> map = this.myInquiryService.selectMyInquiryView(memId);
			model.addAllAttributes(map);
			return "mpg/mif/inq/selectMyInquiryView";
		} catch (CustomException e) {
			log.warn("사용자 정보 조회 페이지를 로드하는 동안 오류가 발생했습니다. " + memId + " : " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", e.getErrorCode().getMessage());
			return "redirect:/login";
		} catch (Exception e) {
			log.warn("사용자 정보 조회 페이지를 로드하는 동안 오류가 발생했습니다. " + memId + " : " + e);
			redirectAttributes.addFlashAttribute("errorMessage", "서비스 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
			return "redirect:/";
		}
	}

	/**
	 * 멤버의 비밀번호를 확인합니다.
	 * 
	 * @param memId 멤버id
	 * @param map   확인용 비밀번호
	 * @return 일치 여부
	 */
	@ResponseBody
	@PostMapping("/mif/inq/checkPassword.do")
	public ResponseEntity<Map<String, String>> checkPassword(@AuthenticationPrincipal String memId, @RequestBody Map<String, String> map) {
		Map<String, String> response = new HashMap<>();
		try {
			myInquiryService.checkPassword(memId, map.get("password"));
			response.put("status", "success");
			response.put("message", "비밀번호가 확인되었습니다.");
			return ResponseEntity.ok(response);
		} catch (CustomException e) {
			ErrorCode errorCode = e.getErrorCode();
			response.put("status", "error");
			response.put("message", errorCode.getMessage());
			return new ResponseEntity<>(response, errorCode.getStatus());
		}
	}

	/**
	 * form데이터로 받은 변경 내용을 업데이트합니다.
	 * 
	 * @param memId  멤버id
	 * @param member 변경 내용
	 * @return result 결과값
	 */
	@PostMapping("/mif/inq/updateMyInquiryDetail.do")
	public String updateMyInquiryView(@AuthenticationPrincipal String memId, MemberVO member, RedirectAttributes redirectAttributes) {
		try {
			this.myInquiryService.updateMyInquiryView(memId, member);
			redirectAttributes.addFlashAttribute("successMessage", "회원 정보가 성공적으로 수정되었습니다.");
			return "redirect:/mpg/mif/inq/selectMyInquiryView.do";
		} catch (CustomException e) {
			log.warn("사용자 정보를 업데이트하지 못했습니다. " + memId + " : " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", e.getErrorCode().getMessage());
			return "redirect:/mpg/mif/inq/selectMyInquiryView.do";
		} catch (Exception e) {
			log.error("사용자 정보 업데이트 중 예기치 않은 오류가 발생했습니다. "+ memId +" : " + e);
			redirectAttributes.addFlashAttribute("errorMessage", "알 수 없는 오류로 정보 수정에 실패했습니다.");
			return "redirect:/mpg/mif/inq/selectMyInquiryView.do";
		}
	}

	/**
	 * 멤버의 프로필 이미지를 변경합니다.
	 * 
	 * @param memId      멤버id
	 * @param profileImg 프로필이미지
	 * @return result 결과값
	 */
	@ResponseBody
	@PostMapping("/mif/inq/updateProfileImg.do")
	public ResponseEntity<Map<String, Object>> updateProfileImg(@AuthenticationPrincipal String memId, @RequestParam MultipartFile profileImg) {
		Map<String, Object> response = new HashMap<>();
		try {
			FileDetailVO fileDetail = this.myInquiryService.updateProfileImg(memId, profileImg);
			response.put("status", "success");
			response.put("message", "프로필 이미지가 성공적으로 변경되었습니다.");
			response.put("imgPath", fileService.getSavePath(fileDetail));
			return ResponseEntity.ok(response);
		} catch (CustomException e) {
			ErrorCode errorCode = e.getErrorCode();
			response.put("status", "error");
			response.put("message", errorCode.getMessage());
			return new ResponseEntity<>(response, errorCode.getStatus());
		}
	}

	/**
	 * 멤버의 관심사 키워드를 입력 or 변경합니다.
	 * 
	 * @param memId      멤버id
	 * @param interestKeyword 관심사키워드
	 * @return 이동 url
	 */
	@PostMapping("/mif/inq/insertInterestList.do")
	public String insertInterestList(@AuthenticationPrincipal String memId, @RequestParam(name = "filter-keyword", required = false) List<String> interestKeyword, RedirectAttributes redirectAttributes) {
		try {
			this.myInquiryService.insertInterestList(memId, interestKeyword);
			redirectAttributes.addFlashAttribute("successMessage", "관심분야가 성공적으로 수정되었습니다.");
			return "redirect:/mpg/mif/inq/selectMyInquiryView.do";
		} catch (Exception e) {
			log.error("관심분야 업데이트 중 오류가 발생했습니다. " + memId + " : " + e);
			redirectAttributes.addFlashAttribute("errorMessage", "관심분야 수정 중 오류가 발생했습니다.");
			return "redirect:/mpg/mif/inq/selectMyInquiryView.do";
		}
	}

	@ResponseBody
	@PostMapping("/mif/inq/insertStudentAuth.do")
	public ResponseEntity<Map<String, Object>> insertStudentAuth(@AuthenticationPrincipal String memId, @RequestParam MultipartFile authFile) {
		Map<String, Object> response = new HashMap<>();
		try {
			this.myInquiryService.insertVerification(memId, "G38001", authFile);
			response.put("status", "success");
			response.put("message", "학생 인증 신청이 성공적으로 변경되었습니다.");
			return ResponseEntity.ok(response);
		} catch (CustomException e) {
			ErrorCode errorCode = e.getErrorCode();
			response.put("status", "error");
			response.put("message", errorCode.getMessage());
			return new ResponseEntity<>(response, errorCode.getStatus());
		}
	}
	
	@PostMapping("/mif/inq/updateMemberPhone.do")
	@ResponseBody
	public String updateMemberPhone(@AuthenticationPrincipal String memId, @RequestBody Map<String, Object> requestBody, Model model) {
		String imp_uid = (String) requestBody.get("imp_uid");
		int res = myInquiryService.updateMemberPhone(imp_uid, memId);
		
		if(res > 0) {
			return "번호 변경이 완료되었습니다.";
		} else {
			return "번호 변경이 실패하였습니다.";
		}
		
		 
	}
}
