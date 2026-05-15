import React from 'react'
import AdminDashboard from './AdminDashboard'
import { User } from '../../types'

interface DashboardProps {
  user: User
  activeMenu: string
}

const PlaceholderDashboard: React.FC<DashboardProps> = ({ user, activeMenu }) => {
  return <AdminDashboard user={user} activeMenu={activeMenu} />
}

export default PlaceholderDashboard
