import React, { ReactNode } from 'react'


interface LayoutProps {
    children: ReactNode;
  }
  
const AdminLayout:React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>{children}</div>
  )
}

export default AdminLayout