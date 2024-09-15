package com.musicstore.shoppingcart.repository;

import com.musicstore.shoppingcart.model.Cart;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findAllByUserUuid(UUID userUuid);

    Optional<Cart> findCartById(Long id);

    Optional<Cart> findCartByUserUuidAndProductSkuId(UUID userUuid, UUID productSgid);

    void deleteAllByUserUuid(UUID userUuid);
}
