CREATE DATABASE IF NOT EXISTS products;

create table if not exists category
(
    id   bigint auto_increment
        primary key,
    name varchar(255) null
);

create table if not exists country
(
    id   bigint auto_increment
        primary key,
    name varchar(255) null
);

create table if not exists manufacturer
(
    id   bigint auto_increment
        primary key,
    name varchar(255) null
);

create table if not exists subcategory
(
    category_id bigint       null,
    id          bigint auto_increment
        primary key,
    name        varchar(255) null,
    constraint FKe4hdbsmrx9bs9gpj1fh4mg0ku
        foreign key (category_id) references category (id)
);

create table if not exists product
(
    in_stock            int            null,
    product_price       decimal(38, 2) null,
    category_id         bigint         not null,
    country_id          bigint         not null,
    date_added          datetime(6)    null,
    id                  bigint auto_increment
        primary key,
    manufacturer_id     bigint         not null,
    subcategory_id      bigint         null,
    product_sku_id      binary(16)     null,
    product_description text           null,
    product_name        varchar(255)   null,
    constraint FK1mtsbur82frn64de7balymq9s
        foreign key (category_id) references category (id),
    constraint FK89igr5j06uw5ps04djxgom0l1
        foreign key (manufacturer_id) references manufacturer (id),
    constraint FKku369nri8u3s17uom8or57trs
        foreign key (subcategory_id) references subcategory (id),
    constraint FKs6hiicggtpkrxno0fm2fhcquk
        foreign key (country_id) references country (id)
);

