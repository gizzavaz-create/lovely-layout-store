create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- first user becomes admin
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null default '',
  description text not null default '',
  price numeric(10,2),
  category text not null,
  platform text not null,
  affiliate_url text not null,
  featured boolean not null default false,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read" on public.products for select to anon, authenticated using (true);
create policy "admin insert" on public.products for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update" on public.products for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete" on public.products for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.increment_click(_product_id uuid) returns void language sql security definer set search_path = public as $$ update public.products set clicks = clicks + 1 where id = _product_id $$;
grant execute on function public.increment_click(uuid) to anon, authenticated;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  contact text not null check (char_length(contact) between 5 and 255),
  created_at timestamptz not null default now()
);
grant insert on public.leads to anon, authenticated;
grant select, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "anyone insert" on public.leads for insert to anon, authenticated with check (true);
create policy "admin read" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));

insert into public.products (name, image_url, description, price, category, platform, affiliate_url, featured) values
('Sérum Vitamina C Glow', 'https://placehold.co/600x600/E8DCCF/4A3F35?text=S%C3%A9rum+Vitamina+C', 'Pele luminosa e uniforme em poucas semanas.', 89.90, 'beleza', 'TikTok Shop', 'https://www.tiktok.com', true),
('Paleta de Sombras Nude', 'https://placehold.co/600x600/D2BBA0/4A3F35?text=Paleta+Nude', '12 tons neutros para o dia a dia.', 59.90, 'beleza', 'Shopee', 'https://shopee.com.br', true),
('Whey Protein Baunilha 900g', 'https://placehold.co/600x600/E8DCCF/4A3F35?text=Whey+Protein', 'Proteína de alta qualidade com sabor suave.', 129.90, 'suplementos', 'Shopee', 'https://shopee.com.br', true),
('Colágeno Verisol', 'https://placehold.co/600x600/D2BBA0/4A3F35?text=Col%C3%A1geno', 'Cuidado de dentro para fora para pele e cabelo.', 74.90, 'suplementos', 'TikTok Shop', 'https://www.tiktok.com', false),
('Vaso de Cerâmica Minimalista', 'https://placehold.co/600x600/E8DCCF/4A3F35?text=Vaso+Cer%C3%A2mica', 'Toque artesanal para qualquer cantinho.', 49.90, 'casa-e-decoracao', 'Shopee', 'https://shopee.com.br', true),
('Curso Organização da Casa', 'https://placehold.co/600x600/D2BBA0/4A3F35?text=Curso+Organiza%C3%A7%C3%A3o', 'Método simples para uma casa leve e organizada.', 197.00, 'cursos-e-ebooks', 'Hotmart', 'https://hotmart.com', true),
('Ebook Rotina de Skincare', 'https://placehold.co/600x600/E8DCCF/4A3F35?text=Ebook+Skincare', 'Guia completo para montar sua rotina ideal.', 27.00, 'cursos-e-ebooks', 'Kiwify', 'https://kiwify.com.br', false),
('Mini Umidificador Aromático', 'https://placehold.co/600x600/D2BBA0/4A3F35?text=Umidificador', 'O achadinho que deixa o ambiente cheiroso.', 39.90, 'achadinhos', 'TikTok Shop', 'https://www.tiktok.com', true);