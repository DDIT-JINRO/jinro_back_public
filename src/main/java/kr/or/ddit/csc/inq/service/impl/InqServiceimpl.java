package kr.or.ddit.csc.inq.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.csc.inq.service.InqService;
import kr.or.ddit.csc.inq.service.InqVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class InqServiceimpl implements InqService {

	@Autowired
	InqMapper inqMapper;

	@Autowired
	AlarmService alarmService;

	// 사용자 1:1문의 목록 조회
	@Override
	public ArticlePage<InqVO> getUserInqryPage(int currentPage, int size, String keyword, List<String> filterKeywords,
			String memId) {

		if ("anonymousUser".equals(memId) || memId == null) {
			// 비로그인 사용자는 조회할 데이터가 없으므로 비어있는 페이지 객체를 반환
			return new ArticlePage<>(0, currentPage, size, new java.util.ArrayList<>(), keyword);
		}

		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<>();
		// 키워드가 있다면
		map.put("keyword", keyword);
		// 내가 쓴 글 찾기

		map.put("memId", memId);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		// 리스트 불러오기
		List<InqVO> list = inqMapper.getInqList(map);

		// 건수
		int total = inqMapper.getAllInqByMemId(map);

		// 페이지 네이션
		ArticlePage<InqVO> page = new ArticlePage<>(total, currentPage, size, list, keyword);
		page.setUrl("/csc/not/noticeList.do");

		return page;
	}

	// 사용자 1:1문의 등록
	@Override
	public int insertInqData(InqVO inqVO) {
		return this.inqMapper.insertInqData(inqVO);
	}

	// 관리자 1:1문의 목록 조회
	@Override
	public ArticlePage<InqVO> getAdminInqList(int currentPage, int size, String keyword, String status) {
		// 파라미터
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("keyword", keyword);
		map.put("status", status);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);

		// 리스트 불러오기
		List<InqVO> list = inqMapper.getAdminInqList(map);
		// 건수
		int total = inqMapper.getAllInq(map);
		// 페이지 네이션
		ArticlePage<InqVO> articlePage = new ArticlePage<InqVO>(total, currentPage, size, list, keyword,10);
		articlePage.setUrl("/csc/admin/faqList.do");
		return articlePage;
	}

	// 관리자 1:1문의 상세조회
	@Override
	public InqVO getAdminInqDetail(int inqId) {
		// 관리자 FAQ 상세 조회
		return inqMapper.getAdminInqDetail(inqId);
	}

	// 관리자 1:1문의 답변 등록
	@Transactional
	@Override
	public int insertInq(InqVO inqVO) {
		// AlarmVO 생성
		AlarmVO alarmVO = new AlarmVO();

		// 알림 타입 지정
		alarmVO.setAlarmTargetType(AlarmType.REPLY_TO_CONTACT);

		// 1:1문의 사용자 ID 조회
		int memId = inqMapper.getMemId(inqVO.getContactId());

		// 알림 타겟 지정
		alarmVO.setMemId(memId);

		// 알림 URL 등록
		alarmVO.setAlarmTargetUrl("/csc/inq/inqryList.do");

		// 알림 전송
		alarmService.sendEvent(alarmVO);

		return inqMapper.insertInq(inqVO);
	}
}
