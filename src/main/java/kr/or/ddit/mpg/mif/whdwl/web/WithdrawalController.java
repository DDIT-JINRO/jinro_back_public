package kr.or.ddit.mpg.mif.whdwl.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.mpg.mif.whdwl.service.WithdrawalService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class WithdrawalController {

	@Autowired
	WithdrawalService withdrawalService;
	
	/**
	 * 페이지 이동 전 회원 탈퇴 분류 조회 후 이동
	 * 
	 * @param model
	 * @return url이동
	 */
	@GetMapping("/mif/whdwl/selectWithdrawalView.do")
	public String selectWithdrawalView (@AuthenticationPrincipal String memId, Model model, RedirectAttributes redirectAttributes) {
		try {
			Map<String, Object> map = this.withdrawalService.selectMdcategoryList(memId);
			model.addAllAttributes(map);
			return "mpg/mif/whdwl/selectWithdrawalView";
		} catch (CustomException e) {
			log.warn("사용자의 탈퇴 페이지를 로드하는 데 실패했습니다. " + memId + " : " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", e.getErrorCode().getMessage());
			return "redirect:/login";
		} catch (Exception e) {
			log.error("사용자 탈퇴 페이지에서 예상치 못한 오류가 발생했습니다. " + memId + " : " + e);
			redirectAttributes.addFlashAttribute("errorMessage", "알 수 없는 오류가 발생했습니다.");
			return "redirect:/";
		}
	}
	
	/**
	 * 회원 탈퇴 신청
	 * 
	 * @param memId 멤버 id
	 * @param map 비밀번호, 탈퇴 카테고리, 탈퇴 사유
	 * @return 탈퇴 신청 여부
	 */
	@ResponseBody
	@PostMapping("/mif/whdwl/insertMemDelete.do")
	public ResponseEntity<Map<String, String>> insertMemDelete (@AuthenticationPrincipal String memId, @RequestBody Map<String, Object> map) {
		Map<String, String> response = new HashMap<>();
		try {
			withdrawalService.insertMemDelete(memId, map);
			response.put("status", "success");
			response.put("message", "회원 탈퇴가 정상적으로 신청되었습니다.<br> 7일 후에 정보가 삭제됩니다.");
			return ResponseEntity.ok(response);
		} catch (CustomException e) {
			ErrorCode errorCode = e.getErrorCode();
			response.put("status", "error");
			response.put("message", errorCode.getMessage());
			return new ResponseEntity<>(response, errorCode.getStatus());
		} catch (Exception e) {
			log.error("사용자 탈퇴 중 예상치 못한 오류 발생 " + memId + " : " + e);
            response.put("status", "error");
            response.put("message", "서버 내부 오류로 인해 탈퇴 처리에 실패했습니다.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
