package kr.or.ddit.com.report.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ddit.com.report.service.ReportService;
import kr.or.ddit.com.report.service.ReportVO;

@Service
public class ReportServiceImpl implements ReportService{

	@Autowired
	ReportMapper reportMapper;

	@Override
	public ReportVO selectReport(ReportVO reportVO) {
		return this.reportMapper.selectReportByMemIdAndTargetTypeAndTargetId(reportVO);
	}

	@Override
	public boolean insertReport(ReportVO reportVO) {
		return this.reportMapper.insertReport(reportVO) > 0 ? true : false ;
	}

}
