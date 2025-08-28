package kr.or.ddit.cns.service.impl;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.chat.service.ChatService;
import kr.or.ddit.cns.service.CounselingLogVO;
import kr.or.ddit.cns.service.CounselingVO;
import kr.or.ddit.cns.service.CounselorService;
import kr.or.ddit.cns.service.VacationVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import kr.or.ddit.video.service.VideoService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CounselorServiceImpl implements CounselorService {

	@Autowired
	private CounselorMapper counselorMapper;
	@Autowired
	private ChatService chatService;
	@Autowired
	private VideoService videoService;
	@Autowired
	FileService fileService;

	@Override
	public List<CounselingVO> selectCounselList() {
		return null;
	}

	@Override
	public ArticlePage<CounselingVO> selectCompletedCounselList(CounselingVO counselingVO) {

		List<CounselingVO> list = counselorMapper.selectCompletedCounselList(counselingVO);
		int total = counselorMapper.selectTotalCompletedCounselList(counselingVO);

		ArticlePage<CounselingVO> articlePage = new ArticlePage<>(total, counselingVO.getCurrentPage(),
				counselingVO.getSize(), list, counselingVO.getKeyword());

		return articlePage;
	}

	@Override
	public CounselingVO selectCounselDetail(int counselId) {
		CounselingVO counselVO = counselorMapper.selectCounselDetail(counselId);
		CounselingLogVO counselLogVO = counselVO.getCounselingLog();
		Long fileGroupId = counselLogVO.getFileGroupId();

		List<FileDetailVO> fileList = fileService.getFileList(fileGroupId);
		counselLogVO.setFileDetailList(fileList);
		return counselVO;
	}

	@Transactional
	@Override
	public boolean updateCnsLog(CounselingLogVO counselingLogVO) {
		// 실제로 첨부된 유효한 파일만 필터링

		List<MultipartFile> validFiles = counselingLogVO.getFiles().stream().filter(file -> file != null
				&& !file.isEmpty() && file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
				.toList();
		// 파일이 있을 경우에만 업로드 처리
		if (!validFiles.isEmpty()) {

			// 파일그룹이 이미 존재하는 경우 체크해서 존재하면 기존 그룹ID 없으면 새로운 ID
			if (counselingLogVO.getFileGroupId() == null || counselingLogVO.getFileGroupId() == 0L) {
				counselingLogVO.setFileGroupId(fileService.createFileGroup());
			}
			// 파일 업로드
			try {
				fileService.uploadFiles(counselingLogVO.getFileGroupId(), validFiles);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		int result = counselorMapper.updateCnsLog(counselingLogVO);
		return result > 0 ? true : false;
	}

	@Override
	public boolean deleteFile(Long fileGroupId, int seq) {
		try {
			fileService.deleteFile(fileGroupId, seq);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Override
	public ArticlePage<VacationVO> myVacationList(VacationVO vacationVO) {
		List<VacationVO> list = this.counselorMapper.selectMyVationList(vacationVO);
		int total = this.counselorMapper.selectTotalMyVationList(vacationVO);

		ArticlePage<VacationVO> articlePage = new ArticlePage<>(total, vacationVO.getCurrentPage(),
				vacationVO.getSize(), list, null);
		return articlePage;
	}

	@Transactional
	@Override
	public boolean insertVacation(VacationVO vacationVO) {

		if (vacationVO.getFiles() != null && vacationVO.getFiles().size() > 0) {
			List<MultipartFile> validFiles = vacationVO.getFiles().stream().filter(file -> file != null
					&& !file.isEmpty() && file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
					.toList();
			if (!validFiles.isEmpty()) {

				// 파일그룹이 이미 존재하는 경우 체크해서 존재하면 기존 그룹ID 없으면 새로운 ID
				if (vacationVO.getFileGroupId() == null || vacationVO.getFileGroupId() == 0L) {
					vacationVO.setFileGroupId(fileService.createFileGroup());
				}
				// 파일 업로드
				try {
					fileService.uploadFiles(vacationVO.getFileGroupId(), validFiles);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		int result = this.counselorMapper.insertVacation(vacationVO);
		return result > 0 ? true : false;
	}

	@Override
	public List<String> disabledDateList(int requestor) {
		List<String> disabledDateStringList = new ArrayList<>();

		List<CounselingVO> counselingVOList = this.counselorMapper.selectMyDeterminedCounselList(requestor);
		for (CounselingVO vo : counselingVOList) {
			disabledDateStringList.add(getFormattedDateStrByJavaDate(vo.getCounselReqDatetime()));
		}

		List<VacationVO> vacationVOList = this.counselorMapper.selectMyInProgressVacationList(requestor);
		for (VacationVO vo : vacationVOList) {
			Date start = vo.getVaStart();
			Date end = vo.getVaEnd();

			// 캘린더에 휴가 시작일 세팅
			Calendar cal = Calendar.getInstance();
			cal.setTime(start);

			// Calendar 로 하루씩 더해가며
			// 시작일부터 종료일까지 모두 포함
			while (!cal.getTime().after(end)) {
				disabledDateStringList.add(getFormattedDateStrByJavaDate(cal.getTime()));
				cal.add(Calendar.DATE, 1);
			}
		}

		return disabledDateStringList;
	}

	private String getFormattedDateStrByJavaDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(date);
	}

	@Override
	public List<CounselingVO> selectCounselingSchedules(CounselingVO counselingVO) {
		// TODO Auto-generated method stub
		return this.counselorMapper.selectCounselingSchedules(counselingVO);
	}

	@Override
	@Transactional
	public String updateCounselStatus(CounselingVO counselingVO, Integer payId) {
		
		// TODO Auto-generated method stub
		String counselUrl = "";
		String userUrl = "";
		if (counselingVO.getCounselMethod() != null && !counselingVO.getCounselMethod().isEmpty()) {

			if (counselingVO.getCounselStatus().equals("S04005") && counselingVO.getCounselMethod().equals("G08002")) {

				CounselingVO chatCounselVO = this.counselorMapper.selectCounselDetail(counselingVO.getCounselId());

				counselUrl = chatService.createCounselingChatRoom(chatCounselVO);
				userUrl = counselUrl;

				counselingVO.setCounselUrlCou(counselUrl);
				counselingVO.setCounselUrlUser(userUrl);
			} else if (counselingVO.getCounselStatus().equals("S04005")
					&& counselingVO.getCounselMethod().equals("G08003")) {
				videoService.createVideoChatRoom(counselingVO.getCounselId());
			}
		}
		if(counselingVO.getCounselStatus().equals("S04002")) {
			int cnt = this.plusPayConsultCnt(payId);
		}

		this.counselorMapper.updateCounselStatus(counselingVO);
		counselingVO = this.counselorMapper.selectCounselDetail(counselingVO.getCounselId());

		return counselingVO.getCounselUrlCou();
	}
	
	private int plusPayConsultCnt(int payId) {
		// TODO Auto-generated method stub
		return counselorMapper.plusPayConsultCnt(payId);
	}

	@Override
	public List<CounselingVO> selectMonthlyCounselingData(CounselingVO searchVO) {
		// TODO Auto-generated method stub
		return counselorMapper.selectMonthlyCounselingData(searchVO);
	}

}
