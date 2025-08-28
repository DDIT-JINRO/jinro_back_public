package kr.or.ddit.you.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.you.service.YoutubeService;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class YoutubeApiController {

	@Autowired
	YoutubeService service;
	
	@Value("${youtube.api.key}")
	private String API_KEY;

	@GetMapping("/main/youtube")
	public Map<String, Object> youtube(@AuthenticationPrincipal String memId, Model model) {	
		log.info(memId);	
		
		// 채널 검색 ID
		String channelId = "UC7veJl4E23uPDXoVu-0qYAA";
		// 키워드
		String result ="";
		Map<String, Object> map= new HashMap<String, Object>();
		
		if(!memId.equals("anonymousUser")) {
			map = service.getKeyword(memId);
			
		}else {
			result ="직업";
			map.put("RESULT",result);
		}
		map.put("channelId", channelId);
		map.put("apikey", API_KEY);
		return map;
	}
}
