package kr.or.ddit.pse.cat.service.impl;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;

import io.github.bonigarcia.wdm.WebDriverManager;
import kr.or.ddit.account.lgn.service.LoginService;
import kr.or.ddit.admin.las.service.RecommendKeywordVO;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.pse.cat.service.AptitudeTestVO;
import kr.or.ddit.pse.cat.service.CareerAptitudeTestService;
import kr.or.ddit.pse.cat.service.TemporarySaveVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CareerAptitudeTestServiceImpl implements CareerAptitudeTestService {

	@Value("${test.api.key}")
	private String TEST_API_KEY;
	
	@Value("${gemini.api.key}")
	private String geminiApiKey;
	
	@Autowired
	LoginService loginService;

	@Autowired
	CareerAptitudeTestMapper careerAptitudeTestMapper;
	
	@Override
	public Map<String, Object> testSubmit(Map<String, Object> data, String memId) {
		int testSeq = (int) data.get("testNo");
		if (testSeq == 30 || testSeq == 31 || testSeq == 24 || testSeq == 25 || testSeq == 20 || testSeq == 21) {
			Map<String, Object> resURL = reqTestNor(data, memId);
			return resURL;
		} else {
			return Map.of("msg", "failed");
		}
	}

	public Map<String, Object> reqTestNor(Map<String, Object> data, String memId) {

		Map<String, Object> answers = (Map<String, Object>) data.get("answers");

		String answer = String.join(" ", answers.entrySet().stream().map((e) -> e.getKey() + "=" + e.getValue()).toArray(String[]::new));

		MemberVO memVO = new MemberVO();
		int numMemId = Integer.parseInt(memId);
		memVO = loginService.selectById(numMemId);

		String memGen = memVO.getMemGen();
		String gender = "";
		if ("G11001".equals(memGen)) {
			gender = "100323";
		} else if ("G11002".equals(memGen)) {
			gender = "100324";
		}

		String testNo = String.valueOf(data.get("testNo"));
		String ageGroup = String.valueOf(data.get("ageGroup"));

		String url = "https://www.career.go.kr/inspct/openapi/test/report";

		RestTemplate restTemplate = new RestTemplate();

		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("apikey", TEST_API_KEY);
		requestBody.put("qestrnSeq", testNo);
		requestBody.put("trgetSe", ageGroup);
		requestBody.put("gender", gender);
		requestBody.put("grade", "3");
		requestBody.put("startDtm", System.currentTimeMillis());
		requestBody.put("answers", answer);

		// 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		// HttpEntity로 결합
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		// 요청 실행
		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

		String responseBody = response.getBody();

		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(responseBody);

			String succYn = root.get("SUCC_YN").asText();
			String errorReason = root.get("ERROR_REASON").asText();
			JsonNode resultNode = root.get("RESULT");
			long inspctSeq = resultNode.get("inspctSeq").asLong();
			String reportUrl = resultNode.get("url").asText();

			// insertResultKeyword(reportUrl, memId, testNo);
			
			AptitudeTestVO aptitudeTestVO = AptitudeTestVO.builder().memId(Integer.parseInt(memId))
					.atTestNo(Integer.parseInt(testNo))
					.atResultUrl(reportUrl)
					.build();
			
			this.careerAptitudeTestMapper.insertAptitudeResult(aptitudeTestVO);

			return Map.of("msg", "success", "reportUrl", reportUrl);
		} catch (Exception e) {
			return Map.of("msg", "failed");
		}

	}

	@Override
	public String testV2Submit(Map<String, Object> data, String memId) {

//		List<Map<>> data.get("answers");

		Map<Integer, Integer> answers = (Map<Integer, Integer>) data.get("answers");

//		String answer = String.join(" ",
//				answers.entrySet().stream().map((e) -> e.getKey() + "=" + e.getValue()).toArray(String[]::new));
//
//		MemberVO memVO = new MemberVO();
//		int numMemId = Integer.parseInt(memId);
//		memVO = loginService.selectById(numMemId);
//
//		String memGen = memVO.getMemGen();
//		String gender = "";
//		if ("G11001".equals(memGen)) {
//			gender = "100323";
//		} else if ("G11002".equals(memGen)) {
//			gender = "100324";
//		}
//
//		String testNo = String.valueOf(data.get("testNo"));
//		String ageGroup = String.valueOf(data.get("ageGroup"));
//
//		String url = "https://www.career.go.kr/inspct/openapi/v2/report";
//
//		RestTemplate restTemplate = new RestTemplate();
//
//		Map<String, Object> requestBody = new HashMap<>();
//		requestBody.put("apikey", TEST_API_KEY);
//		requestBody.put("qestrnSeq", testNo);
//		requestBody.put("trgetSe", ageGroup);
//		requestBody.put("gender", gender);
//		requestBody.put("grade", "3");
//		requestBody.put("startDtm", System.currentTimeMillis());
//		requestBody.put("answers", answer);
//
//		// 헤더 설정
//		HttpHeaders headers = new HttpHeaders();
//		headers.setContentType(MediaType.APPLICATION_JSON);
//
//		// HttpEntity로 결합
//		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
//
//		// 요청 실행
//		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//
//		String responseBody = response.getBody();
//
//		try {
//			ObjectMapper mapper = new ObjectMapper();
//			JsonNode root = mapper.readTree(responseBody);
//
//			String succYn = root.get("SUCC_YN").asText();
//			String errorReason = root.get("ERROR_REASON").asText();
//			JsonNode resultNode = root.get("RESULT");
//			long inspctSeq = resultNode.get("inspctSeq").asLong();
//			String reportUrl = resultNode.get("url").asText();
//
////		    log.info("SUCC_YN: {}", succYn);
////		    log.info("ERROR_REASON: {}", errorReason);
////		    log.info("inspctSeq: {}", inspctSeq);
////		    log.info("Report URL: {}", reportUrl);

//			return reportUrl;
//		} catch (Exception e) {
//			return "응답 JSON 파싱 실패";
//		}
		return "";
	}

	@Override
	public String testSave(Map<String, Object> data, String memId) {

		String testType = "";
		String type = data.get("testNo") + "";

		if ("30".equals(type) || "31".equals(type))
			testType = "G37001";
		if ("33".equals(type) || "34".equals(type))
			testType = "G37002";
		if ("24".equals(type) || "25".equals(type))
			testType = "G37003";
		if ("20".equals(type) || "21".equals(type))
			testType = "G37004";
		if ("6".equals(type))
			testType = "G37005";
		if ("8".equals(type))
			testType = "G37006";
		if ("9".equals(type))
			testType = "G37007";
		if ("10".equals(type))
			testType = "G37008";

		ObjectMapper objectMapper = new ObjectMapper();
		TemporarySaveVO temporarySaveVO = new TemporarySaveVO();

		String json = "";
		int intMemId = Integer.parseInt(memId);

		try {

			json = objectMapper.writeValueAsString(data);
			temporarySaveVO.setMemId(intMemId);
			temporarySaveVO.setTsContent(json);
			temporarySaveVO.setTsType(testType);
			int result = careerAptitudeTestMapper.testSave(temporarySaveVO);

			if (result == 1) {
				return "success";
			} else {
				return "failed";
			}

		} catch (JsonProcessingException e) {
			return "failed";
		}
	}

	@Override
	public Map<String, Object> getSavingTest(String qno, String memId) {

		String testType = "G3700" + qno;

		int intMemId = Integer.parseInt(memId);
		Map<String, Object> map = new HashMap<String, Object>();

		TemporarySaveVO temporarySaveVO = new TemporarySaveVO();

		temporarySaveVO.setTsType(testType);
		temporarySaveVO.setMemId(intMemId);

		TemporarySaveVO savingTest = careerAptitudeTestMapper.getSavingTest(temporarySaveVO);
		if (savingTest == null) {
			map.put("msg", "failed");
			return map;
		}

		String testContent = savingTest.getTsContent();
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			Map<String, Object> savingContent = objectMapper.readValue(testContent, Map.class);
			savingContent.put("msg", "success");
			return savingContent;
		} catch (JsonMappingException e) {
			map.put("msg", "failed");
			return map;
		} catch (JsonProcessingException e) {
			map.put("msg", "failed");
			return map;
		}

	}

	@Override
	public void delTempSaveTest(String no, String memId) {
		String testType = "G3700" + no;
		int intMemId = Integer.parseInt(memId);
		TemporarySaveVO temporarySaveVO = new TemporarySaveVO();
		temporarySaveVO.setTsType(testType);
		temporarySaveVO.setMemId(intMemId);
		careerAptitudeTestMapper.delTempSaveTest(temporarySaveVO);
	}

	@Override
	public void insertResultKeyword(String url, String memId, String testNo) {
		WebDriver driver = null;
		try {
			WebDriverManager.chromedriver().setup();
			ChromeOptions options = new ChromeOptions();
			options.addArguments("--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage");

			// 3. WebDriver 인스턴스 생성
			driver = new ChromeDriver(options);
			// 4. 웹 페이지로 이동하여 원하는 작업 수행
			driver.get(url);

			// 5. 암시적 대기 설정 (페이지 로딩까지 최대 5초 대기)
			driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

			String result = "";

			switch (testNo) {
			case "20": // 직업적성검사(중학생용) 크롤링
			case "21": {
				// 직업적성검사(고등학생용) 크롤링
				result = scrapeAptitudeTestResult(driver);
				break;
			}
			case "24": // 직업가치관검사(중학생용) 크롤링
			case "25": {
				// 직업가치관검사(고등학생용) 크롤링
				result = scrapeJuniorValueTestResult(driver);
				break;
			}
			case "30": // 직업흥미검사(K)(중학생용) 크롤링
			case "31": {
				// 직업흥미검사(K)(고등학생용) 크롤링
				result = scrapeCareerInterestTestResult(driver);
				break;
			}
			default:
				throw new IllegalArgumentException("Unexpected value: " + testNo);
			}


			AptitudeTestVO aptitudeTestVO = AptitudeTestVO.builder().memId(Integer.parseInt(memId))
					.atTestNo(Integer.parseInt(testNo))
					.atResultUrl(url)
					.atResultText(result)
					.build();
			
			insertRecommendKeyword(result, memId);
			this.careerAptitudeTestMapper.insertAptitudeResult(aptitudeTestVO);

		} catch (Exception e) {
			throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
		} finally {
			if (driver != null) {
				driver.quit();
			}
		}
	}
	
    public void insertRecommendKeyword(String aptitudeTestResult, String memId) {
        
        // 기존 로직은 그대로 유지합니다.
        Client client = Client.builder().apiKey(geminiApiKey).build();

        StringBuilder sb = new StringBuilder();
    	
        sb.append(aptitudeTestResult).append("를 바탕으로 직업 1가지를 추천해주세요.\n");
        sb.append("단어는 1개로 제한합니다.");
        sb.append("앞 뒤에 대한 내용 없이 답변 하는 내용 또한 1단어로만 합니다.");
        sb.append("직업에 대하여 전문가, 교수, CEO 등의 뭉뚱한 대답보다는 경찰, 의사처럼 특정 직업을 답변합니다.");
        
     	String prompt = sb.toString();
        
        try {
            GenerateContentResponse response = client.models.generateContent("gemini-1.5-flash", prompt, null);
            String rkName = response.text();
            
            RecommendKeywordVO recommendKeywordVO = new RecommendKeywordVO();
            recommendKeywordVO.setMemId(Integer.parseInt(memId));
            recommendKeywordVO.setRkName(rkName);
            
            this.careerAptitudeTestMapper.insertRecommendKeyword(recommendKeywordVO);            
        } catch (ServerException e) {
            log.error("Google GenAI API를 호출하는 중 서버 에러(503 등)가 발생했습니다. 추천 키워드 생성을 건너뜁니다.", e);
        } catch (Exception e) {
            log.error("Google GenAI API 호출 중 예상치 못한 에러가 발생했습니다.", e);
        }
    }

	/**
	 * 직업적성검사(중·고등학생용) 결과를 크롤링하여 하나의 문자열로 조합합니다. (testNo 20, 21)
	 * 
	 * @param driver WebDriver 인스턴스
	 * @return "높은 적성 : ... / 적성1 추천 직업 : ..." 형태의 최종 문자열
	 */
	private String scrapeAptitudeTestResult(WebDriver driver) {
		// 1. 높은 적성 키워드 3개 추출
		List<WebElement> topAptitudeElements = driver.findElements(By.cssSelector("ul.total-result-list > li > strong"));
		List<String> topAptitudes = topAptitudeElements.stream().map(WebElement::getText).collect(Collectors.toList());

		// 2. 추천 직업군 및 직업 목록을 Map 형태로 추출 (헬퍼 메서드 호출)
		Map<String, List<String>> recommendedJobsMap = findAptitudeJobs(driver, topAptitudes);

		// 3. 모든 결과를 하나의 문자열로 조합
		List<String> finalParts = new ArrayList<>();

		// 3-1. 높은 적성 분야 추가
		if (!topAptitudes.isEmpty()) {
			finalParts.add("높은 적성 : " + String.join(", ", topAptitudes));
		}

		// 3-2. 각 적성별 추천 직업 목록 추가
		recommendedJobsMap.forEach((aptitude, jobs) -> {
			finalParts.add(aptitude + " 추천 직업 : " + String.join(", ", jobs));
		});

		// 3-3. 모든 부분을 " / "로 연결하여 최종 문자열 생성 후 반환
		return String.join(" / ", finalParts);
	}

	/**
	 * [헬퍼] 직업적성검사 페이지에서 주어진 적성들에 해당하는 직업 목록을 찾아 반환합니다.
	 * 
	 * @param driver       WebDriver 인스턴스
	 * @param topAptitudes 상위 적성 목록
	 * @return 적성 이름을 Key로, 직업 목록을 Value로 갖는 Map
	 */
	private Map<String, List<String>> findAptitudeJobs(WebDriver driver, List<String> topAptitudes) {
		Map<String, List<String>> results = new LinkedHashMap<>();

		// 페이지의 모든 '추천 직업군' 섹션 컨테이너를 XPath로 찾음
		List<WebElement> jobGroupSections = driver.findElements(By.xpath("//strong[@class='title-aptitude-box']/ancestor::div[1]"));

		for (WebElement section : jobGroupSections) {
			String fullTitle = section.findElement(By.className("title-aptitude-box")).getText();
			String aptitudeName = fullTitle.replace(" 직업군", "").trim();

			if (topAptitudes.contains(aptitudeName)) {
				// 해당 섹션 내의 모든 직업 링크(a) 또는 텍스트(span)를 찾음
				List<WebElement> jobElements = section.findElements(By.cssSelector("td.left > a, td.left > span"));

				List<String> jobNames = jobElements.stream().map(job -> job.getText().trim()).filter(name -> !name.isEmpty()) // 가끔 빈 텍스트가 들어오는 경우 제외
						.collect(Collectors.toList());

				results.put(aptitudeName, jobNames);
			}
		}
		return results;
	}

	/**
	 * 직업가치관검사(중·고등학생용) 결과를 크롤링하여 하나의 문자열로 조합합니다. (testNo 24)
	 * 
	 * @param driver WebDriver 인스턴스
	 * @return "상위 가치관 : ... / 내가 중요하게 생각하는 가치관 : ..." 형태의 최종 문자열
	 */
	private String scrapeJuniorValueTestResult(WebDriver driver) {
		// 1. 검사 결과 상위 가치관
		List<WebElement> topResultElements = driver.findElements(By.cssSelector(".aptitude-tbl-list.value.import tbody tr td:nth-of-type(1)"));
		String topResultValues = topResultElements.stream().map(WebElement::getText).collect(Collectors.joining(", "));

		// 2. 내가 중요하게 생각하는 가치관
		List<WebElement> myChoiceElements = driver.findElements(By.cssSelector(".aptitude-tbl-list.value.import tbody tr td:nth-of-type(2)"));
		String myChoiceValues = myChoiceElements.stream().map(WebElement::getText).collect(Collectors.joining(", "));

		// 3. 나의 가치지향 유형 텍스트 추출
		WebElement myTypeElement = driver.findElement(By.cssSelector("p.value-custom > span.fcolor-green"));
		String myValueType = myTypeElement.getText().replace("\"", "").trim();

		// 4. 해당 유형에 맞는 직업 목록 찾기 (헬퍼 메서드 호출)
		String recommendedJobs = findJobsByValueType(driver, myValueType);

		// 5. 최종 문자열 조합 후 반환
		return "상위 가치관 :: " + topResultValues + " / 내가 중요하게 생각하는 가치관 :: " + myChoiceValues + " / 나의 가치지향 유형 :: " + myValueType + " / 추천 직업 목록 :: "
				+ recommendedJobs;
	}

	/**
	 * 직업흥미검사(K) 결과를 크롤링하여 하나의 문자열로 조합합니다. (testNo 30)
	 * 
	 * @param driver WebDriver 인스턴스
	 * @return "높은 흥미 분야 : ... / 흥미군 제목1 : 직업..." 형태의 최종 문자열
	 */
	private String scrapeCareerInterestTestResult(WebDriver driver) {
		// 1. 높은 흥미 분야 추출
		List<WebElement> highInterestElements = driver.findElements(By.cssSelector("ul.interest-part > li > span"));
		List<String> highInterestFields = highInterestElements.stream().map(WebElement::getText).collect(Collectors.toList());

		// 2. 상위 3개 직업 흥미군 및 직업명 추출
		Map<String, List<String>> top3JobGroups = new LinkedHashMap<>();

		// --- 선택자 수정 부분 ---
		// 특정 섹션을 지정하여 원하는 테이블의 제목만 가져오도록 수정
		List<WebElement> headerElements = driver
				.findElements(By.cssSelector(".aptitude-result-content > .cont-wrap:nth-of-type(2) .aptitude-tbl-list.violet thead tr th"));
		// 마찬가지로 원하는 테이블의 내용만 가져오도록 수정
		List<WebElement> jobCellElements = driver
				.findElements(By.cssSelector(".aptitude-result-content > .cont-wrap:nth-of-type(2) .aptitude-tbl-list.violet tbody tr.td-background > td"));
		// --- 선택자 수정 끝 ---

		if (headerElements.size() == jobCellElements.size()) {
			for (int i = 0; i < headerElements.size(); i++) {
				String groupTitle = headerElements.get(i).getText();
				WebElement jobCell = jobCellElements.get(i);
				List<WebElement> jobSpans = jobCell.findElements(By.tagName("span"));
				List<String> jobNames = jobSpans.stream().map(WebElement::getText).collect(Collectors.toList());
				top3JobGroups.put(groupTitle, jobNames);
			}
		}

		// 3. 모든 결과를 하나의 문자열로 조합
		List<String> finalParts = new ArrayList<>();

		// 3-1. 높은 흥미 분야 추가
		if (!highInterestFields.isEmpty()) {
			finalParts.add("높은 흥미 분야 :: " + String.join(", ", highInterestFields));
		}

		finalParts.add("상위 3개 직업 흥미군의 관련 직업목록 ::");

		// 3-2. 상위 3개 직업 흥미군 추가
		top3JobGroups.forEach((group, jobs) -> {
			finalParts.add(group + " : " + String.join(", ", jobs));
		});

		// 3-3. 모든 부분을 " / "로 연결하여 최종 문자열 생성 후 반환
		return String.join(" / ", finalParts);
	}

	// 직업가치관(중학생) 가치지향 직업 추출 (헬퍼 메소드)
	private String findJobsByValueType(WebDriver driver, String valueType) {
		List<WebElement> jobSections = driver.findElements(By.cssSelector("ul.value4-job > li"));

		for (WebElement section : jobSections) {
			// 가치지향 제목
			WebElement titleElement = section.findElement(By.tagName("dt"));
			if (titleElement.getText().contains(valueType)) {

				try {
					// 1. 현재 섹션 내에서 '더보기' 링크를 찾습니다.
					WebElement moreButton = section.findElement(By.linkText("더보기"));

					// 2. 버튼이 화면에 보일 경우에만 클릭합니다.
					if (moreButton.isDisplayed()) {
						log.info("'{}' 섹션의 '더보기' 버튼을 클릭합니다.", valueType);

						// JavascriptExecutor를 사용하여 강제로 클릭
						JavascriptExecutor js = (JavascriptExecutor) driver;
						// 1. 먼저 요소를 화면 중앙으로 스크롤합니다. (선택사항이지만 안정성을 높여줍니다)
						js.executeScript("arguments[0].scrollIntoView({block: 'center'});", moreButton);
						// 2. Javascript를 통해 클릭 이벤트를 직접 실행합니다.
						js.executeScript("arguments[0].click();", moreButton);

						Thread.sleep(500); // 내용이 로딩될 시간을 기다립니다.
					}
				} catch (NoSuchElementException e) {
					// '더보기' 버튼이 없는 경우, 아무것도 하지 않고 넘어갑니다.
					log.info("'{}' 섹션에는 '더보기' 버튼이 없습니다.", valueType);
				} catch (InterruptedException e) {
					Thread.currentThread().interrupt();
				}

				// 직업 텍스트를 추출하여 반환
				List<WebElement> jobLinks = section.findElements(By.cssSelector("dd > a"));

				return jobLinks.stream().map(WebElement::getText).collect(Collectors.joining(" , "));
			}
		}
		// 일치하는 유형을 찾지 못한 경우 빈 리스트 반환
		return "";
	}

}
