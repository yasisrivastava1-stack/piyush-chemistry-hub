const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/Users.tsx', 'utf8');

// The file needs a complete rewrite. We can just replace the whole file.
