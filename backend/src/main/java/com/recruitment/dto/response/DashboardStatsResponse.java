package com.recruitment.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalApplications;
    private long submitted;
    private long underReview;
    private long approved;
    private long rejected;
    private long totalUsers;
    private long totalApplicants;
    private long totalHrUsers;
    private long activeUsers;
}
