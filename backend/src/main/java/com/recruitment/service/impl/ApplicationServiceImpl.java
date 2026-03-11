package com.recruitment.service.impl;

import com.recruitment.dto.request.ApplicationReviewRequest;
import com.recruitment.dto.request.ApplicationSubmitRequest;
import com.recruitment.dto.request.UpdateApplicationRequest;
import com.recruitment.dto.response.ApplicationResponse;
import com.recruitment.dto.response.NesaLookupResponse;
import com.recruitment.dto.response.NidLookupResponse;
import com.recruitment.entity.Application;
import com.recruitment.entity.User;
import com.recruitment.enums.ApplicationStatus;
import com.recruitment.enums.EducationLevel;
import com.recruitment.exception.BadRequestException;
import com.recruitment.exception.ConflictException;
import com.recruitment.exception.ResourceNotFoundException;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.UserRepository;
import com.recruitment.service.ApplicationService;
import com.recruitment.service.EmailService;
import com.recruitment.simulation.NesaSimulationService;
import com.recruitment.simulation.NidSimulationService;
import com.recruitment.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NidSimulationService nidService;
    private final NesaSimulationService nesaService;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    @Override
    @Transactional
    public ApplicationResponse submitApplication(
            ApplicationSubmitRequest request,
            MultipartFile cvFile,
            String userEmail
    ) {
        User user = findUserByEmail(userEmail);

        if (applicationRepository.existsByUser(user)) {
            throw new ConflictException("You have already submitted an application. You cannot apply more than once.");
        }

        NidLookupResponse  nidData  = nidService.lookupByNationalId(request.getNationalId());
        NesaLookupResponse nesaData = nesaService.lookupByNationalId(request.getNationalId());
        String cvFilePath = fileStorageService.storeFile(cvFile, user.getId().toString());

        Application.ApplicationBuilder builder = Application.builder()
                .user(user)
                .nationalId(nidData.getNationalId())
                .firstName(nidData.getFirstName())
                .lastName(nidData.getLastName())
                .dateOfBirth(nidData.getDateOfBirth())
                .gender(nidData.getGender())
                .nationality(nidData.getNationality())
                .phone(request.getPhone())
                .address(request.getAddress())
                .educationLevel(nesaData.getEducationLevel())
                .positionApplied(request.getPositionApplied())
                .coverLetter(request.getCoverLetter())
                .cvFilePath(cvFilePath)
                .cvOriginalFilename(cvFile.getOriginalFilename())
                .status(ApplicationStatus.SUBMITTED);

        applyEducationFields(builder, nesaData);

        Application saved = applicationRepository.save(builder.build());
        log.info("Application submitted for user: {}", userEmail);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getMyApplication(String userEmail) {
        User user = findUserByEmail(userEmail);
        return applicationRepository.findByUser(user)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("You have not submitted an application yet."));
    }

    @Override
    @Transactional
    public ApplicationResponse updateMyApplication(
            UpdateApplicationRequest request,
            MultipartFile cvFile,
            String userEmail
    ) {
        User user = findUserByEmail(userEmail);
        Application application = applicationRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("No application found to update."));

        if (application.getStatus() != ApplicationStatus.SUBMITTED) {
            throw new BadRequestException("Your application is already under review and can no longer be edited.");
        }

        if (request.getPositionApplied() != null) application.setPositionApplied(request.getPositionApplied());
        if (request.getCoverLetter()     != null) application.setCoverLetter(request.getCoverLetter());
        if (request.getPhone()           != null) application.setPhone(request.getPhone());
        if (request.getAddress()         != null) application.setAddress(request.getAddress());

        if (cvFile != null && !cvFile.isEmpty()) {
            fileStorageService.deleteFile(application.getCvFilePath());
            application.setCvFilePath(fileStorageService.storeFile(cvFile, user.getId().toString()));
            application.setCvOriginalFilename(cvFile.getOriginalFilename());
        }

        return toResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getTop10Applications() {
        return applicationRepository.findTop10ByOrderByFirstNameAsc(PageRequest.of(0, 10))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAllOrderByFirstNameAsc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByStatus(ApplicationStatus status) {
        return applicationRepository.findAllByStatusOrderByFirstNameAsc(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> searchApplications(String keyword) {
        if (keyword == null || keyword.isBlank()) return getAllApplications();
        return applicationRepository.searchByKeyword(keyword.trim())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(UUID applicationId) {
        return applicationRepository.findById(applicationId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));
    }

    @Override
    @Transactional
    public ApplicationResponse reviewApplication(
            UUID applicationId,
            ApplicationReviewRequest request,
            String reviewerEmail
    ) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        ApplicationStatus newStatus = request.getStatus();

        if (newStatus == ApplicationStatus.SUBMITTED) {
            throw new BadRequestException("Cannot set status back to SUBMITTED.");
        }
        if (application.getStatus() == ApplicationStatus.APPROVED
                || application.getStatus() == ApplicationStatus.REJECTED) {
            throw new BadRequestException("This application is already finalized and cannot be reviewed again.");
        }

        application.setStatus(newStatus);
        application.setReviewReason(request.getReason());
        application.setReviewedBy(reviewerEmail);
        application.setReviewedAt(LocalDateTime.now());

        Application updated = applicationRepository.save(application);
        log.info("Application {} → {} by {}", applicationId, newStatus, reviewerEmail);

        emailService.sendApplicationStatusUpdate(
                application.getUser().getEmail(),
                application.getFirstName(),
                newStatus.name(),
                request.getReason()
        );

        return toResponse(updated);
    }

    
    private void applyEducationFields(Application.ApplicationBuilder builder, NesaLookupResponse nesaData) {
        if (nesaData.getEducationLevel() == EducationLevel.HIGH_SCHOOL) {
            builder
                    .schoolName(nesaData.getSchoolName())
                    .graduationYear(nesaData.getGraduationYear())
                    .combinationOption(nesaData.getCombinationOption())
                    .aggregateScore(nesaData.getAggregateScore())
                    .grade(nesaData.getGrade());
        } else {
            // BACHELOR, MASTER, DOCTORATE
            builder
                    .institutionName(nesaData.getInstitutionName())
                    .degreeTitle(nesaData.getDegreeTitle())
                    .fieldOfStudy(nesaData.getFieldOfStudy())
                    .completionYear(nesaData.getCompletionYear())
                    .classification(nesaData.getClassification())
                    .thesisTitle(nesaData.getThesisTitle());
        }
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private ApplicationResponse toResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .nationalId(app.getNationalId())
                .firstName(app.getFirstName())
                .lastName(app.getLastName())
                .dateOfBirth(app.getDateOfBirth())
                .gender(app.getGender())
                .nationality(app.getNationality())
                .phone(app.getPhone())
                .address(app.getAddress())
                .educationLevel(app.getEducationLevel())
                // HIGH_SCHOOL fields
                .schoolName(app.getSchoolName())
                .graduationYear(app.getGraduationYear())
                .combinationOption(app.getCombinationOption())
                .aggregateScore(app.getAggregateScore())
                .grade(app.getGrade())
                // BACHELOR / MASTER / DOCTORATE fields
                .institutionName(app.getInstitutionName())
                .degreeTitle(app.getDegreeTitle())
                .fieldOfStudy(app.getFieldOfStudy())
                .completionYear(app.getCompletionYear())
                .classification(app.getClassification())
                .thesisTitle(app.getThesisTitle())
                // Application meta
                .positionApplied(app.getPositionApplied())
                .coverLetter(app.getCoverLetter())
                .cvOriginalFilename(app.getCvOriginalFilename())
                .status(app.getStatus())
                .reviewReason(app.getReviewReason())
                .reviewedBy(app.getReviewedBy())
                .reviewedAt(app.getReviewedAt())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
