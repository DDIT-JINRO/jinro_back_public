package kr.or.ddit.prg.ctt.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.comm.peer.teen.service.TeenCommService;
import kr.or.ddit.prg.ctt.service.ContestService;
import kr.or.ddit.prg.ctt.service.ContestVO;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ContestServiceImpl implements ContestService {

	@Autowired
	private ContestMapper contestMapper;

	@Autowired
	private TeenCommService teenCommService;

	// 공모전 목록 조회
	@Override
	public List<ContestVO> selectCttList(ContestVO contestVO) {

		// 페이징 정보 계산 (startRow, endRow)
		int size = contestVO.getSize();
		int currentPage = contestVO.getCurrentPage();

		int startRow = (currentPage - 1) * size + 1;
		int endRow = currentPage * size;
		contestVO.setStartRow(startRow);
		contestVO.setEndRow(endRow);

		List<ContestVO> cttList = contestMapper.selectCttList(contestVO);
		return cttList;
	}

	// 공모전 총 개수 조회
	@Override
	public int selectCttCount(ContestVO contestVO) {

		if (contestVO.getContestGubunFilter() == null || contestVO.getContestGubunFilter().isEmpty()) {
			List<String> contestGubunFilter = new ArrayList<>();
			contestGubunFilter.add("G32001");
			contestVO.setContestGubunFilter(contestGubunFilter);
		}

		int totalCount = contestMapper.selectCttCount(contestVO);
		return totalCount;
	}

	// 공모전 상세
	@Override
	@Transactional
	public ContestVO selectCttDetail(String cttId) {
		// 0. [추가] 조회수를 먼저 1 증가시킵니다.
		contestMapper.updateCttViewCount(cttId);

		// 1. DB에서 상세 정보 조회
		ContestVO detail = contestMapper.selectCttDetail(cttId);

		if (detail != null && detail.getContestDescription() != null) {
			// 2. 상세 설명(contestDescription)을 '●' 기준으로 나누기
			String[] sections = detail.getContestDescription().split("●");
			List<String> sectionList = new ArrayList<>(); // return될 리스트

			for(int i=0; i<sections.length;i++) {

				if(i==0) {
					// 첫 줄은 Strong으로 처리
					sectionList.add("<strong style=\"font-size: 16px;\">" + sections[0] + "</strong>");
					continue;
				}


				if(i!=0 && sections[i].contains(" - ")) {
					String data = sections[i].replace(" - ", "<br>&nbsp;&nbsp; - ");
					String[] parts = data.split("<br>"); // 배열 뽑고
					String firstPart = parts[0].trim(); // 첫번째 가져오기
					sections[i] = "<strong class=\"supDetailData\" style=\"font-size: 16px;\">" + firstPart + "</strong>";
					for(int j=1;j<parts.length;j++) {
						sections[i]+= "<br>"+parts[j];
					}
				}

				if((i!=0 && sections[i].contains("*"))){
					sections[i] = sections[i].replace("*", "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; * ");
				}

				if((i!=0 && sections[i].contains("※"))){
					sections[i] = sections[i].replace("※", "<br>&nbsp;&nbsp;&nbsp;&nbsp; * ");
				}

				sectionList.add(sections[i]);

			}

			detail.setDescriptionSections(sectionList);
		}

		return detail;
	}

	// 공모전분류 목록 조회
	@Override
	public List<ComCodeVO> getContestTypeList() {
		return contestMapper.selectContestTypeList();
	}

	// 모집 대상 목록 조회
	@Override
	public List<ComCodeVO> getContestTargetList() {
		return contestMapper.selectContestTargetList();
	}

	// merge
	@Override
	public int updateContest(ContestVO contestVO) {
		return contestMapper.updateContest(contestVO);
	}

	// delete
	@Override
	public int deleteContest(String contestId) {
		return contestMapper.deleteContest(contestId);
	}

	@Override
	public List<Map<String, Object>> contestBanner(String memId) {
		Map<String, Object> param = new HashMap<>();
		if(memId== null || "anonymousUser".equals(memId)) {
			return contestMapper.selectContestBanner(param);
		}

		boolean isTeen = teenCommService.isTeen(memId);
		if(isTeen) {
			param.put("age", "teen");
		}else {
			param.put("age", "youth");
		}

		return contestMapper.selectContestBanner(param);
	}
}