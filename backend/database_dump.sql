--
-- PostgreSQL database dump
--

\restrict aWzbPsYimeF9ZpqTll6A0KGc1wrkzD0MY4MKFrvnEOIEnWVvBBtgbdbpIKWc1EC

-- Dumped from database version 18.4 (Postgres.app)
-- Dumped by pg_dump version 18.4 (Postgres.app)

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
-- Name: categories; Type: TABLE; Schema: public; Owner: nikolasntaras
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO nikolasntaras;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: nikolasntaras
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO nikolasntaras;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nikolasntaras
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: measurements; Type: TABLE; Schema: public; Owner: nikolasntaras
--

CREATE TABLE public.measurements (
    id integer NOT NULL,
    sensor_id integer NOT NULL,
    value double precision NOT NULL,
    unit character varying(20) NOT NULL,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.measurements OWNER TO nikolasntaras;

--
-- Name: measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: nikolasntaras
--

CREATE SEQUENCE public.measurements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.measurements_id_seq OWNER TO nikolasntaras;

--
-- Name: measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nikolasntaras
--

ALTER SEQUENCE public.measurements_id_seq OWNED BY public.measurements.id;


--
-- Name: sensor_categories; Type: TABLE; Schema: public; Owner: nikolasntaras
--

CREATE TABLE public.sensor_categories (
    sensor_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.sensor_categories OWNER TO nikolasntaras;

--
-- Name: sensors; Type: TABLE; Schema: public; Owner: nikolasntaras
--

CREATE TABLE public.sensors (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.sensors OWNER TO nikolasntaras;

--
-- Name: sensors_id_seq; Type: SEQUENCE; Schema: public; Owner: nikolasntaras
--

CREATE SEQUENCE public.sensors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensors_id_seq OWNER TO nikolasntaras;

--
-- Name: sensors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nikolasntaras
--

ALTER SEQUENCE public.sensors_id_seq OWNED BY public.sensors.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nikolasntaras
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(80) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(100),
    email character varying(120),
    role character varying(20)
);


ALTER TABLE public.users OWNER TO nikolasntaras;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nikolasntaras
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO nikolasntaras;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nikolasntaras
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: measurements id; Type: DEFAULT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.measurements ALTER COLUMN id SET DEFAULT nextval('public.measurements_id_seq'::regclass);


--
-- Name: sensors id; Type: DEFAULT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.sensors ALTER COLUMN id SET DEFAULT nextval('public.sensors_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: nikolasntaras
--

COPY public.categories (id, name) FROM stdin;
1	Θερμοκρασία
2	Υγρασία
\.


--
-- Data for Name: measurements; Type: TABLE DATA; Schema: public; Owner: nikolasntaras
--

COPY public.measurements (id, sensor_id, value, unit, "timestamp") FROM stdin;
1	1	23.4	°C	2026-08-30 10:39:13.293863
2	1	45	%	2026-08-30 10:54:13.293863
3	2	25.1	°C	2026-08-30 11:19:13.293863
4	3	65.5	%	2026-08-30 11:29:13.293863
\.


--
-- Data for Name: sensor_categories; Type: TABLE DATA; Schema: public; Owner: nikolasntaras
--

COPY public.sensor_categories (sensor_id, category_id) FROM stdin;
1	1
2	1
1	2
3	2
\.


--
-- Data for Name: sensors; Type: TABLE DATA; Schema: public; Owner: nikolasntaras
--

COPY public.sensors (id, name, description) FROM stdin;
1	Αισθητήρας Σαλονιού	Κεντρικός χώρος - Θερμοκρασία & Υγρασία
2	Αισθητήρας Κουζίνας	Παρακολούθηση θερμοκρασίας μαγειρέματος
3	Αισθητήρας Μπάνιου	Έλεγχος επιπέδων υγρασίας
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nikolasntaras
--

COPY public.users (id, username, password, full_name, email, role) FROM stdin;
1	admin	scrypt:32768:8:1$38bpvQiwa3ds24Lr$b4c7cfa438a241f29f2cb8680c4bd8be9543a5863e794d5fd8120b619ae715ceb995dff7ffa67d4b50e16ed6386bda35000c01c975904c9abe9ac110c97ca657	Διαχειριστής Συστήματος	admin@example.com	Admin
2	user	scrypt:32768:8:1$qXPWBHei7s6C6y2W$ef914d5bb8bd8905ccdcebcc692a43aee8585329a12c108d0bae745d958bfb39b4b87d56ab9b748fdbb27ae729a447239335b6d9dc59c9b4a24175db511f1864	Απλός Χρήστης	user@example.com	Simple
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nikolasntaras
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- Name: measurements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nikolasntaras
--

SELECT pg_catalog.setval('public.measurements_id_seq', 4, true);


--
-- Name: sensors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nikolasntaras
--

SELECT pg_catalog.setval('public.sensors_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nikolasntaras
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: measurements measurements_pkey; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_pkey PRIMARY KEY (id);


--
-- Name: sensor_categories sensor_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.sensor_categories
    ADD CONSTRAINT sensor_categories_pkey PRIMARY KEY (sensor_id, category_id);


--
-- Name: sensors sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: measurements measurements_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.measurements
    ADD CONSTRAINT measurements_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(id) ON DELETE CASCADE;


--
-- Name: sensor_categories sensor_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.sensor_categories
    ADD CONSTRAINT sensor_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: sensor_categories sensor_categories_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nikolasntaras
--

ALTER TABLE ONLY public.sensor_categories
    ADD CONSTRAINT sensor_categories_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict aWzbPsYimeF9ZpqTll6A0KGc1wrkzD0MY4MKFrvnEOIEnWVvBBtgbdbpIKWc1EC

