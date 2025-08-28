package kr.or.ddit.empt.ema.service.impl;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.empt.ema.service.EmploymentAdvertisementService;
import kr.or.ddit.empt.ema.service.HireVO;
import kr.or.ddit.util.alarm.service.AlarmService;
import kr.or.ddit.util.alarm.service.AlarmType;
import kr.or.ddit.util.alarm.service.AlarmVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmploymentAdvertisementServiceImpl implements EmploymentAdvertisementService {

	private final EmploymentAdvertisementMapper employmentAdvertisementMapper;
	private final AlarmService alarmService;

	@Override
	public int selectFilteredHireTotalCount(HireVO hireVO) {
		// TODO Auto-generated method stub
		return employmentAdvertisementMapper.selectFilteredHireTotalCount(hireVO);
	}

	@Override
	public List<HireVO> selectFilteredHireList(HireVO hireVO) {
		// TODO Auto-generated method stub
		return employmentAdvertisementMapper.selectFilteredHireList(hireVO);
	}

	@Override
	public List<ComCodeVO> selectCodeVOList(ComCodeVO comCodeVO) {
		// TODO Auto-generated method stub
		return employmentAdvertisementMapper.selectCodeVOList(comCodeVO);
	}

	@Override
	@Scheduled(cron = "0 0 9 * * *")
	public void sendDeadlineReminders() {
		// TODO Auto-generated method stub
		// 1. 모든 사용자의 북마크 목록을 가져옵니다.
		// 이 부분은 비즈니스 로직에 따라 변경될 수 있습니다.
		// 여기서는 예시로 모든 사용자의 북마크를 확인한다고 가정합니다.
		List<String> allUserIds = employmentAdvertisementMapper.getAllUserIds(); // 모든 사용자 ID를 가져오는 메서드

		for (String memId : allUserIds) {
			// 2. 해당 사용자가 북마크한 모든 채용공고 목록을 가져옵니다.
			List<HireVO> hireVOList = employmentAdvertisementMapper.selectHireByBookMarkMemId(memId);
			for (HireVO hire : hireVOList) {
				// 3. HireVO에 구현된 getDDay() 메서드를 사용하여 남은 일수를 계산합니다.
				long dDay = hire.getDday();

				// 4. 남은 일수가 정확히 3일인지 확인합니다.
				if (dDay == 3) {
					// 5. 알림 전송 로직 호출
					AlarmVO alarmVO = new AlarmVO();
					alarmVO.setMemId(Integer.parseInt(memId));
					alarmVO.setAlarmTargetType(AlarmType.DEADLINE_HIRE);

					alarmVO.setAlarmTargetUrl("/empt/ema/employmentAdvertisement.do?keyword=" + hire.getCpName());

					alarmService.sendEvent(alarmVO);
				}

			}
		}
	}

	@Override
	public int checkHireByHireId(HireVO HireVO) {
		int hireId = 0;
		HireVO = employmentAdvertisementMapper.checkHireByHireId(HireVO);

		if (HireVO == null) {
			hireId = employmentAdvertisementMapper.getMaxHireId();
		} else {
			hireId = HireVO.getHireId();
		}

		return hireId;
	}

	@Override
	public int updateEmploymentAdvertisement(HireVO hireVO) {
		// TODO Auto-generated method stub
		return employmentAdvertisementMapper.updateEmploymentAdvertisement(hireVO);
	}

	@Override
	public int deleteEmploymentAdvertisement(HireVO hireVO) {
		// TODO Auto-generated method stub
		return employmentAdvertisementMapper.deleteEmploymentAdvertisement(hireVO);
	}
}
