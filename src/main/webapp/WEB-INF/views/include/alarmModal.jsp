<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<link rel="stylesheet" href="/css/alarmModal.css"/>
<!-- 알림모달 -->
<div id="alarm-modal" class="alarm-modal hidden">
  <div class="alarm-header">
    <h3>알림</h3>
    <button id="alarm-close">&times;</button>
  </div>
  <div class="alarm-body" id="alarm-body">
    <!-- 알림이 하나도 없을 때 보여줄 기본 메시지 -->
    <p class="empty-message">알림이 없습니다.</p>
  </div>
  <div class="alarm-footer">
    <button id="alarm-delete-all" class="denied" disabled="disabled">전체 삭제</button>
  </div>
</div>
<!-- 알림모달 끝 -->
<script src="/js/include/alarmModal.js"></script>