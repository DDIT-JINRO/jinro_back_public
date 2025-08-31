package kr.or.ddit.rdm.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.pse.cat.service.impl.CareerAptitudeTestServiceImpl;
import kr.or.ddit.rdm.service.RoadmapResultRequestVO;
import kr.or.ddit.rdm.service.RoadmapService;
import kr.or.ddit.rdm.service.RoadmapStepVO;
import kr.or.ddit.rdm.service.RoadmapVO;
import lombok.extern.slf4j.Slf4j;

/**
 * {@link RoadmapService} 인터페이스의 구현체. 로드맵 관련 비즈니스 로직을 처리합니다.
 */
@Service
@Slf4j
public class RoadmapServiceImpl implements RoadmapService {

	/**
	 * 미션 완료 여부 확인 시 허용되는 테이블 이름 목록.
	 * 이 목록에 없는 테이블 이름은 보안상 허용되지 않습니다.
	 */
	private final Set<String> ALLOWED_TABLE_NAMES = new HashSet<>(
			Arrays.asList("INTEREST_CN", "APTITUDE_TEST", "WORLDCUP", "BOOKMARK", "CHAT_MEMBER", "COUNSELING", "BOARD",
					"RESUME", "SELF_INTRO", "MOCK_INTERVIEW_HISTORY"));

	@Value("${gemini.api.key}")
	private String geminiApiKey;

	@Autowired
	private RoadmapMapper roadmapMapper;
	
	@Autowired
	private CareerAptitudeTestServiceImpl careerAptitudeTestServiceImpl;

