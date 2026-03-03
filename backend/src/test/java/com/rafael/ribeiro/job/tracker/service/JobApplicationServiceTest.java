package com.rafael.ribeiro.job.tracker.service;

import com.rafael.ribeiro.job.tracker.dto.ApplicationRequest;
import com.rafael.ribeiro.job.tracker.dto.ApplicationResponse;
import com.rafael.ribeiro.job.tracker.exception.ResourceNotFoundException;
import com.rafael.ribeiro.job.tracker.model.ApplicationStatus;
import com.rafael.ribeiro.job.tracker.model.JobApplication;
import com.rafael.ribeiro.job.tracker.repository.JobApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobApplicationService Tests")
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @InjectMocks
    private JobApplicationService service;

    private JobApplication sampleApplication;
    private ApplicationRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleApplication = new JobApplication();
        sampleApplication.setId(1L);
        sampleApplication.setCompanyName("Google");
        sampleApplication.setJobTitle("Java Developer");
        sampleApplication.setStatus(ApplicationStatus.APPLIED);
        sampleApplication.setNotes("Via LinkedIn");
        sampleApplication.setJobUrl("https://careers.google.com");
        sampleApplication.setAppliedDate(LocalDate.of(2026, 3, 1));
        sampleApplication.setCreatedAt(LocalDateTime.now());
        sampleApplication.setUpdatedAt(LocalDateTime.now());

        sampleRequest = new ApplicationRequest();
        sampleRequest.setCompanyName("Google");
        sampleRequest.setJobTitle("Java Developer");
        sampleRequest.setStatus(ApplicationStatus.APPLIED);
        sampleRequest.setNotes("Via LinkedIn");
        sampleRequest.setJobUrl("https://careers.google.com");
        sampleRequest.setAppliedDate(LocalDate.of(2026, 3, 1));
    }

    // ── CREATE ───────────────────────────────────────────────

    @Test
    @DisplayName("create: should save application and return mapped response")
    void create_shouldSaveAndReturnResponse() {
        when(repository.save(any(JobApplication.class))).thenReturn(sampleApplication);

        ApplicationResponse response = service.create(sampleRequest);

        assertThat(response).isNotNull();
        assertThat(response.getCompanyName()).isEqualTo("Google");
        assertThat(response.getJobTitle()).isEqualTo("Java Developer");
        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.APPLIED);

        verify(repository, times(1)).save(any(JobApplication.class));
    }

    @Test
    @DisplayName("create: should default to APPLIED when no status provided")
    void create_shouldDefaultToAppliedStatus() {
        sampleRequest.setStatus(null);
        when(repository.save(any(JobApplication.class))).thenReturn(sampleApplication);

        ApplicationResponse response = service.create(sampleRequest);

        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
    }

    // ── FIND ALL ─────────────────────────────────────────────

    @Test
    @DisplayName("findAll: should return list of all applications")
    void findAll_shouldReturnAllApplications() {
        JobApplication second = new JobApplication();
        second.setId(2L);
        second.setCompanyName("Stripe");
        second.setJobTitle("Backend Engineer");
        second.setStatus(ApplicationStatus.INTERVIEW);

        when(repository.findAll()).thenReturn(List.of(sampleApplication, second));

        List<ApplicationResponse> result = service.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getCompanyName()).isEqualTo("Google");
        assertThat(result.get(1).getCompanyName()).isEqualTo("Stripe");

        verify(repository, times(1)).findAll();
    }

    @Test
    @DisplayName("findAll: should return empty list when no applications exist")
    void findAll_shouldReturnEmptyList() {
        when(repository.findAll()).thenReturn(List.of());

        List<ApplicationResponse> result = service.findAll();

        assertThat(result).isEmpty();
    }

    // ── FIND BY ID ───────────────────────────────────────────

    @Test
    @DisplayName("findById: should return response when application exists")
    void findById_shouldReturnResponse() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleApplication));

        ApplicationResponse response = service.findById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getCompanyName()).isEqualTo("Google");
    }

    @Test
    @DisplayName("findById: should throw ResourceNotFoundException when not found")
    void findById_shouldThrowWhenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(repository, times(1)).findById(99L);
    }

    // ── UPDATE ───────────────────────────────────────────────

    @Test
    @DisplayName("update: should update fields and return updated response")
    void update_shouldUpdateAndReturn() {
        ApplicationRequest updateRequest = new ApplicationRequest();
        updateRequest.setCompanyName("Google");
        updateRequest.setJobTitle("Senior Java Developer");
        updateRequest.setStatus(ApplicationStatus.INTERVIEW);
        updateRequest.setNotes("Phone screen passed");

        JobApplication updated = new JobApplication();
        updated.setId(1L);
        updated.setCompanyName("Google");
        updated.setJobTitle("Senior Java Developer");
        updated.setStatus(ApplicationStatus.INTERVIEW);
        updated.setNotes("Phone screen passed");
        updated.setCreatedAt(LocalDateTime.now());
        updated.setUpdatedAt(LocalDateTime.now());

        when(repository.findById(1L)).thenReturn(Optional.of(sampleApplication));
        when(repository.save(any(JobApplication.class))).thenReturn(updated);

        ApplicationResponse response = service.update(1L, updateRequest);

        assertThat(response.getJobTitle()).isEqualTo("Senior Java Developer");
        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.INTERVIEW);
        assertThat(response.getNotes()).isEqualTo("Phone screen passed");

        verify(repository).findById(1L);
        verify(repository).save(any(JobApplication.class));
    }

    @Test
    @DisplayName("update: should throw ResourceNotFoundException when not found")
    void update_shouldThrowWhenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, sampleRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(repository, never()).save(any());
    }

    // ── DELETE ───────────────────────────────────────────────

    @Test
    @DisplayName("delete: should delete when application exists")
    void delete_shouldDeleteSuccessfully() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("delete: should throw ResourceNotFoundException when not found")
    void delete_shouldThrowWhenNotFound() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(repository, never()).deleteById(any());
    }

    // ── STATS ────────────────────────────────────────────────

    @Test
    @DisplayName("getStats: should return correct counts for all statuses")
    void getStats_shouldReturnCorrectCounts() {
        when(repository.countByStatus(ApplicationStatus.APPLIED)).thenReturn(5L);
        when(repository.countByStatus(ApplicationStatus.INTERVIEW)).thenReturn(2L);
        when(repository.countByStatus(ApplicationStatus.OFFER)).thenReturn(1L);
        when(repository.countByStatus(ApplicationStatus.REJECTED)).thenReturn(3L);
        when(repository.countByStatus(ApplicationStatus.WITHDRAWN)).thenReturn(0L);
        when(repository.count()).thenReturn(11L);

        Map<String, Long> stats = service.getStats();

        assertThat(stats.get("APPLIED")).isEqualTo(5L);
        assertThat(stats.get("INTERVIEW")).isEqualTo(2L);
        assertThat(stats.get("OFFER")).isEqualTo(1L);
        assertThat(stats.get("REJECTED")).isEqualTo(3L);
        assertThat(stats.get("WITHDRAWN")).isEqualTo(0L);
        assertThat(stats.get("TOTAL")).isEqualTo(11L);
    }
}