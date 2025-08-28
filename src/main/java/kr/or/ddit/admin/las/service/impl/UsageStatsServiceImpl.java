package kr.or.ddit.admin.las.service.impl;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.admin.las.service.UsageStatsService;
import kr.or.ddit.admin.las.service.UsageStatsVO;
import kr.or.ddit.admin.las.service.VisitVO;

import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.util.ArticlePage;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UsageStatsServiceImpl implements UsageStatsService {

	@Autowired
	UsageStatsMapper usageStatsMapper;

	// 일별/월별/기간별 사용자 구하기
	@Override
	public List<UsageStatsVO> userInqury(String selectUserInquiry, String startDate, String endDate, String gender,
			String ageGroup) {
		// 앞 단에서 male, female값으로 넘겼을 때 대응
		if (gender != null && "male".equals(gender))
			gender = "G11001";
		if (gender != null && "female".equals(gender))
			gender = "G11002";

		List<UsageStatsVO> list = new ArrayList<>();

		if (selectUserInquiry.equals("daily")) {
			list = usageStatsMapper.dailyUserInquiry(gender, ageGroup);
		} else if (selectUserInquiry.equals("monthly")) {
			list = usageStatsMapper.monthlyUserInquiry(gender, ageGroup);
		} else if (selectUserInquiry.equals("selectDays")) {
			list = usageStatsMapper.customUserInquiry(startDate, endDate, gender, ageGroup);
		}

		return list;
	}

	@Override
	public List<VisitVO> visitCount(String selectVisitCount, String startDate, String endDate, String gender,
			String ageGroup) {
		List<VisitVO> list = new ArrayList<>();

		// 앞 단에서 male, female값으로 넘겼을 때 대응
		if (gender != null && "male".equals(gender))
			gender = "G11001";
		if (gender != null && "female".equals(gender))
			gender = "G11002";

		if (selectVisitCount.equals("daily")) {
			list = usageStatsMapper.dailyPageVisitCount(gender, ageGroup);
		} else if (selectVisitCount.equals("monthly")) {
			list = usageStatsMapper.monthlyPageVisitCount(gender, ageGroup);
		} else if (selectVisitCount.equals("selectDays")) {
			list = usageStatsMapper.customPageVisitCount(startDate, endDate, gender, ageGroup);
		}

		return list;
	}

	@Override
	public ArticlePage<MemberVO> liveUserList(int currentPage, int size, String keyword, String gen, String loginType) {
		// 파라미터
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("keyword", keyword);
		map.put("gen", gen);
		map.put("loginType", loginType);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);

		// 리스트 불러오기
		List<MemberVO> memList = usageStatsMapper.liveUserList(map);

		// 건수
		int total = usageStatsMapper.liveUserListCount(map);
		// 페이지 네이션
		ArticlePage<MemberVO> articlePage = new ArticlePage<MemberVO>(total, currentPage, size, memList, keyword);

		return articlePage;
	}

	@Override
    public List<Map<String, Object>> getSingleUserActivityYoY(String memId, String type, String startDate, String endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("memId", memId);
        params.put("type", type);
        params.put("startDate", startDate);
        params.put("endDate", endDate);
        
        return usageStatsMapper.getSingleUserActivityYoY(params);
    }

}
