package kr.or.ddit.cdp.rsm.rsm.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.cdp.rsm.rsm.service.ResumeDetailVO;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeSectionVO;
import kr.or.ddit.cdp.rsm.rsm.service.ResumeVO;

@Mapper
public interface ResumeMapper {

	String getElement(ResumeSectionVO resumeSectionVO);

	int mergeIntoResume(ResumeVO resumeVO);

	int selectNextResumeId();

	ResumeVO selectResumeByResumeId(ResumeVO resumeVO);

	int mergeIntoResumeDetail(ResumeDetailVO resumeDetailVO);

	List<ResumeVO> selectResumeBymemId(ResumeVO resumeVO);

	int deleteResumeById(int resumeId);

	int selectResumeTotalBymemId(ResumeVO resumeVO);

}
