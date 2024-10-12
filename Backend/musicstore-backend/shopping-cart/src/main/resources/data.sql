CREATE DATABASE IF NOT EXISTS shoppingcarts;

create table if not exists cart
(
    product_price  decimal(38, 2) null,
    quantity       int            null,
    id             bigint         not null
        primary key,
    product_sku_id binary(16)     null,
    user_uuid      binary(16)     null,
    product_name   varchar(255)   null
);

create table if not exists cart_seq
(
    next_val bigint null
);

