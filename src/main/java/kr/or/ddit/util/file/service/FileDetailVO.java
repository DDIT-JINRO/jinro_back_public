package kr.or.ddit.util.file.service;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class FileDetailVO {
    private int fileId;             // UUID or 시퀀스
    private Long fileGroupId;        // FK
    private String fileOrgName;        // 원본 파일명
    private String fileSaveName;       // 저장된 파일명 (uuid_원본)
    private Long fileSize;				//kb 기준
    private String fileExt;
    private String fileMime;
    private LocalDateTime fileSaveDate;
    private int fileSeq;
    
    private String filePath;
}
