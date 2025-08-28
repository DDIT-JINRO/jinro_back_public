package kr.or.ddit.util.pdf.service;

import java.io.IOException;
import java.util.Map;

import com.itextpdf.text.DocumentException;

public interface HTMLtoPdfService {
	/**
	 * HTML과 CSS를 PDF로 변환
	 */
	byte[] convertHtmlToPdf(String htmlContent, String cssContent) throws DocumentException, IOException;
	
    /**
     * 완전한 HTML 문서 생성
     */
	String buildFullHtmlDocument(String htmlContent, String cssContent);

}
