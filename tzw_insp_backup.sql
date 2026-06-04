--
-- PostgreSQL database dump
--

\restrict 4p1SaUV8tCnAcxeCjRNfyEVcZZl9aV6HJ3BLGQGrJJjV1OX2DNd4KzRHe0NdBR1

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
-- Name: InspStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InspStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'OVERDUE',
    'CANCELLED',
    'REQUESTED'
);


ALTER TYPE public."InspStatus" OWNER TO postgres;

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
-- Name: inspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspections (
    id text NOT NULL,
    "extinguisherId" text NOT NULL,
    "inspectorId" text,
    "scheduledBy" text NOT NULL,
    "scheduledDate" date NOT NULL,
    "scheduledTime" text NOT NULL,
    status public."InspStatus" DEFAULT 'PENDING'::public."InspStatus" NOT NULL,
    result text,
    notes text,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.inspections OWNER TO postgres;

--
-- Name: maintenance_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_logs (
    id text NOT NULL,
    "extinguisherId" text NOT NULL,
    "inspectorId" text NOT NULL,
    "inspectionId" text NOT NULL,
    "actionTaken" text NOT NULL,
    "issuesIdentified" text,
    recommendations text,
    "maintenanceDate" date NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "conditionsNoted" text
);


ALTER TABLE public.maintenance_logs OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
08deb2c1-ed78-42c7-aef8-8406c63b9c7b	2413fb4fccae27fc978f41f6077df090a1a8df04522388296bf80d67e4df0755	2026-06-03 08:07:56.130772+01	20260603070756_init	\N	\N	2026-06-03 08:07:56.095583+01	1
\.


--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inspections (id, "extinguisherId", "inspectorId", "scheduledBy", "scheduledDate", "scheduledTime", status, result, notes, "completedAt", "createdAt", "updatedAt") FROM stdin;
91b31c97-8d18-47c7-8ab4-b2ced00d9290	b82a4b7a-e8f7-474b-afbe-12df26bf15ec	06149201-a3db-44ae-b57a-4ff0d9803292	86656693-9e33-429b-8bd0-385ace46c325	2026-06-05	09:00	PENDING	\N	TO 	\N	2026-06-04 10:21:16.144	2026-06-04 10:21:45.594
3223f580-13ab-4638-8e7a-ca9c45653692	f112f3a5-895f-4704-9eda-f7d31b452fc1	06149201-a3db-44ae-b57a-4ff0d9803292	77dd5815-b619-41cc-874c-eac488bdcbda	2026-06-03	09:00	COMPLETED	PASS	\N	2026-06-04 10:22:06.782	2026-06-04 09:45:55.277	2026-06-04 10:22:06.783
4f698e0a-7bb7-477f-a431-fe896129da68	2730aaa9-d5ef-4bb9-a46a-0c888dd9e301	06149201-a3db-44ae-b57a-4ff0d9803292	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-14	09:00	COMPLETED	PASS	\N	2026-06-04 09:48:37.901	2026-06-04 09:34:16.273	2026-06-04 09:48:37.903
88051bd9-7626-4423-a762-7650d43ee63b	2b55bc07-9fb4-43dc-81fe-319689f5b206	06149201-a3db-44ae-b57a-4ff0d9803292	31ce186c-2223-4701-b657-b65aca5d15e1	2026-05-30	10:00	COMPLETED	PASS	\N	2026-06-04 09:50:47.51	2026-06-04 09:34:16.275	2026-06-04 09:50:47.511
db4c082f-f554-40ad-b044-903ed04cf4d3	f431f49e-617a-4d2c-aad0-97373b7ed63e	15d8541f-8a01-4b55-8aca-61258b669cb1	77dd5815-b619-41cc-874c-eac488bdcbda	2026-06-05	09:00	PENDING	\N	It is not working	\N	2026-06-04 10:08:52.248	2026-06-04 10:10:32.195
e5acc171-2985-4e95-860f-8dcf1ab2f76c	f431f49e-617a-4d2c-aad0-97373b7ed63e	15d8541f-8a01-4b55-8aca-61258b669cb1	77dd5815-b619-41cc-874c-eac488bdcbda	2026-06-06	09:00	PENDING	\N	I want to replace it 	\N	2026-06-04 10:10:03.034	2026-06-04 10:10:39.788
77813867-8ba5-4e42-b833-141470f9412c	67af6fe4-9f5d-4233-92d5-473c180cf802	06149201-a3db-44ae-b57a-4ff0d9803292	31ce186c-2223-4701-b657-b65aca5d15e1	2026-05-25	09:00	COMPLETED	NEEDS_MAINTENANCE	\N	2026-05-25 09:34:16.258	2026-06-04 09:34:16.261	2026-06-04 09:34:16.261
c0752954-0d8a-478a-8f03-e36ce95ae3ad	8c9c29d3-1ea7-424a-b145-31d40b53042e	15d8541f-8a01-4b55-8aca-61258b669cb1	31ce186c-2223-4701-b657-b65aca5d15e1	2026-05-25	11:00	COMPLETED	PASS	\N	2026-05-25 09:34:16.258	2026-06-04 09:34:16.273	2026-06-04 09:34:16.273
b6af523e-0049-4a7e-8216-97b48ef5d43a	8b6d6f2e-2ab2-48de-ab7b-f7c98bbf21fc	15d8541f-8a01-4b55-8aca-61258b669cb1	31ce186c-2223-4701-b657-b65aca5d15e1	2026-06-24	13:00	PENDING	\N	\N	\N	2026-06-04 09:34:16.274	2026-06-04 09:34:16.274
\.


--
-- Data for Name: maintenance_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_logs (id, "extinguisherId", "inspectorId", "inspectionId", "actionTaken", "issuesIdentified", recommendations, "maintenanceDate", "createdAt", "conditionsNoted") FROM stdin;
3003a7da-dc6b-4336-b121-dd4f20efc716	67af6fe4-9f5d-4233-92d5-473c180cf802	06149201-a3db-44ae-b57a-4ff0d9803292	77813867-8ba5-4e42-b833-141470f9412c	Replaced discharge hose and recharged CO2 canister.	Cracked hose, low pressure	Schedule re-inspection in 6 months	2026-05-25	2026-06-04 09:34:16.271	\N
f74b2af5-92e1-4d8a-a0d0-399583bfce93	2730aaa9-d5ef-4bb9-a46a-0c888dd9e301	06149201-a3db-44ae-b57a-4ff0d9803292	4f698e0a-7bb7-477f-a431-fe896129da68	REPLACED THE FIRE EXTINGUISHER	THE FIRE EXTINGUISHER WAS EMPTY	TO CHECK REGULARLY IF FIRE EXTINGUISHERS ARE EMPTY	2026-06-03	2026-06-04 09:49:36.339	\N
d118410c-300d-40af-93a4-f8590c52f1ff	2b55bc07-9fb4-43dc-81fe-319689f5b206	06149201-a3db-44ae-b57a-4ff0d9803292	88051bd9-7626-4423-a762-7650d43ee63b	dasfdadsf	adsfadsf	asfadsf	2026-06-03	2026-06-04 09:54:18.668	fasdfasd
fefd5ddb-819b-4293-9f30-ccd505c26cc6	f112f3a5-895f-4704-9eda-f7d31b452fc1	06149201-a3db-44ae-b57a-4ff0d9803292	3223f580-13ab-4638-8e7a-ca9c45653692	Replaced the new fire extinguisher	was empty	to tell us sooner	2026-06-02	2026-06-04 10:22:55.702	sad
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: inspections inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_pkey PRIMARY KEY (id);


--
-- Name: maintenance_logs maintenance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_pkey PRIMARY KEY (id);


--
-- Name: inspections_extinguisherId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inspections_extinguisherId_idx" ON public.inspections USING btree ("extinguisherId");


--
-- Name: inspections_inspectorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inspections_inspectorId_idx" ON public.inspections USING btree ("inspectorId");


--
-- Name: inspections_scheduledDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inspections_scheduledDate_idx" ON public.inspections USING btree ("scheduledDate");


--
-- Name: inspections_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inspections_status_idx ON public.inspections USING btree (status);


--
-- Name: maintenance_logs_extinguisherId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "maintenance_logs_extinguisherId_idx" ON public.maintenance_logs USING btree ("extinguisherId");


--
-- Name: maintenance_logs_inspectionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "maintenance_logs_inspectionId_key" ON public.maintenance_logs USING btree ("inspectionId");


--
-- Name: maintenance_logs_inspectorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "maintenance_logs_inspectorId_idx" ON public.maintenance_logs USING btree ("inspectorId");


--
-- Name: maintenance_logs maintenance_logs_inspectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT "maintenance_logs_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES public.inspections(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 4p1SaUV8tCnAcxeCjRNfyEVcZZl9aV6HJ3BLGQGrJJjV1OX2DNd4KzRHe0NdBR1

