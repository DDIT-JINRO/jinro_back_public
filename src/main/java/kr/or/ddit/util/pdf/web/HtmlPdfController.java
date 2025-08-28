package kr.or.ddit.util.pdf.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.util.pdf.service.HTMLtoPdfService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/pdf")
public class HtmlPdfController {

    @Autowired
    private HTMLtoPdfService htmlToPdfService;

    @PostMapping("/download")
    public ResponseEntity<byte[]> generatePdf(@RequestParam("htmlContent") String htmlContent,
                                            @RequestParam(value = "cssContent", required = false) String cssContent,
                                            HttpServletResponse response) {
        
        log.info("PDF 생성 요청 - HTML 길이: {}, CSS 길이: {}", 
                htmlContent != null ? htmlContent.length() : 0, 
                cssContent != null ? cssContent.length() : 0);
        
        try {
        	// pdf 파일 만들고 byte 값으로 변환
            byte[] pdfBytes = htmlToPdfService.convertHtmlToPdf(htmlContent, cssContent);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "document.pdf");
            headers.setContentLength(pdfBytes.length);
            
            log.info("PDF 생성 성공 - 파일 크기: {} bytes", pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("PDF 생성 실패", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/preview")
    @ResponseBody
    public ResponseEntity<byte[]> previewPdf(@RequestParam("htmlContent") String htmlContent,
                                           @RequestParam(value = "cssContent", required = false) String cssContent) {
        
        log.info("PDF 미리보기 요청 - HTML 길이: {}, CSS 길이: {}", 
                htmlContent != null ? htmlContent.length() : 0, 
                cssContent != null ? cssContent.length() : 0);
        
        try {
        	
        	// pdf 파일 만들고 byte 값으로 변환
            byte[] pdfBytes = htmlToPdfService.convertHtmlToPdf(htmlContent, cssContent);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "preview.pdf");
            headers.setContentLength(pdfBytes.length);
            
            log.info("PDF 미리보기 성공 - 파일 크기: {} bytes", pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("PDF 미리보기 실패", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 
    
}