package com.gk.study.config;

import com.gk.study.interceptor.AccessInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry; // 引入这个
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MyConfig implements WebMvcConfigurer {

    @Value("${File.uploadPath}")
    private String uploadPath; // 读取 yml 中的路径

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowCredentials(true)
                .allowedMethods("*");
    }

    // ↓↓↓↓↓↓ 新增这个方法 ↓↓↓↓↓↓
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射图片路径
        // 前端访问：/api/staticfiles/image/xxx.jpg
        // 映射到本地：D:/aliyun_workspace/java_food/server/upload/image/xxx.jpg

        // 注意：addResourceHandler 里的路径不包含 context-path (/api)
        // 如果你的 context-path 是 /api，那么前端访问 /api/staticfiles/... 时，
        // Spring Boot 内部处理的是 /staticfiles/...

        registry.addResourceHandler("/staticfiles/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
    // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AccessInterceptor());
    }
}
