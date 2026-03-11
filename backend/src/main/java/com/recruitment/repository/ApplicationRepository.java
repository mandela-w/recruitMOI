package com.recruitment.repository;

import com.recruitment.entity.Application;
import com.recruitment.entity.User;
import com.recruitment.enums.ApplicationStatus;
import com.recruitment.enums.EducationLevel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Optional<Application> findByUser(User user);
    boolean existsByUser(User user);
    long countByStatus(ApplicationStatus status);
    long countByEducationLevel(EducationLevel educationLevel);

    @Query("SELECT a FROM Application a ORDER BY a.firstName ASC")
    List<Application> findTop10ByOrderByFirstNameAsc(Pageable pageable);

    @Query("SELECT a FROM Application a ORDER BY a.firstName ASC")
    List<Application> findAllOrderByFirstNameAsc();

    @Query("SELECT a FROM Application a WHERE a.status = :status ORDER BY a.firstName ASC")
    List<Application> findAllByStatusOrderByFirstNameAsc(@Param("status") ApplicationStatus status);

    @Query("""
        SELECT a FROM Application a
        WHERE LOWER(a.firstName)  LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(a.lastName)   LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(a.nationalId) LIKE LOWER(CONCAT('%', :keyword, '%'))
        ORDER BY a.firstName ASC
        """)
    List<Application> searchByKeyword(@Param("keyword") String keyword);

    @Query("""
        SELECT FUNCTION('YEAR',  a.createdAt) AS year,
               FUNCTION('MONTH', a.createdAt) AS month,
               COUNT(a)                        AS count
        FROM Application a
        GROUP BY FUNCTION('YEAR', a.createdAt), FUNCTION('MONTH', a.createdAt)
        ORDER BY FUNCTION('YEAR', a.createdAt) ASC, FUNCTION('MONTH', a.createdAt) ASC
        """)
    List<Object[]> countApplicationsGroupedByMonth();

    @Query("""
        SELECT a.combinationOption, COUNT(a)
        FROM Application a
        WHERE a.educationLevel = 'HIGH_SCHOOL'
          AND a.combinationOption IS NOT NULL
        GROUP BY a.combinationOption
        ORDER BY COUNT(a) DESC
        """)
    List<Object[]> countByHighSchoolCombination();

    @Query("""
        SELECT a.fieldOfStudy, COUNT(a)
        FROM Application a
        WHERE a.educationLevel <> 'HIGH_SCHOOL'
          AND a.fieldOfStudy IS NOT NULL
        GROUP BY a.fieldOfStudy
        ORDER BY COUNT(a) DESC
        """)
    List<Object[]> countByUniversityFieldOfStudy();

    @Query("""
        SELECT a.educationLevel, COUNT(a)
        FROM Application a
        WHERE a.educationLevel IS NOT NULL
        GROUP BY a.educationLevel
        ORDER BY COUNT(a) DESC
        """)
    List<Object[]> countByEducationLevel();
}
