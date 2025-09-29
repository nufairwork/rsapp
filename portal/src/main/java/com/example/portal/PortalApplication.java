package com.example.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.portal","com.example.hr","com.example.inventory"})
@EnableJpaRepositories(basePackages = {"com.example.hr","com.example.inventory","com.example.portal"})
@EntityScan(basePackages = {"com.example.hr", "com.example.inventory","com.example.portal"})
public class PortalApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(PortalApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application){
        return application.sources(PortalApplication.class);
    }
}
