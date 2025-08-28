package kr.or.ddit.config.jwt;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.admin.las.service.VisitLogService;
import kr.or.ddit.admin.las.service.impl.VisitViewUriMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserDetailsService userDetailsService;
	private final VisitLogService visitLogService;

	

	public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService,
			VisitLogService visitLogService) {
		this.jwtUtil = jwtUtil;
		this.userDetailsService = userDetailsService;
		this.visitLogService = visitLogService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String uri = request.getRequestURI();
		String contextPath = request.getContextPath();
		String path = uri.substring(contextPath.length());
		String referer = request.getHeader("Referer");
		String pathOnly = "";

		if (referer != null) {
			try {
				URL url = new URL(referer);
				pathOnly = url.getPath();
			} catch (MalformedURLException e) {
				e.printStackTrace();
			}
		}
		
		// 정적 리소스 요청은 필터 제외 (css, js, image, favicon 등)
		if (path.startsWith("/static/") || path.startsWith("/css/") || path.startsWith("/js/")
				|| path.startsWith("/images/") || path.equals("/favicon.ico") || path.startsWith("/fonts/")) {
			filterChain.doFilter(request, response); // 그냥 통과
			return;
		}

		// 1. 쿠키나 헤더에서 JWT 꺼내기
		try {
			String token = jwtUtil.resolveToken(request);
			// 2. 토큰이 유효하면
			if (token != null && token != "" && jwtUtil.validateToken(token)) {

				String username = jwtUtil.getUsernameFromToken(token);
				List<String> roles = jwtUtil.getRolesFromToken(token); // 클레임에서 roles 꺼내기

				// 3. UserDetails 생성
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				List<GrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new)
						.collect(Collectors.toList());

				// 4. 인증 객체 생성 및 SecurityContext에 저장
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username,
						null, authorities);
				SecurityContextHolder.getContext().setAuthentication(authentication);

				if (VisitViewUriMap.contains(path) && VisitViewUriMap.contains(pathOnly)) {
					String pageName = VisitViewUriMap.getPageName(path);
					String refererName = VisitViewUriMap.getPageName(pathOnly);

					if (pageName != null && refererName != null) {
						if (!pageName.trim().equals(refererName.trim())) {
							visitLogService.insertPageLog(username, pageName, path, pathOnly);
						}
					}
				}

				filterChain.doFilter(request, response);
				return;
			} else if (token != null && token != "" && !jwtUtil.validateToken(token)) {
				String refreshToken = jwtUtil.resolveRefreshToken(request);
				if (refreshToken != null) {
					String userId = refreshToken.split("_")[0];
					String storedRefreshToken = jwtUtil.getRefreshTokenFromDb(userId);
					if (refreshToken.equals(storedRefreshToken)) {
						String newAccessToken = jwtUtil.createAccessToken(userId);
						Cookie newTokenCookie = new Cookie("accessToken", newAccessToken);
						newTokenCookie.setPath("/");
						newTokenCookie.setHttpOnly(true);
						newTokenCookie.setMaxAge(60 * 60);
						response.addCookie(newTokenCookie);

						String username = jwtUtil.getUsernameFromToken(newAccessToken);
						List<String> roles = jwtUtil.getRolesFromToken(newAccessToken);

						UserDetails userDetails = userDetailsService.loadUserByUsername(username);
						List<GrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new)
								.collect(Collectors.toList());

						UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
								username, null, authorities);
						SecurityContextHolder.getContext().setAuthentication(authentication);

						if (VisitViewUriMap.contains(path) && VisitViewUriMap.contains(pathOnly)) {
							String pageName = VisitViewUriMap.getPageName(path);
							String refererName = VisitViewUriMap.getPageName(pathOnly);

							if (pageName != null && refererName != null) {
								if (!pageName.trim().equals(refererName.trim())) {
									visitLogService.insertPageLog(username, pageName, path, pathOnly);
								}
							}
						}

						filterChain.doFilter(request, response);
						return;
					} else {
						SecurityContextHolder.clearContext();
						if (VisitViewUriMap.contains(path) && VisitViewUriMap.contains(pathOnly)) {
							String pageName = VisitViewUriMap.getPageName(path);
							String refererName = VisitViewUriMap.getPageName(pathOnly);

							if (pageName != null && refererName != null) {
								if (!pageName.trim().equals(refererName.trim())) {
									visitLogService.insertPageLog("0", pageName, path, pathOnly);
								}
							}
						}
					}
				}
			} else {
				// 토큰 없거나 유효하지 않을 때 인증 초기화 (null로 설정)
				SecurityContextHolder.clearContext();
				if (VisitViewUriMap.contains(path) && VisitViewUriMap.contains(pathOnly)) {
					String pageName = VisitViewUriMap.getPageName(path);
					String refererName = VisitViewUriMap.getPageName(pathOnly);

					if (pageName != null && refererName != null) {
						if (!pageName.trim().equals(refererName.trim())) {
							visitLogService.insertPageLog("0", pageName, path, pathOnly);
						}
					}
				}
			}

		} catch (Exception e) {
			// 예외 발생 시 인증 초기화 및 로그 기록
			SecurityContextHolder.clearContext();
			logger.error("JWT 인증 처리 중 오류", e);
		}

		// 다음 필터로 진행
		filterChain.doFilter(request, response);
	}
}
