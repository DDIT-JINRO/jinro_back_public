package kr.or.ddit.util.file.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {

	@Value("${app.file_url}")
	private String basePath;

    public FileDetailVO saveFile(MultipartFile file, Long fileGroupId, int fileSeq) throws IOException {
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path saveDir = Paths.get(basePath, datePath);
        Files.createDirectories(saveDir);

        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String original = file.getOriginalFilename();
        String savedName = uuid + "_" + original;
        Path fullPath = saveDir.resolve(savedName);
        file.transferTo(fullPath.toFile());

        FileDetailVO detail = new FileDetailVO();
        detail.setFileGroupId(fileGroupId);
        detail.setFileOrgName(original);
        detail.setFileSaveName(savedName);
        detail.setFileSize(file.getSize());
        detail.setFileExt(getExt(original));
        detail.setFileMime(file.getContentType());
        detail.setFileSaveDate(LocalDateTime.now());
        detail.setFileSeq(fileSeq);
        return detail;
    }

    private String getExt(String filename) {
        int idx = filename.lastIndexOf(".");
        return (idx != -1) ? filename.substring(idx + 1).toLowerCase() : "";
    }
}