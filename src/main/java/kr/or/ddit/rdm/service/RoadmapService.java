package kr.or.ddit.rdm.service;

import java.util.List;
import java.util.Map;

/**
 * 로드맵 관련 비즈니스 로직을 정의하는 서비스 인터페이스.
 */
public interface RoadmapService {

	/**
	 * 특정 회원의 로드맵 정보를 조회, 회원의 로드맵 정보가 없다면, 초기 로드맵을 생성한 후 조회
	 * @param memId 사용자 식별 번호
	 * @return 사용자의 로드맵 정보가 담긴 Map 객체
	 * <ul>
	 * <li><b>currentCharPosition</b>: 현재 캐릭터 위치 정보 (Object 또는 특정 DTO)</li>
	 * <li><b>progressMissions</b>: 진행 중인 미션 목록 (List&lt;Mission&gt;)</li>
	 * <li><b>completedMissions</b>: 완료한 미션 목록 (List&lt;Mission&gt;)</li>
	 * <li><b>isFirst</b>: 사용자의 로드맵 최초 진입 여부 (boolean)</li>
	 * </ul>
	 */
	public Map<String, Object> selectMemberRoadmap(String memId);

	/**
	 * 로드맵 노드별 미션 리스트
	 * @return {@link RoadmapStepVO}를 담은 List
	 */
	public List<RoadmapStepVO> selectMissionList();

	/**
	 * 특정 사용자의 미션 완료 상태 업데이트 메서드
	 * @param memId 사용자 식별 번호
	 * @param roadmapVO 완료 로드맵 정보
	 * @return "success" (성공), "fail" (실패), 또는 "complete" (로드맵 전체 완료)
	 */
	public String updateCompleteMission(String memId, RoadmapVO roadmapVO);

	/**
	 * 특정 사용자의 미션 등록 메서드
	 * @param memId 사용자 식별 번호
	 * @param roadmapVO 등록할 미션 정보가 담긴 {@link RoadmapVO} 객체
	 * @return "success" (성공) 또는 "fail" (실패)
	 */
	public String insertMission(String memId, RoadmapVO roadmapVO);

	/**
	 * 특정 사용자의 미션 완료 날짜 업데이트
	 * @param memId 사용자 식별 번호
	 * @param roadmapVO 업데이트할 완료 예정일 정보가 담긴 {@link RoadmapVO} 객체
	 * @return "success" (성공) 또는 "fail" (실패)
	 */
	public String updateDueDate(String memId, RoadmapVO roadmapVO);

	/**
	 * 특정 사용자의 완료 로드맵 정보
	 * @param memId 사용자 식별 번호
	 * @return 아직 어떤 데이터가 나올지 모르겠습니다.
	 */
	public String selectResultData(String memId);
	
	public String geminiAnalysis(RoadmapResultRequestVO roadmapResultRequest);
	
	public String buildPrompt(RoadmapResultRequestVO roadmapResultRequest);

}
