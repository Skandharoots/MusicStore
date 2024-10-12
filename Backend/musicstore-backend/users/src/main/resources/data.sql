SELECT 'CREATE DATABASE postgres' WHERE NOT EXISTS (SELECT FROM postgres WHERE datname = 'postgres')\gexec;

create table IF NOT EXISTS public.users
(
    id         bigint not null
        primary key,
    email      varchar(255),
    enabled    boolean,
    first_name varchar(255),
    last_name  varchar(255),
    locked     boolean,
    password   varchar(255),
    user_role  varchar(255)
        constraint users_user_role_check
            check ((user_role)::text = ANY ((ARRAY ['USER'::character varying, 'ADMIN'::character varying])::text[])),
    uuid       uuid
);

alter table public.users
    owner to postgres;

create table IF NOT EXISTS public.confirmation_token
(
    id           bigint       not null
        primary key,
    confirmed_at timestamp(6),
    created_at   timestamp(6) not null,
    expires_at   timestamp(6) not null,
    token        varchar(255) not null,
    user_id      bigint       not null
        constraint fkah4p1rycwibwm6s9bsyeckq51
            references public.users
);

alter table public.confirmation_token
    owner to postgres;

