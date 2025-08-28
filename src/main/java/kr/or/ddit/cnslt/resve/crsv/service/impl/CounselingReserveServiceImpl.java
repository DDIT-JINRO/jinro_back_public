package kr.or.ddit.cnslt.resve.crsv.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.cnslt.resve.crsv.service.CounselingReserveService;
import kr.or.ddit.cnslt.resve.crsv.service.CounselingVO;
import kr.or.ddit.cnslt.resve.crsv.service.VacationVO;
import kr.or.ddit.com.ComCodeVO;
import kr.or.ddit.main.service.MemberVO;
import kr.or.ddit.mpg.pay.service.MemberSubscriptionVO;
import kr.or.ddit.mpg.pay.service.PaymentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CounselingReserveServiceImpl implements CounselingReserveService {

	// Redis 락을 위한 상수 정의
	private static final String HOLD_KEY_PREFIX = "counsel_hold:";
	private static final long LOCK_TIMEOUT_SECONDS = 600; // 5분 TTL

	private final CounselingReserveMapper counselingReserveMapper;
	private final RedisTemplate<String, Object> redisTemplate;

	@Override
	public boolean tryHoldCounsel(CounselingVO counselingVO) {
		String lockKey = createHoldKey(counselingVO);
		String lockValue = String.valueOf(counselingVO.getMemId());

		// lockValue는 락을 획득한 사용자의 고유 ID로, 여기서는 memId를 사용합니다.

		// Redis에 키가 존재하지 않으면(null) 키를 설정하고 true 반환
		Boolean isLocked = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue,
				Duration.ofSeconds(LOCK_TIMEOUT_SECONDS));

	    if (Boolean.TRUE.equals(isLocked)) {
	        // 성공적으로 락을 획득
	        return true;
	    } else {
	        // 락 키가 이미 존재하는 경우, 락을 건 사용자가 본인인지 확인
	        String holdValue = (String) redisTemplate.opsForValue().get(lockKey);
	        if (holdValue != null && holdValue.equals(lockValue)) {
	            // 본인이 락을 걸었다면, 만료 시간만 갱신하고 true 반환
	            redisTemplate.expire(lockKey, Duration.ofSeconds(LOCK_TIMEOUT_SECONDS));
	            return true;
	        } else {
	            // 다른 사용자가 락을 걸었다면 실패
	            return false;
	        }
	    }
	}

	@Override
	public boolean tryReserveCounsel(CounselingVO counselingVO) {
		String lockKey = createHoldKey(counselingVO);

		// Redis에서 락이 유효한지 확인
		String holdValue = (String) redisTemplate.opsForValue().get(lockKey);
		// 락이 존재하고, 락을 건 사용자와 현재 사용자가 동일한지 확인
		String currentMemId = String.valueOf(counselingVO.getMemId());

		if (holdValue != null && holdValue.equals(currentMemId)) {
			// DB에 예약 정보 삽입
			List<ComCodeVO> counselCategoryList = selectCounselCategoryList();
			for(ComCodeVO category : counselCategoryList) {
				if(category.getCcId().equals(counselingVO.getCounselCategory())) {
					counselingVO.setCounselTitle(category.getCcName()+" 상담 요청합니다.");
				}
			}
			int result = counselingReserveMapper.insertReservation(counselingVO);

			// 삽입 성공 시 임시 락 해제
			if (result > 0) {
				releaseCounselHold(counselingVO);
				return true;
			}
		}

		// 락이 없거나, 다른 사용자가 건 락인 경우 실패
		return false;

	}

	// 락키를 생성하는 메소드
	private String createHoldKey(CounselingVO counselingVO) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

		Date reservationDatetime = counselingVO.getCounselReqDatetime();

		// Redis 락 키 생성: 상담사ID + 날짜 + 시간
		return HOLD_KEY_PREFIX + counselingVO.getCounsel() + ":" + dateFormat.format(reservationDatetime) + ":"
				+ timeFormat.format(reservationDatetime);
	}

	// 락키를 해제하는 메소드
	@Override
	public void releaseCounselHold(CounselingVO counselingVO) {

		String lockKey = createHoldKey(counselingVO);
		redisTemplate.delete(lockKey);
	}

	@Override
	public List<String> getAvailableTimes(int counselId, Date counselReqDatetime, int memId) {
		// 1. 상담사가 해당 날짜에 휴가 중인지 확인
		VacationVO vacationVO = new VacationVO();
		vacationVO.setVaRequestor(counselId);
		vacationVO.setVaStart(counselReqDatetime);

		int vacationCount = counselingReserveMapper.selectCounselorVacations(vacationVO);
		if (vacationCount > 0) {
			return new ArrayList<>(); // 휴가 중이면 빈 리스트 반환
		}

		// 2. 예약된 시간 목록 조회
		CounselingVO counselingVO = new CounselingVO();
		counselingVO.setCounsel(counselId);
		counselingVO.setCounselReqDatetime(counselReqDatetime);

		// 상담사 상담 날짜로 시간 가져오기
		List<Date> bookedTimes = counselingReserveMapper.selectBookedTimesByCounselorAndDate(counselingVO);

		// 3. 예약된 시간 목록을 "HH:mm" 형식의 문자열로 변환
		List<String> bookedTimesFormatted = new ArrayList<>();
		SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
		for (Date time : bookedTimes) {
			bookedTimesFormatted.add(timeFormat.format(time));
		}

		// 4. 전체 상담 가능 시간대(9시~18시)와 비교하여 가능한 시간 필터링
		List<String> allPossibleTimes = new ArrayList<>();
		for (int hour = 9; hour <= 18; hour++) {
			allPossibleTimes.add(String.format("%02d:00", hour));
		}

		// 5. 현재 날짜와 시간 가져오기
		Calendar now = Calendar.getInstance();

		// 6. 전체 시간 목록에서 예약된 시간을 제거하여 최종 가능한 시간 목록 생성
		List<String> availableTimes = new ArrayList<>();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String requestedDateStr = dateFormat.format(counselReqDatetime);
		boolean isToday = dateFormat.format(now.getTime()).equals(requestedDateStr);

		for (String possibleTime : allPossibleTimes) {
			if (bookedTimesFormatted.contains(possibleTime)) {
				continue;
			}
			if (isToday) {
				try {

					Date possibleDateTime = timeFormat.parse(possibleTime);
					Date nowTime = timeFormat.parse(timeFormat.format(now.getTime()));
					// 현재 시간보다 이전인 경우 건너뛰기
					if (possibleDateTime.before(nowTime)) {
						continue;
					}
				} catch (ParseException e) {
					// 시간 파싱 오류 처리
					e.printStackTrace();
				}
			}
	        String lockKey = HOLD_KEY_PREFIX + counselId + ":" + requestedDateStr + ":" + possibleTime;
	        String holdValue = (String) redisTemplate.opsForValue().get(lockKey);

	        // 락이 존재하고, 락을 건 사용자가 본인이 아니라면 건너뜀
	        if (holdValue != null && !holdValue.equals(String.valueOf(memId))) {
	            continue;
	        }

			// 위의 조건들을 모두 통과한 시간만 리스트에 추가
			availableTimes.add(possibleTime);
		}

		return availableTimes;
	}

	@Override
	public List<MemberVO> selectCounselorList() {
		// TODO Auto-generated method stub
		return counselingReserveMapper.selectCounselorList();
	}

	@Override
	public List<ComCodeVO> selectCounselCategoryList() {
		// TODO Auto-generated method stub
		return counselingReserveMapper.selectCounselCategoryList();
	}

	@Override
	public List<ComCodeVO> selectCounselMethodList() {
		// TODO Auto-generated method stub
		return counselingReserveMapper.selectCounselMethodList();
	}

	@Override
	public MemberVO selectMemberInfo(MemberVO memberVO) {
		// TODO Auto-generated method stub
		return counselingReserveMapper.counselingReserveMapper(memberVO);
	}

	@Override
	public PaymentVO selectLastSubcription(MemberSubscriptionVO currentSub) {
		// TODO Auto-generated method stub
		return counselingReserveMapper.selectLastSubcription(currentSub);
	}

	@Override
	public int minusPayConsultCnt(int payId) {
		// TODO Auto-generated method stub
		return counselingReserveMapper.minusPayConsultCnt(payId);
	}
}
