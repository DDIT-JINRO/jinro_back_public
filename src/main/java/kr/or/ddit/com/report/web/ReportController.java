package kr.or.ddit.com.report.web;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.com.report.service.ReportService;
import kr.or.ddit.com.report.service.ReportVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ReportController {

	@Autowired
	ReportService reportService;

	@Autowired
	FileService fileService;

	/**
	 * 신고하기 전에 이미 신고한 내역이 있는지 찾기 위한 조회
	 * 필요파라미터 memId, targetType, targetId
	 * @param reportVO
	 * @return
	 */
	@PostMapping("/api/report/selectReport")
	public ResponseEntity<ReportVO> selectReport(ReportVO reportVO){
		ReportVO selectedReportVO = this.reportService.selectReport(reportVO);
		if(selectedReportVO!=null) {
			return ResponseEntity.ok(selectedReportVO);
		}else {
			return ResponseEntity.noContent().build();
		}
	}

	/**
	 * 파일첨부 가능한 신고
	 *
	 * @param reportVO
	 * @return
	 */
	@PostMapping("/api/report/insertReport")
	@ResponseBody
	public ResponseEntity<Boolean> insertReport(@ModelAttribute ReportVO reportVO){
		List<MultipartFile> list = reportVO.getReportFile();
		if(list != null && list.size() >= 1 && list.get(0).getOriginalFilename()!=null) {
			try {
				Long fileGroupId = fileService.createFileGroup();
				fileService.uploadFiles(fileGroupId, list);
				reportVO.setFileGroupNo(fileGroupId);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		boolean result = this.reportService.insertReport(reportVO);
		return ResponseEntity.ok(result);
	}

}
