package kr.or.ddit.util.file.service.impl;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.util.file.service.FileDetailVO;
import kr.or.ddit.util.file.service.FileGroupVO;

@Mapper
public interface FileMapper {

	public void insertFileGroup(FileGroupVO vo);

	public Long getMaxFileGroupId(String today);

	public void insertFileDetail(FileDetailVO detail);

	public FileDetailVO getFileDetailByGroupAndSeq(@Param("fileGroupId") Long fileGroupId,
			@Param("fileSeq") int fileSeq);

	public FileDetailVO getFileDetailById(Long fileId);

	FileDetailVO selectFile(@Param("groupId") Long groupId, @Param("seq") int seq);

	int deleteFile(@Param("groupId") Long groupId, @Param("seq") int seq);

	List<FileDetailVO> selectFileList(Long groupId);

	int deleteFilesByGroupId(Long groupId);

	public void deleteFileGroup(Long groupId);

	int getMaxFileSeq(Long fileGroupId);

}
