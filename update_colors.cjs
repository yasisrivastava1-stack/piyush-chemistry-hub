const fs = require('fs');

let content = fs.readFileSync('src/components/student/Sidebar.tsx', 'utf8');

// NavLinks non-active states
content = content.replace(/text-slate-400 hover:text-slate-200/g, 'text-slate-200 hover:text-white');

// Section headers ('Learning', 'Personal')
content = content.replace(/text-slate-500 text-\[10px\]/g, 'text-slate-300 text-[10px]');

// 'Your Profile' header
content = content.replace(/text-blue-300\/70/g, 'text-slate-300');

// Theme toggle text and logout icon
content = content.replace(/text-slate-400/g, 'text-slate-200');

// Logout text
content = content.replace(/text-slate-300 font-semibold truncate/g, 'text-slate-200 font-semibold truncate');

fs.writeFileSync('src/components/student/Sidebar.tsx', content);
