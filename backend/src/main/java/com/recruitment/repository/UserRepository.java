package com.recruitment.repository;

import com.recruitment.entity.User;
import com.recruitment.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByRoleOrderByFirstNameAsc(Role role);
    List<User> findAllByActiveOrderByFirstNameAsc(boolean active);
    long countByRole(Role role);
    long countByActive(boolean active);
    long countByRoleAndActive(Role role, boolean active);
}
