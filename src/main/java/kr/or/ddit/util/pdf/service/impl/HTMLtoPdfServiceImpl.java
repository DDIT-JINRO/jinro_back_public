package kr.or.ddit.util.pdf.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.xhtmlrenderer.pdf.ITextFontResolver;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.BaseFont;

import kr.or.ddit.util.pdf.service.HTMLtoPdfService;

@Service
public class HTMLtoPdfServiceImpl implements HTMLtoPdfService {

	private static final String DEFAULT_FONT_PATH = "C:/Windows/Fonts/malgun.ttf";
	private static final String MAC_FONT_PATH = "/System/Library/Fonts/AppleGothic.ttf";

	@Override
	public byte[] convertHtmlToPdf(String htmlContent, String cssContent) throws DocumentException, IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		try {
			// HTML 내용 검증 및 전처리
			if (htmlContent == null || htmlContent.trim().isEmpty()) {
				throw new IllegalArgumentException("HTML 내용이 비어있습니다.");
			}

			// 완전한 HTML 문서로 변환
			String fullHtml = buildFullHtmlDocument(htmlContent, cssContent);

			// Flying Saucer 렌더러 생성
			ITextRenderer renderer = new ITextRenderer();

			// 한글폰트 포함 및 폰트 설정
			setupKoreanFonts(renderer);

			// HTML 문자열 문서화
			renderer.setDocumentFromString(fullHtml);
			// 문서를 위치 줄바꿈 폰트 페이지분할 등 계산하여 적용
			renderer.layout();
			// PDF 생성
			renderer.createPDF(baos);

		} catch (Exception e) {
			System.err.println("PDF 생성 중 오류: " + e.getMessage());
			e.printStackTrace();
			throw new DocumentException("PDF 생성 실패: " + e.getMessage());
		}

		return baos.toByteArray();
	}

	@Override
	public String buildFullHtmlDocument(String htmlContent, String cssContent) {


        StringBuilder fullHtml = new StringBuilder();
        fullHtml.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
        fullHtml.append("<html xmlns=\"http://www.w3.org/1999/xhtml\">");
        fullHtml.append("<head>");
        fullHtml.append("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />");
        fullHtml.append("<title>PDF Document</title>");
        fullHtml.append("<style type=\"text/css\">");
        fullHtml.append(getDefaultStyles());
        if (cssContent != null && !cssContent.trim().isEmpty()) {
            fullHtml.append(cssContent);
        }
        fullHtml.append("</style>");
        fullHtml.append("</head>");
        fullHtml.append("<body>");
        fullHtml.append(htmlContent);
        fullHtml.append("</body>");
        fullHtml.append("</html>");

        return fullHtml.toString();
	}

	/**
	 * pdf만들때 추가할 html기본문서 css양식
	 */
	private String getDefaultStyles() {
		String defaultStyles = """
            body {
                font-family: 'Malgun Gothic', 'Apple Gothic', 'NanumGothic', sans-serif;
                margin: 20px;
                line-height: 1.6;
                color: #333;
                font-size: 12px;
            }
            h1, h2, h3, h4, h5, h6 {
                color: #2c3e50;
                margin-top: 0;
                margin-bottom: 10px;
            }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
            h3 { font-size: 16px; }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 11px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f8f9fa;
                font-weight: bold;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 10px;
                color: #666;
            }
            p {
                margin: 0 0 10px 0;
            }
            .highlight {
                background-color: #fff3cd;
                padding: 5px;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }

            <!-- font family class -->
            .malgun { font-family: 'Malgun Gothic'; }
            .nanum { font-family: 'NanumGothic'; }
            .jeju { font-family: 'JejuGothic'; }
            """;
        return defaultStyles;
	}

   /**
     * 폰트설정 (한글 폰트 하나라도 있으면 한글 가능, 나머지 폰트 추가해서 커스텀 가능)
     */
	private void setupKoreanFonts(ITextRenderer renderer) {
	    try {
	        ITextFontResolver fontResolver = renderer.getFontResolver();

	        // 클래스패스 리소스 폰트들 추가
	        List<String> resourceFonts = Arrays.asList(
	            "static/fonts/NanumGothic.ttf",
	            "static/fonts/JejuGothic.ttf",
	            "static/fonts/폰트파일명"
	        );
	        for (String path : resourceFonts) {
	            try {
	                // ClassPathResource 객체 생성
	                ClassPathResource resource = new ClassPathResource(path);

	                // 리소스가 존재하는지 확인
	                if (resource.exists()) {
	                    // 폰트 경로 문자열을 직접 전달하여 폰트 등록
	                    fontResolver.addFont(path, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
	                } else {
	                    System.err.println("❌ 리소스 폰트 파일을 찾을 수 없음: " + path);
	                }
	            } catch (IOException e) {
	                System.err.println("❌ 리소스 폰트 로드 실패: " + path + " → " + e.getMessage());
	            }
	        }
	    } catch (Exception e) {
	        System.err.println("폰트 설정 중 오류: " + e.getMessage());
	    }
	}

}