package kr.or.ddit.cdp.rsm.rsm.service;

import java.util.List;

public interface ResumeService {

	String getElement(ResumeSectionVO resumeSectionVO);

	ResumeVO mergeIntoResume(ResumeVO resumeVO);

	ResumeVO selectResumeByResumeId(ResumeVO resumeVO, String memId);

	// 리스트 불러오기
	List<ResumeVO> selectResumeBymemId(ResumeVO resumeVO);

	int deleteResumeById(int resumeId);

	int selectResumeTotalBymemId(ResumeVO resumeVO);

}
