package kr.or.ddit.mpg.mif.inq.service.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;

import kr.or.ddit.account.join.service.MemberJoinService;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.mif.inq.service.MyInquiryService;
import kr.or.ddit.mpg.mif.inq.service.VerificationVO;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MyInquiryServiceImpl implements MyInquiryService {

	@Autowired
	MyInquiryMapper myInquiryMapper;

	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;

	@Autowired
	FileService fileService;
	
	@Autowired
	MemberJoinService memberJoinService;
	
	@Value("${join.imp.api.key}")
	private String IMP_IDENTITY_KEY;
	
	@Value("${join.imp.api.secret}")
	private String IMP_IDENTITY_SECRET;
	
	@Value("${join.imp.channel.key}")
	private String IMP_CHANNEL_KEY;
	
	@Value("${join.imp.identification.code}")
	private String IMP_IDENTIFICATION_CODE;
	
	/**
	 * 마이페이지 진입 전 멤버의 정보를 확인합니다.
	 * 
	 * @param memIdStr 멤버id
	 * @return Map 멤버 정보
	 */
	@Override
	public Map<String, Object> selectMyInquiryView(String memIdStr) {
		int memId = parseMemId(memIdStr);

		MemberVO member = this.myInquiryMapper.selectMyInquiryView(memId);
		if (member == null) {
			throw new CustomException(ErrorCode.USER_NOT_FOUND);
		}

		member = getProfileFile(member);

		List<ComCodeVO> interetsKeywordList = this.myInquiryMapper.selectInteretsKeywordList();

		return Map.of("member", member, "interetsKeywordList", interetsKeywordList);
	}

	/**
	 * 멤버의 비밀번호를 확인합니다.
	 * 
	 * @param memIdStr 멤버id
	 * @param password 확인용 비밀번호
	 */
	@Override
	public void checkPassword(String memIdStr, String password) {
		int memId = parseMemId(memIdStr);

		MemberVO memberVO = this.myInquiryMapper.checkPassword(memId);

		if (memberVO == null || !bCryptPasswordEncoder.matches(password, memberVO.getMemPassword())) {
			throw new CustomException(ErrorCode.INVALID_PASSWORD);
		}
	}

	/**
	 * form데이터로 받은 변경 내용을 업데이트합니다.
	 * 
	 * @param memIdStr 멤버id
	 * @param member   변경 내용
	 */
	@Override
	public void updateMyInquiryView(String memIdStr, MemberVO member) {
		int memId = parseMemId(memIdStr);

		member.setMemId(memId);

		int result = this.myInquiryMapper.updateMyInquiryView(member);
		if (result == 0) {
			throw new CustomException(ErrorCode.USER_UPDATE_FAILED);
		}
	}

	/**
	 * 멤버의 프로필 이미지를 변경합니다.
	 * 
	 * @param memIdStr   멤버id
	 * @param profileImg 프로필이미지
	 * @return FileDetailVO 결과
	 */
	@Override
	public FileDetailVO updateProfileImg(String memIdStr, MultipartFile profileImg) {
		int memId = parseMemId(memIdStr);

		if (profileImg == null || profileImg.isEmpty()) {
			throw new CustomException(ErrorCode.INVALID_FILE);
		}

		MemberVO member = this.myInquiryMapper.selectMyInquiryView(memId);

		Long fileGroupId = fileService.createFileGroup();
		member.setFileProfile(fileGroupId);

		List<MultipartFile> files = new ArrayList<MultipartFile>();
		files.add(profileImg);

		try {
			this.fileService.uploadFiles(fileGroupId, files);
		} catch (IOException e) {
			throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
		}

		int result = this.myInquiryMapper.updateFileGroup(member);
		if (result == 0) {
			throw new CustomException(ErrorCode.USER_UPDATE_FAILED);
		}

		return fileService.getFileDetail(fileGroupId, 1);
	}

	/**
	 * 멤버의 관심사 키워드를 입력 or 변경합니다.
	 * 
	 * @param memIdStr        멤버id
	 * @param interestKeyword 관심사키워드
	 */
	@Override
	public void insertInterestList(String memIdStr, List<String> interestKeyword) {
		int memId = parseMemId(memIdStr);

		this.myInquiryMapper.deleteInterestList(memId);

		if (interestKeyword == null || interestKeyword.isEmpty()) {
			this.myInquiryMapper.insertEmptyInterest(memId);
		} else {
			for (String keyword : interestKeyword) {
				this.myInquiryMapper.insertInterestList(Map.of("memId", memId, "keyword", keyword));
			}
		}
	}

	@Override
	public void insertVerification(String memIdStr, String vCategory, MultipartFile authFile) {
		int memId = parseMemId(memIdStr);

		if (authFile == null || authFile.isEmpty()) {
			throw new CustomException(ErrorCode.INVALID_FILE);
		}
		Long fileGroupId = fileService.createFileGroup();

		VerificationVO verification = VerificationVO.builder().memId(memId).fileGroupId(fileGroupId)
				.veriCategory(vCategory).build();

		List<MultipartFile> files = new ArrayList<MultipartFile>();
		files.add(authFile);

		try {
			this.fileService.uploadFiles(fileGroupId, files);
		} catch (IOException e) {
			throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
		}

		int result = this.myInquiryMapper.insertVerification(verification);
		if (result == 0) {
			throw new CustomException(ErrorCode.USER_UPDATE_FAILED);
		}
	}

	/**
	 * String타입의 멤버 Id를 int 타입으로 변환합니다.
	 * 
	 * @param memIdStr 멤버id
	 */
	@Override
	public int parseMemId(String memIdStr) {
		if (memIdStr == null || memIdStr.equals("anonymousUser")) {
			throw new CustomException(ErrorCode.INVALID_AUTHORIZE);
		}

		int memId;
		try {
			memId = Integer.parseInt(memIdStr);
		} catch (NumberFormatException e) {
			throw new CustomException(ErrorCode.INVALID_AUTHORIZE);
		}

		return memId;
	}

	@Override
	public MemberVO getProfileFile(MemberVO member) {
		int memId = member.getMemId();

		MemberVO profile = this.myInquiryMapper.getProfileFile(memId);

		if (profile == null) {
			return member;
		}

		member.setProfileFilePath(getFilePathFromId(profile.getFileProfile()));
		member.setBadgeFilePath(getFilePathFromId(profile.getFileBadge()));
		member.setSubFilePath(getFilePathFromId(profile.getFileSub()));

		member.setMemId(memId);

		return member;
	}

	private String getFilePathFromId(Long fileId) {
		// 파일 ID 자체가 null이면 null 반환
		if (fileId == null) {
			return null;
		}

		FileDetailVO fileDetail = fileService.getFileDetail(fileId, 1);

		if (fileDetail == null) {
			return null;
		}

		return this.fileService.getSavePath(fileDetail);
	}

	@Override
	public int updateMemberPhone(String imp_uid, String memId) {

		if (imp_uid == null || imp_uid.isEmpty()) {
			return 0;
		}

		RestTemplate restTemplate = new RestTemplate();

		String tokenUrl = "https://api.iamport.kr/users/getToken";

		HttpHeaders tokenHeaders = new HttpHeaders();
		tokenHeaders.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));

		Map<String, String> tokenBody = new HashMap<>();
		tokenBody.put("imp_key", IMP_IDENTITY_KEY); // REST API 키
		tokenBody.put("imp_secret", IMP_IDENTITY_SECRET);

		Gson gson = new Gson();
		String jsonBody = gson.toJson(tokenBody);

		String accessToken = "";
		try {
			HttpEntity<String> tokenRequest = new HttpEntity<>(jsonBody, tokenHeaders);

			ResponseEntity<Map> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequest,
					Map.class);

			Map tokenRes = (Map) tokenResponse.getBody().get("response");
			accessToken = (String) tokenRes.get("access_token");

		} catch (Exception e) {
			e.printStackTrace();
		}

		String certificationUrl = "https://api.iamport.kr/certifications/" + imp_uid;

		HttpHeaders authHeaders = new HttpHeaders();
		authHeaders.setBearerAuth(accessToken); // Bearer 토큰 설정

		HttpEntity<String> authEntity = new HttpEntity<>(authHeaders);

		ResponseEntity<Map> certificationResponse = restTemplate.exchange(certificationUrl, HttpMethod.GET, authEntity,
				Map.class);

		Map<String, Object> finalResult = new HashMap<>();
		if (certificationResponse.getStatusCode().is2xxSuccessful()) {
			Map<String, Object> responseBody = (Map<String, Object>) certificationResponse.getBody().get("response");
			
			log.info("전체 데이터"+responseBody);
			log.info("변경된 폰넘버"+responseBody.get("phone"));
			
			MemberVO member = this.myInquiryMapper.selectMyInquiryView(parseMemId(memId));
			
			if(member.getMemName().equals(responseBody.get("name"))) {
				member.setMemId(parseMemId(memId));
				member.setMemPhoneNumber(memberJoinService.formatPhoneNumber((String) responseBody.get("phone")));
				return myInquiryMapper.updateMemberPhone(member);
			} else {
				log.error("사용자 불일치");
			}
			
		} else {
			log.error("인증 정보 조회 실패: " + certificationResponse.getBody());
		}

		return 0;
	}
}
