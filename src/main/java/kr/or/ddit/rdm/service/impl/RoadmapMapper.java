package kr.or.ddit.rdm.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.rdm.service.RoadmapResultRequestVO;
import kr.or.ddit.rdm.service.RoadmapStepVO;
import kr.or.ddit.rdm.service.RoadmapVO;

/**
 * 로드맵 관련 데이터베이스 작업을 위한 매퍼 인터페이스.
 */
@Mapper
public interface RoadmapMapper {

	/**
	 * 특정 회원의 로드맵 미션 목록을 조회
	 * @param memId 회원 식별 번호
	 * @return 해당 회원의 모든 로드맵 미션 목록 (List<RoadmapVO>)
	 */
	List<RoadmapVO> selectMemberRoadmap(int memId);

	/**
	 * 로드맵이 없는 신규 회원을 위해 초기 로드맵 데이터를 생성
	 * @param memId 회원 식별 번호
	 * @return 생성된 행의 수 (보통 1)
	 */
	int insertMemberRoadmap(int memId);
	
	/**
	 * 특정 회원의 로드맵에서 현재 캐릭터의 위치를 조회
	 * @param memId 회원 식별 번호
	 * @return 현재 캐릭터의 위치를 나타내는 정수 값
	 */
	int selectCurrentCharPosition(int memId);

	/**
	 * 특정 회원의 진행 중인 미션 리스트를 조회
	 * @param memId 회원 식별 번호
	 * @return 진행 중인 미션 목록 (List<RoadmapVO>)
	 */
	List<RoadmapVO> selectProgressMissionList(int memId);

	/**
	 * 특정 회원의 완료된 미션 리스트를 조회
	 * @param memId 회원 식별 번호
	 * @return 완료된 미션 목록 (List<RoadmapVO>)
	 */
	List<RoadmapVO> selectCompletedMissionList(int memId);

	/**
	 * 로드맵 노드별 미션 리스트를 조회
	 * @return {@link RoadmapStepVO} 객체를 담은 리스트
	 */
	List<RoadmapStepVO> selectMissionList();
	
	/**
	 * 주어진 로드맵 단계 식별 번호(rsId)에 해당하는 테이블 이름을 조회
	 * @param rsId 로드맵 단계 식별 번호
	 * @return 해당 단계와 연관된 테이블 이름
	 */
	String selectTableName(int rsId);
	
	/**
	 * 미션 완료 여부를 확인
	 * @param parameter 테이블 이름, 회원 ID, 로드맵 단계 ID를 포함하는 Map
	 * @return 완료 여부 (0보다 크면 완료된 것으로 간주)
	 */
	int isCompleteExists(Map<String, Object> parameter);
	
	/**
	 * 미션 완료 시 해당 미션의 완료 여부를 업데이트
	 * @param parameter 테이블 이름, 회원 ID, 로드맵 단계 ID를 포함하는 Map
	 * @return 업데이트된 행의 수
	 */
	int updateCompleteMission(Map<String, Object> parameter);

	/**
	 * 특정 회원의 미션을 데이터베이스에 등록
	 * @param roadmapVO 등록할 미션 정보가 담긴 {@link RoadmapVO} 객체
	 * @return 삽입된 행의 수
	 */
	int insertMission(RoadmapVO roadmapVO);

	/**
	 * 특정 회원의 미션 완료 예정일을 업데이트
	 * @param request 업데이트할 미션 정보가 담긴 {@link RoadmapVO} 객체
	 * @return 업데이트된 행의 수
	 */
	int updateDueDate(RoadmapVO request);

	/**
	 * 특정 회원의 로드맵 전체 완성 여부를 기록
	 * @param memId 회원 식별 번호
	 */
	void insertCompleteRoadmap(int memId);

	/**
	 * 로드맵 완료시 특정 회원의 포인트 추가
	 * @param parameter 회원 ID, 추가 포인트양을 포함하는 Map
	 * @return 업데이트된 행의 수
	 */
	int updateUserPoint(Map<String, Object> parameter);

	RoadmapResultRequestVO selectResultData(int memId);

}
