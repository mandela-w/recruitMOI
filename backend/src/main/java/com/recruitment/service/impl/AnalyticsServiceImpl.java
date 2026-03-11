package com.recruitment.service.impl;

import com.recruitment.dto.response.*;
import com.recruitment.enums.ApplicationStatus;
import com.recruitment.enums.EducationLevel;
import com.recruitment.enums.Role;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.UserRepository;
import com.recruitment.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Month;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AnalyticsResponse getFullAnalytics() {
        long total = applicationRepository.count();

        // Per-status breakdown 
        List<ApplicationStatusCountResponse> byStatus = Arrays.stream(ApplicationStatus.values())
                .map(status -> {
                    long count = applicationRepository.countByStatus(status);
                    return ApplicationStatusCountResponse.builder()
                            .status(status)
                            .count(count)
                            .percentage(percent(count, total))
                            .build();
                })
                .collect(Collectors.toList());

        // Education level breakdown 
        List<EducationLevelStatsResponse> byEducationLevel = applicationRepository.countByEducationLevel()
                .stream()
                .map(row -> {
                    EducationLevel level = EducationLevel.valueOf((String) row[0]);
                    long count = ((Number) row[1]).longValue();
                    return EducationLevelStatsResponse.builder()
                            .educationLevel(level)
                            .count(count)
                            .percentage(percent(count, total))
                            .build();
                })
                .collect(Collectors.toList());

        // High school combination breakdown 
        List<Object[]> combinationRaw = applicationRepository.countByHighSchoolCombination();
        long combinationTotal = combinationRaw.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        List<CombinationStatsResponse> topHighSchoolCombinations = combinationRaw.stream()
                .map(row -> CombinationStatsResponse.builder()
                        .combination((String) row[0])
                        .count(((Number) row[1]).longValue())
                        .percentage(percent(((Number) row[1]).longValue(), combinationTotal))
                        .build())
                .collect(Collectors.toList());

        // University field of study breakdown 
        List<Object[]> fieldRaw = applicationRepository.countByUniversityFieldOfStudy();
        long fieldTotal = fieldRaw.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        List<CombinationStatsResponse> topUniversityFields = fieldRaw.stream()
                .map(row -> CombinationStatsResponse.builder()
                        .combination((String) row[0])
                        .count(((Number) row[1]).longValue())
                        .percentage(percent(((Number) row[1]).longValue(), fieldTotal))
                        .build())
                .collect(Collectors.toList());

        // Monthly trend
        List<MonthlyApplicationStatsResponse> monthlyTrend = applicationRepository
                .countApplicationsGroupedByMonth()
                .stream()
                .map(row -> MonthlyApplicationStatsResponse.builder()
                        .year(((Number) row[0]).intValue())
                        .month(((Number) row[1]).intValue())
                        .monthName(Month.of(((Number) row[1]).intValue()).name())
                        .count(((Number) row[2]).longValue())
                        .build())
                .collect(Collectors.toList());

        // User metrics 
        long totalUsers  = userRepository.count();
        long activeUsers = userRepository.countByActive(true);

        // Approval / rejection rates 
        long approved  = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        long rejected  = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long finalized = approved + rejected;

        return AnalyticsResponse.builder()
                .totalApplications(total)
                .byStatus(byStatus)
                .byEducationLevel(byEducationLevel)
                .topHighSchoolCombinations(topHighSchoolCombinations)
                .topUniversityFields(topUniversityFields)
                .monthlyTrend(monthlyTrend)
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(totalUsers - activeUsers)
                .totalHrUsers(userRepository.countByRole(Role.HR))
                .totalApplicants(userRepository.countByRole(Role.APPLICANT))
                .approvalRatePercent(percent(approved, finalized))
                .rejectionRatePercent(percent(rejected, finalized))
                .build();
    }

    private double percent(long part, long total) {
        if (total == 0) return 0.0;
        return Math.round((part * 100.0 / total) * 100.0) / 100.0;
    }
}
