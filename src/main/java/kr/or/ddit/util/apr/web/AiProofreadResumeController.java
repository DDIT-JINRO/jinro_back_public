package kr.or.ddit.util.apr.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import kr.or.ddit.util.apr.service.AiProofreadResumeService;

@RestController
@RequestMapping("/ai/proofread")
public class AiProofreadResumeController {

	@Autowired
	private AiProofreadResumeService aiProofreadResumeService;

	@PostMapping("/resume")
	public String proofreadResume(@RequestBody Map<String, String> body) {

		String html = body.get("html");

		if (html == null || html.isBlank()) {
			throw new IllegalArgumentException("html 파라미터가 비어 있습니다.");
		}

		return aiProofreadResumeService.proofreadResume(html);

	}
}
