package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.web;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.AnalysisService;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.dto.AnalysisResponse;
import kr.or.ddit.mpg.pay.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InterviewAnalysisController {

	private final AnalysisService analysisService;
	private final PaymentService paymentService;

	/**
	 * 면접 분석 메인 엔드포인트 (프론트엔드 연동)
	 */
	@PostMapping("/analyze-interview")
	public ResponseEntity<?> analyzeInterview(@RequestBody Map<String, Object> requestData, @AuthenticationPrincipal String memId) {
		String sessionId = null;

		try {
			// 세션 ID 추출
			sessionId = (String) requestData.get("sessionId");
			if (sessionId == null || sessionId.trim().isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid session ID", "message", "세션 ID가 필요합니다."));
			}

			// Service에 분석 요청 위임
			AnalysisResponse analysisResult = analysisService.analyzeInterviewFromMap(requestData);

			// 프론트엔드 형식에 맞는 응답 구성
			Map<String, Object> response = Map
					.of("success", analysisResult.getSuccess(), "sessionId", analysisResult.getSessionId(), "timestamp", analysisResult.getTimestamp().toString(), "overallScore",
							analysisResult.getOverallScore(), "grade", analysisResult.getGrade(), "analysisMethod", analysisResult.getAnalysisMethod(), "detailed",
							Map.of("audio",
									Map.of("speechClarity", analysisResult.getDetailed().getAudio().getSpeechClarity(), "paceAppropriate",
											analysisResult.getDetailed().getAudio().getPaceAppropriate(), "volumeConsistency",
											analysisResult.getDetailed().getAudio().getVolumeConsistency(), "feedback", analysisResult.getDetailed().getAudio().getFeedback()),
									"video",
									Map.of("eyeContact", analysisResult.getDetailed().getVideo().getEyeContact(), "facialExpression",
											analysisResult.getDetailed().getVideo().getFacialExpression(), "posture", analysisResult.getDetailed().getVideo().getPosture(),
											"feedback", analysisResult.getDetailed().getVideo().getFeedback()),
									"text",
									Map.of("contentQuality", analysisResult.getDetailed().getText().getContentQuality(), "structureLogic",
											analysisResult.getDetailed().getText().getStructureLogic(), "relevance", analysisResult.getDetailed().getText().getRelevance(),
											"feedback", analysisResult.getDetailed().getText().getFeedback())),
							"summary",
							Map.of("strengths", analysisResult.getSummary().getStrengths(), "improvements", analysisResult.getSummary().getImprovements(), "recommendation",
									analysisResult.getSummary().getRecommendation()),
							"scores", Map.of("communication", analysisResult.getScores().getCommunication(), "appearance", analysisResult.getScores().getAppearance(), "content",
									analysisResult.getScores().getContent(), "overall", analysisResult.getScores().getOverall()));
			// 분석 완료후 응답 직전 횟수 차감
			boolean isSuccess = paymentService.minusPayMockCnt(memId);
			if(!isSuccess) throw new Exception("모의면접 유료 횟수 차감 중 오류발생");

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("❌ 분석 실패 - 세션 ID: {}, 오류: {}", sessionId, e.getMessage(), e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "sessionId", sessionId != null ? sessionId : "unknown", "error",
					"Analysis failed", "message", "면접 분석 중 오류가 발생했습니다: " + e.getMessage(), "timestamp", LocalDateTime.now().toString()));
		}
	}

	/**
	 * 분석 진행 상태 확인
	 */
	@GetMapping("/analyze-interview/progress/{sessionId}")
	public ResponseEntity<?> getAnalysisProgress(@PathVariable String sessionId) {
		try {
			// Service에 진행률 확인 위임
			Map<String, Object> progressInfo = analysisService.getAnalysisProgress(sessionId);

			return ResponseEntity.ok(progressInfo);

		} catch (Exception e) {
			log.error("❌ 진행 상태 확인 실패 - 세션 ID: {}", sessionId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
					Map.of("sessionId", sessionId, "progress", 0, "status", "error", "message", "진행 상태 확인 실패: " + e.getMessage(), "timestamp", LocalDateTime.now().toString()));
		}
	}

	/**
	 * 분석 취소
	 */
	@PostMapping("/analyze-interview/cancel/{sessionId}")
	public ResponseEntity<?> cancelAnalysis(@PathVariable String sessionId) {
		try {
			// Service에 취소 요청 위임
			Map<String, Object> cancelResult = analysisService.cancelAnalysis(sessionId);

			return ResponseEntity.ok(cancelResult);

		} catch (Exception e) {
			log.error("❌ 분석 취소 실패 - 세션 ID: {}", sessionId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("success", false, "sessionId", sessionId, "message", "취소 처리 실패: " + e.getMessage(), "timestamp", LocalDateTime.now().toString()));
		}
	}

	/**
	 * API 상태 확인
	 */
	@GetMapping("/analyze-interview/health")
	public ResponseEntity<?> healthCheck() {
		try {
			// Service에 상태 확인 위임
			Map<String, Object> healthStatus = analysisService.getHealthStatus();

			String status = (String) healthStatus.get("status");
			HttpStatus httpStatus = "OK".equals(status) ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;

			return ResponseEntity.status(httpStatus).body(healthStatus);

		} catch (Exception e) {
			log.error("❌ Health check 실패", e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("status", "ERROR", "message", "Health check 실패: " + e.getMessage(), "timestamp", LocalDateTime.now().toString()));
		}
	}

	/**
	 * 세션 상태 확인 (추가 엔드포인트)
	 */
	@GetMapping("/analyze-interview/session/{sessionId}/status")
	public ResponseEntity<?> getSessionStatus(@PathVariable String sessionId) {
		try {
			boolean isActive = analysisService.isSessionActive(sessionId);

			return ResponseEntity.ok(Map.of("sessionId", sessionId, "isActive", isActive, "status", isActive ? "active" : "inactive", "timestamp", LocalDateTime.now().toString()));

		} catch (Exception e) {
			log.error("❌ 세션 상태 확인 실패 - 세션 ID: {}", sessionId, e);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
					Map.of("sessionId", sessionId, "isActive", false, "status", "error", "message", "세션 상태 확인 실패: " + e.getMessage(), "timestamp", LocalDateTime.now().toString()));
		}
	}
}