	/**
	 * {@inheritDoc}
	 * <p>
	 * 각 진행 중인 미션에 대해 현재 완료 가능한 상태인지(isComplete) 확인하는 로직을 포함
	 * </p>
	 */
	@Override
	public Map<String, Object> selectMemberRoadmap(String memIdStr) {
		int memId;
		try {
		    memId = Integer.parseInt(memIdStr);
		} catch (NumberFormatException e) {
		    throw new CustomException(ErrorCode.INVALID_USER);
		}

		boolean isFirst = false;

		// 초기 로드맵 생성
		if (this.roadmapMapper.selectMemberRoadmap(memId).isEmpty()) {
			this.roadmapMapper.insertMemberRoadmap(memId);
			isFirst = true;
		}

		// 현재 캐릭터 위치
		int currentCharPosition = this.roadmapMapper.selectCurrentCharPosition(memId);

		// 현재 받은 미션들
		List<RoadmapVO> progressMissions = this.roadmapMapper.selectProgressMissionList(memId);

		// 각 진행 중인 미션에 대해 완료 가능 여부를 조회 및 설정
		for(RoadmapVO mission : progressMissions) {
			int rsId = mission.getRsId();

			String tableName = this.roadmapMapper.selectTableName(rsId);
			if (tableName != null && ALLOWED_TABLE_NAMES.contains(tableName)) {
				Map<String, Object> parameter = new HashMap<String, Object>();
				parameter.put("tableName", tableName);
				parameter.put("memId", memId);
				parameter.put("rsId", rsId);

				int result = this.roadmapMapper.isCompleteExists(parameter);

				if(result > 0) mission.setComplete(true);
			} else {
				mission.setComplete(false);
			}
		}

		// 완료한 미션들
		List<RoadmapVO> completedMissions = this.roadmapMapper.selectCompletedMissionList(memId);

		return Map.of("currentCharPosition", currentCharPosition, "progressMissions", progressMissions,
				"completedMissions", completedMissions, "isFirst", isFirst);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<RoadmapStepVO> selectMissionList() {
		return this.roadmapMapper.selectMissionList();
	}

	/**
	 * {@inheritDoc}
	 * <p>
	 * rsId가 11인 경우 로드맵 전체 완료 처리를 수행
	 * </p>
	 */
	@Override
	public String updateCompleteMission(String memIdStr, RoadmapVO roadmapVO) {
		int memId;
		try {
		    memId = Integer.parseInt(memIdStr);
		} catch (NumberFormatException e) {
		    throw new CustomException(ErrorCode.INVALID_USER);
		}

		if (roadmapVO == null) {
			throw new CustomException(ErrorCode.INVALID_INPUT);
		}

		int rsId = roadmapVO.getRsId();

		int point;
		String tableName = this.roadmapMapper.selectTableName(rsId);
		Map<String, Object> parameter = new HashMap<String, Object>();
		parameter.put("memId", memId);


		if (rsId == 11) {
			point = 10;
			parameter.put("point", point);
			this.roadmapMapper.insertCompleteRoadmap(memId);
			int pointResult = this.roadmapMapper.updateUserPoint(parameter);
			if (pointResult <= 0) {
				throw new CustomException(ErrorCode.POINT_UPDATE_ERROR);
			}

			return "complete";
		}

		if (tableName == null || !ALLOWED_TABLE_NAMES.contains(tableName)) {
			throw new CustomException(ErrorCode.FORBIDDEN_OPERATION);
		}

		parameter.put("tableName", tableName);
		parameter.put("rsId", rsId);

		int searchResult = this.roadmapMapper.isCompleteExists(parameter);

	    if (searchResult <= 0) {
	        return "fail";
	    }

		int updateResult = this.roadmapMapper.updateCompleteMission(parameter);

	   if (updateResult <= 0) {
	        throw new CustomException(ErrorCode.MISSION_ERROR);
	    }

		point = 1;
		parameter.put("point", point);
		int pointResult = this.roadmapMapper.updateUserPoint(parameter);

	    if (pointResult <= 0) {
	        throw new CustomException(ErrorCode.POINT_UPDATE_ERROR);
	    }

		return "success";
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public String insertMission(String memIdStr, RoadmapVO request) {
		int memId;
		try {
		    memId = Integer.parseInt(memIdStr);
		} catch (NumberFormatException e) {
		    throw new CustomException(ErrorCode.INVALID_USER);
		}

		request.setMemId(memId);

		int result = this.roadmapMapper.insertMission(request);

	    if (result <= 0) {
	        throw new CustomException(ErrorCode.MISSION_ERROR);
	    }

		return "success";
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public String updateDueDate(String memIdStr, RoadmapVO request) {
		int memId;
		try {
		    memId = Integer.parseInt(memIdStr);
		} catch (NumberFormatException e) {
		    throw new CustomException(ErrorCode.INVALID_USER);
		}

		request.setMemId(memId);

		int result = this.roadmapMapper.updateDueDate(request);

		if (result > 0)
			return "success";

		return "fail";
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public String selectResultData(String memIdStr) {
		int memId;
		try {
		    memId = Integer.parseInt(memIdStr);
		} catch (NumberFormatException e) {
		    throw new CustomException(ErrorCode.INVALID_USER);
		}

		RoadmapResultRequestVO roadmapResultRequestVO = this.roadmapMapper.selectResultData(memId);
		String result = geminiAnalysis(roadmapResultRequestVO, memIdStr);

		if (result == null) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		String jsonContent = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);

		return jsonContent;
	}

	@Override
    public String geminiAnalysis(RoadmapResultRequestVO roadmapResultRequest, String memIdStr) {
		Client client = Client.builder().apiKey(geminiApiKey).build();

		String prompt = buildPrompt(roadmapResultRequest);

		GenerateContentResponse response = client.models.generateContent("gemini-2.0-flash", prompt, null);
		
		careerAptitudeTestServiceImpl.insertRecommendKeyword(response.text(), memIdStr);
		
    	return response.text();
    }

	@Override
	public String buildPrompt(RoadmapResultRequestVO roadmapResultRequest) {
    	StringBuilder prompt = new StringBuilder();

    	prompt.append("당신은 15년 경력의 진로 상담사입니다.")
    		  .append("청소년과 청년들을 대상으로 상담 결과를 제출할 예정입니다.\n")
    		  .append("상담을 받은 대상의 이름은 " + roadmapResultRequest.getMemName() + "입니다.\n")
    		  .append("상담을 받은 대상의 연령대는 " + roadmapResultRequest.getMemAge() + "세 입니다. \n\n")
    		  .append("상담 데이터의 분류에는 총 6가지의 분류가 있습니다. \n")
    		  .append("======== 상담 대상의 상담 결과 도출을 위한 데이터 시작 ======= \n")
    		  .append("1. INTEREST_CN : 상담 대상의 관심사 키워드 ::: " + roadmapResultRequest.getInterestCn() + "\n")
    		  .append("2. SELF_INTRO : 상담 대상이 작성했던 자기소개서의 질문 항목에 대한 내용 ::: " + roadmapResultRequest.getSiqJob() + "\n")
    		  .append("3. WORLDCUP : 상담 대상이 직업 월드컵의 우승 결과로 선택된 선호하는 직업 ::: " + roadmapResultRequest.getWdResult() + "\n")
    		  .append("4. BOOKMARK : 상담 대상이 평소에 즐겨 찾던 직업명 ::: " + roadmapResultRequest.getBookmarkJob() + "\n")
    		  // .append("5. APTITUDE_TEST : " + roadmapResultRequest.getAptitudeTestName() + "의 검사 결과 데이터 :::" + roadmapResultRequest.getAptitudeResult() + "\n")
    		  .append("6. RECOMMEND_KEYWORD : 상담 대상의 기존 추천 직업 키워드 :::" + roadmapResultRequest.getRecommendKeyword() + "\n")
    		  .append("======== 상담 대상의 상담 결과 도출을 위한 데이터 종료 ======= \n\n")
    		  .append("당신은 위와 같은 데이터를 바탕으로 3가지 분석 결과를 도출 하려고 합니다. \n")
    		  .append("======== 상담 대상의 상담 결과 필요 내용 시작 ======= \n")
    		  .append("1. 상담 대상의 관심분야 분석\n")
    		  .append("1-1. 상담 대상이 특히 관심있어하는 관심분야 키워드 2종류\n")
    		  .append("1-2. 이러한 키워드 2종류가 두드러지게 나타나는 데이터 분류(INTEREST_CN, MOCK_INTERVIEW_HISTORY, SELF_INTRO, WORLDCUP, BOOKMARK, APTITUDE_TEST 중 하나)\n")
    		  .append("2. 상담 대상에게 추천하는 추천 직업 5가지\n")
    		  .append("2-1. 추천 직업명과 추천 직업에 대한 간단한 설명 및 관련 역량 한글로 100글자 내외\n")
    		  .append("2-2. 추천 직업 이외의 관련 산업분야 2가지\n")
    		  .append("3. 상담 대상에게 전하는 추가 제언\n")
    		  .append("- 상담 대상의 관심 분야에 대한 구체적인 학습 계획\n")
    		  .append("- 추천 직업에 대하여 사용자가 쌓으면 좋은 경험\n")
    		  .append("- 상담 분석 결과를 통한 상담 대상이 강화하면 좋은 필요 역량과 강화 방법\n")
    		  .append("======== 상담 대상의 상담 결과 필요 내용 종료 ======= \n\n")
    		  .append("=== 분석 요청 사항 ===\n")
    		  .append("위 데이터를 종합적으로 분석하여 다음과 같은 JSON 형식으로 상세한 분석을 제공해주세요.\\n")
    		  .append("청소년/청년 대상이므로 격려와 성장 중심의 건설적 피드백을 부탁드립니다:\n\n")
    		  .append("```json\n")
    		  .append("{ \n")
    		  .append("  \"memName\" : \"상담 대상 이름\",  \n")
    		  .append("  \"interest\" : {  \n")
    		  .append("    \"interestKeyword\" : [\"관심분야1\", \"관심분야2\"],  \n")
    		  .append("    \"interestDataType\" : \"데이터 분류\"  \n")
    		  .append("  }, \n")
    		  .append("  \"recommendJob\" : [ \n")
    		  .append("    { \n")
    		  .append("      \"jobName\" : \"직업명1\", \n")
    		  .append("      \"jobDetail\" : \"추천 직업에 대한 간단한 설명 및 관련 역량 내용\", \n")
    		  .append("    }, \n")
    		  .append("    { \n")
    		  .append("      \"jobName\" : \"직업명2\", \n")
    		  .append("      \"jobDetail\" : \"추천 직업에 대한 간단한 설명 및 관련 역량 내용\", \n")
    		  .append("    }, \n")
    		  .append("    { \n")
    		  .append("      \"jobName\" : \"직업명3\", \n")
    		  .append("      \"jobDetail\" : \"추천 직업에 대한 간단한 설명 및 관련 역량 내용\", \n")
    		  .append("    }, \n")
    		  .append("    { \n")
    		  .append("      \"jobName\" : \"직업명4\", \n")
    		  .append("      \"jobDetail\" : \"추천 직업에 대한 간단한 설명 및 관련 역량 내용\", \n")
    		  .append("    }, \n")
    		  .append("    { \n")
    		  .append("      \"jobName\" : \"직업명5\", \n")
    		  .append("      \"jobDetail\" : \"추천 직업에 대한 간단한 설명 및 관련 역량 내용\", \n")
    		  .append("    }, \n")
    		  .append("  ], \n")
    		  .append("  \"related\" : [\"관련 산업분야1\", \"관련 산업분야2\"],  \n")
    		  .append("  \"suggest\" : {  \n")
    		  .append("    \"planner\" : \"구체적인 학습 계획\",  \n")
    		  .append("    \"experience\" : \"쌓으면 좋은 경험\",  \n")
    		  .append("    \"enhance\" : \"강화하면 좋은 필요 역량과 강화 방법\",  \n")
    		  .append("  } \n")
    		  .append("} \n")
    		  .append("```\n\n");

    	prompt.append("⚠️ 중요 지침:\n");
		prompt.append("- 구체적이고 실행 가능한 개선 방안 제시\n");
		prompt.append("- JSON 형식을 정확히 준수 (문법 오류 금지)\n");
		prompt.append("- 상담 대상에게 전하는 추가 제언은 각 planner, experience, enhance별로 200자 제한으로 상세하게 적어주세요.\n");
		prompt.append("- 제가 요청한 json 형식의 데이터는 절대로 데이터가 빠지면 안됩니다.\n");

		// 메시지 포멧 사용 방법이 아래와 같이 있습니다.
//		MessageFormat.format(prompt.toString(), roadmapResultRequest.getMemName());
    	return prompt.toString();
    }

}
