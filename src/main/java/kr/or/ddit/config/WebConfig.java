package kr.or.ddit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Value("${app.file_url}")
	private String fileUrl;
	
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // classpath:/static/css/ → /css/**
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");

        // classpath:/static/images/ → /images/**
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
        
        // classpath:/static/fonts/ → /fonts/**
        registry.addResourceHandler("/fonts/**")
                .addResourceLocations("classpath:/static/fonts/");
        
        registry.addResourceHandler("/js/**")
        		.addResourceLocations("classpath:/static/js/");
        
        registry.addResourceHandler("/ckeditor5/**")
				.addResourceLocations("classpath:/static/ckeditor5/");
        
        registry.addResourceHandler("/upload/**")
				.addResourceLocations("file:"+fileUrl+"/");
    }
}

