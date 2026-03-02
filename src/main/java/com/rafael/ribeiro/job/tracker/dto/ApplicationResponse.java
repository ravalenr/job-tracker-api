package com.rafael.ribeiro.job.tracker.dto;

import com.rafael.ribeiro.job.tracker.model.ApplicationStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {

    private Long id;
    private String companyName;
    private String jobTitle;
    private ApplicationStatus status;
    private String notes;
    private String jobUrl;
    private LocalDate appliedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}