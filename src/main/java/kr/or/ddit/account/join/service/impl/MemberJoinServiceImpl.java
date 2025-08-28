package kr.or.ddit.account.join.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;

import kr.or.ddit.account.join.service.MemberJoinService;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MemberJoinServiceImpl implements MemberJoinService {

	@Autowired
	MemberJoinMapper memberJoinMapper;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Value("${join.imp.api.key}")
	private String IMP_IDENTITY_KEY;
	
	@Value("${join.imp.api.secret}")
	private String IMP_IDENTITY_SECRET;
	
	@Value("${join.imp.channel.key}")
	private String IMP_CHANNEL_KEY;
	
	@Value("${join.imp.identification.code}")
	private String IMP_IDENTIFICATION_CODE;

	@Override
	public MemberVO selectUserEmail(String email) {
		return memberJoinMapper.selectUserEmail(email);
	}

	@Override
	public boolean isNicknameExists(String nickname) {
		String result = this.memberJoinMapper.isNicknameExists(nickname);

		boolean tf = true;

		if (result.equals("false")) {
			tf = false;
		}

		return tf;
	}

	@Override
	public Map<String, Object> identityCheck(String imp_uid) {

		if (imp_uid == null || imp_uid.isEmpty()) {
			Map<String, Object> result = new HashMap<>();
			result.put("success", false);
			result.put("message", "imp_uid가 누락되었습니다.");
			return result;
		}

		RestTemplate restTemplate = new RestTemplate();

		// 1. 인증 토큰 발급
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

			// 응답에서 access_token 추출
			Map tokenRes = (Map) tokenResponse.getBody().get("response");
			accessToken = (String) tokenRes.get("access_token");

		} catch (Exception e) {
			e.printStackTrace();
		}

		// 2. imp_uid로 본인 인증 정보 조회
		String certificationUrl = "https://api.iamport.kr/certifications/" + imp_uid;

		HttpHeaders authHeaders = new HttpHeaders();
		authHeaders.setBearerAuth(accessToken); // Bearer 토큰 설정

		HttpEntity<String> authEntity = new HttpEntity<>(authHeaders);

		ResponseEntity<Map> certificationResponse = restTemplate.exchange(certificationUrl, HttpMethod.GET, authEntity,
				Map.class);

		Map<String, Object> finalResult = new HashMap<>();
		if (certificationResponse.getStatusCode().is2xxSuccessful()) {
			Map<String, Object> responseBody = (Map<String, Object>) certificationResponse.getBody().get("response");

			// 본인 인증 성공 시
			finalResult.put("success", true);
			finalResult.put("message", "본인 인증 정보 조회 성공");
			finalResult.put("data", responseBody); // 인증 정보 데이터

		} else { // 본인 인증 실패 시 finalResult.put("success", false);
			finalResult.put("message", "본인 인증 정보 조회 실패");
			log.error("인증 정보 조회 실패: " + certificationResponse.getBody());
		}

		return finalResult;
	}

	@Override
	public int memberJoin(MemberVO memberVO) {

		memberVO.setMemPassword(bCryptPasswordEncoder.encode(memberVO.getMemPassword()));
		memberVO.setMemPhoneNumber(formatPhoneNumber(memberVO.getMemPhoneNumber()));
		return memberJoinMapper.memberJoin(memberVO);
	}

	public String formatPhoneNumber(String phoneNum) {

		if (phoneNum == null || phoneNum.length() != 11) {
			return null;
		}

		if (!phoneNum.matches("\\d+")) {
			return null;
		}

		StringBuilder sb = new StringBuilder();
		sb.append(phoneNum.substring(0, 3));
		sb.append("-");
		sb.append(phoneNum.substring(3, 7)); 
		sb.append("-");
		sb.append(phoneNum.substring(7));

		return sb.toString();
	}

	@Override
	public Map<String, Object> getImpChannelKeyAndIdentificationCode() {
		return Map.of("IMP_CHANNEL_KEY", IMP_CHANNEL_KEY, "IMP_IDENTIFICATION_CODE", IMP_IDENTIFICATION_CODE);
	}

}
