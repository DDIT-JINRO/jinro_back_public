package kr.or.ddit.you.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.you.service.YoutubeService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
//유튜브 동영상 가져오기 API 
public class youtubeServiceImpl implements YoutubeService {

	@Autowired
	YoutubeMapper mapper;
	
	@Override
	public Map<String, Object> getKeyword(String memId) {
	    String data = "";
	    Map<String, Object> map = this.mapper.getKeyword(Integer.parseInt(memId));

	    log.info("datadatadatadata: "+map);
	    
	    // 결과 없으면 새로운 HashMap 생성
	    if (map == null) {
	        map = new HashMap<>();
	    }

	    if (map.get("RESULT") != null) {
	        data = map.get("RESULT").toString();
	    }

	    if (data != null) {
	        if (data.contains("·")) {
	            String replaceData = data.replace("·", " 적성 |");
	            map.put("RESULT", replaceData);
	        }
	        return map;
	    } else {
	        map.put("RESULT", "직업");
	        return map;
	    }
	}

}
