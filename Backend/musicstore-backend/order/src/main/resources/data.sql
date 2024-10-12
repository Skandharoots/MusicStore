CREATE DATABASE IF NOT EXISTS orders;

create table if not exists order_forms
(
    status           tinyint        null,
    total_price      decimal(38, 2) null,
    date_created     datetime(6)    null,
    id               bigint         not null
        primary key,
    order_identifier binary(16)     null,
    user_identifier  binary(16)     null,
    city             varchar(255)   null,
    country          varchar(255)   null,
    email            varchar(255)   null,
    name             varchar(255)   null,
    phone            varchar(255)   null,
    street_address   varchar(255)   null,
    surname          varchar(255)   null,
    zip_code         varchar(255)   null
);

create table if not exists order_forms_seq
(
    next_val bigint null
);

create table if not exists order_items
(
    quantity       int            null,
    unit_price     decimal(38, 2) null,
    id             bigint auto_increment
        primary key,
    product_sku_id binary(16)     null,
    product_name   varchar(255)   null
);

create table if not exists order_forms_order_items
(
    order_id       bigint not null,
    order_items_id bigint not null,
    constraint UK_ac1b7bmjsudhabscpqqng7yxn
        unique (order_items_id),
    constraint FK83ato1o6s0116wnjgw0n4tra
        foreign key (order_id) references order_forms (id),
    constraint FKkvdreg7vbdl7hijcnw1fm2qn0
        foreign key (order_items_id) references order_items (id)
);

