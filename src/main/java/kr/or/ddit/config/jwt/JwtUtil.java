package kr.or.ddit.config.jwt;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import kr.or.ddit.account.lgn.service.impl.LoginMapper;
import kr.or.ddit.main.service.MemberVO;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    

	private final long accessTokenExpire = 1000 * 60 * 30 ; // 30분

	@Autowired
	LoginMapper loginMapper;

	@Autowired
	JwtProperties jwtProperties;

   

	public String createAccessToken(String memId) {
		long now = System.currentTimeMillis(); 
		Date issuedAt = new Date(now);
		Date expiration = new Date(now + accessTokenExpire); 
		
		int intMemId = Integer.parseInt(memId);
		
		MemberVO memberVO = loginMapper.selectAuthByMemId(intMemId);

		String auth = memberVO.getMemRole();
		
		if (auth.equals("R01001")) {
			return Jwts.builder().setHeaderParam(Header.TYPE, Header.JWT_TYPE) // 헤더 typ:JWT
					.claim("roles", List.of("ROLE_USER")).setIssuer(this.jwtProperties.getIssuer()).setSubject(memId)
					.setIssuedAt(issuedAt).setExpiration(expiration).setId(UUID.randomUUID().toString())
					.signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey()).compact();
		}else if(auth.equals("R01002")) {
			return Jwts.builder().setHeaderParam(Header.TYPE, Header.JWT_TYPE) // 헤더 typ:JWT
					.claim("roles", List.of("ROLE_USER", "ROLE_ADMIN")).setIssuer(this.jwtProperties.getIssuer())
					.setSubject(memId).setIssuedAt(issuedAt)
					.setExpiration(expiration).setId(UUID.randomUUID().toString())
					.signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey()).compact();			
		}else if(auth.equals("R01003")){
			return Jwts.builder().setHeaderParam(Header.TYPE, Header.JWT_TYPE) // 헤더 typ:JWT
					.claim("roles", List.of("ROLE_USER", "ROLE_COUNSEL")).setIssuer(this.jwtProperties.getIssuer())
					.setSubject(memId).setIssuedAt(issuedAt)
					.setExpiration(expiration).setId(UUID.randomUUID().toString())
					.signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey()).compact();
			
		}else {
			return Jwts.builder().setHeaderParam(Header.TYPE, Header.JWT_TYPE) // 헤더 typ:JWT
					.claim("roles", List.of("ROLE_USER", "ROLE_CNSLEADER")).setIssuer(this.jwtProperties.getIssuer())
					.setSubject(memId).setIssuedAt(issuedAt)
					.setExpiration(expiration).setId(UUID.randomUUID().toString())
					.signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey()).compact();
		}
	}

	public String createRefreshToken(String memId) {
		return memId + "_" + UUID.randomUUID().toString();
	}

	public boolean validateToken(String token) {
		
		try {
			if(token!=null && token!="") {
				Jwts.parser().setSigningKey(jwtProperties.getSecretKey()).parseClaimsJws(token);
				return true;
			}
		} catch (ExpiredJwtException e) {
		} catch (JwtException e) {
		}
		return false;
	}

	public String extractMemId(String token) {
		try {
			Claims claims = Jwts.parser().setSigningKey(jwtProperties.getSecretKey()).parseClaimsJws(token).getBody();
			return claims.getSubject();
		} catch (JwtException e) {
			return null;
		}
	}
	
	public String resolveToken(HttpServletRequest request) {
        
		if (request.getCookies() != null) {
			
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {              	
                	return cookie.getValue(); // 토큰 반환
                }
            }
        }
        return null;
    }

	public String resolveRefreshToken(HttpServletRequest request) {
		if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {              	
                	return cookie.getValue(); // 토큰 반환
                }
            }
        }
        return null;
	}
	
	public String getUsernameFromToken(String token) {
	    Claims claims = getClaims(token);
	    return claims.getSubject();
	}

	public List<String> getRolesFromToken(String token) {
	    Claims claims = getClaims(token);
	    return claims.get("roles", List.class);
	}


	private Claims getClaims(String token) {
	    return Jwts.parser()
	            .setSigningKey(jwtProperties.getSecretKey())
	            .parseClaimsJws(token)
	            .getBody();
	}
	public String getRefreshTokenFromDb(String username) {
	    
		int memId = Integer.parseInt(username);
		
		MemberVO member = loginMapper.selectById(memId);
		String rfToken =member.getMemToken();
		
	    return rfToken;
	}
}
