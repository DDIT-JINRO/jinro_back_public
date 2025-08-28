package kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AnalysisResponse {

	// 세션 ID 추가
	private String sessionId;

	// 성공 여부 추가 (프론트엔드 호환성)
	private Boolean success = true;

	private Integer overallScore;
	private String grade;

	// timestamp를 문자열로 반환하도록 포맷 지정
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime timestamp;

	private String analysisMethod;
	private DetailedAnalysis detailed;
	private AnalysisSummary summary;
	private ScoreBreakdown scores;

	// 생성자 추가 (편의성)
	public AnalysisResponse(String sessionId) {
		this.sessionId = sessionId;
		this.timestamp = LocalDateTime.now();
		this.analysisMethod = "Gemini AI Expert Analysis";
		this.success = true;
	}

	@Data
	@NoArgsConstructor
	public static class DetailedAnalysis {
		private AudioAnalysis audio;
		private VideoAnalysis video;
		private TextAnalysis text;

		@Data
		@NoArgsConstructor
		public static class AudioAnalysis {
			private Integer speechClarity;
			private Integer paceAppropriate;
			private Integer volumeConsistency;
			private String feedback;

			// 생성자 추가
			public AudioAnalysis(Integer speechClarity, Integer paceAppropriate, Integer volumeConsistency, String feedback) {
				this.speechClarity = speechClarity;
				this.paceAppropriate = paceAppropriate;
				this.volumeConsistency = volumeConsistency;
				this.feedback = feedback;
			}
		}

		@Data
		@NoArgsConstructor
		public static class VideoAnalysis {
			private Integer eyeContact;
			private Integer facialExpression;
			private Integer posture;
			private String feedback;

			// 생성자 추가
			public VideoAnalysis(Integer eyeContact, Integer facialExpression, Integer posture, String feedback) {
				this.eyeContact = eyeContact;
				this.facialExpression = facialExpression;
				this.posture = posture;
				this.feedback = feedback;
			}
		}

		@Data
		@NoArgsConstructor
		public static class TextAnalysis {
			private Integer contentQuality;
			private Integer structureLogic;
			private Integer relevance;
			private String feedback;

			// 생성자 추가
			public TextAnalysis(Integer contentQuality, Integer structureLogic, Integer relevance, String feedback) {
				this.contentQuality = contentQuality;
				this.structureLogic = structureLogic;
				this.relevance = relevance;
				this.feedback = feedback;
			}
		}
	}

	@Data
	@NoArgsConstructor
	public static class AnalysisSummary {
		private List<String> strengths;
		private List<String> improvements;
		private String recommendation;

		// 생성자 추가
		public AnalysisSummary(List<String> strengths, List<String> improvements, String recommendation) {
			this.strengths = strengths;
			this.improvements = improvements;
			this.recommendation = recommendation;
		}
	}

	@Data
	@NoArgsConstructor
	public static class ScoreBreakdown {
		private Integer communication;
		private Integer appearance;
		private Integer content;
		private Integer overall;

		// 생성자 추가
		public ScoreBreakdown(Integer communication, Integer appearance, Integer content, Integer overall) {
			this.communication = communication;
			this.appearance = appearance;
			this.content = content;
			this.overall = overall;
		}
	}

	// 기본값으로 응답 생성하는 정적 메서드
	public static AnalysisResponse createDefaultResponse(String sessionId, String errorMessage) {
		AnalysisResponse response = new AnalysisResponse(sessionId);
		response.setOverallScore(70);
		response.setGrade("B");

		// 기본 상세 분석
		DetailedAnalysis detailed = new DetailedAnalysis();
		detailed.setAudio(new DetailedAnalysis.AudioAnalysis(70, 70, 70, "음성 분석 중 오류가 발생했습니다: " + errorMessage));
		detailed.setVideo(new DetailedAnalysis.VideoAnalysis(70, 70, 70, "영상 분석 중 오류가 발생했습니다: " + errorMessage));
		detailed.setText(new DetailedAnalysis.TextAnalysis(70, 70, 70, "텍스트 분석 중 오류가 발생했습니다: " + errorMessage));
		response.setDetailed(detailed);

		// 기본 요약
		response.setSummary(
				new AnalysisSummary(List.of("면접 참여에 감사드립니다", "기본적인 준비가 되어있습니다"), List.of("기술적 문제로 정확한 분석이 어려웠습니다", "다시 시도해보시기 바랍니다"), "기술적 문제가 발생했지만, 지속적인 연습으로 실력을 향상시켜보세요."));

		// 기본 점수
		response.setScores(new ScoreBreakdown(70, 70, 70, 70));

		response.setSuccess(false); // 오류 상황이므로 false
		response.setAnalysisMethod("Default Analysis (Error Fallback)");

		return response;
	}
}