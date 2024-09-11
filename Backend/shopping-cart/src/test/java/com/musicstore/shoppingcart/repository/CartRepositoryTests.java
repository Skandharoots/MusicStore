package com.musicstore.shoppingcart.repository;

import com.musicstore.shoppingcart.model.Cart;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class CartRepositoryTests {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void createCartTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        Cart savedCart = cartRepository.save(cart);
        Assertions.assertThat(savedCart).isNotNull();
        Assertions.assertThat(savedCart.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(savedCart.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(savedCart.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(savedCart.getProductName()).isEqualTo("Stratocaster Player MX Modern C");
        Assertions.assertThat(savedCart.getQuantity()).isEqualTo(2);
    }

    @Test
    public void findAllByUserUuidTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        UUID productSkuId2 = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);
        BigDecimal productPrice2 = BigDecimal.valueOf(449.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        Cart cart2 = new Cart(
                userUuid,
                productSkuId2,
                productPrice2,
                "Telecaster Player MX",
                4
        );

        entityManager.persist(cart);
        entityManager.persist(cart2);
        entityManager.flush();
        List<Cart> carts = cartRepository.findAllByUserUuid(userUuid);
        Assertions.assertThat(carts.size()).isEqualTo(2);
        Assertions.assertThat(carts.get(0).getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(carts.get(0).getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(carts.get(0).getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(carts.get(0).getProductName()).isEqualTo("Stratocaster Player MX Modern C");
        Assertions.assertThat(carts.get(0).getQuantity()).isEqualTo(2);
        Assertions.assertThat(carts.get(1).getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(carts.get(1).getProductSkuId()).isEqualTo(productSkuId2);
        Assertions.assertThat(carts.get(1).getProductPrice()).isEqualTo(productPrice2);
        Assertions.assertThat(carts.get(1).getProductName()).isEqualTo("Telecaster Player MX");
        Assertions.assertThat(carts.get(1).getQuantity()).isEqualTo(4);

    }

    @Test
    public void findCartByIdTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        entityManager.persist(cart);
        entityManager.flush();
        Optional<Cart> cartOptional = cartRepository.findCartById(cart.getId());
        Assertions.assertThat(cartOptional.isPresent()).isTrue();
        Assertions.assertThat(cartOptional.get().getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cartOptional.get().getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cartOptional.get().getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cartOptional.get().getProductName()).isEqualTo("Stratocaster Player MX Modern C");
        Assertions.assertThat(cartOptional.get().getQuantity()).isEqualTo(2);

    }

    @Test
    public void findCartByUserUuidAndProductSkuIdTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        entityManager.persist(cart);
        entityManager.flush();
        Optional<Cart> cartOptional = cartRepository.findCartByUserUuidAndProductSkuId(userUuid, productSkuId);
        Assertions.assertThat(cartOptional.isPresent()).isTrue();
        Assertions.assertThat(cartOptional.get().getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cartOptional.get().getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cartOptional.get().getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cartOptional.get().getProductName()).isEqualTo("Stratocaster Player MX Modern C");
        Assertions.assertThat(cartOptional.get().getQuantity()).isEqualTo(2);

    }

    @Test
    public void deleteCartByUserUuidAndProductSkuIdTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );
        entityManager.persist(cart);
        entityManager.flush();
        Optional<Cart> cartSaved = cartRepository.findCartByUserUuidAndProductSkuId(userUuid, productSkuId);
        Assertions.assertThat(cartSaved.isPresent()).isTrue();


        cartRepository.deleteCartByUserUuidAndProductSkuId(userUuid, productSkuId);
        entityManager.flush();
        Optional<Cart> cartDeleted = cartRepository.findCartByUserUuidAndProductSkuId(userUuid, productSkuId);
        Assertions.assertThat(cartDeleted.isPresent()).isFalse();

    }

    @Test
    public void deleteCartByUserUuidTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        UUID productSkuId2 = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);
        BigDecimal productPrice2 = BigDecimal.valueOf(449.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        Cart cart2 = new Cart(
                userUuid,
                productSkuId2,
                productPrice2,
                "Telecaster Player MX",
                4
        );

        entityManager.persist(cart);
        entityManager.persist(cart2);
        entityManager.flush();

        List<Cart> carts = cartRepository.findAllByUserUuid(userUuid);
        Assertions.assertThat(carts.size()).isEqualTo(2);

        cartRepository.deleteAllByUserUuid(userUuid);
        entityManager.flush();
        carts = cartRepository.findAllByUserUuid(userUuid);
        Assertions.assertThat(carts.size()).isEqualTo(0);

    }

}
