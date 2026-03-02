-- Required for AdminDashboard product creation from frontend anon key.
-- Run in Supabase SQL editor.

create policy if not exists "Allow public insert on products"
on public.products
for insert
to anon
with check (true);
