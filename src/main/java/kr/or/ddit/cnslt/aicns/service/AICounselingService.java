package kr.or.ddit.cnslt.aicns.service;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public interface AICounselingService {

	Map<String, Object> aicnsPopUpStart(HttpSession session, Map<String, Object> param);

	String validateForStartAICns(String sid, String memId, HttpSession session, HttpServletRequest req);

}
