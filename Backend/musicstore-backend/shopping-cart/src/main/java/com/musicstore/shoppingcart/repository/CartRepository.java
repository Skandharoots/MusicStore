package com.musicstore.shoppingcart.repository;

import com.musicstore.shoppingcart.model.Cart;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findAllByUserUuid(UUID userUuid);

    Optional<Cart> findCartById(Long id);

    Optional<Cart> findCartByUserUuidAndProductSkuId(UUID userUuid, UUID productSgid);

    void deleteAllByUserUuid(UUID userUuid);
}
