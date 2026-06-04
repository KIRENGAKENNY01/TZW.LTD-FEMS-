--
-- PostgreSQL database dump
--

\restrict eiyEwxdzuJohJlqGjcs7uLWUF7annsqAK9vBMEVx3uryBGsPjazd3AaUdD93ehz

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
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'INSPECTOR',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

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
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4ad32e1c-24f6-4041-8206-fb46dd74c5a0	6e4168dcbee98d1b63ada7debfa8907f8e1070393fbbfe8691167dfb54035569	2026-06-03 08:06:50.144941+01	20260603070650_init	\N	\N	2026-06-03 08:06:50.095916+01	1
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, "userId", token, "expiresAt", "createdAt", status) FROM stdin;
2791a21a-65ec-4911-a5cd-c995c4dbf069	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NjI2NiwiZXhwIjoxNzgxMTcxMDY2fQ.yUs7vq-BWuCB0JaVn_5bXN911u9_UvSQxJyyB63bP2Q	2026-06-11 09:44:26.429	2026-06-04 09:44:26.43	REVOKED
b05cea32-8f57-4e3f-8167-5512642711a9	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2NjMzOSwiZXhwIjoxNzgxMTcxMTM5fQ.-vae5AxB69j2swLh61aAMeS2-sI2dEJirn03ufZQbqg	2026-06-11 09:45:39.904	2026-06-04 09:45:39.904	REVOKED
ad640854-def9-4812-9fee-27d75d2c3456	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NjM4MywiZXhwIjoxNzgxMTcxMTgzfQ.GegRC-P0n1bzUJTmcjdYgQcJOYar2gGigup0eR064do	2026-06-11 09:46:23.509	2026-06-04 09:46:23.51	REVOKED
f7dbf2ba-9d97-4222-a761-96c566c90259	06149201-a3db-44ae-b57a-4ff0d9803292	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2MTQ5MjAxLWEzZGItNDRhZS1iNTdhLTRmZjBkOTgwMzI5MiIsImlhdCI6MTc4MDU2NjQ3MCwiZXhwIjoxNzgxMTcxMjcwfQ.al73JTdpKjXSdbKmbns_rNREikeF2v-k5-BLEI3DQVY	2026-06-11 09:47:50.707	2026-06-04 09:47:50.708	ACTIVE
7cc96a24-7f25-47b9-b34a-d1c7d309d53a	06149201-a3db-44ae-b57a-4ff0d9803292	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2MTQ5MjAxLWEzZGItNDRhZS1iNTdhLTRmZjBkOTgwMzI5MiIsImlhdCI6MTc4MDU2NjgzMiwiZXhwIjoxNzgxMTcxNjMyfQ.TBhDCZSRYVBiftpS0icsBdRtoEmA7bnWwXniQsZhsbs	2026-06-11 09:53:52.811	2026-06-04 09:53:52.813	REVOKED
0b8465e9-6583-4227-837f-69290695ab27	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2Njg3OCwiZXhwIjoxNzgxMTcxNjc4fQ.NdLFHstaJUk1bPbuAFqBQojbr5ia7LcKvnec3bk09vM	2026-06-11 09:54:38.715	2026-06-04 09:54:38.717	REVOKED
43a21ad9-ec55-42e4-92f6-4ff38b9994ca	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NTk0NywiZXhwIjoxNzgxMTcwNzQ3fQ.YctHTH7wrg9NhMkAKDgr6H3xxL2uv-SPppJe1MB2sQA	2026-06-11 09:39:07.869	2026-06-04 09:39:07.87	REVOKED
77622012-8cd2-43d5-aeae-28a5832f845d	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2NjE3MCwiZXhwIjoxNzgxMTcwOTcwfQ.Tq_lizESO_huGr6_4UosufzbWIFECjLkB00KsQhlP0E	2026-06-11 09:42:50.206	2026-06-04 09:42:50.208	REVOKED
3c2ae8ab-d8f7-4069-a7bc-d796e9b9d37f	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2NzExMywiZXhwIjoxNzgxMTcxOTEzfQ.Kh2wJLFDt-GQqkuXMxooab_gOnY3gW9STnFMWKY-eWk	2026-06-11 09:58:33.619	2026-06-04 09:58:33.621	REVOKED
74052404-dee4-4a44-b3e1-9f5c493e201e	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NzEyOSwiZXhwIjoxNzgxMTcxOTI5fQ.vc4D3wk2_asLGUgVqM6i53MPn3i9ARgZOGAHYn7VHLc	2026-06-11 09:58:49.567	2026-06-04 09:58:49.569	REVOKED
ce864e32-2b24-448a-9d0b-b699e36908df	06149201-a3db-44ae-b57a-4ff0d9803292	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2MTQ5MjAxLWEzZGItNDRhZS1iNTdhLTRmZjBkOTgwMzI5MiIsImlhdCI6MTc4MDU2NzE3NywiZXhwIjoxNzgxMTcxOTc3fQ.Pp6MEjJV7gsFWxcXI98ppRqxgFoN00NFJ8kKIw2pDf4	2026-06-11 09:59:37.326	2026-06-04 09:59:37.328	REVOKED
ba4901aa-f59f-4089-be9b-4d51ebd3b318	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NzIyNywiZXhwIjoxNzgxMTcyMDI3fQ.WufVuleWk7ALp93WI32Bpm80vjnX6uekpQS5mvW1iig	2026-06-11 10:00:27.855	2026-06-04 10:00:27.857	REVOKED
e18902d7-34d7-4d7d-9f78-faef849f40ef	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NzQwMiwiZXhwIjoxNzgxMTcyMjAyfQ.cIE5Ain5u-U_Ozl95r0KhoC_260188NQLUZhMDhje7k	2026-06-11 10:03:22.77	2026-06-04 10:03:22.772	REVOKED
d59f476e-a4bb-4c01-bfd5-ec58a255d4ae	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2NzU1NCwiZXhwIjoxNzgxMTcyMzU0fQ.5APcPPOh8V931sMC-fEbOl_IEnZu2NoVHX9LtiiMxVA	2026-06-11 10:05:54.761	2026-06-04 10:05:54.763	REVOKED
563827c6-b5db-41c4-8d2d-2d8e45d7294e	06149201-a3db-44ae-b57a-4ff0d9803292	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2MTQ5MjAxLWEzZGItNDRhZS1iNTdhLTRmZjBkOTgwMzI5MiIsImlhdCI6MTc4MDU2NzU4MiwiZXhwIjoxNzgxMTcyMzgyfQ.FqggSkL2hiBLGXKn_tn-EdxJEo3YNvOIq1r0OFDOj-Y	2026-06-11 10:06:22.878	2026-06-04 10:06:22.88	REVOKED
42c601d5-a724-4adb-beba-44af575216e6	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2NzY2NywiZXhwIjoxNzgxMTcyNDY3fQ.-qh28vHSE5rNKhB3_JIQ87UX-LSJIS1yROVEchZggbU	2026-06-11 10:07:47.893	2026-06-04 10:07:47.894	REVOKED
79858a4f-175b-4574-bc7d-e93efeb6ec01	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NzczOSwiZXhwIjoxNzgxMTcyNTM5fQ.RFG0GZ_Phlyl8EXnYzT2rJb5NN2uoukjPTojgPkMJQw	2026-06-11 10:08:59.605	2026-06-04 10:08:59.607	REVOKED
9b617b1c-9a8f-43fe-9e26-82078e1a45fd	77dd5815-b619-41cc-874c-eac488bdcbda	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3ZGQ1ODE1LWI2MTktNDFjYy04NzRjLWVhYzQ4OGJkY2JkYSIsImlhdCI6MTc4MDU2Nzc1OSwiZXhwIjoxNzgxMTcyNTU5fQ.93FW6JKafWKj3I4RG_ySoIiBBO-PVCE9jC0YALNY-FQ	2026-06-11 10:09:19.346	2026-06-04 10:09:19.348	REVOKED
0b29ec70-c544-40ea-8a63-68c61bc6061c	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NzgxMCwiZXhwIjoxNzgxMTcyNjEwfQ.NwHygf3_b-Zwj94_bYVT4-UlOIYTVdmNQTigKMEmiWQ	2026-06-11 10:10:10.33	2026-06-04 10:10:10.332	REVOKED
5a422073-aa05-4575-9a87-886f58a3e57b	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2NzkwMSwiZXhwIjoxNzgxMTcyNzAxfQ.0SGprJ3tbHXMV4AFGyXU0jD17bRWG7qO9ikQud9syak	2026-06-11 10:11:41.3	2026-06-04 10:11:41.301	REVOKED
f2e94759-a055-4942-bf00-15e36931ad8a	86656693-9e33-429b-8bd0-385ace46c325	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2NjU2NjkzLTllMzMtNDI5Yi04YmQwLTM4NWFjZTQ2YzMyNSIsImlhdCI6MTc4MDU2ODI4MSwiZXhwIjoxNzgxMTczMDgxfQ.k3vhtENTdJWdmekv9ewMcN7NNrCSbwZDmMQSmfSgr_Q	2026-06-11 10:18:01.392	2026-06-04 10:18:01.393	REVOKED
cdd44ddd-64cb-49ef-acb6-c1ff073fd4c7	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2ODMzOCwiZXhwIjoxNzgxMTczMTM4fQ.PTlHN2oWK5CcHIO12KbER3Td0tDBdx2RCNDLDLROayE	2026-06-11 10:18:58.703	2026-06-04 10:18:58.705	REVOKED
a1f1bf67-e487-4e13-940d-3e291c937539	86656693-9e33-429b-8bd0-385ace46c325	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2NjU2NjkzLTllMzMtNDI5Yi04YmQwLTM4NWFjZTQ2YzMyNSIsImlhdCI6MTc4MDU2ODQzMCwiZXhwIjoxNzgxMTczMjMwfQ.ZgvqcaaTl7CN5fh3fDQHPz6G5MV40vnMBms7bxshqkI	2026-06-11 10:20:30.365	2026-06-04 10:20:30.366	REVOKED
cd0d4ee2-6a40-4e84-9cfa-90b006187996	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2ODQ4NywiZXhwIjoxNzgxMTczMjg3fQ.XvNruxcVL70UGNO6Q3Dk1VTb8H4hhuY2WGSIHu133I4	2026-06-11 10:21:27.098	2026-06-04 10:21:27.099	REVOKED
5581286a-30f0-47e0-974e-cb56750e650c	06149201-a3db-44ae-b57a-4ff0d9803292	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2MTQ5MjAxLWEzZGItNDRhZS1iNTdhLTRmZjBkOTgwMzI5MiIsImlhdCI6MTc4MDU2ODUxNCwiZXhwIjoxNzgxMTczMzE0fQ.jZOFkz8749fyZkBJEHWUB1tmtnjaaLvRgddStDocTl4	2026-06-11 10:21:54.987	2026-06-04 10:21:54.988	REVOKED
6222ffab-aad2-48ed-86b7-cf6641304e4f	31ce186c-2223-4701-b657-b65aca5d15e1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxY2UxODZjLTIyMjMtNDcwMS1iNjU3LWI2NWFjYTVkMTVlMSIsImlhdCI6MTc4MDU2ODU4NywiZXhwIjoxNzgxMTczMzg3fQ.rerojT5qZ3ll4MkQUPtKlz5n_OvN_mu7HJjGae5TQjI	2026-06-11 10:23:07.683	2026-06-04 10:23:07.685	ACTIVE
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, "passwordHash", role, "isActive", "createdAt", "updatedAt") FROM stdin;
31ce186c-2223-4701-b657-b65aca5d15e1	admin@tzw.com	$2b$12$MZn0VtFzB.E/6kfshrjAZ.MZ2qMchSk0whasFGn1bvVgeVL30JgkC	ADMIN	t	2026-06-04 09:34:16.22	2026-06-04 09:34:16.22
06149201-a3db-44ae-b57a-4ff0d9803292	inspector1@tzw.com	$2b$12$lU7kT6rnp0p/c9hKXEY97Ogjepwh9C.DeNkzp0Le1CB.0eNeHQp8.	INSPECTOR	t	2026-06-04 09:34:16.229	2026-06-04 09:34:16.229
15d8541f-8a01-4b55-8aca-61258b669cb1	inspector2@tzw.com	$2b$12$lU7kT6rnp0p/c9hKXEY97Ogjepwh9C.DeNkzp0Le1CB.0eNeHQp8.	INSPECTOR	t	2026-06-04 09:34:16.23	2026-06-04 09:34:16.23
ab8a647e-bd91-459b-953e-433ab7fdc87b	user1@tzw.com	$2b$12$NeeaoSnGD1pPY0COq0G4Ge7akGiG3xhs8giv/WqOv64683LoWao3S	USER	t	2026-06-04 09:34:16.23	2026-06-04 09:34:16.23
0722cf6f-00a7-462d-a079-8eee79b9fef2	user2@tzw.com	$2b$12$NeeaoSnGD1pPY0COq0G4Ge7akGiG3xhs8giv/WqOv64683LoWao3S	USER	t	2026-06-04 09:34:16.231	2026-06-04 09:34:16.231
77dd5815-b619-41cc-874c-eac488bdcbda	kennykirenga70@gmail.com	$2b$12$InJ27WT9QfW9omOzMkeTwOZmBM7pYGiMqwtzFrciQnky5dimG6kLi	USER	t	2026-06-04 09:42:49.874	2026-06-04 09:42:49.874
86656693-9e33-429b-8bd0-385ace46c325	mucyoivan@gmail.com	$2b$12$78Z9CrnTNQETS5fOxnoAXOb014UzrH//5V3YO1YLLetD0tkbMFEAG	USER	t	2026-06-04 10:18:01.016	2026-06-04 10:18:01.016
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict eiyEwxdzuJohJlqGjcs7uLWUF7annsqAK9vBMEVx3uryBGsPjazd3AaUdD93ehz

