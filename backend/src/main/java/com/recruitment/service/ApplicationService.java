package com.recruitment.service;

import com.recruitment.dto.request.ApplicationReviewRequest;
import com.recruitment.dto.request.ApplicationSubmitRequest;
import com.recruitment.dto.request.UpdateApplicationRequest;
import com.recruitment.dto.response.ApplicationResponse;
import com.recruitment.enums.ApplicationStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {
    // Applicant
    ApplicationResponse submitApplication(ApplicationSubmitRequest request, MultipartFile cvFile, String userEmail);
    ApplicationResponse getMyApplication(String userEmail);
    ApplicationResponse updateMyApplication(UpdateApplicationRequest request, MultipartFile cvFile, String userEmail);

    // HR / Admin
    List<ApplicationResponse> getTop10Applications();
    List<ApplicationResponse> getAllApplications();
    List<ApplicationResponse> getApplicationsByStatus(ApplicationStatus status);
    List<ApplicationResponse> searchApplications(String keyword);
    ApplicationResponse getApplicationById(UUID applicationId);
    ApplicationResponse reviewApplication(UUID applicationId, ApplicationReviewRequest request, String reviewerEmail);
}
