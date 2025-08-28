package kr.or.ddit.util.file.service;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class FileGroupVO {
    private Long fileGroupId;         // 예: 20250716001
    private LocalDateTime fileGroupDate;
    private List<FileDetailVO> fileList;
}
