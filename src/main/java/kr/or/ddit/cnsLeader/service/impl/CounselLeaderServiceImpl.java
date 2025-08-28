package kr.or.ddit.cnsLeader.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.cns.service.CounselingLogVO;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.cns.service.VacationVO;
import kr.or.ddit.cnsLeader.service.CounselLeaderService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;

@Service
public class CounselLeaderServiceImpl implements CounselLeaderService {

	@Autowired
	CounselLeaderMapper counselLeaderMapper;

	@Autowired
	FileService fileService;

	@Override
	public ArticlePage<CounselingVO> selectCounselLogList(CounselingVO counselingVO) {

		List<CounselingVO> list = counselLeaderMapper.selectCounselLogList(counselingVO);
		int total = counselLeaderMapper.selectTotalCounselLogList(counselingVO);

		ArticlePage<CounselingVO> articlePage = new ArticlePage<>(total, counselingVO.getCurrentPage(),
				counselingVO.getSize(), list, counselingVO.getKeyword());
		return articlePage;
	}

	@Override
	public boolean updateCounselLog(CounselingLogVO counselingLogVO) {
		int result = this.counselLeaderMapper.updateCounselLog(counselingLogVO);
		return result > 0 ? true : false;
	}

	@Override
	public ArticlePage<VacationVO> selectVacationList(VacationVO vacationVO) {
		List<VacationVO> list = this.counselLeaderMapper.selectVacationList(vacationVO);
		int total = this.counselLeaderMapper.selectTotalVationList(vacationVO);

		ArticlePage<VacationVO> articlePage = new ArticlePage<>(total, vacationVO.getCurrentPage(),
				vacationVO.getSize(), list, vacationVO.getKeyword());
		return articlePage;
	}

	@Override
	public VacationVO vacationDetail(int vaId) {
		VacationVO vacationVO = this.counselLeaderMapper.vacationDetail(vaId);
		Long fileGroupId = vacationVO.getFileGroupId();

		List<FileDetailVO> fileList = fileService.getFileList(fileGroupId);
		vacationVO.setFileDetailList(fileList);
		return vacationVO;
	}

	@Override
	@Transactional
	public boolean updateVacation(VacationVO vacationVO) {
		int result = this.counselLeaderMapper.updateVacation(vacationVO);
		vacationVO = this.counselLeaderMapper.vacationDetail(vacationVO.getVaId());
		this.counselLeaderMapper.rejectRequestedCounselForVacation(vacationVO);
		return result > 0 ? true : false;
	}

	@Override
	public List<CounselingVO> selectRequestedCounselBetweenVacation(int vaId) {
		VacationVO vacationVO = this.counselLeaderMapper.vacationDetail(vaId);
		List<CounselingVO> list = this.counselLeaderMapper.selectRequestedCounselBetweenVacation(vacationVO);
		return list;
	}

	@Override
	public ArticlePage<CounselingVO> selectCounselScheduleList(CounselingVO counselingVO) {
		int total = this.counselLeaderMapper.selectCounselTotal(counselingVO);
		List<CounselingVO> list = this.counselLeaderMapper.selectCounselScheduleList(counselingVO);

		ArticlePage<CounselingVO> articlePage = new ArticlePage<>(total, counselingVO.getCurrentPage(),
				counselingVO.getSize(), list, counselingVO.getKeyword());
		return articlePage;
	}

	@Override
	public CounselingVO selectCounselDetail(Integer counselId) {
		CounselingVO counselingVO = this.counselLeaderMapper.selectCounselDetail(counselId);
		return counselingVO;
	}

	@Override
	public List<CounselingVO> selectMonthlyCounselingData(
			CounselingVO searchVO) {
		// TODO Auto-generated method stub
		return counselLeaderMapper.selectMonthlyCounselingData(searchVO);
	}

}
