package kr.or.ddit.prg.std.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.prg.std.service.StdBoardVO;
import kr.or.ddit.prg.std.service.StdReplyVO;

@Mapper
public interface StudyGroupMapper {

	/**
	 * 목록 조회. 필터링, 검색 조건 추가
	 *
	 * @param stdBoardVO
	 * @return
	 */
	List<StdBoardVO> selectStudyGroupList(StdBoardVO stdBoardVO);

	/**
	 * BOARD 테이블에 스터디그룹 게시글 데이터 삽입 content 는 json형식의 clob '{ "content": "학업, 진로 등 아무
	 * 이야기나 편하게 할 수 있는 온라인 수다방입니다.", "region": "G23013", "gender": "women",
	 * "interest": "social.talk", "maxPeople": 20 }'
	 *
	 * @param stdBoardVO
	 * @return
	 */
	int insertStdBoard(StdBoardVO stdBoardVO);

	/**
	 * 목록 조회 -> 조회된 갯수만 가져오기
	 *
	 * @param stdBoardVO
	 * @return
	 */
	int selectStudyGroupTotalCount(StdBoardVO stdBoardVO);

	/**
	 * 지역코드를 이름으로 변환하기 위함
	 *
	 * @return
	 */
	List<Map<String, Object>> selectRegionNamesFromComCode();

	/**
	 * 단일 스터디그룹 게시글 조회
	 *
	 * @param stdGroupId
	 * @return
	 */
	StdBoardVO selectStudyGroupDetail(int stdGroupId);

	/**
	 * 댓글번호로 하위댓글들 조회
	 *
	 * @param replyId
	 * @return
	 */
	List<StdReplyVO> selectChildReplyList(int replyId);

	/**
	 * 조회수 증가
	 *
	 * @param stdBoardVO
	 */
	void increaseViewCnt(int stdGroupId);

	/**
	 * 단일 댓글 선택 댓글생성 비동기 요청 insert 후 회원정보 등을 포함해서 돌려주기 위함
	 *
	 * @param replyId
	 * @return
	 */
	StdReplyVO selectReplyDetail(int replyId);

	/**
	 * 댓글 삽입
	 *
	 * @param stdReplyVO
	 * @return
	 */
	int insertReply(StdReplyVO stdReplyVO);

	/**
	 * 댓글 삭제. 회원번호 까지 확인함
	 *
	 * @param stdReplyVO
	 * @return
	 */
	int deleteReply(StdReplyVO stdReplyVO);

	/**
	 * 게시글 삭제 boardId, memId 필요
	 *
	 * @param stdBoardVO
	 * @return
	 */
	int deleteStdBoard(StdBoardVO stdBoardVO);

	/**
	 * 댓글 수정 replyId, memId 필요
	 *
	 * @param stdReplyVO
	 * @return
	 */
	int updateStdReply(StdReplyVO stdReplyVO);

	/**
	 * 스터디그룹 게시글 수정 필요파라미터5<br/>
	 * boardTitle<br/>
	 * boardContent<br/>
	 * boardId<br/>
	 * memId<br/>
	 * ccId<br/>
	 *
	 * @param stdBoardVO
	 * @return
	 */
	int updateStdBoard(StdBoardVO stdBoardVO);
}