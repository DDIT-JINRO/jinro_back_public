package kr.or.ddit.prg.std.service;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class StdReplyVO {
	private int replyId; // 댓글 혹은 대댓글 번호
	private int boardId; // 게시글 번호
	private int replyParentId; // 상위 댓글 번호 (최상위는 0값)
	private int memId; // 댓글 혹은 대댓글 작성자
	private String replyContent; // 내용
	private String replyDelYn; // 삭제여부
	private Date replyCreatedAt; // 작성일
	private Date replyUpdatedAt; // 수정일

	private Long fileBadge;
	private Long fileProfile;
	private Long fileSub;

	private int childCount; // 자식 수

	List<StdReplyVO> childReplyVOList; // 하위 게시글(대댓글) 리스트

	// 작성자 정보 받아올 필드들 추가
	private String memGen;
	private String memName;
	private String memNickname;
	private String memEmail;

	private String fileBadgeStr;
	private String fileProfileStr;
	private String fileSubStr;
}
