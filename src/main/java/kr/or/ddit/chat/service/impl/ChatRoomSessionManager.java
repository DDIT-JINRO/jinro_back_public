package kr.or.ddit.chat.service.impl;

import java.security.Principal;
import java.util.Collections;
import java.security.Principal;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ChatRoomSessionManager {

    // key: memId, value: crId (한 사람은 한 방만 열 수 있음)  -> 수신자 테이블에 삽입될 데이터의 시간관리를 위함
    private final Map<Integer, Integer> roomSessionMap = new ConcurrentHashMap<>();

    // 채팅 모달을 열고 있는 사용자 (memId 기준) -> 채팅방별 안읽음 메시지 브로드 캐스팅을 위함
    private final Set<Integer> modalOpenedUsers = ConcurrentHashMap.newKeySet();

    // key: sessionId, value:memId 예기치 못한 세션 종료시를 대비해서 소켓세션의 값과 userId를 매칭시켜둘 맵
    private final Map<String, Integer> sessionToUserMap = new ConcurrentHashMap<String, Integer>();

    // key: sessionId, <key:memId value:> 소켓세션값과 구독URL을 매칭 시켜서 관리해줄 맵
    //								-> 구독 취소 시에 destination값이 없어서 필요
    private final Map<String, Map<String, String>> sessionSubscriptions = new ConcurrentHashMap<>();

    /**
     * 특정 채팅방 구독 시 사용자 추가 -> 수신자 테이블에 삽입될 데이터의 시간관리를 위함
     * 모달 오픈시 사용자 추가 -> 모달 오픈된 사용자 기준으로 브로드 캐스팅을 위함
     */
    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        Principal user = accessor.getUser();
        String destination = accessor.getDestination();
        String sessionId = accessor.getSessionId();
        String subId = accessor.getSubscriptionId();
//        log.info("[SUBSCRIBE] session={}, subId={}, destination={}", sessionId, subId, destination);
        if(destination.endsWith("anonymousUser")) {
        	return;
        }

        // 세션값을 유저와 매핑 관리
        if(user != null && !sessionToUserMap.containsKey(accessor.getSessionId())) {
//        	System.out.println("########[소켓세션관리] "+user.getName() + " ---→ 세션값 : "+accessor.getSessionId());
        	sessionToUserMap.put(accessor.getSessionId(), Integer.parseInt(user.getName()));
        }

        // 세션값 : <구독id : 구독경로>
        if(sessionId != null && subId != null && destination != null) {
        	sessionSubscriptions.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>()).put(subId, destination);
        }

        // 특정 채팅방 구독 관리
        if (user != null && destination != null && destination.startsWith("/sub/chat/room/")) {
            try {
                int crId = Integer.parseInt(destination.replace("/sub/chat/room/", ""));
                int memId = Integer.parseInt(user.getName()); // Spring Security에서 받은 사용자 ID

                roomSessionMap.put(memId, crId);
//                System.out.println("########[채팅방구독] " + memId + " ---→ 채팅방 : " + crId);
            } catch (NumberFormatException e) {
                log.error("구독 파싱 오류: {}", destination);
                log.error("구독 파싱 오류 에러 메시지: {}", e);
            }
        }

        // 모달 오픈된 유저 관리
		if (destination != null && destination.startsWith("/sub/chat/unread/detail/")) {
//			System.out.println("########[모달오픈유저] " + user.getName());
			int memId = Integer.parseInt(destination.replace("/sub/chat/unread/detail/", ""));
			modalOpenedUsers.add(memId);
		}
//		printAll();	// 상태관리 디버깅용
	}

    @EventListener
    public void handleSessionUnsubscribeEvent(SessionUnsubscribeEvent event) {
    	StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String subId = accessor.getSubscriptionId();

//        log.info("[UNSUBSCRIBE] session={}, subId={}", sessionId, subId);
        // 구독취소가 발생한 세션id값과 취소된구독id값 점검
        if (sessionId != null && subId != null) {
            Map<String, String> subscriptions = sessionSubscriptions.get(sessionId);
            // 관리중인 구독과 매칭시켜서 점검
            if (subscriptions != null) {
            	// 관리중인 구독에서 취소한구독id의 url경로 확인
                String destination = subscriptions.remove(subId);
//                log.info("[UNSUB DEST] {}", destination);
                // 세션값과 매칭해서 보관중인 userId 받아옴
                Integer memId = sessionToUserMap.get(sessionId);

                // 구독 취소된 url 경로를 확인해고 관리중인 map혹은 set에서 제거
                if (memId != null && destination != null) {
                    if (destination.startsWith("/sub/chat/room/")) {
                        roomSessionMap.remove(memId);
//                        log.info("[roomSessionMap REMOVE] memId={}", memId);
                    } else if (destination.startsWith("/sub/chat/unread/detail/")) {
                        modalOpenedUsers.remove(memId);
//                        log.info("[modalOpenedUsers REMOVE] memId={}", memId);
                    }
                }
            }
        }
//        printAll();	// 상태관리 디버깅용
    }

    /**
     * 세션 연결 끊김 시 사용자 제거
     */
    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        Principal user = accessor.getUser();
        String sessionId = accessor.getSessionId();
        // 세션과 유저 매핑관리중인것 제거
        Integer memId = sessionToUserMap.remove(sessionId);

//        log.info("[DISCONNECT] session={}, memId={}", sessionId, memId);

        // 세션과 구독 매핑관리중인것 제거
        sessionSubscriptions.remove(sessionId);

        // 멤버와 채팅방 연결 제거, 멤버와 모달 구독 제거
        if (memId != null) {
            roomSessionMap.remove(memId);
            modalOpenedUsers.remove(memId);
//            log.info("[roomSessionMap REMOVE] memId={}", memId);
//            log.info("[modalOpenedUsers REMOVE] memId={}", memId);
        }
//        printAll();	// 상태관리 디버깅용
    }



    public Set<Integer> getModalOpenUser() {
    	return this.modalOpenedUsers;
    }

    /**
     * 현재 채팅방을 열람 중인 사용자 목록 반환
     */
    public Set<Integer> getOpendUser(int crId) {
        return roomSessionMap.entrySet().stream()
                .filter(entry -> entry.getValue().equals(crId))
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
    }

    /**
     * 특정 유저가 현재 열람 중인 채팅방 ID 조회 (optional)
     */
    public Integer getOpenedRoom(int memId) {
        return roomSessionMap.get(memId);
    }

    /**
     * 아래는 관리중인 상태 확인용 (디버깅용)
     */
    public Map<Integer, Integer> getRoomSessionMap() {
        return Collections.unmodifiableMap(roomSessionMap);
    }

    public Set<Integer> getModalOpenedUsersSnapshot() {
        return Collections.unmodifiableSet(modalOpenedUsers);
    }

    public Map<String, Integer> getSessionToUserMapSnapshot() {
        return Collections.unmodifiableMap(sessionToUserMap);
    }

    public Map<String, Map<String, String>> getSessionSubscriptionsSnapshot() {
        return Collections.unmodifiableMap(sessionSubscriptions.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> Collections.unmodifiableMap(e.getValue()))));
    }

    public void printAll() {
    	log.info("===========================상태관리 체크===============================");
    	log.info("roomSessionMap : {}", getRoomSessionMap());
    	log.info("modalOpenedUsers : {}", getModalOpenedUsersSnapshot());
    	log.info("sessionToUserMap : {} ", getSessionToUserMapSnapshot());
    	log.info("sessionSubscriptions : {}", getSessionSubscriptionsSnapshot());
    	log.info("====================================================================");
    }

}
