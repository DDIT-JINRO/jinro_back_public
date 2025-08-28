package kr.or.ddit.prg.act.sup.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.prg.act.service.ActivityVO;
import kr.or.ddit.prg.act.sup.service.ActivitySupportersService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ActivitySupportersServiceImpl implements ActivitySupportersService {

	@Autowired
	private ActivitySupportersMapper activitySupportersMapper;

	// 서포터즈 목록 조회
	@Override
	public List<ActivityVO> selectSupList(ActivityVO activityVO) {
		// 페이징 정보 계산 (startRow, endRow)
		int size = activityVO.getSize();
		int currentPage = activityVO.getCurrentPage();

		int startRow = (currentPage - 1) * size + 1;
		int endRow = currentPage * size;
		activityVO.setStartRow(startRow);
		activityVO.setEndRow(endRow);

		return activitySupportersMapper.selectSupList(activityVO);
	}

	// 서포터즈 총 개수 조회
	@Override
	public int selectSupCount(ActivityVO activityVO) {
		if (activityVO.getContestGubunFilter() == null || activityVO.getContestGubunFilter().isEmpty()) {
			List<String> contestGubunFilter = new ArrayList<>();
			contestGubunFilter.add("G32002");
			activityVO.setContestGubunFilter(contestGubunFilter);
		}

		int totalCount = activitySupportersMapper.selectSupCount(activityVO);
		return totalCount;
	}

	// 서포터즈 상세
	@Override
	@Transactional
	public ActivityVO selectSupDetail(String supId) {
		// 0. [추가] 조회수를 먼저 1 증가시킵니다.
		activitySupportersMapper.updateSupViewCount(supId);

		// 1. DB에서 상세 정보 조회
		ActivityVO detail = activitySupportersMapper.selectSupDetail(supId);

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

}
