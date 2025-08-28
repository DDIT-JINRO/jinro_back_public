package kr.or.ddit.comm.peer.teen.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.comm.vo.CommBoardLikeVO;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyLikeVO;
import kr.or.ddit.comm.vo.CommReplyVO;

@Mapper
public interface TeenCommMapper {

	List<CommBoardVO> selectTeenList(CommBoardVO commBoardVO);

	CommBoardVO selectTeenDetail(CommBoardVO paramBoard);

	List<CommReplyVO> selectBoardReply(CommReplyVO paramReplyVO);

	List<CommReplyVO> selectChildReplyList(int replyId);

	CommReplyVO selectReplyDetail(int replyId);

	int insertReply(CommReplyVO commReplyVO);

	void insertBoard(CommBoardVO commBoardVO);

	CommBoardVO selectTeenBoard(int boardId);

	void updateBoard(CommBoardVO commBoardVO);

	void deleteteenBoard(CommBoardVO commBoardVO);

	int deleteReply(CommReplyVO commReplyVO);
	
	String getBirthByMemId(String memId);

	void cntPlus(int boardId);

	int isBoardLiked(CommReplyVO commReplyVO);

	CommBoardLikeVO selectBoardLiked(CommBoardVO boardVO);

	void deleteBoardLiked(CommBoardVO boardVO);

	CommBoardLikeVO selectBoardLiked(CommBoardLikeVO boardVO);

	void deleteBoardLiked(CommBoardLikeVO boardVO);

	void insertBoardLiked(CommBoardLikeVO boardVO);

	int selectBoardLikedCnt(int boardId);

	CommReplyLikeVO selectReplyLiked(CommReplyLikeVO replyLikeVO);

	void deleteReplyLiked(CommReplyLikeVO replyLikeVO);

	void insertReplyLiked(CommReplyLikeVO replyLikeVO);

	int selectReplyLikedCnt(CommReplyLikeVO replyLikeVO);

	int selectBoardTotal(CommBoardVO commBoardVO);
	
}
