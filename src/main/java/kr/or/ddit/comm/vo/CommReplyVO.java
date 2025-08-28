package kr.or.ddit.comm.vo;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class CommReplyVO {
	
	private int replyId;
	private int boardId;
	private int replyParentId;
	private int memId;
	private String replyContent;
	private String replyDelYn;
	private Date replyCreatedAt;
	private Date replyUpdatedAt;
	private int replyLikeCnt;	// 게시글 좋아요 수              
	private int replyIsLiked;	// 내가 좋아요 눌렀는지 여부 (1 or 0)
	private String ccId;
	
	private String rnum;
	private Long fileBadge;
	private Long fileProfile;
	private Long fileSub;
	
	private String memNickname;
	private String memGen;
	private String memName;
	private String memEmail;
	
	private int childCount; // 자식 수

	List<CommReplyVO> childReplyVOList; // 하위 게시글(대댓글) 리스트
	
	private String fileBadgeStr;
	private String fileProfileStr;
	private String fileSubStr;
}
