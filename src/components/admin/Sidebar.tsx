import React from 'react';
import { NavLink } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  BarChart,
  Bell,
  Settings,
  LogOut,
  FolderOpen
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Classes & Boards', href: '/admin/classes', icon: FolderOpen },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Question Bank', href: '/admin/questions', icon: HelpCircle },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  return (
    <aside className="w-64 bg-[#0F172A] flex flex-col flex-shrink-0 fixed inset-y-0 z-50">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white text-xl">P</div>
        <div className="text-white font-bold tracking-tight text-sm uppercase leading-tight">
          Piyush Chemistry Hub<br/><span className="text-blue-400 text-[10px]">Admin Panel</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="text-slate-500 text-[10px] uppercase font-bold px-2 py-2 mb-1">Menu</div>
        <NavLink to="/admin/dashboard" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <LayoutDashboard className="mr-3 h-4 w-4 flex-shrink-0" /> Dashboard
        </NavLink>
        <NavLink to="/admin/users" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <Users className="mr-3 h-4 w-4 flex-shrink-0" /> Users
        </NavLink>
        <NavLink to="/admin/classes" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <FolderOpen className="mr-3 h-4 w-4 flex-shrink-0" /> Classes & Boards
        </NavLink>
        <NavLink to="/admin/courses" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <BookOpen className="mr-3 h-4 w-4 flex-shrink-0" /> Chapters & Topics
        </NavLink>

        <div className="text-slate-500 text-[10px] uppercase font-bold px-2 py-6 mb-1">Content Management</div>
        <NavLink to="/admin/content" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <FileText className="mr-3 h-4 w-4 flex-shrink-0" /> Notes & PDFs
        </NavLink>
        <NavLink to="/admin/questions" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <HelpCircle className="mr-3 h-4 w-4 flex-shrink-0" /> Question Bank
        </NavLink>

        <div className="text-slate-500 text-[10px] uppercase font-bold px-2 py-6 mb-1">System</div>
        <NavLink to="/admin/analytics" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <BarChart className="mr-3 h-4 w-4 flex-shrink-0" /> Analytics
        </NavLink>
        <NavLink to="/admin/notifications" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <Bell className="mr-3 h-4 w-4 flex-shrink-0" /> Notifications
        </NavLink>
        <NavLink to="/admin/settings" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white', 'flex items-center px-3 py-2 rounded-md text-xs font-medium')}>
          <Settings className="mr-3 h-4 w-4 flex-shrink-0" /> Settings
        </NavLink>
      </nav>
      <div className="p-4 border-t border-slate-800 flex items-center space-x-3 cursor-pointer hover:bg-slate-800" onClick={() => signOut(auth)}>
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 text-white">
          <LogOut className="h-4 w-4" />
        </div>
        <div className="flex-1 overflow-hidden text-left">
          <p className="text-xs text-white font-semibold truncate">Admin_Session</p>
          <p className="text-[10px] text-slate-400 uppercase">Logout</p>
        </div>
      </div>
    </aside>
  );
}
