package kr.or.ddit.comm.peer.teen.service;

import java.util.List;

import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.util.ArticlePage;

public interface TeenCommService {

	public ArticlePage<CommBoardVO> selectTeenList(String string, CommBoardVO commBoardVO);

	public CommBoardVO selectTeenDetail(int boardId, String memId);

	public List<CommReplyVO> selectBoardReply(int boardId, String memId);

	public CommReplyVO insertReply(CommReplyVO commReplyVO);
	
	public CommReplyVO selectReplyDetail(int replyId);

	public void insertBoard(CommBoardVO commBoardVO);

	public CommBoardVO selectTeenBoard(int boardId);

	public String updateBoard(CommBoardVO commBoardVO);

	public void deleteteenBoard(CommBoardVO commBoardVO);

	public boolean deleteReply(CommReplyVO commReplyVO);
	
	public boolean isTeen(String memId);

	public void cntPlus(int boardId);

	public int updateBoardLiked(int boardId, String memId);

	public int selectBoardLikedCnt(int boardId);

	public int updateReplyLiked(int boardId, int replyId, String memId);

	public int selectReplyLikedCnt(int boardId, int replyId);
	
}
