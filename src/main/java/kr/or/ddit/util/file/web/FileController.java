package kr.or.ddit.util.file.web;

import java.io.IOException;
import java.net.URLEncoder;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

	private final FileService fileService;

	@GetMapping("/download")
	public ResponseEntity<Resource> download(@RequestParam Long fileGroupId, @RequestParam int seq) throws IOException {
		FileDetailVO detail = fileService.getFileDetail(fileGroupId, seq);
		Resource resource = fileService.downloadFile(fileGroupId, seq);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=\"" + URLEncoder.encode(detail.getFileOrgName(), "UTF-8") + "\"")
				.contentType(MediaType.APPLICATION_OCTET_STREAM).body(resource);
	}

}
