package com.rafael.ribeiro.job.tracker.service;

import com.rafael.ribeiro.job.tracker.dto.ApplicationRequest;
import com.rafael.ribeiro.job.tracker.dto.ApplicationResponse;
import com.rafael.ribeiro.job.tracker.exception.ResourceNotFoundException;
import com.rafael.ribeiro.job.tracker.model.ApplicationStatus;
import com.rafael.ribeiro.job.tracker.model.JobApplication;
import com.rafael.ribeiro.job.tracker.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public ApplicationResponse create(ApplicationRequest request) {
        JobApplication application = mapToEntity(request);
        return mapToResponse(repository.save(application));
    }

    public List<ApplicationResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse findById(Long id) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));
        return mapToResponse(application);
    }

    public ApplicationResponse update(Long id, ApplicationRequest request) {
        JobApplication existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with id: " + id));

        existing.setCompanyName(request.getCompanyName());
        existing.setJobTitle(request.getJobTitle());
        existing.setNotes(request.getNotes());
        existing.setJobUrl(request.getJobUrl());
        existing.setAppliedDate(request.getAppliedDate());

        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }

        return mapToResponse(repository.save(existing));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Application not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public Map<String, Long> getStats() {
        return Map.of(
                "APPLIED",    repository.countByStatus(ApplicationStatus.APPLIED),
                "INTERVIEW",  repository.countByStatus(ApplicationStatus.INTERVIEW),
                "OFFER",      repository.countByStatus(ApplicationStatus.OFFER),
                "REJECTED",   repository.countByStatus(ApplicationStatus.REJECTED),
                "WITHDRAWN",  repository.countByStatus(ApplicationStatus.WITHDRAWN),
                "TOTAL",      repository.count()
        );
    }

    // ---- Private mapping methods ----

    private JobApplication mapToEntity(ApplicationRequest request) {
        JobApplication app = new JobApplication();
        app.setCompanyName(request.getCompanyName());
        app.setJobTitle(request.getJobTitle());
        app.setNotes(request.getNotes());
        app.setJobUrl(request.getJobUrl());
        app.setAppliedDate(request.getAppliedDate());
        app.setStatus(request.getStatus() != null
                ? request.getStatus()
                : ApplicationStatus.APPLIED);
        return app;
    }

    private ApplicationResponse mapToResponse(JobApplication app) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setCompanyName(app.getCompanyName());
        response.setJobTitle(app.getJobTitle());
        response.setStatus(app.getStatus());
        response.setNotes(app.getNotes());
        response.setJobUrl(app.getJobUrl());
        response.setAppliedDate(app.getAppliedDate());
        response.setCreatedAt(app.getCreatedAt());
        response.setUpdatedAt(app.getUpdatedAt());
        return response;
    }
}