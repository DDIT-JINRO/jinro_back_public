package kr.or.ddit.util.file.service;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
	Long createFileGroup(); // FILE_GROUP_ID 생성 + 저장

	List<FileDetailVO> uploadFiles(Long fileGroupId, List<MultipartFile> files) throws IOException;

	boolean deleteFile(Long fileId, int seq);

	Resource downloadFile(Long fileGroupId, int fileSeq) throws IOException;

	FileDetailVO getFileDetail(Long fileGroupId, int fileSeq);

	boolean deleteFileGroup(Long groupId);

	List<FileDetailVO> getFileList(Long groupId);

	List<FileDetailVO> updateFile(Long fileGroupId, List<MultipartFile> files) throws IOException;

	String getSavePath(FileDetailVO fileDetailVO);
}
