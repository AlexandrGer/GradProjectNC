package com.grad.project.nc.persistence;

import com.grad.project.nc.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserDao extends CrudDao<User> {
    List<User> findByDomainId(Long domainId);

    void deleteUserRoles(Long userId);

    @Transactional
    void persistUserRoles(User user);

    Optional<User> findByEmail(String email);

    User findUserByProductOrderId(Long productOrderId);

    User findResponsibleByProductOrderId(Long productOrderId);

    User findUserByComplainId(Long complainId);

    User findResponsibleByComplainId(Long complainId);

    void addUserRole(Long userId, Long roleId);

    void deleteUserRole(Long userId, Long roleId);
}
