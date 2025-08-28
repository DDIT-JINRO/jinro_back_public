package kr.or.ddit.util.ai.web;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
//제미나이 챗봇 컨트롤러
public class GenerateTextFromTextInput {

	//API 키
	@Value("${gemini.api.cns.key}")
	private String API_KEY;
	private static final Map<String, String> MEMO = new ConcurrentHashMap<>();

	//테스트용 JSP
	@GetMapping("/ai")
	public String openJSP() {
		return "aiChat/aiChatUI";
	}

    @PostMapping("/ai/chatbot")
    @ResponseBody
    public String geminiChat(@RequestBody Map<String, String> body) {

        // 제미니 api 연결
        Client client = Client.builder().apiKey(API_KEY).build();
        GenerateContentConfig config = GenerateContentConfig.builder()
        	    .responseMimeType("application/json") // JSON만 내도록 강제
        	    .maxOutputTokens(1024)                // 답변 길이 상한
        	    .temperature(0.3f)
        	    .candidateCount(1)
        	    .build();

        String sid = body.get("sid");
        String topic = body.get("topic");
        String userMsg = body.get("message");
        if(topic == null || userMsg == null) {
            return "잘못된 요청입니다.";
        }
        String summary = MEMO.getOrDefault(sid, "");	// debug-1 ) 이전 대화 잘 요약하고 있는지 확인
        String system = sysPrompt(topic, summary);

        // --- 2) 한 번에 JSON으로 받기: answer + summary ---
        String prompt = """
            %s

            [사용자] %s

            [출력형식]
        	- 오직 JSON 객체만 출력합니다. 마크다운/코드펜스(``` 또는 ```json) 절대 금지.
        	- 출력은 반드시 { 로 시작해서 } 로 끝납니다. 앞뒤 공백 외의 문자는 금지합니다.
        	- 키와 값은 모두 큰따옴표를 사용합니다. 불필요한 역슬래시, 주석, 꼬리 콤마 금지.

        	예시 출력:
        	{"answer":"사용자에게 보여줄 답변. html의 div요소 내부에 출력할 문장이니까 마크다운이 아닌 html로 제공","summary":"상담 대화의 연관성을 유지하기 위해 프롬프트에 같이 담아보낼 대화 요약 제공. 최대 3~4문장"}
        """.formatted(system, userMsg);

        try {
            GenerateContentResponse resp = client.models.generateContent("gemini-2.0-flash", prompt, config);
            String text = resp.text();	// debug-2 ) 답변 정상적으로 받았는지. 파싱 가능한 답변인지(json) 확인

            // 매우 단순 파서 (Jackson)
            ObjectMapper om = new ObjectMapper();
            JsonNode root = om.readTree(text);
            String answer = root.path("answer").asText("");    // 프론트에 그대로 반환
            String newSummary = root.path("summary").asText(""); // 메모리에 저장
            if(!newSummary.isBlank()) MEMO.put(sid, newSummary);

            return answer.isBlank() ? "답변 생성에 실패했습니다." : answer;
        } catch (JsonProcessingException e) {
			log.error(e.getMessage());
			return "죄송합니다. 상담 도중 문제가 발생했어요.";
		} catch (IOException e) {
			log.error(e.getMessage());
			return "죄송합니다. 상담 도중 문제가 발생했어요.";
		} catch (Exception e) {
            log.error("Gemini 오류", e.getMessage());
            return "죄송합니다. 상담 도중 문제가 발생했어요.";
        }
    }

    @PostMapping("/ai/session/close")
    @ResponseBody
    public ResponseEntity<Void> closeSession(@RequestBody Map<String, String> body) {
        String sid = body.get("sid");
        if (sid != null && !sid.isBlank()) {
            MEMO.remove(sid);  // ← 여기서 세션별 요약/컨텍스트 삭제
        }
        return ResponseEntity.ok().build();
    }

    private String sysPrompt(String topic, String summary){
        String role = switch(topic){
            case "MIND" -> "심리 상담";
            case "JOB" -> "취업 상담";
            case "STUDY" -> "학업 상담";
            default -> "상담";
        };
        if(summary == null || summary.isBlank()) summary = "없음";

        return """
        [역할] 당신은 %s 챗봇입니다. 공감하고, 현실적으로 실행 가능한 제안을 간단명료하게 제시합니다.
        [주제 일탈] 주제와 관련 없는 질문은 정중히 현재 주제로 다시 이끌어 주세요.
        [대화 요약] %s
        """.formatted(role, summary);
    }


}