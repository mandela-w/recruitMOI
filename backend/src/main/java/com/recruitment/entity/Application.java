package com.recruitment.entity;

import com.recruitment.enums.ApplicationStatus;
import com.recruitment.enums.EducationLevel;
import com.recruitment.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Personal Info from NID simulation 
    @Column(name = "national_id", unique = true)
    private String nationalId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column
    private String nationality;

    @Column
    private String phone;

    @Column
    private String address;

    //Academic Info from NESA simulation

    @Enumerated(EnumType.STRING)
    @Column(name = "education_level")
    private EducationLevel educationLevel;

    // HIGH_SCHOOL fields
    @Column(name = "school_name")
    private String schoolName;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "combination_option")
    private String combinationOption;

    @Column(name = "aggregate_score")
    private String aggregateScore;

    @Column(name = "grade")
    private String grade;

    // BACHELOR / MASTER / DOCTORATE fields
    @Column(name = "institution_name")
    private String institutionName;

    @Column(name = "degree_title")
    private String degreeTitle;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @Column(name = "completion_year")
    private Integer completionYear;

    @Column(name = "classification")
    private String classification;

    @Column(name = "thesis_title")
    private String thesisTitle;

    // Application details
    @Column(name = "position_applied")
    private String positionApplied;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "cv_file_path")
    private String cvFilePath;

    @Column(name = "cv_original_filename")
    private String cvOriginalFilename;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    // Review details — set by HR
    @Column(name = "review_reason", columnDefinition = "TEXT")
    private String reviewReason;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
}
