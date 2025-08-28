package kr.or.ddit.config.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
	// RedisTemplate을 빈으로 등록
	@Bean
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();

		// Redis와 연결을 위한 ConnectionFactory 설정
		redisTemplate.setConnectionFactory(connectionFactory);

		// Key는 String으로 직렬화
		redisTemplate.setKeySerializer(new StringRedisSerializer());

		// Value는 JSON 형식으로 직렬화
		redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

		// Hash Key도 String으로 직렬화
		redisTemplate.setHashKeySerializer(new StringRedisSerializer());

		// Hash Value도 JSON 형식으로 직렬화
		redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

		return redisTemplate;
	}
}
