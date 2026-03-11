package com.recruitment.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsResponse {
    // Application funnel
    private long totalApplications;
    private List<ApplicationStatusCountResponse> byStatus;

    // Education level breakdown
    private List<EducationLevelStatsResponse> byEducationLevel;

    // High school combination breakdown
    private List<CombinationStatsResponse> topHighSchoolCombinations;

    // University field of study breakdown
    private List<CombinationStatsResponse> topUniversityFields;

    // Monthly trend
    private List<MonthlyApplicationStatsResponse> monthlyTrend;

    // User metrics
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long totalHrUsers;
    private long totalApplicants;

    // Rates 
    private double approvalRatePercent;
    private double rejectionRatePercent;
}
