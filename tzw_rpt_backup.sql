--
-- PostgreSQL database dump
--

\restrict eWnuMQa6xeQPXCkuWcqwZHbsGX8Fs3wguATXBanUscBL6h0mGfVPbLx9SBiWW9z

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
-- Name: ExportFmt; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExportFmt" AS ENUM (
    'PDF',
    'CSV'
);


ALTER TYPE public."ExportFmt" OWNER TO postgres;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobStatus" AS ENUM (
    'QUEUED',
    'PROCESSING',
    'DONE',
    'FAILED'
);


ALTER TYPE public."JobStatus" OWNER TO postgres;

--
-- Name: Period; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Period" AS ENUM (
    'DAILY',
    'MONTHLY',
    'YEARLY',
    'CUSTOM'
);


ALTER TYPE public."Period" OWNER TO postgres;

--
-- Name: ReportType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReportType" AS ENUM (
    'INVENTORY',
    'INSPECTION',
    'COMPLIANCE',
    'MAINTENANCE'
);


ALTER TYPE public."ReportType" OWNER TO postgres;

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
-- Name: export_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.export_jobs (
    id text NOT NULL,
    "reportCacheId" text NOT NULL,
    "requestedBy" text NOT NULL,
    format public."ExportFmt" NOT NULL,
    status public."JobStatus" DEFAULT 'QUEUED'::public."JobStatus" NOT NULL,
    "fileUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.export_jobs OWNER TO postgres;

--
-- Name: report_caches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_caches (
    id text NOT NULL,
    "reportType" public."ReportType" NOT NULL,
    period public."Period" NOT NULL,
    payload jsonb NOT NULL,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.report_caches OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
be0db548-68a8-47bb-9ac3-a0560cf9e666	5e7cfe52277bd127c950c8d1584a2a3f6401c9e665afb054fc32752145812853	2026-06-03 08:07:58.590934+01	20260603070758_init	\N	\N	2026-06-03 08:07:58.549515+01	1
e1908a1c-a164-4aa0-b4e4-cfa1644f7bd5	671359f4bdaab9ff920080caff9bfd7094f0c1a4ec763b2261029c354924381d	2026-06-03 08:43:14.133919+01	20260603074314_update_table_mappings	\N	\N	2026-06-03 08:43:14.070293+01	1
\.


--
-- Data for Name: export_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.export_jobs (id, "reportCacheId", "requestedBy", format, status, "fileUrl", "createdAt") FROM stdin;
e2b01c3f-579c-4570-9dc8-37393692b747	4abce2f9-1466-4374-8208-054c81495b9b	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/e2b01c3f-579c-4570-9dc8-37393692b747.pdf	2026-06-03 11:34:07.53
342d9c76-cc28-4e1c-87ee-59ba8b556165	4abce2f9-1466-4374-8208-054c81495b9b	dfd2facf-532c-4257-9eb0-450f95e759f9	CSV	DONE	/api/reports/exports/download/342d9c76-cc28-4e1c-87ee-59ba8b556165.csv	2026-06-03 11:34:13.641
dd672d54-8427-469f-ba5b-046eefa9fd26	5420f5f7-c07d-4caf-8884-ee3a6e375b0e	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/dd672d54-8427-469f-ba5b-046eefa9fd26.pdf	2026-06-03 11:34:18.882
aeacf00b-688a-493b-a5dc-1c2735bceb5f	5420f5f7-c07d-4caf-8884-ee3a6e375b0e	dfd2facf-532c-4257-9eb0-450f95e759f9	CSV	DONE	/api/reports/exports/download/aeacf00b-688a-493b-a5dc-1c2735bceb5f.csv	2026-06-03 11:34:19.659
94d73605-1661-4743-a142-48b1ca36c777	087c1bde-9740-4099-8353-706d0fb66411	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/94d73605-1661-4743-a142-48b1ca36c777.pdf	2026-06-03 11:34:20.305
48320c22-845d-4c11-b260-5e71959d0d8e	253e2f95-d509-49d1-a032-5db750b5785c	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/48320c22-845d-4c11-b260-5e71959d0d8e.pdf	2026-06-03 11:43:45.723
761b5723-34bc-4b96-8ae6-a016d477d898	253e2f95-d509-49d1-a032-5db750b5785c	dfd2facf-532c-4257-9eb0-450f95e759f9	CSV	DONE	/api/reports/exports/download/761b5723-34bc-4b96-8ae6-a016d477d898.csv	2026-06-03 11:44:04.965
b93ec989-ce09-4ad3-903a-2e9e9547f7a8	c3f57b37-32ef-44f3-8bd3-e6b6e5343c4e	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/b93ec989-ce09-4ad3-903a-2e9e9547f7a8.pdf	2026-06-03 11:47:55.314
160b5af1-d89f-4ec1-a889-555bb7ec47de	c3f57b37-32ef-44f3-8bd3-e6b6e5343c4e	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/160b5af1-d89f-4ec1-a889-555bb7ec47de.pdf	2026-06-03 11:48:09.31
f82f6cca-0cd3-49ef-87d8-28e22410d42f	7001e396-4bfb-4e81-986e-c4746677829f	df6e6abd-b9fd-4c21-a52f-2c0053e3c370	PDF	DONE	/api/reports/exports/download/f82f6cca-0cd3-49ef-87d8-28e22410d42f.pdf	2026-06-03 11:49:07.792
b90c0f90-c9db-429e-909b-16b25bd1ce37	7001e396-4bfb-4e81-986e-c4746677829f	df6e6abd-b9fd-4c21-a52f-2c0053e3c370	PDF	DONE	/api/reports/exports/download/b90c0f90-c9db-429e-909b-16b25bd1ce37.pdf	2026-06-03 11:49:22.631
048d294f-6960-4229-b84b-5e9eb97cbc76	7001e396-4bfb-4e81-986e-c4746677829f	df6e6abd-b9fd-4c21-a52f-2c0053e3c370	PDF	DONE	/api/reports/exports/download/048d294f-6960-4229-b84b-5e9eb97cbc76.pdf	2026-06-03 11:50:00.113
c423bf25-b582-4e83-843a-ab52b7f0ec2d	415f45e1-e0d6-47df-94c4-8f7f498c4043	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/c423bf25-b582-4e83-843a-ab52b7f0ec2d.pdf	2026-06-03 11:54:10.264
cf101211-99db-40cd-8939-18166ff41436	de3f2513-da40-4cc8-b8c0-6c5511d0dfe5	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/cf101211-99db-40cd-8939-18166ff41436.pdf	2026-06-03 11:54:59.348
0d418068-ea3f-4107-af5c-075c03d83187	415f45e1-e0d6-47df-94c4-8f7f498c4043	dfd2facf-532c-4257-9eb0-450f95e759f9	CSV	DONE	/api/reports/exports/download/0d418068-ea3f-4107-af5c-075c03d83187.csv	2026-06-03 11:55:08.191
9a0fc837-ad65-4577-940e-9effb2c3ebfd	76a79e61-769a-44f7-83b4-64aab2299040	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/9a0fc837-ad65-4577-940e-9effb2c3ebfd.pdf	2026-06-03 11:55:13.907
7ffe4414-b849-47ed-bfed-0d61d54dcfbc	26b6bd34-3a85-47e0-980e-4d95af2002e4	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/7ffe4414-b849-47ed-bfed-0d61d54dcfbc.pdf	2026-06-03 11:55:22.97
64b567f0-ba8f-4fbf-8775-b54746240d7d	26b6bd34-3a85-47e0-980e-4d95af2002e4	dfd2facf-532c-4257-9eb0-450f95e759f9	PDF	DONE	/api/reports/exports/download/64b567f0-ba8f-4fbf-8775-b54746240d7d.pdf	2026-06-03 11:55:32.675
cfb20a4c-a128-4e37-9554-d6ff203f7ba6	26b6bd34-3a85-47e0-980e-4d95af2002e4	dfd2facf-532c-4257-9eb0-450f95e759f9	CSV	DONE	/api/reports/exports/download/cfb20a4c-a128-4e37-9554-d6ff203f7ba6.csv	2026-06-03 11:55:40.593
7d051e02-38dd-458f-962c-2ad3c9c6cf6f	26b6bd34-3a85-47e0-980e-4d95af2002e4	dfd2facf-532c-4257-9eb0-450f95e759f9	CSV	DONE	/api/reports/exports/download/7d051e02-38dd-458f-962c-2ad3c9c6cf6f.csv	2026-06-03 11:55:44.79
55991a4f-0c1d-4cfa-b264-4bce9380d1ba	3283d613-6fa7-4e5c-a0ac-0d47f5940074	31ce186c-2223-4701-b657-b65aca5d15e1	PDF	DONE	/api/reports/exports/download/55991a4f-0c1d-4cfa-b264-4bce9380d1ba.pdf	2026-06-04 10:00:54.481
3efe7c6d-9b07-4dbf-9453-278b72044638	a0ac0a93-e141-4121-87c0-fa329879f3a9	31ce186c-2223-4701-b657-b65aca5d15e1	PDF	DONE	/api/reports/exports/download/3efe7c6d-9b07-4dbf-9453-278b72044638.pdf	2026-06-04 10:23:26.387
cfec6637-eceb-4035-b2a6-3fbfca2b79a9	e231f96b-6a7a-4de0-8984-de6e4bea13c7	31ce186c-2223-4701-b657-b65aca5d15e1	PDF	DONE	/api/reports/exports/download/cfec6637-eceb-4035-b2a6-3fbfca2b79a9.pdf	2026-06-04 10:23:53.396
08a5b3fd-8bef-4475-a72b-d6e41319c92c	4e982083-cf8c-4786-930b-5634af15a7cb	31ce186c-2223-4701-b657-b65aca5d15e1	PDF	DONE	/api/reports/exports/download/08a5b3fd-8bef-4475-a72b-d6e41319c92c.pdf	2026-06-04 10:24:19.412
892ab3b9-e4ef-48fb-9738-5e6bccbd3214	45885772-516a-4edb-bed2-b21b5cc062fd	31ce186c-2223-4701-b657-b65aca5d15e1	PDF	DONE	/api/reports/exports/download/892ab3b9-e4ef-48fb-9738-5e6bccbd3214.pdf	2026-06-04 10:24:58.037
\.


--
-- Data for Name: report_caches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_caches (id, "reportType", period, payload, "generatedAt", "expiresAt") FROM stdin;
b07eeaea-a18e-4a00-aae9-6652be9124ba	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "7d85833f-8ee2-47fb-b09c-3f07c58a4d3d"}, {"completed": 1, "inspectorId": "1d71cb91-24d5-444f-9e67-2eb8fe7586eb"}], "completionRate": "38%"}	2026-06-03 09:14:13.343	2026-06-03 09:19:13.339
c7ad6e18-81d4-41bd-a468-472c4c94786b	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 09:14:13.339	2026-06-03 09:19:13.334
0ed565e1-9837-404f-9207-8b2c416a5ec7	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "7d85833f-8ee2-47fb-b09c-3f07c58a4d3d"}, {"completed": 1, "inspectorId": "1d71cb91-24d5-444f-9e67-2eb8fe7586eb"}], "completionRate": "38%"}	2026-06-03 09:39:18.195	2026-06-03 09:44:18.19
6f664b82-3857-4851-8f9a-10b03efecb9b	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 09:39:18.181	2026-06-03 09:44:18.177
fabb7a64-c76b-46be-9101-1863b6b3d1d4	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "80%"}	2026-06-03 09:40:04.431	2026-06-03 09:45:04.429
34fbde22-1f55-40f7-b114-c40e7364949e	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 09:47:11.081	2026-06-03 09:52:11.079
bae290f0-0895-476b-b741-b299219088a1	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "7d85833f-8ee2-47fb-b09c-3f07c58a4d3d"}, {"completed": 1, "inspectorId": "1d71cb91-24d5-444f-9e67-2eb8fe7586eb"}], "completionRate": "38%"}	2026-06-03 09:47:11.085	2026-06-03 09:52:11.081
10595e61-a673-4f92-94d1-b306dc1d3a8f	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "80%"}	2026-06-03 09:47:28.551	2026-06-03 09:52:28.548
122aab02-426a-4056-945b-b9172ddeab0e	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "0bea0029-912a-471c-90fa-aab885da3b40"}, {"count": 1, "extinguisherId": "3339b488-0a1a-4388-bfe6-44a984018c24"}, {"count": 1, "extinguisherId": "c16d2c9c-8828-4d43-8000-2e0b3535bf0e"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "4feb628d-57d9-4b37-8001-51934f12438e", "createdAt": "2026-06-03T07:44:52.001Z", "actionTaken": "Hydrostatic pressure test passed, cleaned shell.", "inspectorId": "7d85833f-8ee2-47fb-b09c-3f07c58a4d3d", "inspectionId": "5c85ed51-0f30-43fc-8519-8d525aa539aa", "extinguisherId": "0bea0029-912a-471c-90fa-aab885da3b40", "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "None", "issuesIdentified": "Dust accumulation"}, {"id": "2792142d-508c-421e-9263-c84be7951f73", "createdAt": "2026-06-03T07:44:52.001Z", "actionTaken": "Replaced safety pin and plastic seal.", "inspectorId": "1d71cb91-24d5-444f-9e67-2eb8fe7586eb", "inspectionId": "9badfd92-3ede-43d6-9615-64e1f63e1f20", "extinguisherId": "3339b488-0a1a-4388-bfe6-44a984018c24", "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Check seal weekly", "issuesIdentified": "Damaged plastic pull seal"}, {"id": "e6378c2f-1084-4143-a9e1-a9ce4c47f984", "createdAt": "2026-06-03T07:44:52.001Z", "actionTaken": "Recharged nitrogen propellent and topped up chemical powder.", "inspectorId": "7d85833f-8ee2-47fb-b09c-3f07c58a4d3d", "inspectionId": "45db1451-64b6-4f8b-9027-fcd4d0e96144", "extinguisherId": "c16d2c9c-8828-4d43-8000-2e0b3535bf0e", "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Monthly pressure gauge checks", "issuesIdentified": "Propellent pressure below green zone"}]}	2026-06-03 09:47:28.557	2026-06-03 09:52:28.552
a3c21485-9753-46ad-859f-138a55e2387d	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 09:57:04.738	2026-06-03 10:02:04.736
f896a4f2-842b-45a1-8a00-e6e3d9700fec	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "7d85833f-8ee2-47fb-b09c-3f07c58a4d3d"}, {"completed": 1, "inspectorId": "1d71cb91-24d5-444f-9e67-2eb8fe7586eb"}], "completionRate": "38%"}	2026-06-03 09:57:04.745	2026-06-03 10:02:04.743
6ea6d423-0e0f-4b55-8d4e-f66c9153c3e9	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 10:23:35.137	2026-06-03 10:28:35.115
bc60e789-f1aa-4bfb-9b7e-5367f6a62df7	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 10:23:35.666	2026-06-03 10:28:35.664
3715ab19-4f00-4829-a2ca-69662a463627	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 11:15:17.196	2026-06-03 11:20:17.19
4bee33f9-539e-490a-916e-6260d17ad1f4	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 11:15:17.193	2026-06-03 11:20:17.187
087c1bde-9740-4099-8353-706d0fb66411	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "80%"}	2026-06-03 11:30:51.662	2026-06-03 11:35:51.659
4abce2f9-1466-4374-8208-054c81495b9b	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-03 11:31:37.579	2026-06-03 11:36:37.556
5420f5f7-c07d-4caf-8884-ee3a6e375b0e	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 11:31:37.815	2026-06-03 11:36:37.794
7435cc85-638a-4639-a2de-2ad2d5e021ea	INVENTORY	DAILY	{"total": 6, "byType": {"CO2": 2, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "DAILY", "byStatus": {"ACTIVE": 6}, "byBuilding": {"Building A": 3, "Building B": 3}}	2026-06-04 09:44:36.208	2026-06-04 09:49:36.207
5f73fc52-e7bf-4632-83c2-0462d33c33c9	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45"}, {"count": 1, "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9"}, {"count": 1, "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "80587508-b040-4af5-8861-d6c2d7a60d8a", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Hydrostatic pressure test passed, cleaned shell.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "060021c5-bef1-488b-959d-abe863774628", "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "None", "issuesIdentified": "Dust accumulation"}, {"id": "1f375bde-119c-4cda-8860-1624cc9be2e2", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Replaced safety pin and plastic seal.", "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8", "inspectionId": "9696cea8-7735-4d0a-9626-b13621d7f5a1", "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Check seal weekly", "issuesIdentified": "Damaged plastic pull seal"}, {"id": "137f20fe-9b04-4089-8a2c-2ad9208316d3", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Recharged nitrogen propellent and topped up chemical powder.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "e5ae15dc-e687-426f-bccc-c6b6a17ae6fa", "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Monthly pressure gauge checks", "issuesIdentified": "Propellent pressure below green zone"}]}	2026-06-03 11:34:05.216	2026-06-03 11:39:05.212
253e2f95-d509-49d1-a032-5db750b5785c	INVENTORY	CUSTOM	{"total": 11, "byType": {"CO2": 4, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 9, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "Main building ": 1}}	2026-06-03 11:42:06.302	2026-06-03 11:47:06.296
8341bb06-e57b-40f1-af9a-980544962ea2	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 11:42:06.524	2026-06-03 11:47:06.511
3a5555dc-3854-463f-a371-b0aad78cd221	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45"}, {"count": 1, "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9"}, {"count": 1, "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "80587508-b040-4af5-8861-d6c2d7a60d8a", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Hydrostatic pressure test passed, cleaned shell.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "060021c5-bef1-488b-959d-abe863774628", "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "None", "issuesIdentified": "Dust accumulation"}, {"id": "1f375bde-119c-4cda-8860-1624cc9be2e2", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Replaced safety pin and plastic seal.", "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8", "inspectionId": "9696cea8-7735-4d0a-9626-b13621d7f5a1", "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Check seal weekly", "issuesIdentified": "Damaged plastic pull seal"}, {"id": "137f20fe-9b04-4089-8a2c-2ad9208316d3", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Recharged nitrogen propellent and topped up chemical powder.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "e5ae15dc-e687-426f-bccc-c6b6a17ae6fa", "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Monthly pressure gauge checks", "issuesIdentified": "Propellent pressure below green zone"}]}	2026-06-03 11:43:43.546	2026-06-03 11:48:43.541
fd15d4bf-2827-4fe9-af31-3de8077e35e6	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "82%"}	2026-06-03 11:43:43.539	2026-06-03 11:48:43.536
418136bc-128c-4254-aeb5-3b0c8aa00ad8	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 11:47:38.05	2026-06-03 11:52:38.016
c3f57b37-32ef-44f3-8bd3-e6b6e5343c4e	INVENTORY	CUSTOM	{"total": 11, "byType": {"CO2": 4, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 9, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "Main building ": 1}}	2026-06-03 11:47:38.353	2026-06-03 11:52:38.346
7001e396-4bfb-4e81-986e-c4746677829f	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "82%"}	2026-06-03 11:49:05.827	2026-06-03 11:54:05.825
de3f2513-da40-4cc8-b8c0-6c5511d0dfe5	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 11:52:52.057	2026-06-03 11:57:52.05
415f45e1-e0d6-47df-94c4-8f7f498c4043	INVENTORY	CUSTOM	{"total": 11, "byType": {"CO2": 4, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 9, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "Main building ": 1}}	2026-06-03 11:52:52.201	2026-06-03 11:57:52.198
73bf1727-c9f1-41ec-9852-66cb5a912e9a	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802"}], "lastThirtyDays": 1, "totalActivities": 1, "recentActivities": [{"id": "3003a7da-dc6b-4336-b121-dd4f20efc716", "createdAt": "2026-06-04T09:34:16.271Z", "actionTaken": "Replaced discharge hose and recharged CO2 canister.", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "77813867-8ba5-4e42-b833-141470f9412c", "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802", "conditionsNoted": null, "maintenanceDate": "2026-05-25T00:00:00.000Z", "recommendations": "Schedule re-inspection in 6 months", "issuesIdentified": "Cracked hose, low pressure", "extinguisherSerial": "SN-ACT01"}]}	2026-06-04 09:44:36.216	2026-06-04 09:49:36.214
72a4b58b-9651-4c0b-8764-9ac43f3e6c39	INVENTORY	MONTHLY	{"total": 6, "byType": {"CO2": 2, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "MONTHLY", "byStatus": {"ACTIVE": 6}, "byBuilding": {"Building A": 3, "Building B": 3}}	2026-06-04 09:44:36.211	2026-06-04 09:49:36.209
26b6bd34-3a85-47e0-980e-4d95af2002e4	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45"}, {"count": 1, "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9"}, {"count": 1, "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "80587508-b040-4af5-8861-d6c2d7a60d8a", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Hydrostatic pressure test passed, cleaned shell.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "060021c5-bef1-488b-959d-abe863774628", "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "None", "issuesIdentified": "Dust accumulation"}, {"id": "1f375bde-119c-4cda-8860-1624cc9be2e2", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Replaced safety pin and plastic seal.", "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8", "inspectionId": "9696cea8-7735-4d0a-9626-b13621d7f5a1", "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Check seal weekly", "issuesIdentified": "Damaged plastic pull seal"}, {"id": "137f20fe-9b04-4089-8a2c-2ad9208316d3", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Recharged nitrogen propellent and topped up chemical powder.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "e5ae15dc-e687-426f-bccc-c6b6a17ae6fa", "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Monthly pressure gauge checks", "issuesIdentified": "Propellent pressure below green zone"}]}	2026-06-03 11:54:09.032	2026-06-03 11:59:09.03
76a79e61-769a-44f7-83b4-64aab2299040	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "82%"}	2026-06-03 11:54:09.087	2026-06-03 11:59:09.078
63c3d0d4-3e40-402b-85c0-f3785bdcae73	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "82%"}	2026-06-03 11:59:24.145	2026-06-03 12:04:24.142
38d7198b-fd58-47a6-8b1e-574fc5abff4d	INVENTORY	CUSTOM	{"total": 11, "byType": {"CO2": 4, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "byStatus": {"ACTIVE": 9, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "Main building ": 1}}	2026-06-03 11:59:24.157	2026-06-03 12:04:24.153
11a5efa8-edfc-4741-8e82-b1ff83a48626	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45"}, {"count": 1, "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9"}, {"count": 1, "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "80587508-b040-4af5-8861-d6c2d7a60d8a", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Hydrostatic pressure test passed, cleaned shell.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "060021c5-bef1-488b-959d-abe863774628", "extinguisherId": "caaf79c0-2f61-4906-8b64-341aafb65a45", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "None", "issuesIdentified": "Dust accumulation"}, {"id": "1f375bde-119c-4cda-8860-1624cc9be2e2", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Replaced safety pin and plastic seal.", "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8", "inspectionId": "9696cea8-7735-4d0a-9626-b13621d7f5a1", "extinguisherId": "947bca2b-6ecf-4d7e-8a5e-38a2fe3990c9", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Check seal weekly", "issuesIdentified": "Damaged plastic pull seal"}, {"id": "137f20fe-9b04-4089-8a2c-2ad9208316d3", "createdAt": "2026-06-03T10:18:44.736Z", "actionTaken": "Recharged nitrogen propellent and topped up chemical powder.", "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d", "inspectionId": "e5ae15dc-e687-426f-bccc-c6b6a17ae6fa", "extinguisherId": "930bc611-0a34-4b59-848d-55a3eb1dc636", "conditionsNoted": null, "maintenanceDate": "2026-05-24T00:00:00.000Z", "recommendations": "Monthly pressure gauge checks", "issuesIdentified": "Propellent pressure below green zone"}]}	2026-06-03 11:59:24.302	2026-06-03 12:04:24.298
642c0409-6476-4199-afaa-39e058e4ae6a	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-03 11:59:24.324	2026-06-03 12:04:24.322
c5d1957d-b64e-47dd-828a-f80b46792809	INVENTORY	CUSTOM	{"total": 11, "byType": {"CO2": 4, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 9, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "Main building ": 1}}	2026-06-04 08:58:53.999	2026-06-04 09:03:53.996
ceb0a425-90a7-4039-a9de-06bc63d961ea	INSPECTION	CUSTOM	{"overdue": 2, "pending": 3, "completed": 3, "byInspector": [{"completed": 2, "inspectorId": "f63ebc9f-b073-43ec-a90e-9fbbfa9f916d"}, {"completed": 1, "inspectorId": "1b5d9ec6-fb57-41d3-9e6b-546556a746e8"}], "completionRate": "38%"}	2026-06-04 08:58:54.036	2026-06-04 09:03:54.033
efa3879e-0c01-4624-90a7-b6b3d0004155	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "82%"}	2026-06-04 08:59:40.873	2026-06-04 09:04:40.872
55327783-2619-4fbc-a777-24fd6dcd4931	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-04 09:39:08.567	2026-06-04 09:44:08.564
5b00d3eb-4e10-465c-a1ac-5083622b8477	INSPECTION	CUSTOM	{"overdue": 1, "pending": 2, "completed": 2, "byInspector": [{"completed": 1, "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292"}, {"completed": 1, "inspectorId": "15d8541f-8a01-4b55-8aca-61258b669cb1"}], "completionRate": "40%"}	2026-06-04 09:39:08.704	2026-06-04 09:44:08.701
47cf552a-0a9a-4f82-9800-aa5070bea11b	INVENTORY	CUSTOM	{"total": 10, "byType": {"CO2": 3, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 8, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5}}	2026-06-04 09:44:26.978	2026-06-04 09:49:26.976
849720a9-387a-4032-a7b2-41a6a9ea0254	INSPECTION	CUSTOM	{"overdue": 1, "pending": 2, "completed": 2, "byInspector": [{"completed": 1, "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292"}, {"completed": 1, "inspectorId": "15d8541f-8a01-4b55-8aca-61258b669cb1"}], "completionRate": "40%"}	2026-06-04 09:44:27.027	2026-06-04 09:49:27.025
3adaab98-71fd-494f-bfd5-fe07df3cb769	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "80%"}	2026-06-04 09:44:36.207	2026-06-04 09:49:36.206
2fabbdfd-2257-4645-b8ff-3adedabd82cc	INVENTORY	YEARLY	{"total": 6, "byType": {"CO2": 2, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "YEARLY", "byStatus": {"ACTIVE": 6}, "byBuilding": {"Building A": 3, "Building B": 3}}	2026-06-04 09:44:36.213	2026-06-04 09:49:36.21
b39760f0-1511-42aa-894b-7cc602e85ca7	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "83%"}	2026-06-04 09:57:15.208	2026-06-04 10:02:15.206
054b7f94-f906-43ee-bb8b-f2812d6bbae4	INSPECTION	CUSTOM	{"overdue": 0, "pending": 1, "completed": 4, "byInspector": [{"completed": 3, "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292"}, {"completed": 1, "inspectorId": "15d8541f-8a01-4b55-8aca-61258b669cb1"}], "completionRate": "80%"}	2026-06-04 09:58:50.109	2026-06-04 10:03:50.107
3283d613-6fa7-4e5c-a0ac-0d47f5940074	INVENTORY	CUSTOM	{"total": 12, "byType": {"CO2": 5, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 10, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 09:58:50.133	2026-06-04 10:03:50.128
3724fb7e-5b5c-4f27-94dc-640eea0b6050	INVENTORY	DAILY	{"total": 8, "byType": {"CO2": 4, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "DAILY", "byStatus": {"ACTIVE": 8}, "byBuilding": {"Building A": 3, "Building B": 3, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 09:58:53.682	2026-06-04 10:03:53.679
2eba9625-b834-4a31-877e-8156a97c6fc5	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "2730aaa9-d5ef-4bb9-a46a-0c888dd9e301"}, {"count": 1, "extinguisherId": "2b55bc07-9fb4-43dc-81fe-319689f5b206"}, {"count": 1, "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "f74b2af5-92e1-4d8a-a0d0-399583bfce93", "createdAt": "2026-06-04T09:49:36.339Z", "actionTaken": "REPLACED THE FIRE EXTINGUISHER", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "4f698e0a-7bb7-477f-a431-fe896129da68", "extinguisherId": "2730aaa9-d5ef-4bb9-a46a-0c888dd9e301", "conditionsNoted": null, "maintenanceDate": "2026-06-03T00:00:00.000Z", "recommendations": "TO CHECK REGULARLY IF FIRE EXTINGUISHERS ARE EMPTY", "issuesIdentified": "THE FIRE EXTINGUISHER WAS EMPTY", "extinguisherSerial": "SN-ACT03"}, {"id": "d118410c-300d-40af-93a4-f8590c52f1ff", "createdAt": "2026-06-04T09:54:18.668Z", "actionTaken": "dasfdadsf", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "88051bd9-7626-4423-a762-7650d43ee63b", "extinguisherId": "2b55bc07-9fb4-43dc-81fe-319689f5b206", "conditionsNoted": "fasdfasd", "maintenanceDate": "2026-06-03T00:00:00.000Z", "recommendations": "asfadsf", "issuesIdentified": "adsfadsf", "extinguisherSerial": "SN-EXP01"}, {"id": "3003a7da-dc6b-4336-b121-dd4f20efc716", "createdAt": "2026-06-04T09:34:16.271Z", "actionTaken": "Replaced discharge hose and recharged CO2 canister.", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "77813867-8ba5-4e42-b833-141470f9412c", "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802", "conditionsNoted": null, "maintenanceDate": "2026-05-25T00:00:00.000Z", "recommendations": "Schedule re-inspection in 6 months", "issuesIdentified": "Cracked hose, low pressure", "extinguisherSerial": "SN-ACT01"}]}	2026-06-04 09:58:53.716	2026-06-04 10:03:53.713
8b934e16-fb56-4814-b117-0d6723a4572b	INVENTORY	MONTHLY	{"total": 8, "byType": {"CO2": 4, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "MONTHLY", "byStatus": {"ACTIVE": 8}, "byBuilding": {"Building A": 3, "Building B": 3, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 09:58:53.723	2026-06-04 10:03:53.72
e10d20f4-484d-42e0-ae75-886f733b0f5b	INVENTORY	YEARLY	{"total": 8, "byType": {"CO2": 4, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "YEARLY", "byStatus": {"ACTIVE": 8}, "byBuilding": {"Building A": 3, "Building B": 3, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 09:58:53.726	2026-06-04 10:03:53.724
0075ed18-c947-4e8b-a63d-9d2e0775c550	INSPECTION	CUSTOM	{"overdue": 0, "pending": 1, "completed": 4, "byInspector": [{"completed": 3, "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292"}, {"completed": 1, "inspectorId": "15d8541f-8a01-4b55-8aca-61258b669cb1"}], "completionRate": "80%"}	2026-06-04 10:09:00.312	2026-06-04 10:14:00.31
1f4c7a95-46ab-406c-97a7-33c302796e55	INVENTORY	CUSTOM	{"total": 13, "byType": {"CO2": 6, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 11, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "MAIN HALL ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:09:00.341	2026-06-04 10:14:00.339
7a5f19c1-26bf-4e95-ba95-a56fbe8fc49e	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "85%"}	2026-06-04 10:12:00.212	2026-06-04 10:17:00.21
c4705f03-d5b6-495b-9d1b-9fe8eb4e0713	INVENTORY	MONTHLY	{"total": 9, "byType": {"CO2": 5, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "MONTHLY", "byStatus": {"ACTIVE": 9}, "byBuilding": {"Building A": 3, "Building B": 3, "MAIN HALL ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:12:00.233	2026-06-04 10:17:00.227
f9813e9b-6108-44c9-9d8c-dde2eed8b6d4	INVENTORY	YEARLY	{"total": 9, "byType": {"CO2": 5, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "YEARLY", "byStatus": {"ACTIVE": 9}, "byBuilding": {"Building A": 3, "Building B": 3, "MAIN HALL ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:12:00.24	2026-06-04 10:17:00.238
cdfa87b3-54b6-4d2e-b815-6942c41710b6	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "2730aaa9-d5ef-4bb9-a46a-0c888dd9e301"}, {"count": 1, "extinguisherId": "2b55bc07-9fb4-43dc-81fe-319689f5b206"}, {"count": 1, "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802"}], "lastThirtyDays": 3, "totalActivities": 3, "recentActivities": [{"id": "f74b2af5-92e1-4d8a-a0d0-399583bfce93", "createdAt": "2026-06-04T09:49:36.339Z", "actionTaken": "REPLACED THE FIRE EXTINGUISHER", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "4f698e0a-7bb7-477f-a431-fe896129da68", "extinguisherId": "2730aaa9-d5ef-4bb9-a46a-0c888dd9e301", "conditionsNoted": null, "maintenanceDate": "2026-06-03T00:00:00.000Z", "recommendations": "TO CHECK REGULARLY IF FIRE EXTINGUISHERS ARE EMPTY", "issuesIdentified": "THE FIRE EXTINGUISHER WAS EMPTY", "extinguisherSerial": "SN-ACT03"}, {"id": "d118410c-300d-40af-93a4-f8590c52f1ff", "createdAt": "2026-06-04T09:54:18.668Z", "actionTaken": "dasfdadsf", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "88051bd9-7626-4423-a762-7650d43ee63b", "extinguisherId": "2b55bc07-9fb4-43dc-81fe-319689f5b206", "conditionsNoted": "fasdfasd", "maintenanceDate": "2026-06-03T00:00:00.000Z", "recommendations": "asfadsf", "issuesIdentified": "adsfadsf", "extinguisherSerial": "SN-EXP01"}, {"id": "3003a7da-dc6b-4336-b121-dd4f20efc716", "createdAt": "2026-06-04T09:34:16.271Z", "actionTaken": "Replaced discharge hose and recharged CO2 canister.", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "77813867-8ba5-4e42-b833-141470f9412c", "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802", "conditionsNoted": null, "maintenanceDate": "2026-05-25T00:00:00.000Z", "recommendations": "Schedule re-inspection in 6 months", "issuesIdentified": "Cracked hose, low pressure", "extinguisherSerial": "SN-ACT01"}]}	2026-06-04 10:12:00.261	2026-06-04 10:17:00.259
e929bdf3-2338-4285-b5b7-37c3660ba632	INVENTORY	DAILY	{"total": 8, "byType": {"CO2": 4, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "DAILY", "byStatus": {"ACTIVE": 8}, "byBuilding": {"Building A": 3, "Building B": 3, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:12:00.345	2026-06-04 10:17:00.343
474c878f-1da4-4252-98de-ecb0029843a8	INSPECTION	CUSTOM	{"overdue": 0, "pending": 4, "completed": 4, "byInspector": [{"completed": 3, "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292"}, {"completed": 1, "inspectorId": "15d8541f-8a01-4b55-8aca-61258b669cb1"}], "completionRate": "50%"}	2026-06-04 10:14:08.516	2026-06-04 10:19:08.514
c85f2a51-4ac6-4e9d-8c25-babd26e45305	INVENTORY	CUSTOM	{"total": 13, "byType": {"CO2": 6, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 11, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "MAIN HALL ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:14:08.617	2026-06-04 10:19:08.615
a0ac0a93-e141-4121-87c0-fa329879f3a9	INVENTORY	CUSTOM	{"total": 14, "byType": {"CO2": 7, "FOAM": 2, "WATER": 2, "DRY_CHEMICAL": 3}, "period": "CUSTOM", "byStatus": {"ACTIVE": 12, "EXPIRED": 2}, "byBuilding": {"Building A": 5, "Building B": 5, "MAIN HALL ": 1, "Main Hall ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:21:27.758	2026-06-04 10:26:27.755
e231f96b-6a7a-4de0-8984-de6e4bea13c7	INSPECTION	CUSTOM	{"overdue": 0, "pending": 4, "completed": 4, "byInspector": [{"completed": 3, "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292"}, {"completed": 1, "inspectorId": "15d8541f-8a01-4b55-8aca-61258b669cb1"}], "completionRate": "50%"}	2026-06-04 10:21:27.888	2026-06-04 10:26:27.886
4e982083-cf8c-4786-930b-5634af15a7cb	COMPLIANCE	CUSTOM	{"expired": 2, "expiringThisMonth": 2, "expiringNext30Days": 2, "compliantPercentage": "86%"}	2026-06-04 10:23:16.27	2026-06-04 10:28:16.268
2cc603eb-3ca5-41d4-be32-7616ae11f143	INVENTORY	MONTHLY	{"total": 10, "byType": {"CO2": 6, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "MONTHLY", "byStatus": {"ACTIVE": 10}, "byBuilding": {"Building A": 3, "Building B": 3, "MAIN HALL ": 1, "Main Hall ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:23:16.307	2026-06-04 10:28:16.305
aada05cc-759e-40df-b594-7b05e5bb5283	INVENTORY	DAILY	{"total": 8, "byType": {"CO2": 4, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "DAILY", "byStatus": {"ACTIVE": 8}, "byBuilding": {"Building A": 3, "Building B": 3, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:23:16.337	2026-06-04 10:28:16.33
45885772-516a-4edb-bed2-b21b5cc062fd	MAINTENANCE	CUSTOM	{"byExtinguisher": [{"count": 1, "extinguisherId": "f112f3a5-895f-4704-9eda-f7d31b452fc1"}, {"count": 1, "extinguisherId": "2730aaa9-d5ef-4bb9-a46a-0c888dd9e301"}, {"count": 1, "extinguisherId": "2b55bc07-9fb4-43dc-81fe-319689f5b206"}, {"count": 1, "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802"}], "lastThirtyDays": 4, "totalActivities": 4, "recentActivities": [{"id": "f74b2af5-92e1-4d8a-a0d0-399583bfce93", "createdAt": "2026-06-04T09:49:36.339Z", "actionTaken": "REPLACED THE FIRE EXTINGUISHER", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "4f698e0a-7bb7-477f-a431-fe896129da68", "extinguisherId": "2730aaa9-d5ef-4bb9-a46a-0c888dd9e301", "conditionsNoted": null, "maintenanceDate": "2026-06-03T00:00:00.000Z", "recommendations": "TO CHECK REGULARLY IF FIRE EXTINGUISHERS ARE EMPTY", "issuesIdentified": "THE FIRE EXTINGUISHER WAS EMPTY", "extinguisherSerial": "SN-ACT03"}, {"id": "d118410c-300d-40af-93a4-f8590c52f1ff", "createdAt": "2026-06-04T09:54:18.668Z", "actionTaken": "dasfdadsf", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "88051bd9-7626-4423-a762-7650d43ee63b", "extinguisherId": "2b55bc07-9fb4-43dc-81fe-319689f5b206", "conditionsNoted": "fasdfasd", "maintenanceDate": "2026-06-03T00:00:00.000Z", "recommendations": "asfadsf", "issuesIdentified": "adsfadsf", "extinguisherSerial": "SN-EXP01"}, {"id": "fefd5ddb-819b-4293-9f30-ccd505c26cc6", "createdAt": "2026-06-04T10:22:55.702Z", "actionTaken": "Replaced the new fire extinguisher", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "3223f580-13ab-4638-8e7a-ca9c45653692", "extinguisherId": "f112f3a5-895f-4704-9eda-f7d31b452fc1", "conditionsNoted": "sad", "maintenanceDate": "2026-06-02T00:00:00.000Z", "recommendations": "to tell us sooner", "issuesIdentified": "was empty", "extinguisherSerial": "SN-002"}, {"id": "3003a7da-dc6b-4336-b121-dd4f20efc716", "createdAt": "2026-06-04T09:34:16.271Z", "actionTaken": "Replaced discharge hose and recharged CO2 canister.", "inspectorId": "06149201-a3db-44ae-b57a-4ff0d9803292", "inspectionId": "77813867-8ba5-4e42-b833-141470f9412c", "extinguisherId": "67af6fe4-9f5d-4233-92d5-473c180cf802", "conditionsNoted": null, "maintenanceDate": "2026-05-25T00:00:00.000Z", "recommendations": "Schedule re-inspection in 6 months", "issuesIdentified": "Cracked hose, low pressure", "extinguisherSerial": "SN-ACT01"}]}	2026-06-04 10:23:16.344	2026-06-04 10:28:16.342
a4b86255-e9a9-4269-b945-3a5b280daaff	INVENTORY	YEARLY	{"total": 10, "byType": {"CO2": 6, "FOAM": 1, "WATER": 1, "DRY_CHEMICAL": 2}, "period": "YEARLY", "byStatus": {"ACTIVE": 10}, "byBuilding": {"Building A": 3, "Building B": 3, "MAIN HALL ": 1, "Main Hall ": 1, "Main Building ": 1, "Main city hall": 1}}	2026-06-04 10:23:16.38	2026-06-04 10:28:16.378
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: export_jobs export_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_jobs
    ADD CONSTRAINT export_jobs_pkey PRIMARY KEY (id);


--
-- Name: report_caches report_caches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_caches
    ADD CONSTRAINT report_caches_pkey PRIMARY KEY (id);


--
-- Name: export_jobs export_jobs_reportCacheId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_jobs
    ADD CONSTRAINT "export_jobs_reportCacheId_fkey" FOREIGN KEY ("reportCacheId") REFERENCES public.report_caches(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict eWnuMQa6xeQPXCkuWcqwZHbsGX8Fs3wguATXBanUscBL6h0mGfVPbLx9SBiWW9z

