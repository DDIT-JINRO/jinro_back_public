package kr.or.ddit.util.alarm.service.impl;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.annotation.PreDestroy;

@Component
public class AlarmEmitterManager {

	private final Map<Integer, SseEmitter> connectedEmitterMap = new ConcurrentHashMap<>();

	public SseEmitter createOrReplaceEmitter(int memId) {
		if(connectedEmitterMap.containsKey(memId)) {
			connectedEmitterMap.get(memId).complete();
		}

		SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
		connectedEmitterMap.put(memId, emitter);

		// 연결 테스트용
		try {
			emitter.send(SseEmitter.event().name("connected").data(memId));
		} catch (IOException e) {
			emitter.complete();
			connectedEmitterMap.remove(memId);
		} catch (Exception e) {
			e.printStackTrace();
		}

		emitter.onCompletion(()->{
			SseEmitter disconnectEmitter = connectedEmitterMap.remove(memId);
			if(disconnectEmitter != null) disconnectEmitter.complete();
		});
		emitter.onTimeout(()->{
			SseEmitter disconnectEmitter = connectedEmitterMap.remove(memId);
			if(disconnectEmitter != null) disconnectEmitter.complete();
		});
		emitter.onError((e)->{
			SseEmitter disconnectEmitter = connectedEmitterMap.remove(memId);
			if(disconnectEmitter != null) disconnectEmitter.complete();
		});

		return emitter;
	}

	@PreDestroy
	public void cleanupEmitters() {
		connectedEmitterMap.forEach((memId, emitter) -> {
			try {
				emitter.complete();
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
		connectedEmitterMap.clear();
	}

	public SseEmitter getEmitter(int memId) {
		return this.connectedEmitterMap.get(memId);
	}

	public Map<Integer, SseEmitter> getConnectedEmitterMap(){
		return this.connectedEmitterMap;
	}

}
