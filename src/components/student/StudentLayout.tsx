import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onMobileClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2.5 ml-3 flex-1 justify-center pr-8">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm shadow-blue-500/20 transform -rotate-2">P</div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-[13px] tracking-tight uppercase leading-none">Piyush Chemistry</span>
              <span className="text-blue-600 font-bold text-[9px] tracking-widest uppercase">Hub</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
