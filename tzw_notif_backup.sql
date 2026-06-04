--
-- PostgreSQL database dump
--

\restrict PdwKMTIWrTIkzwkN9THn9Ab1MvgqbuQCjTwKX2ekDwPtzXjWozR3kmDlmpNyGWy

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
-- Name: NotifType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotifType" AS ENUM (
    'INSPECTION_SCHEDULED',
    'INSPECTION_OVERDUE',
    'MAINTENANCE_COMPLETED',
    'EXPIRY_ALERT',
    'PASSWORD_RESET',
    'GENERAL'
);


ALTER TYPE public."NotifType" OWNER TO postgres;

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
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "recipientId" text NOT NULL,
    type public."NotifType" NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
54374bc0-afa0-479d-8b1e-ad32315ee3f0	a5e36e93b1ef7d34667127bbac299eac0263c59f8a9aa1a6f7151b52dcd2e386	2026-06-03 08:08:01.050656+01	20260603070801_init	\N	\N	2026-06-03 08:08:01.015212+01	1
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "recipientId", type, title, body, "isRead", "readAt", "createdAt") FROM stdin;
89e00de5-ddc5-4cd9-9154-03a43b6d010e	15d8541f-8a01-4b55-8aca-61258b669cb1	INSPECTION_SCHEDULED	Inspection Assigned	Inspection scheduled for SN-ACT05 on Wed Jun 24 2026 at 13:00.	f	\N	2026-06-04 09:34:16.277
7133f032-b370-453a-9d9c-7b97beb99995	31ce186c-2223-4701-b657-b65aca5d15e1	MAINTENANCE_COMPLETED	Maintenance Logged	Maintenance completed for SN-ACT01 by Bob Inspector. Status restored to ACTIVE.	t	2026-05-25 09:34:16.258	2026-06-04 09:34:16.277
8c4814c4-8f55-4c9c-a63f-075f9a567992	31ce186c-2223-4701-b657-b65aca5d15e1	EXPIRY_ALERT	Extinguisher Expired Alert	Fire extinguisher SN-EXP01 has passed its expiration date. Please service immediately.	t	2026-05-25 09:34:16.258	2026-06-04 09:34:16.277
ff763ac8-0fee-4fbe-b0d0-97c8f5182eb3	06149201-a3db-44ae-b57a-4ff0d9803292	GENERAL	Welcome to TZW FEMS	Welcome to the new Fire Extinguisher Management System.	t	2026-05-25 09:34:16.258	2026-06-04 09:34:16.277
bcca95d4-d29d-49ed-abd4-90f9ea2b04ac	06149201-a3db-44ae-b57a-4ff0d9803292	INSPECTION_SCHEDULED	Inspection Assigned	Inspection scheduled for SN-ACT04 on Sun Jun 14 2026 at 09:00.	t	2026-06-04 09:48:05.453	2026-06-04 09:34:16.277
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict PdwKMTIWrTIkzwkN9THn9Ab1MvgqbuQCjTwKX2ekDwPtzXjWozR3kmDlmpNyGWy

