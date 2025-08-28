package kr.or.ddit.mpg.mif.pswdchg.web;

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
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.pswdchg.service.PasswordChangeService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mpg")
@Slf4j
public class PasswordChangeController {
	
	@Autowired
	PasswordChangeService passwordChangeService;

	/**
	 * 비밀번호 변경 페이지 진입 전 멤버의 정보를 확인합니다.
	 * 
	 * @param memId 멤버id
	 * @param model
	 * @return 이동 url
	 */
	@GetMapping("/mif/pswdchg/selectPasswordChangeView.do")
	public String selectPasswordChangeView (@AuthenticationPrincipal String memId, Model model, RedirectAttributes redirectAttributes) {
		try {
			MemberVO member = this.passwordChangeService.selectPasswordChangeView(memId);
			model.addAttribute("member", member);
			return "mpg/mif/pswdchg/selectPasswordChangeView";
		} catch (CustomException e) {
			log.warn("사용자 비밀번호 변경 페이지를 로드하는 데 실패했습니다. " + memId + " : " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", e.getErrorCode().getMessage());
			return "redirect:/login";
		} catch (Exception e) {
			log.error("사용자 비밀번호 변경 페이지에서 오류가 발생했습니다. "+ memId + " : " + e);
			redirectAttributes.addFlashAttribute("errorMessage", "알 수 없는 오류가 발생했습니다.");
			return "redirect:/";
		}
	}
	
	/**
	 * 특정 멤버의 비밀번호를 변경합니다.
	 * 
	 * @param memId 멤버id
	 * @param map 기존비밀번호, 변경비밀번호
	 * @return 성공여부 map
	 */
	@ResponseBody
	@PostMapping("/mif/pswdchg/updatePassword.do")
	public ResponseEntity<Map<String, String>> updatePassword (@AuthenticationPrincipal String memId, @RequestBody Map<String, Object> map) {
		Map<String, String> response = new HashMap<>();
		try {
			passwordChangeService.updatePasswordChange(memId, map);
			response.put("status", "success");
			response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
			return ResponseEntity.ok(response);
		} catch (CustomException e) {
			ErrorCode errorCode = e.getErrorCode();
			response.put("status", "error");
			response.put("message", errorCode.getMessage());
			return new ResponseEntity<>(response, errorCode.getStatus());
		} catch (Exception e) {
			log.error("사용자 비밀번호 업데이트 중 예기치 않은 오류가 발생했습니다. " + memId + " : " + e);
            response.put("status", "error");
            response.put("message", "서버 내부 오류가 발생했습니다.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
