package kr.or.ddit.mpg.mif.inq.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.file.service.FileDetailVO;

public interface MyInquiryService {

	Map<String, Object> selectMyInquiryView(String memId);

	void updateMyInquiryView(String memId, MemberVO member);

	void checkPassword(String memId, String password);

	FileDetailVO updateProfileImg(String memId, MultipartFile profileImg);

	void insertInterestList(String memId, List<String> filterKeyword);

	int parseMemId(String memIdStr);

	void insertVerification(String memId, String vCategory, MultipartFile authFile);
	
	MemberVO getProfileFile(MemberVO member);

	int updateMemberPhone(String imp_uid, String memId);
}
