package kr.or.ddit.csc.faq.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.csc.faq.service.FaqService;
import kr.or.ddit.csc.faq.service.FaqVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FaqServiceImpl implements FaqService{
	
	@Autowired
	FaqMapper faqMapper;

	@Autowired
	FileService fileService;
	
	//사용자 FAQ 리스트
	@Override
	public List<FaqVO> getUserFaqList(String keyword) {
		
		// 목록 불러오기
		List<FaqVO> faqList = this.faqMapper.getUserFaqList(keyword);
		// 리스트 FaqVO 별 리스트 삽입
		for (FaqVO faq : faqList) {
			if(faq.getFileGroupNo() != null) {
			    faq.setGetFileList(fileService.getFileList(faq.getFileGroupNo()));
			}
		}
		
		return faqList;
	}
	
	// 관리자 FAQ 리스트
	@Override
	public ArticlePage<FaqVO> getAdminFaqList(int currentPage, int size, String keyword, String status) {

		// 파라미터
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("keyword", keyword);
		map.put("status", status);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);

		// 리스트 불러오기
		List<FaqVO> list = faqMapper.getAdminFaqList(map);
		// 건수
		int total = faqMapper.getAllFaq(map);
		// 페이지 네이션
		ArticlePage<FaqVO> articlePage = new ArticlePage<FaqVO>(total, currentPage, size, list, keyword,10);
		articlePage.setUrl("/csc/admin/faqList.do");
		return articlePage;
	}

	// 관리자 FAQ 상세조회
	@Override
	public FaqVO getAdminFaqDetail(String faqId) {
		
		// 관리자 FAQ 상세 조회
		FaqVO faqDetail = faqMapper.getAdminFaqDetail(faqId);
		
		// 파일그룹ID가 있다면 상세 조회
		if(faqDetail.getFileGroupNo() != null) {
			List<FileDetailVO> getFileList = fileService.getFileList(faqDetail.getFileGroupNo());
			// 파일 그룹 ID에 대한 파일 리스가 있다면 Set
			if (getFileList != null ) {
				faqDetail.setGetFileList(getFileList);
			}
		}
		
		return faqDetail;
	}

	// 관리자 FAQ 등록
	@Transactional
	@Override
	public int insertFaq(FaqVO faqVO) {

		// 실제 첨부된 유효한 파일만 필터링
		List<MultipartFile> validFiles = faqVO.getFiles().stream()
		    .filter(file -> file != null && !file.isEmpty() && file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
		    .toList();

		// 파일이 있을 경우에만 업로드 처리
		if (!validFiles.isEmpty()) {
		    // 파일 그룹 ID 생성
		    faqVO.setFileGroupNo(fileService.createFileGroup());

		    // 파일 업로드
		    try {
		        fileService.uploadFiles(faqVO.getFileGroupNo(), validFiles);
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		} else {
			// 파일 그룹 오류 해결
			faqVO.setFileGroupNo(0L);
		}
		
		return faqMapper.insertFaq(faqVO);
	}

	@Transactional
	@Override
	public int updateFaq(FaqVO faqVO) {

		// 실제 첨부된 유효한 파일만 필터링
		List<MultipartFile> validFiles = faqVO.getFiles().stream()
		    .filter(file -> file != null && !file.isEmpty() && file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
		    .toList();
		
		// 파일이 있을 경우
		if (!validFiles.isEmpty()) {
			
			// 기존 파일이 있을 경우
			if(faqVO.getFileGroupNo() != null && faqVO.getFileGroupNo() != 0L) {
				// 파일 업로드
				try {
					fileService.uploadFiles(faqVO.getFileGroupNo(), faqVO.getFiles());
				} catch (IOException e) {
					e.printStackTrace();
				}
			}else {
				// 기존파일이 없을 경우
				// 파일 그룹 ID 생성
				faqVO.setFileGroupNo(fileService.createFileGroup());

				// 파일 업로드
				try {
					fileService.uploadFiles(faqVO.getFileGroupNo(), faqVO.getFiles());
					faqMapper.updateFaqFileGroupID(faqVO.getFaqId(),faqVO.getFileGroupNo());
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return faqMapper.updateFaq(faqVO);
	}

	@Override
	@Transactional
	public int deleteFaq(FaqVO faqVO) {
		
		//파일이 있는 경우
		if(faqVO.getFileGroupNo() !=null) {
			fileService.deleteFileGroup(faqVO.getFileGroupNo());
		}
		//파일이 없는 경우
		faqMapper.deleteFaq(faqVO.getFaqId());
		
		return 0;
	}


}


