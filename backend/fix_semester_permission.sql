-- Insert modul semester if not exists
INSERT INTO shared.permissions (nama_permission, modul, aksi)
VALUES 
  ('Membaca Semester', 'semester', 'read'),
  ('Membuat Semester', 'semester', 'create'),
  ('Mengubah Semester', 'semester', 'update'),
  ('Menghapus Semester', 'semester', 'delete')
ON CONFLICT (modul, aksi) DO NOTHING;

-- Grant permissions to Admin TU
INSERT INTO shared.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM shared.roles r, shared.permissions p 
WHERE r.nama_role = 'Admin TU' AND p.modul = 'semester'
ON CONFLICT (role_id, permission_id) DO NOTHING;
