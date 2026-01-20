CREATE SEQUENCE movies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.movies (
  id INT NOT NULL DEFAULT nextval('movies_id_seq'::regclass),
  url TEXT,
  name VARCHAR(255),
  type VARCHAR(50),
  language VARCHAR(50),
  genres TEXT,
  schedule_days TEXT,
  status VARCHAR(50),
  runtime INT,
  average_runtime INT,
  premiered DATE,
  ended DATE,
  rating NUMERIC(3,1),
  image_url TEXT,
  summary TEXT,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT movies_pkey PRIMARY KEY (id)
);

ALTER TABLE public.movies ADD CONSTRAINT movies_url_unique UNIQUE (url);
