package kr.or.ddit.admin.las.service;

public interface VisitLogService {

	void insertPageLog(String username, String pageName, String path, String referer);

}
