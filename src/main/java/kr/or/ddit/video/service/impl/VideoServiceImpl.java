package kr.or.ddit.video.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import kr.or.ddit.video.service.VideoService;
import lombok.extern.slf4j.Slf4j;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Slf4j
public class VideoServiceImpl implements VideoService {
	
	@Autowired
	VideoMapper videoMapper;
	
	@Transactional
	@Override
	public int createVideoChatRoom(int counselId) {
		
		// 방 생성 id
		String roomId ="";
		
		//방 URL 응답 String
		String responseBodyUser ="";
		String responseBodyCou ="";
		
		//qkd 생성 url
		String userUrl = "";
		String couUrl="";
		
		// 채팅방 생성
		OkHttpClient client = new OkHttpClient();

		MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");
		RequestBody body = RequestBody.create(mediaType,
				// 비밀번호, 방 생성 title, 최대 입장 등 설정
				"callType=P2P&liveMode=false&maxJoinCount=2&liveMaxJoinCount=100&layoutType=4&sfuIncludeAll=true&roomTitle=%EC%A7%84%EB%A1%9C%EC%9D%B4%EC%A6%88%EB%B0%B1");
		Request request = new Request.Builder()
				.url("https://openapi.gooroomee.com/api/v1/room")
				.post(body)
				.addHeader("accept", "application/json")
				.addHeader("content-type", "application/x-www-form-urlencoded")
				.addHeader("X-GRM-AuthToken", "12056163501988613cf51b7b51cdd8140bb172761d02211a8b")
				.build();

		// 💡 응답 처리 및 파싱
		try (Response response = client.newCall(request).execute()) {

			// 응답 본문을 문자열로 읽음
			String responseBody = response.body().string();
			log.info("responseBody : {}", responseBody);

			// 💡 GSON을 이용하여 JSON 파싱
			JsonObject jsonObj = JsonParser.parseString(responseBody).getAsJsonObject();
			JsonObject data = jsonObj.getAsJsonObject("data");
			JsonObject room = data.getAsJsonObject("room");
			roomId = room.get("roomId").getAsString(); // 안전하게 roomId 추출
		} catch (Exception e) {
			log.error("화상 회의 방 생성 실패", e);
		}
		
		// 채팅방 URL 생성 관련 설정
		
		// 
		String payload1 = "roomId=" + roomId +  // 방생성
						"&username=사용자" +  // 닉네임
						"&roleId=participant" +  // 방 역할 설정(참가자)
						"&apiUserId=gooroomee-tester" +  // default임
						"&ignorePasswd=false"; //비밀번호 의무로 하게 할건지

		String payload2 = "roomId=" + roomId + 
						"&username=상담사" + 
						"&roleId=speaker" + 
						"&apiUserId=gooroomee-master" +
						"&ignorePasswd=false";
		
		RequestBody body1 = RequestBody.create(mediaType, payload1);
		RequestBody body2 = RequestBody.create(mediaType, payload2);
		String data1 = body1.toString();
		String data2 = body2.toString();
		
		// 채팅방 URL 요청
		Request request1 = new Request.Builder()
				.url("https://openapi.gooroomee.com/api/v1/room/user/otp/url")
				.post(body1)
				.addHeader("accept", "application/json")
				.addHeader("content-type", "application/x-www-form-urlencoded")
				.addHeader("X-GRM-AuthToken", "12056163501988613cf51b7b51cdd8140bb172761d02211a8b")
				.build();
		log.info("requst : " + request);

		Request request2 = new Request.Builder()
				.url("https://openapi.gooroomee.com/api/v1/room/user/otp/url")
				.post(body2)
				.addHeader("accept", "application/json")
				.addHeader("content-type", "application/x-www-form-urlencoded")
				.addHeader("X-GRM-AuthToken", "12056163501988613cf51b7b51cdd8140bb172761d02211a8b")
				.build();

		// URL 요청에 대한 응답
		try {

			/*
			{"resultCode":"GRM_200",
				"data":{
					"roomUserOtp":{"otp":"biz_148578ece4434a5aa8b88854276cd5f7de9ff89e1cbb4","expiresIn":120},
					"url":"https://biz.gooroomee.com/room/otp/biz_148578ece4434a5aa8b88854276cd5f7de9ff89e1cbb4"
				}
			,"description":"success"
			}
			 */
			// 참가자 url
			Response response = client.newCall(request1).execute();
			responseBodyUser = response.body().string();
			
			if(responseBodyUser!=null || responseBodyUser!="") {
				Map<String,Object> map = (HashMap)this.jsonStringToObject(responseBodyUser, HashMap.class);				
				Map<String,Object> dataMap = (HashMap)map.get("data");
				log.info("room/enter(참가자)->JSON : " + dataMap.get("url"));				
				userUrl = dataMap.get("url").toString();
			}
			
			// 상담사 url
			response = client.newCall(request2).execute();
			responseBodyCou = response.body().string();
			if(responseBodyCou!=null || responseBodyCou!="") {
				Map<String,Object> map = (HashMap)this.jsonStringToObject(responseBodyCou, HashMap.class);
				Map<String,Object> dataMap = (HashMap)map.get("data");
				couUrl = dataMap.get("url").toString();
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return this.videoMapper.createVideoChatRoom(counselId,couUrl,userUrl);
	}

	// String to JSON
	public static Object jsonStringToObject(String jsonString, Class<?> clazz) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonString, clazz);
        } catch (IOException e) {
            // 예외 처리 (예: 로깅, 예외 던지기)
            e.printStackTrace();
            return null;
        }
    }
	
}
