package com.recruitment.dto.response;

import com.recruitment.enums.EducationLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NesaLookupResponse {
    private String nationalId;
    private EducationLevel educationLevel;

    // HIGH_SCHOOL fields
    private String schoolName;
    private Integer graduationYear;
    private String combinationOption;   
    private String aggregateScore;      
    private String grade;               

    // BACHELOR / MASTER / DOCTORATE fields
    private String institutionName;     
    private String degreeTitle;         
    private String fieldOfStudy;        
    private Integer completionYear;
    private String classification;      

    // MASTER / DOCTORATE extra
    private String thesisTitle;         
}
