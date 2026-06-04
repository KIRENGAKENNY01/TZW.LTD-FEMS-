--
-- PostgreSQL database dump
--

\restrict b0uAOR3NnXHzfXKkefi0awN6CdscI36O2B3lYYhxYiuJgT90v31HbqazkRGESg2

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: password_resets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_resets (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_resets OWNER TO postgres;

--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
464b7c1a-032f-4c77-9323-8847dc36b068	98537624bea0edb7612b15e74d999d2d03b25da21d83d2cb4280b6fd7541c30c	2026-06-03 08:07:50.954039+01	20260603070750_init	\N	\N	2026-06-03 08:07:50.913934+01	1
772584c4-cf63-4d8b-a462-9fbba5929575	0261e0c98e3a2a876ab54c3d72ce783cdb0e65d60d74c6e952e18b1fb9b32586	2026-06-03 09:56:02.074404+01	20260603120000_remove_phone_department	\N	\N	2026-06-03 09:56:02.045534+01	1
\.


--
-- Data for Name: password_resets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_resets (id, "userId", token, "expiresAt", used, "createdAt") FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, "userId", "firstName", "lastName", "updatedAt") FROM stdin;
17882608-970e-4708-81cc-24f5e3b3525a	31ce186c-2223-4701-b657-b65aca5d15e1	Admin	Safety	2026-06-04 09:34:16.232
6b8b06bf-5d95-490f-88c6-6458047e5896	06149201-a3db-44ae-b57a-4ff0d9803292	Bob	Inspector	2026-06-04 09:34:16.232
8b88d90c-2848-46c3-b01a-4c2df516cf48	15d8541f-8a01-4b55-8aca-61258b669cb1	Alice	Inspector	2026-06-04 09:34:16.232
3da090f1-f6f5-4a7d-8100-18b2ecc4b4f4	ab8a647e-bd91-459b-953e-433ab7fdc87b	John	Facilities	2026-06-04 09:34:16.232
e31f591a-6071-4de1-a5ee-28802abaadc3	0722cf6f-00a7-462d-a079-8eee79b9fef2	Jane	Facilities	2026-06-04 09:34:16.232
213294f8-0a1f-4677-ae58-e70aee5ad9c8	77dd5815-b619-41cc-874c-eac488bdcbda	Cyubahiro	Emmy	2026-06-04 09:42:49.951
19a65a8f-2ab7-4153-a89e-811720ae7f28	86656693-9e33-429b-8bd0-385ace46c325	Mucyo	Ivan	2026-06-04 10:18:01.036
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: password_resets_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_resets_token_key ON public.password_resets USING btree (token);


--
-- Name: user_profiles_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "user_profiles_userId_key" ON public.user_profiles USING btree ("userId");


--
-- Name: password_resets password_resets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT "password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.user_profiles("userId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict b0uAOR3NnXHzfXKkefi0awN6CdscI36O2B3lYYhxYiuJgT90v31HbqazkRGESg2

