import React, { ReactNode } from 'react'
import DashboardUI from '../_admin_components/DashboardUI';


interface LayoutProps {
    children: ReactNode;
  }
  
const DashboardLayout:React.FC<LayoutProps> = ({ children }) => {
  return (
    <DashboardUI children={children}/>
  )
}

export default DashboardLayout