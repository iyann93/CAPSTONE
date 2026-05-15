import type { ReactNode } from 'react'

export type UserRole = 'Admin' | 'Kepala Sekolah' | 'Wakil Kepsek' | 'Guru' | 'Siswa'

export interface User {
  id: string
  username: string
  fullName: string
  role: UserRole
  avatar?: string
  email?: string
  phone?: string
  nip?: string
  address?: string
}

export interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: ReactNode
  iconBg: string
  iconColor: string
}

export interface ScheduleItem {
  timeStart: string
  timeEnd: string
  subject: string
  className: string
  teacher: string
  accentColor: string
  accentBg: string
}

export interface ActivityItem {
  time: string
  userName: string
  userRole: string
  module: 'Akademik' | 'Keuangan' | 'Master Data'
  activity: string
}

export interface SalaryItem {
  label: string
  count: number
  amount: string
  percentage: number
  color: string
}

export interface ChartDataItem {
  kelas: string
  tuntas: number
  belumTuntas: number
}

export interface SidebarProps {
  collapsed: boolean
  role: UserRole
  user?: User
  activeMenu: string
  onMenuClick: (label: string) => void
  onClose?: () => void
}

export interface TopBarProps {
  onToggle: () => void
  onLogout: () => void
  onProfileClick: () => void
  user: User
}
