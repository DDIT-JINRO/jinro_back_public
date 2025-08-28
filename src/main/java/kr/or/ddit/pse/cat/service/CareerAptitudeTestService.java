package kr.or.ddit.pse.cat.service;

import java.util.Map;

public interface CareerAptitudeTestService {

	public Map<String, Object> testSubmit(Map<String, Object> data, String memId);

	public String testV2Submit(Map<String, Object> data, String memId);

	public String testSave(Map<String, Object> data, String memId);

	public Map<String, Object> getSavingTest(String qno, String memId);

	public void delTempSaveTest(String no, String memId);

	public void insertResultKeyword(String url, String memId, String testNo);

}
