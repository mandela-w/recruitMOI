package com.recruitment.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MonthlyApplicationStatsResponse {
    private int year;
    private int month;
    private String monthName;
    private long count;
}
