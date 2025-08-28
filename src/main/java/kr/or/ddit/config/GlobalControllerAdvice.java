package kr.or.ddit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalControllerAdvice {

	@Value("${app.front_url}")
	private String FRONT_URL;
	
	@Value("${app.back_url}")
	private String BACK_URL;
	
	@ModelAttribute("frontUrl")
	public String getFrontUrl() {
		return FRONT_URL;
	}

	@ModelAttribute("backUrl")
	public String getBackUrl() {
		return BACK_URL;
	}
}