package kr.or.ddit.comm.vo;

import java.util.Date;

import lombok.Data;

@Data
public class CommBoardLikeVO {
	private int boardId;
	private int memId;
	private Date likeAt;
}
