package com.rafael.ribeiro.job.tracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Job Tracker API")
                        .version("1.0")
                        .description("REST API for tracking job applications — " +
                                "built with Spring Boot 3, PostgreSQL and JPA")
                        .contact(new Contact()
                                .name("Rafael Ribeiro")
                                .url("https://github.com/ravalenr")
                                .email("raphahribs@icloud.com")));
    }
}