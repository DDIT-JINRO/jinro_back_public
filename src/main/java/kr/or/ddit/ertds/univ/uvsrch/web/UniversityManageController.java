package kr.or.ddit.ertds.univ.uvsrch.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptService;
import kr.or.ddit.ertds.univ.dpsrch.service.UnivDeptVO;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityDetailVO.DeptInfo;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityManageService;
import kr.or.ddit.ertds.univ.uvsrch.service.UniversityVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/ertds/univ/uvsrch")
@Slf4j
public class UniversityManageController {

	@Autowired
	private UniversityManageService universityManageService;
	
	@Autowired  // 추가
    private UnivDeptService univDeptService;
	
	/**
	 * 대학 목록 조회 (페이징)
	 */
	@GetMapping("/universities")
	public ResponseEntity<Map<String, Object>> getUniversityList(UniversityVO universityVO) {
	    Map<String, Object> response = new HashMap<>();
	    
	    try {
	        ArticlePage<UniversityVO> universityPage = universityManageService.getUniversityList(universityVO);
	        
	        response.put("success", true);
	        response.put("data", universityPage);
	        return ResponseEntity.ok(response);
	        
	    } catch (Exception e) {
	        log.error("대학 목록 조회 중 오류 발생: ", e);
	        response.put("success", false);
	        response.put("message", "대학 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }
	}

	/**
	 * 대학 추가
	 */
	@PostMapping("/universities")
	public ResponseEntity<Map<String, Object>> createUniversity(UniversityVO universityVO) {
		Map<String, Object> response = new HashMap<>();

		try {
			int result = universityManageService.updateUniversity(universityVO);

			if (result > 0) {
				response.put("success", true);
				response.put("message", "대학이 성공적으로 추가되었습니다.");
				response.put("univId", universityVO.getUnivId());
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "대학 추가에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
			}

		} catch (Exception e) {
			log.error("대학 추가 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "대학 추가 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 대학 수정
	 */
	@PutMapping("/universities/{univId}")
	public ResponseEntity<Map<String, Object>> updateUniversity(@PathVariable("univId") int univId, UniversityVO universityVO) {

		Map<String, Object> response = new HashMap<>();

		try {
			universityVO.setUnivId(univId);
			int result = universityManageService.updateUniversity(universityVO);

			if (result > 0) {
				response.put("success", true);
				response.put("message", "대학 정보가 성공적으로 수정되었습니다.");
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "대학 수정에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
			}

		} catch (Exception e) {
			log.error("대학 수정 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "대학 수정 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 대학 삭제
	 */
	@DeleteMapping("/universities/{univId}")
	public ResponseEntity<Map<String, Object>> deleteUniversity(@PathVariable("univId") int univId) {
		Map<String, Object> response = new HashMap<>();

		try {
			// 대학 삭제
			int result = universityManageService.deleteUniversity(univId);

			if (result > 0) {
				response.put("success", true);
				response.put("message", "대학이 성공적으로 삭제되었습니다.");
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "대학 삭제에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

		} catch (Exception e) {
			log.error("대학 삭제 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "대학 삭제 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 대학 단일 조회
	 */
	@GetMapping("/universities/{univId}")
	public ResponseEntity<Map<String, Object>> getUniversity(@PathVariable("univId") int univId) {
		Map<String, Object> response = new HashMap<>();

		try {
			UniversityVO university = universityManageService.selectUniversityById(univId);
			List<DeptInfo> univDept = universityManageService.selectUniversityDeptList(univId);
			
			if (university != null) {
				response.put("success", true);
				response.put("data", university);
				response.put("deptData", univDept);
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "해당 대학을 찾을 수 없습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

		} catch (Exception e) {
			log.error("대학 조회 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "대학 조회 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	/**
     * 학과 목록 조회 (페이징) - 추가
     */
    @GetMapping("/departments")
    public ResponseEntity<Map<String, Object>> getUnivDeptList(UnivDeptVO univDeptVO) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ArticlePage<UnivDeptVO> univDeptPage = univDeptService.getUnivDeptList(univDeptVO);
            
            response.put("success", true);
            response.put("data", univDeptPage);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("학과 목록 조회 중 오류 발생: ", e);
            response.put("success", false);
            response.put("message", "학과 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
	/**
	 * 학과 추가
	 */
	@PostMapping("/universities/{univId}/departments")
	public ResponseEntity<Map<String, Object>> createDepartment(@PathVariable("univId") int univId, DeptInfo deptInfo) {

		Map<String, Object> response = new HashMap<>();

		try {
			// 새로운 ID 생성
			deptInfo.setUnivId(univId);

			int result = universityManageService.updateDepartment(deptInfo);

			if (result > 0) {
				response.put("success", true);
				response.put("message", "학과가 성공적으로 추가되었습니다.");
				response.put("udId", deptInfo.getUdId());
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "학과 추가에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
			}

		} catch (Exception e) {
			log.error("학과 추가 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "학과 추가 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 학과 수정
	 */
	@PutMapping("/departments/{udId}")
	public ResponseEntity<Map<String, Object>> updateDepartment(@PathVariable("udId") int udId, DeptInfo deptInfo) {

		Map<String, Object> response = new HashMap<>();

		try {
			deptInfo.setUdId(udId);
			int result = universityManageService.updateDepartment(deptInfo);

			if (result > 0) {
				response.put("success", true);
				response.put("message", "학과 정보가 성공적으로 수정되었습니다.");
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "학과 수정에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
			}

		} catch (Exception e) {
			log.error("학과 수정 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "학과 수정 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 학과 삭제
	 */
	@DeleteMapping("/departments/{udId}")
	public ResponseEntity<Map<String, Object>> deleteDepartment(@PathVariable("udId") int udId) {
		Map<String, Object> response = new HashMap<>();

		try {
			int result = universityManageService.deleteDepartment(udId);

			if (result > 0) {
				response.put("success", true);
				response.put("message", "학과가 성공적으로 삭제되었습니다.");
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "학과 삭제에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

		} catch (Exception e) {
			log.error("학과 삭제 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "학과 삭제 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 특정 대학의 모든 학과 삭제
	 */
	@DeleteMapping("/universities/{univId}/departments")
	public ResponseEntity<Map<String, Object>> deleteDepartmentsByUnivId(@PathVariable("univId") int univId) {
		Map<String, Object> response = new HashMap<>();

		try {
			int result = universityManageService.deleteDepartmentsByUnivId(univId);

			response.put("success", true);
			response.put("message", "해당 대학의 모든 학과가 삭제되었습니다.");
			response.put("deletedCount", result);
			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("학과 일괄 삭제 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "학과 삭제 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	/**
	 * 학과 단일 조회
	 */
	@GetMapping("/departments/{udId}")
	public ResponseEntity<Map<String, Object>> getDepartment(@PathVariable("udId") int udId) {
		Map<String, Object> response = new HashMap<>();

		try {
			DeptInfo department = universityManageService.selectDepartmentById(udId);

			if (department != null) {
				response.put("success", true);
				response.put("data", department);
				return ResponseEntity.ok(response);
			} else {
				response.put("success", false);
				response.put("message", "해당 학과를 찾을 수 없습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

		} catch (Exception e) {
			log.error("학과 조회 중 오류 발생: ", e);
			response.put("success", false);
			response.put("message", "학과 조회 중 오류가 발생했습니다: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
}