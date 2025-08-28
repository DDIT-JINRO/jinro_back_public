package kr.or.ddit.comm.peer.teen.service.impl;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.comm.peer.teen.service.TeenCommService;
import kr.or.ddit.comm.vo.CommBoardLikeVO;
import kr.or.ddit.comm.vo.CommBoardVO;
import kr.or.ddit.comm.vo.CommReplyLikeVO;
import kr.or.ddit.comm.vo.CommReplyVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TeenCommServiceImpl implements TeenCommService {

	@Autowired
	TeenCommMapper teenCommMapper;

	@Autowired
	FileService fileService;

	@Override
	public ArticlePage<CommBoardVO> selectTeenList(String ccId, CommBoardVO commBoardVO) {


		commBoardVO.setCcId(ccId);

		int total = teenCommMapper.selectBoardTotal(commBoardVO);

		List<CommBoardVO> commBoardList = teenCommMapper.selectTeenList(commBoardVO);

		ArticlePage<CommBoardVO> articlePage = new ArticlePage<>(total, commBoardVO.getCurrentPage(), commBoardVO.getSize(), commBoardList, commBoardVO.getKeyword());



		return articlePage;
	}

	@Override
	public CommBoardVO selectTeenDetail(int boardId, String memId) {

		int intMemId = 0;

		if (memId != "" && memId != "annoymousUser" && memId != null) {
			intMemId = Integer.parseInt(memId);
		}

		CommBoardVO paramBoard = new CommBoardVO();
		paramBoard.setBoardId(boardId);
		paramBoard.setMemId(intMemId);

		return teenCommMapper.selectTeenDetail(paramBoard);
	}

	@Override
	public List<CommReplyVO> selectBoardReply(int boardId, String memId) {

		int intMemId = Integer.parseInt(memId);

		CommReplyVO paramReplyVO = new CommReplyVO();
		paramReplyVO.setBoardId(boardId);
		paramReplyVO.setMemId(intMemId);

		List<CommReplyVO> replyVOList = teenCommMapper.selectBoardReply(paramReplyVO);

		if (replyVOList != null && !replyVOList.isEmpty() && replyVOList.get(0).getReplyContent() != null) {
			for (CommReplyVO commReplyVO : replyVOList) {
				Long replyFileBadgeId = commReplyVO.getFileBadge();
				Long replyFileProfileId = commReplyVO.getFileProfile();
				Long replyFileSubId = commReplyVO.getFileSub();

				FileDetailVO replyFileBadgeDetail = this.fileService.getFileDetail(replyFileBadgeId, 1);
				FileDetailVO replyFileProfileDetail = this.fileService.getFileDetail(replyFileProfileId, 1);
				FileDetailVO replyFileSubDetail = this.fileService.getFileDetail(replyFileSubId, 1);

				if (replyFileBadgeDetail != null) {
					commReplyVO.setFileBadgeStr(this.fileService.getSavePath(replyFileBadgeDetail));
				}
				if (replyFileProfileDetail != null) {
					commReplyVO.setFileProfileStr(this.fileService.getSavePath(replyFileProfileDetail));
				}
				if (replyFileSubDetail != null) {
					commReplyVO.setFileSubStr(this.fileService.getSavePath(replyFileSubDetail));
				}

				int childCount = commReplyVO.getChildCount();
				if (childCount == 0)
					continue;

				if (childCount > 0) {

					int parentReplyId = commReplyVO.getReplyId();
					List<CommReplyVO> childReplies = this.getChildReplies(parentReplyId);

					// 자식댓글 리스트 세팅
					commReplyVO.setChildReplyVOList(childReplies);
				}

			}
		}
		return replyVOList;
	}

	private List<CommReplyVO> getChildReplies(int replyId) {
		List<CommReplyVO> replyList = this.teenCommMapper.selectChildReplyList(replyId);
		for (CommReplyVO replyVO : replyList) {
			Long fileBadgeId = replyVO.getFileBadge();
			Long fileProfileId = replyVO.getFileProfile();
			Long fileSubId = replyVO.getFileSub();

			FileDetailVO fileBadgeDetail = this.fileService.getFileDetail(fileBadgeId, 1);
			FileDetailVO fileProfileDetail = this.fileService.getFileDetail(fileProfileId, 1);
			FileDetailVO fileSubDetail = this.fileService.getFileDetail(fileSubId, 1);

			if (fileBadgeDetail != null) {
				replyVO.setFileBadgeStr(this.fileService.getSavePath(fileBadgeDetail));
			}
			if (fileProfileDetail != null) {
				replyVO.setFileProfileStr(this.fileService.getSavePath(fileProfileDetail));
			}
			if (fileSubDetail != null) {
				replyVO.setFileSubStr(this.fileService.getSavePath(fileSubDetail));
			}

			if (replyVO.getChildCount() == 0)
				continue;
			int parentReplyId = replyVO.getReplyId();
			List<CommReplyVO> childReplies = getChildReplies(parentReplyId);
			// 자식댓글 리스트 세팅
			replyVO.setChildReplyVOList(childReplies);
		}
		return replyList;
	}

	@Override
	public CommReplyVO insertReply(CommReplyVO commReplyVO) {
		int result = this.teenCommMapper.insertReply(commReplyVO);
		if (result > 0) {
			return this.selectReplyDetail(commReplyVO.getReplyId());
		}
		return null;
	}

	@Override
	public CommReplyVO selectReplyDetail(int replyId) {
		CommReplyVO detailReplyVO = this.teenCommMapper.selectReplyDetail(replyId);
		Long fileBadgeId = detailReplyVO.getFileBadge();
		Long fileProfileId = detailReplyVO.getFileProfile();
		Long fileSubId = detailReplyVO.getFileSub();

		FileDetailVO fileBadgeDetail = this.fileService.getFileDetail(fileBadgeId, 1);
		FileDetailVO fileProfileDetail = this.fileService.getFileDetail(fileProfileId, 1);
		FileDetailVO fileSubDetail = this.fileService.getFileDetail(fileSubId, 1);

		if (fileBadgeDetail != null) {
			detailReplyVO.setFileBadgeStr(this.fileService.getSavePath(fileBadgeDetail));
		}
		if (fileProfileDetail != null) {
			detailReplyVO.setFileProfileStr(this.fileService.getSavePath(fileProfileDetail));
		}
		if (fileSubDetail != null) {
			detailReplyVO.setFileSubStr(this.fileService.getSavePath(fileSubDetail));
		}

		return detailReplyVO;
	}

	@Override
	public void insertBoard(CommBoardVO commBoardVO) {
		teenCommMapper.insertBoard(commBoardVO);
	}

	@Override
	public CommBoardVO selectTeenBoard(int boardId) {
		return teenCommMapper.selectTeenBoard(boardId);
	}

	@Transactional
	@Override
	public String updateBoard(CommBoardVO commBoardVO) {
		teenCommMapper.updateBoard(commBoardVO);
		commBoardVO = teenCommMapper.selectTeenBoard(commBoardVO.getBoardId());
		return commBoardVO.getCcId();
	}

	@Override
	public void deleteteenBoard(CommBoardVO commBoardVO) {
		teenCommMapper.deleteteenBoard(commBoardVO);
	}

	@Override
	public boolean deleteReply(CommReplyVO commReplyVO) {
		return this.teenCommMapper.deleteReply(commReplyVO) > 0 ? true : false;
	}

	@Override
	public boolean isTeen(String memId) {
		String birthStr = teenCommMapper.getBirthByMemId(memId);

		if (birthStr == null) {
			throw new IllegalArgumentException("회원의 생년월일이 없습니다.");
		}

		LocalDate birthDate = LocalDate.parse(birthStr); // YYYY-MM-DD 형식 기준
		LocalDate today = LocalDate.now();

		Period age = Period.between(birthDate, today);
		return age.getYears() < 19;
	}

	@Override
	public void cntPlus(int boardId) {
		teenCommMapper.cntPlus(boardId);

	}

	@Override
	public int updateBoardLiked(int boardId, String memId) {

		int intMemId = Integer.parseInt(memId);

		CommBoardLikeVO boardVO = new CommBoardLikeVO();
		boardVO.setBoardId(boardId);
		boardVO.setMemId(intMemId);

		CommBoardLikeVO selRes = teenCommMapper.selectBoardLiked(boardVO);
		if (selRes != null) {
			teenCommMapper.deleteBoardLiked(boardVO);
			return 0;
		} else {
			teenCommMapper.insertBoardLiked(boardVO);
			return 1;
		}

	}

	@Override
	public int selectBoardLikedCnt(int boardId) {

		return teenCommMapper.selectBoardLikedCnt(boardId);
	}

	@Override
	public int updateReplyLiked(int boardId, int replyId, String memId) {
		int intMemId = Integer.parseInt(memId);

		CommReplyLikeVO replyLikeVO = new CommReplyLikeVO();
		replyLikeVO.setBoardId(boardId);
		replyLikeVO.setMemId(intMemId);
		replyLikeVO.setReplyId(replyId);

		CommReplyLikeVO selRes = teenCommMapper.selectReplyLiked(replyLikeVO);
		if (selRes != null) {
			teenCommMapper.deleteReplyLiked(replyLikeVO);
			return 0;
		} else {
			teenCommMapper.insertReplyLiked(replyLikeVO);
			return 1;
		}
	}

	@Override
	public int selectReplyLikedCnt(int boardId, int replyId) {
		CommReplyLikeVO replyLikeVO = new CommReplyLikeVO();
		replyLikeVO.setBoardId(boardId);
		replyLikeVO.setReplyId(replyId);


		return teenCommMapper.selectReplyLikedCnt(replyLikeVO);
	}



}
