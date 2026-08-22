import React, { useState } from 'react';
import { Outlet, Link } from 'react-router';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row overflow-hidden">
      <div className="md:hidden bg-[#0F172A] text-white flex justify-between items-center p-4 flex-shrink-0">
        <span className="font-bold text-lg tracking-tight">PIYUSH CHEMISTRY</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      <div className={`fixed inset-0 z-40 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:relative md:translate-x-0 md:flex flex-shrink-0 md:w-64`}>
        <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96">
            <span className="text-slate-400 text-xs font-medium">🔍 Search for questions, students or papers...</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full absolute -top-1.5 -right-1.5 font-bold border border-white">4</span>
              <span className="text-slate-500">🔔</span>
            </div>
            <div className="flex space-x-2">
              <Link to="/admin/content" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700 flex items-center justify-center">+ New Content</Link>
              <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded shadow-sm hover:bg-slate-50">Export Report</button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
