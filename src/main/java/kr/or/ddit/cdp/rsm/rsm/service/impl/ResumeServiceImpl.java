package kr.or.ddit.cdp.rsm.rsm.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.cdp.rsm.rsm.service.ResumeSectionVO;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeService;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeVO;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

	private final ResumeMapper resumeMapper;
	private final FileService fileService;

	@Override
	public String getElement(ResumeSectionVO resumeSectionVO) {
		// TODO Auto-generated method stub
		return resumeMapper.getElement(resumeSectionVO);
	}

	@Override
	@Transactional
	public ResumeVO mergeIntoResume(ResumeVO resumeVO) {
		// 만약 resumeVO에 아이디가 있으면 update, 없으면 insert
		if (resumeVO.getResumeId() == 0) { // id가 없을때
			int newResumeId = resumeMapper.selectNextResumeId();
			resumeVO.setResumeId(newResumeId);
		}

		// 파일 그룹 ID가 있고, 새 파일도 있는 경우
		if (resumeVO.getFiles() != null && !resumeVO.getFiles().isEmpty() && resumeVO.getFileGroupId() != null
				&& resumeVO.getFileGroupId() != 0) {

			Long fileGroupId = resumeVO.getFileGroupId();

			try {
				List<FileDetailVO> fileDetailVOList = fileService.updateFile(fileGroupId, resumeVO.getFiles());
				String filePath = fileService.getSavePath(fileDetailVOList.get(0));
				String content = changeImg(resumeVO.getResumeContent(), filePath);
				resumeVO.setResumeContent(content);
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else if (resumeVO.getFiles() != null && !resumeVO.getFiles().isEmpty()
				&& (resumeVO.getFileGroupId() == null || resumeVO.getFileGroupId() == 0)) {
			// 파일은 있고, 파일그룹 아이디는 없을 경우

			Long fileGroupId = fileService.createFileGroup();
			resumeVO.setFileGroupId(fileGroupId); // 이 라인도 있어야 이후 로직이 안전합니다

			try {
				List<FileDetailVO> fileDetailVOList = fileService.uploadFiles(fileGroupId, resumeVO.getFiles());
				String filePath = fileService.getSavePath(fileDetailVOList.get(0));
				String content = changeImg(resumeVO.getResumeContent(), filePath);
				resumeVO.setResumeContent(content);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		int result = resumeMapper.mergeIntoResume(resumeVO);

		resumeVO = resumeMapper.selectResumeByResumeId(resumeVO); // 방금 isnert 또는 update한 ResumId로 가져옴

		return resumeVO;
	}

	@Override
	public ResumeVO selectResumeByResumeId(ResumeVO resumeVO,String memId) {
		
		resumeVO = resumeMapper.selectResumeByResumeId(resumeVO);
		if(resumeVO == null || (resumeVO.getMemId()!= Integer.parseInt(memId))){
			resumeVO = null;
		}
		return resumeVO;
	}

	private String changeImg(String html, String filePath) {
		String modified = html.replaceAll("(<img[^>]*id=[\"']photo-preview[\"'][^>]*src=\")[^\"]*(\"[^>]*>)",
				"$1" + Matcher.quoteReplacement(filePath) + "$2");

		return modified;

	}

	@Override
	public List<ResumeVO> selectResumeBymemId(ResumeVO resumeVO) {
		// TODO Auto-generated method stub
		return resumeMapper.selectResumeBymemId(resumeVO);
	}

	@Override
	public int deleteResumeById(int resumeId) {
		
		return resumeMapper.deleteResumeById(resumeId);
	}

	@Override
	public int selectResumeTotalBymemId(ResumeVO resumeVO) {
		// TODO Auto-generated method stub
		return resumeMapper.selectResumeTotalBymemId(resumeVO);
	}

}
