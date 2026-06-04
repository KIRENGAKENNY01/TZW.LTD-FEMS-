--
-- PostgreSQL database dump
--

\restrict ElNhb6lpgXAQgiA3tClUsJQLZGYV5iiXuJ7TuoZ5YBa5Ts2fY0Zc1YEiS3xwjrP

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

--
-- Name: ExtSize; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExtSize" AS ENUM (
    'LB_1_5',
    'LB_5',
    'LB_9',
    'LB_12',
    'LB_2_5'
);


ALTER TYPE public."ExtSize" OWNER TO postgres;

--
-- Name: ExtStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExtStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'EXPIRED',
    'UNDER_MAINTENANCE'
);


ALTER TYPE public."ExtStatus" OWNER TO postgres;

--
-- Name: ExtType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExtType" AS ENUM (
    'WATER',
    'CO2',
    'FOAM',
    'DRY_CHEMICAL'
);


ALTER TYPE public."ExtType" OWNER TO postgres;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."RequestStatus" OWNER TO postgres;

--
-- Name: RequestType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RequestType" AS ENUM (
    'NEW',
    'REPLACEMENT',
    'INSTALLATION'
);


ALTER TYPE public."RequestType" OWNER TO postgres;

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
-- Name: extinguisher_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.extinguisher_requests (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."RequestType" NOT NULL,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    details text,
    "adminComment" text,
    building text,
    floor text,
    location text,
    size public."ExtSize",
    "extinguisherType" public."ExtType",
    "extinguisherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.extinguisher_requests OWNER TO postgres;

--
-- Name: fire_extinguishers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fire_extinguishers (
    id text NOT NULL,
    "serialNumber" text NOT NULL,
    location text NOT NULL,
    building text,
    floor text,
    type public."ExtType" NOT NULL,
    size public."ExtSize" NOT NULL,
    "installationDate" date NOT NULL,
    "expiryDate" date NOT NULL,
    status public."ExtStatus" DEFAULT 'ACTIVE'::public."ExtStatus" NOT NULL,
    notes text,
    "registeredBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "assignedUserId" text,
    "inspectorId" text,
    "ownerUserId" text
);


ALTER TABLE public.fire_extinguishers OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d2855bd0-35a8-4de6-8c89-4e1ac5ac9f41	09b8317b92f15c6dea99485a591525d4fbc2a36661f61e8ced0ee1d99622192b	2026-06-03 08:07:53.61345+01	20260603070753_init	\N	\N	2026-06-03 08:07:53.580055+01	1
8643b5d7-06a2-4e54-906b-3d77b6eacdfc	a2887c951e2594531cc815a357dfae75b06d070ab6693a84301e668dc50686f7	2026-06-03 10:20:03.033911+01	20260603140000_add_assigned_user	\N	\N	2026-06-03 10:20:02.930425+01	1
\.


--
-- Data for Name: extinguisher_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.extinguisher_requests (id, "userId", type, status, details, "adminComment", building, floor, location, size, "extinguisherType", "extinguisherId", "createdAt", "updatedAt") FROM stdin;
a5d31665-0fda-418b-a901-afb5a204655b	df6e6abd-b9fd-4c21-a52f-2c0053e3c370	NEW	APPROVED	For emergency cases 	\N	Main Building	3	Next to Elevator	LB_5	CO2	\N	2026-06-03 11:30:30.89	2026-06-03 11:43:02.008
92baa7d2-628c-4f42-8f5b-be213c280cc6	77dd5815-b619-41cc-874c-eac488bdcbda	NEW	APPROVED	\N	\N	Main city hall	2	kicukiro 	LB_5	CO2	\N	2026-06-04 09:43:53.617	2026-06-04 09:45:07.331
6ba9cc22-7d1b-45d5-a4f8-08eb254719cb	77dd5815-b619-41cc-874c-eac488bdcbda	NEW	APPROVED	\N	\N	Main Building 	2	Kigali	LB_5	CO2	\N	2026-06-04 09:43:27.493	2026-06-04 09:45:22.229
6ea288f3-f3c3-4d1d-82b4-5ec144d60f28	86656693-9e33-429b-8bd0-385ace46c325	NEW	APPROVED	I want new fire extinguishers 	\N	Main Hall 	2	Kigali	LB_5	CO2	\N	2026-06-04 10:18:51.064	2026-06-04 10:20:18.121
\.


--
-- Data for Name: fire_extinguishers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fire_extinguishers (id, "serialNumber", location, building, floor, type, size, "installationDate", "expiryDate", status, notes, "registeredBy", "createdAt", "updatedAt", "assignedUserId", "inspectorId", "ownerUserId") FROM stdin;
1c23cb6f-965a-4ca2-b10a-3b5549c99a66	SN-001	kicukiro 	Main city hall	2	CO2	LB_5	2026-06-04	2027-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:45:07.342	2026-06-04 09:45:07.342	\N	\N	77dd5815-b619-41cc-874c-eac488bdcbda
b82a4b7a-e8f7-474b-afbe-12df26bf15ec	SN-045	Kigali	Main Hall 	2	CO2	LB_5	2026-06-02	2027-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 10:20:18.136	2026-06-04 10:20:18.136	\N	\N	86656693-9e33-429b-8bd0-385ace46c325
f112f3a5-895f-4704-9eda-f7d31b452fc1	SN-002	Kigali	Main Building 	2	CO2	LB_5	2026-06-04	2027-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:45:22.24	2026-06-04 10:22:55.725	\N	\N	77dd5815-b619-41cc-874c-eac488bdcbda
2730aaa9-d5ef-4bb9-a46a-0c888dd9e301	SN-ACT03	Building B, Floor 1 Server Room	Building B	1	CO2	LB_12	2026-06-04	2028-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.257	2026-06-04 09:49:36.51	\N	\N	\N
2b55bc07-9fb4-43dc-81fe-319689f5b206	SN-EXP01	Building A, Basement	Building A	0	CO2	LB_5	2024-06-04	2024-06-04	EXPIRED	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.243	2026-06-04 09:54:39.171	\N	\N	\N
f431f49e-617a-4d2c-aad0-97373b7ed63e	SN-048	Kigali	MAIN HALL 	2	CO2	LB_5	2026-06-03	2027-06-24	ACTIVE	Registered a new extigui	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 10:05:40.038	2026-06-04 10:05:40.038	\N	06149201-a3db-44ae-b57a-4ff0d9803292	77dd5815-b619-41cc-874c-eac488bdcbda
ec0ce3cf-79f9-4981-9c01-d179d8c2d8a5	SN-EXP02	Building B, Floor 1 Kitchen	Building B	1	FOAM	LB_9	2025-06-04	2025-06-04	EXPIRED	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.254	2026-06-04 09:34:16.254	\N	\N	\N
12445c7a-aa84-4945-8ef9-cbb6aab0069d	SN-SOON01	Building A, Floor 1 West Wing	Building A	1	WATER	LB_12	2025-06-04	2026-06-19	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.255	2026-06-04 09:34:16.255	\N	\N	\N
dac5556e-1256-404a-9b39-83f66c4eff81	SN-SOON02	Building B, Floor 2 Elevator Lobby	Building B	2	DRY_CHEMICAL	LB_1_5	2025-06-04	2026-06-29	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.255	2026-06-04 09:34:16.255	\N	\N	\N
67af6fe4-9f5d-4233-92d5-473c180cf802	SN-ACT01	Building A, Floor 2 Breakroom	Building A	2	CO2	LB_5	2026-06-04	2028-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.256	2026-06-04 09:34:16.256	\N	\N	\N
8c9c29d3-1ea7-424a-b145-31d40b53042e	SN-ACT02	Building A, Floor 3 Conference Room	Building A	3	DRY_CHEMICAL	LB_12	2026-06-04	2029-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.257	2026-06-04 09:34:16.257	\N	\N	\N
8b6d6f2e-2ab2-48de-ab7b-f7c98bbf21fc	SN-ACT04	Building B, Floor 2 Warehousing	Building B	2	FOAM	LB_9	2026-06-04	2029-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.258	2026-06-04 09:34:16.258	\N	\N	\N
4ddf7c16-26a3-4a7c-ac17-bbe426e97339	SN-ACT05	Building A, Reception	Building A	1	WATER	LB_5	2026-06-04	2028-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.258	2026-06-04 09:34:16.258	\N	\N	\N
7f68718d-eb1b-4854-adc4-02aa4954ac16	SN-ACT06	Building B, Loading Bay	Building B	1	DRY_CHEMICAL	LB_9	2026-06-04	2029-06-04	ACTIVE	\N	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-04 09:34:16.259	2026-06-04 09:34:16.259	\N	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: extinguisher_requests extinguisher_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.extinguisher_requests
    ADD CONSTRAINT extinguisher_requests_pkey PRIMARY KEY (id);


--
-- Name: fire_extinguishers fire_extinguishers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fire_extinguishers
    ADD CONSTRAINT fire_extinguishers_pkey PRIMARY KEY (id);


--
-- Name: extinguisher_requests_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX extinguisher_requests_status_idx ON public.extinguisher_requests USING btree (status);


--
-- Name: extinguisher_requests_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX extinguisher_requests_type_idx ON public.extinguisher_requests USING btree (type);


--
-- Name: extinguisher_requests_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "extinguisher_requests_userId_idx" ON public.extinguisher_requests USING btree ("userId");


--
-- Name: fire_extinguishers_assignedUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fire_extinguishers_assignedUserId_idx" ON public.fire_extinguishers USING btree ("assignedUserId");


--
-- Name: fire_extinguishers_expiryDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fire_extinguishers_expiryDate_idx" ON public.fire_extinguishers USING btree ("expiryDate");


--
-- Name: fire_extinguishers_inspectorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fire_extinguishers_inspectorId_idx" ON public.fire_extinguishers USING btree ("inspectorId");


--
-- Name: fire_extinguishers_ownerUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fire_extinguishers_ownerUserId_idx" ON public.fire_extinguishers USING btree ("ownerUserId");


--
-- Name: fire_extinguishers_serialNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "fire_extinguishers_serialNumber_key" ON public.fire_extinguishers USING btree ("serialNumber");


--
-- Name: fire_extinguishers_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fire_extinguishers_status_idx ON public.fire_extinguishers USING btree (status);


--
-- PostgreSQL database dump complete
--

\unrestrict ElNhb6lpgXAQgiA3tClUsJQLZGYV5iiXuJ7TuoZ5YBa5Ts2fY0Zc1YEiS3xwjrP

