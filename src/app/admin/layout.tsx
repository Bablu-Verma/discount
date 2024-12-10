import React, { ReactNode } from 'react'
import AdminProvider from './admin_provider';




interface LayoutProps {
    children: ReactNode;
  }
  
const AdminLayout:React.FC<LayoutProps> = ({ children }) => {

  return (
    <AdminProvider>{children}</AdminProvider>
  )
}

export default AdminLayout