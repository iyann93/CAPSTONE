INSERT INTO shared.role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM shared.roles r, shared.permissions p 
WHERE r.nama_role = 'Admin TU' AND p.modul = 'siswa' AND p.aksi = 'read'
ON CONFLICT (role_id, permission_id) DO NOTHING;
