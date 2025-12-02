
Buatkan project lengkap bernama Signatura, yaitu platform tanda tangan digital seperti Mekari Sign, menggunakan teknologi berikut:

Frontend: Next.js 14 (App Router)

UI/UX: TailwindCSS + ShadCN UI + Lucide Icons

Auth & Database: Supabase (Auth, SQL DB, Storage)

Editor tanda tangan: Fabric.js dalam komponen React

Penyimpanan dokumen: Supabase Storage

Realtime: Supabase Realtime untuk chat dan activity log

Role-based access: admin & user

Admin = full akses

🎯 GOALS APLIKASI

User & admin bisa membuat, mengunggah, dan menandatangani dokumen.

Editor tanda tangan berbasis Fabric.js.

Template surat otomatis (HTML → PDF → simpan ke Supabase Storage).

Realtime chat antar admin-user dalam satu dokumen.

Workflow permintaan tanda tangan (request → approve → signed).

User dapat membagikan dokumen final ke orang lain via link publik.


supabase
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  document_id uuid,
  actor_id uuid,
  role text CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
  action text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id),
  CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id)
);
CREATE TABLE public.chats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  document_id uuid,
  sender_id uuid,
  role text NOT NULL CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
  message text NOT NULL,
  device_info text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chats_pkey PRIMARY KEY (id),
  CONSTRAINT chats_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id),
  CONSTRAINT chats_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id)
);
CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id uuid,
  admin_id uuid,
  user_id uuid,
  title text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'pending'::text, 'signed'::text, 'cancelled'::text])),
  final_pdf_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id),
  CONSTRAINT documents_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id),
  CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.signatures (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  document_id uuid,
  user_id uuid,
  signature_url text NOT NULL,
  ip_address text,
  device_info text,
  signed_at timestamp with time zone DEFAULT now(),
  hash text NOT NULL,
  CONSTRAINT signatures_pkey PRIMARY KEY (id),
  CONSTRAINT signatures_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id),
  CONSTRAINT signatures_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_id uuid,
  name text NOT NULL,
  html_content text NOT NULL,
  merge_fields jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT templates_pkey PRIMARY KEY (id),
  CONSTRAINT templates_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);