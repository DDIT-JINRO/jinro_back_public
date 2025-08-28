package kr.or.ddit.prg.std.service;

import java.util.Date;
import java.util.List;

import kr.or.ddit.chat.service.ChatRoomVO;
import lombok.Data;

@Data
public class StdBoardVO {
	private int boardId;
	private int memId;
	private String ccId;
	private String boardTitle;
	private String boardContent;
	private Date boardCreatedAt;
	private Date boardUpdatedAt;
	private int boardCnt;
	private String boardDelYn;
	private Long filegroupId;

	private Long fileBadge;
	private Long fileProfile;
	private Long fileSub;

	private ChatRoomVO chatRoomVO; // 연계된 채팅방
	private List<StdReplyVO> stdReplyVOList; // 게시글에 연결된 댓글 리스트

	private int curJoinCnt; // 현재 참여자 수 (IS_EXITED = 'N')
	private int replyCnt; // 작성된 댓글 수
	private String chatTitle; // 폼태그 입력시 받아올 채팅방제목

	// 작성자 정보 받아올 필드 추가
	private String memGen;
	private String memName;
	private String memNickname;
	private String memEmail;
	private String fileBadgeStr;
	private String fileProfileStr;
	private String fileSubStr;

	// JSON 파싱 후 저장할 필드들
	private String region;
	private String gender;
	private String interest;
	private Integer maxPeople;

	private String parsedContent; // JSON에서 content만 분리

	// 검색용 필드도 추가
	private String searchType;
	private String searchKeyword;
	private List<String> interestItems;

	// 정렬용 필드 추가
	private String sortOrder;

	// 목록 조회시 페이징 처리를 위한 필드 추가
	private int currentPage;
	private int size;
	private int startNo;
	private int endNo;

	public int getStartNo() {
		return (this.currentPage - 1) * size;
	}

	public int getEndNo() {
		return this.currentPage * size;
	}
}
