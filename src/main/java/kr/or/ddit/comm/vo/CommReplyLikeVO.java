package kr.or.ddit.comm.vo;

import java.util.Date;

import lombok.Data;

@Data
public class CommReplyLikeVO {
	
	private int replyId;
	private int boardId;
	private int memId;
	private Date likeAt;
	
}
