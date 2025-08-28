package kr.or.ddit.prg.std.service;

import java.util.List;
import java.util.Map;

public interface StudyGroupService {

	/**
	 * 목록 조회. 필터링, 검색 조건 추가
	 * @param stdBoardVO
	 * @return
	 */
	List<StdBoardVO> selectStudyGroupList(StdBoardVO stdBoardVO);

	/**
	 * BOARD 테이블에 스터디그룹 게시글 데이터 삽입
	 * content 는 json형식의 clob
	 *   '{
		    "content": "학업, 진로 등 아무 이야기나 편하게 할 수 있는 온라인 수다방입니다.",
		    "region": "G23013",
		    "gender": "women",
		    "interest": "social.talk",
		    "maxPeople": 20
		  }'
	 * @param stdBoardVO
	 * @return 생성 완료된 게시글 번호를 반환합니다 -> boardId, crId를 Map으로 반환합니다.
	 */
	Map<String, Integer> insertStdBoard(StdBoardVO stdBoardVO);

	/**
	 * 목록 조회 -> 조회된 갯수만 가져오기
	 * @param stdBoardVO
	 * @return
	 */
	int selectStudyGroupTotalCount(StdBoardVO stdBoardVO);

	/**
	 * 목록 조회 때 같이 전송할 키워드 값 영문명과 한글명 맵
	 * @return
	 */
	Map<String, String> getInterestsMap();

	/**
	 * 단일 스터디그룹 게시글 조회
	 * @param stdGroupId
	 * @return
	 */
	StdBoardVO selectStudyGroupDetail(int stdGroupId);

	/**
	 * 지역코드 맵 불러오기
	 * @return
	 */
	Map<String, String> getRegionMap();

	/**
	 * 조회수 증가
	 * @param stdBoardVO
	 */
	void increaseViewCnt(int stdGroupId);

	/**
	 * 단일 댓글 선택
	 * 댓글생성 비동기 요청 insert 후 회원정보 등을 포함해서 돌려주기 위함
	 * @param replyId
	 * @return
	 */
	StdReplyVO selectReplyDetail(int replyId);

	/**
	 * 댓글 삽입 후 삽입된 댓글 조회해서 반환
	 * 삽입 실패하면 null 반환
	 * @param stdReplyVO
	 * @return
	 */
	StdReplyVO insertReply(StdReplyVO stdReplyVO);

	/**
	 * 댓글 삭제. 회원번호 까지 확인함
	 * @param stdReplyVO
	 * @return
	 */
	boolean deleteReply(StdReplyVO stdReplyVO);

	/**
	 * 스터디그룹 게시글 삭제 -> 채팅방 삭제 -> 채팅멤버 전체 삭제
	 * 3단계 모두 update 처리
	 * map : crId, memId, boardId
	 * @param stdBoardVO
	 * @return
	 */
	boolean deleteStdBoard(Map<String, Object> map);

	/**
	 * 댓글 수정 replyId, memId, replyContent 필요
	 * @param stdReplyVO
	 * @return
	 */
	boolean updateStdReply(StdReplyVO stdReplyVO);

	/**
	 * 스터디그룹 게시글 수정, 내부에서 채팅방 같이 수정
	 * 필요파라미터5<br/>
	 * boardTitle<br/>
	 * boardContent<br/>
	 * boardId<br/>
	 * memId<br/>
	 * ccId<br/>
	 * @param stdBoardVO
	 * @return boardId. 수정된 게시글 번호를 반환합니다
	 */
	int updateStdBoard(StdBoardVO stdBoardVO);
}
