package kr.or.ddit.account.lgn.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class KakaoCallBackService {
	
	@Value("${kakao.api.key}")
	private String REST_API_KEY;
	@Value("${app.back_url}")
	private String BACK_URL;
	
	private String REDIRECT_URI;
	
	
	public Map<String, Object> loginWithKakao(String code) {
        String accessToken = getAccessToken(code);
        return getUserInfo(accessToken); // 반환 타입도 Map
    }

    private String getAccessToken(String code) {
        String tokenUri = "https://kauth.kakao.com/oauth/token";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        REDIRECT_URI = BACK_URL + "/lgn/kakaoCallback.do";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", REST_API_KEY);
        params.add("redirect_uri", REDIRECT_URI);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, request, Map.class);
        return response.getBody().get("access_token").toString();
    }

    private Map<String, Object> getUserInfo(String accessToken) {
        String userInfoUri = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, request, Map.class);

        return response.getBody(); // 그대로 반환
    }

	public String getRestApiKey() {
		// TODO Auto-generated method stub
		return REST_API_KEY;
	}
}	
