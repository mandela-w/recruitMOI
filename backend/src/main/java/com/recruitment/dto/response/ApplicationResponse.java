package com.recruitment.dto.response;

import com.recruitment.enums.ApplicationStatus;
import com.recruitment.enums.EducationLevel;
import com.recruitment.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ApplicationResponse {
    private UUID id;
    private UUID userId;

    // Personal
    private String nationalId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String nationality;
    private String phone;
    private String address;

    // Academic — shared
    private EducationLevel educationLevel;

    // HIGH_SCHOOL
    private String schoolName;
    private Integer graduationYear;
    private String combinationOption;
    private String aggregateScore;
    private String grade;

    // BACHELOR / MASTER / DOCTORATE
    private String institutionName;
    private String degreeTitle;
    private String fieldOfStudy;
    private Integer completionYear;
    private String classification;
    private String thesisTitle;

    // Application
    private String positionApplied;
    private String coverLetter;
    private String cvOriginalFilename;
    private ApplicationStatus status;
    private String reviewReason;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
