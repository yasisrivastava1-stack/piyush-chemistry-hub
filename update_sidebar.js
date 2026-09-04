const fs = require('fs');

let content = fs.readFileSync('src/components/student/Sidebar.tsx', 'utf8');

// Replace main background
content = content.replace('bg-blue-950', 'bg-blue-600');
content = content.replace('border-blue-900', 'border-blue-500');

// Logo block
content = content.replace(
  'from-blue-500 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/30',
  'bg-white rounded-2xl flex items-center justify-center font-extrabold text-blue-600 text-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-blue-400/50'
);

content = content.replace(
  'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 font-extrabold text-[22px]',
  'text-white font-extrabold text-[22px]'
);

content = content.replace(
  'text-blue-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-1.5 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20',
  'text-blue-100 font-bold text-[10px] tracking-[0.3em] uppercase mt-1.5 bg-blue-700/50 px-2 py-0.5 rounded-full border border-blue-500/50'
);

// Borders
content = content.replace(/border-slate-800\/60/g, 'border-blue-500/50');
content = content.replace(/bg-slate-800\/20/g, 'bg-blue-700/30');

// Profile text
content = content.replace(/text-slate-500/g, 'text-blue-200');
content = content.replace(/text-slate-200/g, 'text-white');

// Badges
content = content.replace(/bg-blue-500\/10/g, 'bg-blue-700/50');
content = content.replace(/text-blue-400/g, 'text-blue-50');
content = content.replace(/border-blue-500\/20/g, 'border-blue-400/30');

content = content.replace(/bg-indigo-500\/10/g, 'bg-blue-700/50');
content = content.replace(/text-indigo-400/g, 'text-blue-50');
content = content.replace(/border-indigo-500\/20/g, 'border-blue-400/30');

// NavLinks
content = content.replace(
  /isActive \? 'bg-blue-600\/10 text-blue-400 border-l-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800\/50 border-l-2 border-transparent'/g,
  "isActive ? 'bg-blue-700 text-white border-l-2 border-white shadow-inner' : 'text-blue-100 hover:text-white hover:bg-blue-500 border-l-2 border-transparent'"
);

// Theme Toggle & Bottom Actions
content = content.replace(/text-slate-400/g, 'text-blue-100');
content = content.replace(/hover:text-slate-200/g, 'hover:text-white');
content = content.replace(/hover:bg-slate-800\/50/g, 'hover:bg-blue-700/50');
content = content.replace(/bg-slate-600/g, 'bg-blue-800');

// Logout button
content = content.replace(/bg-slate-800/g, 'bg-blue-700');
content = content.replace(/text-slate-300/g, 'text-white');

fs.writeFileSync('src/components/student/Sidebar.tsx', content);
