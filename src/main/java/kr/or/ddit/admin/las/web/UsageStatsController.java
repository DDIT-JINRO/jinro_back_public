package kr.or.ddit.admin.las.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.admin.las.service.UsageStatsService;
import kr.or.ddit.admin.las.service.UsageStatsVO;
import kr.or.ddit.admin.las.service.VisitVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

/*
 * 접속/이용 통계 컨트롤러
 * */
@RestController
@Slf4j
@RequestMapping("/admin/las")
public class UsageStatsController {

	@Autowired
	UsageStatsService usageStatsService;

	/*
	 * 사용 방법: 필수 파라미터 : 1. userInquiry - selectUserInquiry 2. visitCount -
	 * selectVisitCount 3. daily(일) / monthly(월) / selectDays(기간별) 로 해주셔야 합니다.
	 *
	 * 보내는 방식 : post
	 */

	@GetMapping("/userInquiry.do")
	public List<UsageStatsVO> userInquiry(
			@RequestParam(value = "selectUserInquiry", defaultValue = "daily") String selectUserInquiry,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate,
			@RequestParam(value = "gender", required = false) String gender,
			@RequestParam(value = "ageGroup", required = false) String ageGroup) {

		List<UsageStatsVO> list = usageStatsService.userInqury(selectUserInquiry, startDate, endDate, gender, ageGroup);
		return list;
	}

	// 페이지별 방문자 조회
	@GetMapping("/visitCount.do")
	public List<VisitVO> visitCount(
			@RequestParam(value = "selectVisitCount", defaultValue = "daily") String selectVisitCount,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate,
			@RequestParam(value = "gender", required = false) String gender,
			@RequestParam(value = "ageGroup", required = false) String ageGroup) {

		List<VisitVO> list = usageStatsService.visitCount(selectVisitCount, startDate, endDate, gender, ageGroup);

		return list;
	}

	// 실시간 사용자 조회
	@GetMapping("/liveUserList.do")
	public ArticlePage<MemberVO> liveUserList(
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "keyword", required = false) String keyword,
			// 성별 구분
			@RequestParam(value = "gen", required = false) String gen,
			// 로그인 구분
			@RequestParam(value = "loginType", required = false) String loginType) {

		ArticlePage<MemberVO> memList = usageStatsService.liveUserList(currentPage, size, keyword, gen, loginType);

		return memList;
	}

	@GetMapping("/user-activity-yoy/{memId}")
    public List<Map<String, Object>> getSingleUserActivityYoY(
            @PathVariable("memId") String memId,
            @RequestParam(value="type", defaultValue="daily") String type,
            @RequestParam(value="startDate", required=false) String startDate,
            @RequestParam(value="endDate", required=false) String endDate) {

        return usageStatsService.getSingleUserActivityYoY(memId, type, startDate, endDate);
    }

}