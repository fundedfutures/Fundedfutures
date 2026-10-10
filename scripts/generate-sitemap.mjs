import { readFileSync, writeFileSync } from 'node:fs';
const origin = 'https://fundededucationfutures.com';
const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const paths = [...source.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]).filter(path => path !== '/thank-you' && !path.includes('*'));
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(path => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(new URL('../public/robots.txt', import.meta.url), `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml
`);
