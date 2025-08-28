package kr.or.ddit.csc.not.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.csc.not.service.NoticeService;
import kr.or.ddit.csc.not.service.NoticeVO;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
// 공지사항 서비스 impl
public class NoticeServiceImpl implements NoticeService {

	// 공지사항 Mapper
	@Autowired
	NoticeMapper noticeMapper;

	// 파일처리 Service
	@Autowired
	FileService fileService;

	// getList
	public List<NoticeVO> getList(Map<String, Object> map) {

		return this.noticeMapper.getList(map);
	}

	// 1. 사용자 목록 조회
	@Override
	public ArticlePage<NoticeVO> getUserNoticePage(int currentPage, int size, String keyword, String sortOrder) {
		int startNo = (currentPage - 1) * size + 1;
		int endNo = currentPage * size;

		Map<String, Object> map = new HashMap<>();
		map.put("keyword", keyword);
		map.put("currentPage", currentPage);
		map.put("startNo", startNo);
		map.put("endNo", endNo);
		map.put("sortOrder", sortOrder);

		// 리스트 불러오기
		List<NoticeVO> list = noticeMapper.getList(map);

		// 건수
		int total = noticeMapper.getAllNotice(map);

		// 페이지 네이션
		ArticlePage<NoticeVO> page = new ArticlePage<>(total, currentPage, size, list, keyword);
		page.setUrl("/csc/not/noticeList.do");

		return page;
	}

	// 2. 관리자 목록 조회
	@Override
	public ArticlePage<NoticeVO> getAdminNoticePage(int currentPage, int size, String keyword, String status) {

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
		List<NoticeVO> list = noticeMapper.getList(map);
		// 건수
		int total = noticeMapper.getAllNotice(map);
		// 페이지 네이션
		ArticlePage<NoticeVO> articlePage = new ArticlePage<>(total, currentPage, size, list, keyword,10);
		articlePage.setUrl("/csc/admin/noticeList.do");
		return articlePage;
	}

	// 3. 사용자 공지사항 세부 조회
	@Override
	public NoticeVO getUserNoticeDetail(String noticeIdStr) {

		int noticeId = Integer.parseInt(noticeIdStr);

		// 조회수 증가
		noticeMapper.upNoticeCnt(noticeId);

		// 게시글 상세 조회
		NoticeVO noticeDetail = noticeMapper.getNoticeDetail(noticeId);

		// 파일 불러오기
		List<FileDetailVO> getFileList = fileService.getFileList(noticeDetail.getFileGroupNo());
		if (getFileList != null && getFileList.size() > 0) {
			noticeDetail.setGetFileList(getFileList);
		}

		return noticeDetail;
	}

	// 4. 관리자 공지사항 세부 조회
	@Override
	public NoticeVO getAdminNoticeDetail(String noticeIdStr) {

		int noticeId = Integer.parseInt(noticeIdStr);
		// 게시글 상세 조회
		NoticeVO noticeDetail = noticeMapper.getNoticeDetail(noticeId);

		// 파일 불러오기
		List<FileDetailVO> getFileList = fileService.getFileList(noticeDetail.getFileGroupNo());
		if (getFileList != null) {
			noticeDetail.setGetFileList(getFileList);
		}

		return noticeDetail;
	}

	// 5. 관리자 공지사항 등록
	@Override
	@Transactional
	public int insertNotice(NoticeVO noticeVo) {
		
		// 실제로 첨부된 유효한 파일만 필터링
		List<MultipartFile> validFiles = noticeVo.getFiles().stream()
			.filter(file -> file != null && !file.isEmpty() && file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
			.toList();
		
		// 파일이 있을 경우에만 업로드 처리
		if (!validFiles.isEmpty()) {
			
			log.info("파일 업롣");
			
		    // 파일 그룹 ID 생성
			noticeVo.setFileGroupNo(fileService.createFileGroup());

		    // 파일 업로드
		    try {
		        fileService.uploadFiles(noticeVo.getFileGroupNo(), validFiles);
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		} else {
			// 파일 그룹 오류 해결
			noticeVo.setFileGroupNo(0L);
		}
		
		return noticeMapper.insertNotice(noticeVo);
	}

	// 6. 공지사항 수정
	@Override
	@Transactional
	public int updateNotice(NoticeVO noticeVo) {
		
		// 실제 첨부된 유효한 파일만 필터링
		List<MultipartFile> validFiles = noticeVo.getFiles().stream().filter(file -> file != null && !file.isEmpty()
				&& file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank()).toList();
		
		// 파일이 있을 경우
		if (!validFiles.isEmpty()) {
			log.info("파일이 있을 경우");

			// 기존 파일이 있을 경우
			if (noticeVo.getFileGroupNo() != null && noticeVo.getFileGroupNo() != 0L) {
				// 파일 업로드
				try {
					fileService.uploadFiles(noticeVo.getFileGroupNo(), noticeVo.getFiles());
				} catch (IOException e) {
					e.printStackTrace();
				}
			} else {
				// 기존파일이 없을 경우
				// 파일 그룹 ID 생성
				noticeVo.setFileGroupNo(fileService.createFileGroup());

				// 파일 업로드
				try {
					fileService.uploadFiles(noticeVo.getFileGroupNo(), noticeVo.getFiles());
					noticeMapper.updateNoticeFileGroup(noticeVo.getNoticeId(), noticeVo.getFileGroupNo());
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
    	

		return noticeMapper.updateNotice(noticeVo);
	}


	// 7. 공지사항 삭제
	@Override
	@Transactional
	public int deleteNotice(NoticeVO noticeVO) {
		// 공지사항 삭제
		int noticeId = noticeVO.getNoticeId();
		int result = noticeMapper.deleteNotice(noticeId);
		
		// 파일 그룹, 파일 삭제
		Long fileGroupId = noticeVO.getFileGroupNo(); 
		if(fileGroupId != null) {
			fileService.deleteFileGroup(fileGroupId);
		}
		
		return result;
	}

	@Transactional
	@Override
	public boolean deleteFile(Long groupId, int seq, int noticeId) {
		fileService.deleteFile(groupId, seq);

		// 게시글 상세 조회
		NoticeVO noticeDetail = noticeMapper.getNoticeDetail(noticeId);

		// 파일 불러오기
		List<FileDetailVO> getFileList = fileService.getFileList(noticeDetail.getFileGroupNo());
		if (getFileList != null && getFileList.size() > 0) {
			noticeDetail.setGetFileList(getFileList);
		} else {
			noticeMapper.updateNoticeFileGroup(noticeId, null);
		}
		
		return false;
	}

}
