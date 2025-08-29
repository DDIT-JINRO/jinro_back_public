package kr.or.ddit.main.service;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import kr.or.ddit.com.ComCodeVO;
import lombok.Data;

@Data
public class MemberVO {

	private int memId;
	private String memEmail;
	private String memPassword;
	private String memNickname;
	private String memPhoneNumber;
	private String memName;
	private String memGen;
	@DateTimeFormat(pattern="yyyy-MM-dd")
	private Date memBirth;
	private String memAlarm;
	private String memStudent;
	private String memRole;
	private int memPoint;
	private Date createdAt;
	private Date pwUpdatedAt;
	private String loginType;
	private String memToken;
	private String delYn;
	private Long fileProfile;
	private Long fileEtc;
	private Long fileSub;
	private Long fileBadge;
	private String rnum;

	private String activityStatus;

	private int memAge;

	private List<ComCodeVO> interests;
	private String subName;
	private String subDetail;
	private int remainingDays;
	private int msId;
	private Integer resumeRemain;
	private Integer coverRemain;
	private Integer consultRemain;
	private Integer mockRemain;
	private Integer serviceTotal;


	private Date veriCreatedAt;
	private String veriStatus;
	private String veriReason;

	private String profileFilePath;
	private String badgeFilePath;
	private String subFilePath;

	public String getSMemId() {
		return memId + "";
	}

	private String keyword;
	private String status;

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

	private String saveId;

}
