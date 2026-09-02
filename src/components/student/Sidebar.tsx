import React from 'react';
import { NavLink } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Video,
  DownloadCloud,
  LogOut,
  User as UserIcon,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Sidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  const { userData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <aside className="w-64 bg-[#0A0F1C] flex flex-col flex-shrink-0 fixed inset-y-0 z-50 border-r border-slate-800/60 shadow-xl">
      <div className="p-6 flex flex-col items-center justify-center border-b border-slate-800/60 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
        
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/30 mb-3 z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
          P
        </div>
        <div className="text-center z-10 flex flex-col items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 font-extrabold text-[22px] tracking-tight uppercase leading-none drop-shadow-sm">
            Piyush
          </span>
          <span className="text-white font-extrabold text-[15px] tracking-[0.15em] uppercase leading-tight mt-1 opacity-95">
            Chemistry
          </span>
          <span className="text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-1.5 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Hub
          </span>
        </div>
      </div>
      
      <div className="px-5 py-5 border-b border-slate-800/60 bg-slate-800/20">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Your Profile</p>
        <p className="text-sm font-bold text-slate-200 mt-1 truncate">{userData?.displayName || 'Student'}</p>
        <div className="flex gap-2 mt-2">
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] rounded-full font-bold">Class {userData?.studentClass || '12'}</span>
          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] rounded-full font-bold">{userData?.board || 'CBSE'}</span>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        <NavLink to="/dashboard" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent', 'flex items-center px-5 py-2.5 text-sm font-semibold transition-all duration-200')}>
          <LayoutDashboard className="mr-3 h-4 w-4 flex-shrink-0" /> Dashboard
        </NavLink>
        
        <div className="text-slate-500 text-[10px] uppercase font-bold px-5 py-4 mb-1">Learning</div>
        
        <NavLink to="/study-materials" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent', 'flex items-center px-5 py-2.5 text-sm font-semibold transition-all duration-200')}>
          <FileText className="mr-3 h-4 w-4 flex-shrink-0" /> Study Materials
        </NavLink>
        <NavLink to="/videos" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent', 'flex items-center px-5 py-2.5 text-sm font-semibold transition-all duration-200')}>
          <Video className="mr-3 h-4 w-4 flex-shrink-0" /> Video Lectures
        </NavLink>
        <NavLink to="/questions" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent', 'flex items-center px-5 py-2.5 text-sm font-semibold transition-all duration-200')}>
          <HelpCircle className="mr-3 h-4 w-4 flex-shrink-0" /> Important Questions
        </NavLink>

        <div className="text-slate-500 text-[10px] uppercase font-bold px-5 py-4 mb-1">Personal</div>
        
        <NavLink to="/downloads" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent', 'flex items-center px-5 py-2.5 text-sm font-semibold transition-all duration-200')}>
          <DownloadCloud className="mr-3 h-4 w-4 flex-shrink-0" /> Downloads
        </NavLink>
        <NavLink to="/profile" onClick={onMobileClose} className={({ isActive }) => cn(isActive ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent', 'flex items-center px-5 py-2.5 text-sm font-semibold transition-all duration-200')}>
          <UserIcon className="mr-3 h-4 w-4 flex-shrink-0" /> Profile
        </NavLink>
      </nav>

      <div className="mt-auto px-4 py-2 border-t border-slate-800/60">
        <button 
          onClick={toggleTheme} 
          className="flex w-full items-center justify-between p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="text-xs font-semibold">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-600'}`}>
            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800/60 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => signOut(auth)}>
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400">
          <LogOut className="h-4 w-4" />
        </div>
        <div className="flex-1 overflow-hidden text-left">
          <p className="text-xs text-slate-300 font-semibold truncate">Logout</p>
        </div>
      </div>
    </aside>
  );
}
