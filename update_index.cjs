const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  '<meta property="og:type" content="website" />',
  '<meta property="og:type" content="website" />\n    <meta property="og:image" content="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&h=630&q=80" />'
);

content = content.replace(
  '<meta name="twitter:card" content="summary_large_image" />',
  '<meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&h=630&q=80" />'
);

fs.writeFileSync('index.html', content);
