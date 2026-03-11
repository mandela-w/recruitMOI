package com.recruitment.simulation;

import com.recruitment.dto.response.NesaLookupResponse;
import com.recruitment.enums.EducationLevel;
import com.recruitment.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class NesaSimulationService {

    private static final Map<String, NesaLookupResponse> NESA_DATABASE = new HashMap<>();

    static {

        // HIGH SCHOOL entries 

        NESA_DATABASE.put("1199880012345678", NesaLookupResponse.builder()
                .nationalId("1199880012345678")
                .educationLevel(EducationLevel.HIGH_SCHOOL)
                .schoolName("Groupe Scolaire Officiel de Butare")
                .graduationYear(2016)
                .combinationOption("MCB - Mathematics, Chemistry, Biology")
                .aggregateScore("4")
                .grade("Division I")
                .build());

        NESA_DATABASE.put("1200190098765432", NesaLookupResponse.builder()
                .nationalId("1200190098765432")
                .educationLevel(EducationLevel.HIGH_SCHOOL)
                .schoolName("Lycee de Kigali")
                .graduationYear(2019)
                .combinationOption("PCM - Physics, Chemistry, Mathematics")
                .aggregateScore("6")
                .grade("Division I")
                .build());

        NESA_DATABASE.put("1200290034561890", NesaLookupResponse.builder()
                .nationalId("1200290034561890")
                .educationLevel(EducationLevel.HIGH_SCHOOL)
                .schoolName("Maranyundo Girls School")
                .graduationYear(2020)
                .combinationOption("MEG - Mathematics, Economics, Geography")
                .aggregateScore("5")
                .grade("Division I")
                .build());

        NESA_DATABASE.put("1199960078903456", NesaLookupResponse.builder()
                .nationalId("1199960078903456")
                .educationLevel(EducationLevel.HIGH_SCHOOL)
                .schoolName("College Saint Andre")
                .graduationYear(2014)
                .combinationOption("PCB - Physics, Chemistry, Biology")
                .aggregateScore("8")
                .grade("Division II")
                .build());

        NESA_DATABASE.put("1200090011223344", NesaLookupResponse.builder()
                .nationalId("1200090011223344")
                .educationLevel(EducationLevel.HIGH_SCHOOL)
                .schoolName("Ecole Secondaire de Nyagatare")
                .graduationYear(2018)
                .combinationOption("HEG - History, Economics, Geography")
                .aggregateScore("10")
                .grade("Division II")
                .build());

        // BACHELOR entries 

        NESA_DATABASE.put("1199750056781234", NesaLookupResponse.builder()
                .nationalId("1199750056781234")
                .educationLevel(EducationLevel.BACHELOR)
                .institutionName("University of Rwanda — College of Science and Technology")
                .degreeTitle("Bachelor of Science in Computer Science")
                .fieldOfStudy("Computer Science")
                .completionYear(2022)
                .classification("First Class Honours")
                .build());

        NESA_DATABASE.put("1199850067891234", NesaLookupResponse.builder()
                .nationalId("1199850067891234")
                .educationLevel(EducationLevel.BACHELOR)
                .institutionName("Adventist University of Central Africa (AUCA)")
                .degreeTitle("Bachelor of Business Administration")
                .fieldOfStudy("Business Administration")
                .completionYear(2021)
                .classification("Upper Second Class Honours")
                .build());

        NESA_DATABASE.put("1199920089012345", NesaLookupResponse.builder()
                .nationalId("1199920089012345")
                .educationLevel(EducationLevel.BACHELOR)
                .institutionName("University of Rwanda — College of Medicine and Health Sciences")
                .degreeTitle("Bachelor of Science in Nursing")
                .fieldOfStudy("Nursing")
                .completionYear(2020)
                .classification("First Class Honours")
                .build());

        NESA_DATABASE.put("1199780045671234", NesaLookupResponse.builder()
                .nationalId("1199780045671234")
                .educationLevel(EducationLevel.BACHELOR)
                .institutionName("Kigali Independent University (ULK)")
                .degreeTitle("Bachelor of Laws (LLB)")
                .fieldOfStudy("Law")
                .completionYear(2019)
                .classification("Second Class Honours")
                .build());

        NESA_DATABASE.put("1199930012340987", NesaLookupResponse.builder()
                .nationalId("1199930012340987")
                .educationLevel(EducationLevel.BACHELOR)
                .institutionName("Institut d'Enseignement Superieur de Ruhengeri (INES)")
                .degreeTitle("Bachelor of Science in Civil Engineering")
                .fieldOfStudy("Civil Engineering")
                .completionYear(2023)
                .classification("First Class Honours")
                .build());

        // MASTER entries

        NESA_DATABASE.put("1198960034562345", NesaLookupResponse.builder()
                .nationalId("1198960034562345")
                .educationLevel(EducationLevel.MASTER)
                .institutionName("University of Rwanda — School of Graduate Studies")
                .degreeTitle("Master of Science in Information Technology")
                .fieldOfStudy("Information Technology")
                .completionYear(2021)
                .classification("Distinction")
                .thesisTitle("Machine Learning Approaches for Crop Disease Detection in Rwanda")
                .build());

        NESA_DATABASE.put("1199050023451234", NesaLookupResponse.builder()
                .nationalId("1199050023451234")
                .educationLevel(EducationLevel.MASTER)
                .institutionName("Carnegie Mellon University Africa")
                .degreeTitle("Master of Science in Engineering — Electrical and Computer Engineering")
                .fieldOfStudy("Electrical and Computer Engineering")
                .completionYear(2022)
                .classification("Distinction")
                .thesisTitle("Low-Power IoT Sensor Networks for Smart Agriculture")
                .build());

        NESA_DATABASE.put("1199150078904567", NesaLookupResponse.builder()
                .nationalId("1199150078904567")
                .educationLevel(EducationLevel.MASTER)
                .institutionName("African Leadership University (ALU)")
                .degreeTitle("Master of Business Administration (MBA)")
                .fieldOfStudy("Business Administration")
                .completionYear(2023)
                .classification("Merit")
                .build());

        // DOCTORATE entries 

        NESA_DATABASE.put("1198750056780001", NesaLookupResponse.builder()
                .nationalId("1198750056780001")
                .educationLevel(EducationLevel.DOCTORATE)
                .institutionName("University of Rwanda — Doctoral School")
                .degreeTitle("Doctor of Philosophy in Public Health")
                .fieldOfStudy("Public Health")
                .completionYear(2020)
                .classification("Pass with Distinction")
                .thesisTitle("Community Health Interventions and Maternal Mortality Reduction in Rural Rwanda")
                .build());

        NESA_DATABASE.put("1198850045670002", NesaLookupResponse.builder()
                .nationalId("1198850045670002")
                .educationLevel(EducationLevel.DOCTORATE)
                .institutionName("Jomo Kenyatta University of Agriculture and Technology (JKUAT)")
                .degreeTitle("Doctor of Philosophy in Computer Science")
                .fieldOfStudy("Computer Science")
                .completionYear(2019)
                .classification("Pass")
                .thesisTitle("Federated Learning Architectures for Privacy-Preserving Healthcare Analytics in Sub-Saharan Africa")
                .build());
    }

    public NesaLookupResponse lookupByNationalId(String nationalId) {
        NesaLookupResponse result = NESA_DATABASE.get(nationalId);
        if (result == null) {
            throw new ResourceNotFoundException(
                    "No academic record found for NID: " + nationalId +
                    ". Please verify your National ID number."
            );
        }
        return result;
    }
}
