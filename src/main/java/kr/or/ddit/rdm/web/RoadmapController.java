package kr.or.ddit.rdm.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.rdm.service.RoadmapService;
import kr.or.ddit.rdm.service.RoadmapStepVO;
import kr.or.ddit.rdm.service.RoadmapVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/roadmap")
public class RoadmapController {

	@Autowired
	RoadmapService roadmapService;
	
	/**
	 * 특정 사용자의 로드맵 정보를 조회
	 * @param memId 사용자 식별번호 (AuthenticationPrincipal 통해 얻음)
	 * @return 사용자의 로드맵 정보가 담긴 Map 객체
	 * <ul>
	 * <li><b>currentCharPosition</b>: 현재 캐릭터 위치 정보 (Object 또는 특정 DTO)</li>
	 * <li><b>progressMissions</b>: 진행 중인 미션 목록 (List&lt;Mission&gt;)</li>
	 * <li><b>completedMissions</b>: 완료한 미션 목록 (List&lt;Mission&gt;)</li>
	 * <li><b>isFirst</b>: 사용자의 로드맵 최초 진입 여부 (boolean)</li>
	 * </ul>
	 */
	@GetMapping("/selectMemberRoadmap")
	public ResponseEntity<Map<String, Object>> selectMemberRoadmap(@AuthenticationPrincipal String memId) {
		Map<String, Object> roadmapInfo = this.roadmapService.selectMemberRoadmap(memId);
		
		return new ResponseEntity<Map<String, Object>>(roadmapInfo, HttpStatus.OK);
	}
	
	/**
	 * 로드맵 노드별 미션 리스트
	 * @return {@link RoadmapStepVO}를 담은 List
	 */
	@GetMapping("/selectMissionList")
	public ResponseEntity<List<RoadmapStepVO>> selectMissionList() {
		List<RoadmapStepVO> roadmapStepVOList = this.roadmapService.selectMissionList();

		return new ResponseEntity<List<RoadmapStepVO>>(roadmapStepVOList, HttpStatus.OK);
	}
	
	/**
	 * 특정 사용자의 미션 완료 상태 업데이트 메서드
	 * @param memId 사용자 식별번호 (AuthenticationPrincipal 통해 얻음)
	 * @param roadmapVO 로드맵 정보
	 * @return "success" (성공), "fail" (실패), 또는 "complete" (로드맵 전체 완료)
	 */
	@PostMapping("/updateCompleteMission")
	public ResponseEntity<String> updateCompleteMission(@AuthenticationPrincipal String memId, @RequestBody RoadmapVO roadmapVO) {
		String result = this.roadmapService.updateCompleteMission(memId, roadmapVO);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	/**
	 * 특정 사용자의 미션 등록 메서드
	 * @param memId 사용자 식별번호 (AuthenticationPrincipal 통해 얻음)
	 * @param roadmapVO 등록할 미션 정보가 담긴 {@link RoadmapVO} 객체
	 * @return "success" (성공) 또는 "fail" (실패)
	 */
	@PostMapping("/insertMission")
	public ResponseEntity<String> insertMission(@AuthenticationPrincipal String memId, @RequestBody RoadmapVO roadmapVO) {
		String result = this.roadmapService.insertMission(memId, roadmapVO);

		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	/**
	 * 특정 사용자의 미션 완료 날짜 업데이트
	 * @param memId 사용자 식별번호 (AuthenticationPrincipal 통해 얻음)
	 * @param roadmapVO 업데이트할 완료 예정일 정보가 담긴 {@link RoadmapVO} 객체
	 * @return "success" (성공) 또는 "fail" (실패)
	 */
	@PostMapping("/updateDueDate")
	public ResponseEntity<String> updateDueDate(@AuthenticationPrincipal String memId, @RequestBody RoadmapVO roadmapVO) {
		String result = this.roadmapService.updateDueDate(memId, roadmapVO);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
	
	/**
	 * 특정 사용자의 완료 로드맵 정보
	 * @param memId 사용자 식별번호 (AuthenticationPrincipal 통해 얻음)
	 * @return 아직 어떤 데이터가 나올지 모르겠습니다.
	 */
	@GetMapping("/selectResultData")
	public ResponseEntity<String> selectResultData(@AuthenticationPrincipal String memId) {
		String result = this.roadmapService.selectResultData(memId);
		
		return new ResponseEntity<String>(result, HttpStatus.OK);
	}
}