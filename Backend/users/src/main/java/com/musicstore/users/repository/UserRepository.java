package com.musicstore.users.repository;


import com.musicstore.users.model.Users;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    Optional<Users> findByUuid(UUID uuid);

    @Transactional
    @Modifying
    @Query("UPDATE Users u SET u.firstName = ?2, " +
            "u.lastName = ?3, u.email = ?4, u.password = ?5 " +
            "WHERE u.uuid = ?1")
    void updateUser(UUID uuid, String firstName, String lastName, String email, String password);

    @Transactional
    @Modifying
    @Query("UPDATE Users u " +
            "SET u.enabled = TRUE " +
            "WHERE u.email = ?1")
    void enableUser(String email);

    @Transactional
    @Modifying
    void deleteByUuid(UUID uuid);
}
