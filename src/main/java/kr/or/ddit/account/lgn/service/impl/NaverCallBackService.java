package kr.or.ddit.account.lgn.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class NaverCallBackService {
	
	@Value("${naver.client.id}")
    private String CLIENT_ID;
	@Value("${naver.client.secret}")
    private String CLIENT_SECRET;
	@Value("${app.back_url}")
	private String BACK_URL;
	
	private String REDIRECT_URI;

    public Map<String, Object> loginWithNaver(String code) {
        String accessToken = getAccessToken(code);
        return getUserInfo(accessToken);
    }

    private String getAccessToken(String code) {
        String tokenUri = "https://nid.naver.com/oauth2.0/token";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        REDIRECT_URI = BACK_URL + "/lgn/naverCallback.do";
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", CLIENT_ID);
        params.add("client_secret", CLIENT_SECRET);
        params.add("code", code);
        params.add("redirect_uri", REDIRECT_URI);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, request, Map.class);

        return response.getBody().get("access_token").toString();
    }

    private Map<String, Object> getUserInfo(String accessToken) {
        String userInfoUri = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken); // Authorization: Bearer accessToken

        HttpEntity<Void> request = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.exchange(userInfoUri, HttpMethod.GET, request, Map.class);

        return response.getBody(); // "response" 키 안에 사용자 정보가 들어있음
    }

	public String getClientKey() {
		// TODO Auto-generated method stub
		return CLIENT_ID;
	}
}
