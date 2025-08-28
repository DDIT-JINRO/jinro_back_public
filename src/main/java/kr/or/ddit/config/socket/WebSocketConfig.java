package kr.or.ddit.config.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // WebSocket + STOMP 사용 선언
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws-stomp")	// 연결 주소 (클라이언트에서 SockJS 연결용)
				.setAllowedOriginPatterns("*")
				.withSockJS();
		
	}
	
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 구독 주소(prefix): 서버 → 클라이언트 메시지 전송 경로
        registry.enableSimpleBroker("/sub");

        // 전송 주소(prefix): 클라이언트 → 서버 메시지 전송 경로
        registry.setApplicationDestinationPrefixes("/pub");
	}
	
}
