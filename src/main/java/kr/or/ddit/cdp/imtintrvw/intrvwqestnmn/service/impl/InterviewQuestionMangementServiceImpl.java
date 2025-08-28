package kr.or.ddit.cdp.imtintrvw.intrvwqestnmn.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.cdp.imtintrvw.intrvwqestnmn.service.InterviewQuestionMangementService;
import kr.or.ddit.exception.CustomException;
import kr.or.ddit.exception.ErrorCode;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailListVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewDetailVO;
import kr.or.ddit.cdp.imtintrvw.aiimtintrvw.service.InterviewQuestionVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewQuestionMangementServiceImpl implements InterviewQuestionMangementService {

	@Autowired
	private InterviewQuestionMangementMapper interviewQuestionMangementMapper;

	// 사용자 면접질문 갯수
	@Override
	public int selectInterviewQuestionTotalBymemId(InterviewDetailListVO interviewDetailListVO) {
		// TODO Auto-generated method stub
		return interviewQuestionMangementMapper.selectInterviewQuestionTotalBymemId(interviewDetailListVO);
	}

	// 사용자 면접질문 리스트
	@Override
	public List<InterviewDetailListVO> selectInterviewQuestionBymemId(InterviewDetailListVO interviewDetailListVO) {
		// TODO Auto-generated method stub
		return interviewQuestionMangementMapper.selectInterviewQuestionBymemId(interviewDetailListVO);
	}

	// 면접이 존재하지 않을 경우 에러 반환
	// 면접질문 정보 가져오기
	@Override
	public InterviewDetailListVO selectByInterviewQuestionId(InterviewDetailListVO interviewDetailListVO) {
		interviewDetailListVO = interviewQuestionMangementMapper.selectByInterviewQuestionId(interviewDetailListVO);

		if (interviewDetailListVO == null) {
			throw new CustomException(ErrorCode.INVALID_INPUT);
		}
		return interviewDetailListVO;
	}

	// 본인 면접질문인지 확인
	@Override
	public void cheakInterviewQuestionbyMemId(InterviewDetailListVO interviewDetailListVO, String memId) {
		int idlMemId = interviewDetailListVO.getMemId();
		int loginMemId = Integer.valueOf(memId);

		// 2) 면접질문이 없거나 작성자 정보가 없거나, 작성자가 아니면 모두 403
		if (!(idlMemId == loginMemId)) {
			throw new CustomException(ErrorCode.ACCESS_DENIED);
		}
	}

	// 항목별 자소서내용가져오기
	@Override
	public List<InterviewDetailVO> selectByInterviewQuestionContentIdList(InterviewDetailListVO interviewDetailListVO) {
		// TODO Auto-generated method stub
		return interviewQuestionMangementMapper.selectByInterviewQuestionContentIdList(interviewDetailListVO);
	}

	// 질문 가져오기
	@Override
	public InterviewQuestionVO selectByInterviewQuestionQId(InterviewDetailVO interviewDetailVO) {
		// TODO Auto-generated method stub
		return interviewQuestionMangementMapper.selectByInterviewQuestionQId(interviewDetailVO);
	}

	// 신규 면접 정보 등록
	@Override
	public int insertInterviewQuestionId(InterviewDetailListVO interviewDetailListVO) {
		int idlId = interviewQuestionMangementMapper.selectMaxInterviewQuestionId();
		interviewDetailListVO.setIdlId(idlId);
		interviewQuestionMangementMapper.insertInterviewQuestion(interviewDetailListVO);

		return idlId;
	}

	@Override
	@Transactional
	public void insertInterviewDetails(int idlId, List<Integer> iqIdList, List<String> idAnswerList) {
		for (int i = 0; i < iqIdList.size(); i++) {
			int newIdId = interviewQuestionMangementMapper.selectMaxInterviewDetailId();
			InterviewDetailVO interviewDetailListVO = new InterviewDetailVO();
			interviewDetailListVO.setIdId(newIdId);
			interviewDetailListVO.setIdlId(idlId);
			interviewDetailListVO.setIqId(iqIdList.get(i));
			interviewDetailListVO.setIdAnswer(idAnswerList.get(i));
			interviewDetailListVO.setIdOrder(i + 1);
			interviewQuestionMangementMapper.insertInterviewDetail(interviewDetailListVO);
		}
	}

	@Override
	public void updateInterview(InterviewDetailListVO interviewDetailListVO) {
		interviewQuestionMangementMapper.updateInterview(interviewDetailListVO);
	}

	@Override
	@Transactional
	public void updateInterviewDetails(List<Integer> iqIdList, Map<Integer, Integer> qToIdId,
			List<String> idAnswerList) {
		for (int i = 0; i < iqIdList.size(); i++) {
			int iqId = iqIdList.get(i);
			int idId = qToIdId.get(iqId); // 기존 행 식별자
			String answer = idAnswerList.get(i);
			int order = i + 1;
			interviewQuestionMangementMapper.updateInterviewDetail(idId, iqId, answer, order);
		}
	}

	// 면접 전체 삭제
	@Override
	@Transactional
	public void deleteInterviewQuestion(InterviewDetailListVO interviewDetailListVO) {
		interviewQuestionMangementMapper.deleteInterviewQuestionContent(interviewDetailListVO);
		interviewQuestionMangementMapper.deleteInterviewQuestion(interviewDetailListVO);
	}

}
