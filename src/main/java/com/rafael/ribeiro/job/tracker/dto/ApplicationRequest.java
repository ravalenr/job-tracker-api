package com.rafael.ribeiro.job.tracker.dto;

import com.rafael.ribeiro.job.tracker.model.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private ApplicationStatus status;

    private String notes;

    private String jobUrl;

    private LocalDate appliedDate;
}