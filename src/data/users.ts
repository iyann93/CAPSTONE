import { User } from '../types'

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    fullName: 'Budi Santoso',
    role: 'Admin',
    avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=810100&color=fff',
    email: 'admin@smanusantara.sch.id',
    phone: '+62 812-3456-7890',
    nip: '198507232010011015',
    address: 'Jl. Pendidikan No. 1, Kel. Menteng, Jakarta Pusat',
  },
  {
    id: '2',
    username: 'kepsek',
    password: 'kepsek123',
    fullName: 'Dr. H. Ahmad Dahlan',
    role: 'Kepala Sekolah',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Dahlan&background=0f172a&color=fff',
  },
  {
    id: '3',
    username: 'wakepsek',
    password: 'wakepsek123',
    fullName: 'Dra. Siti Aminah',
    role: 'Wakil Kepsek',
    avatar: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=1e293b&color=fff',
  },
  {
    id: '4',
    username: 'guru',
    password: 'guru123',
    fullName: 'Dra. Sri Wahyuni',
    role: 'Guru',
    avatar: 'https://ui-avatars.com/api/?name=Sri+Wahyuni&background=334155&color=fff',
  },
  {
    id: '5',
    username: 'siswa',
    password: 'siswa123',
    fullName: 'Andi Setiawan',
    role: 'Siswa',
    avatar: 'https://ui-avatars.com/api/?name=Andi+Setiawan&background=475569&color=fff',
  },
]
