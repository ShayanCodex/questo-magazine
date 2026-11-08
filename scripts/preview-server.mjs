import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 4173;
const distDir = path.resolve('dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // Determine file path
  let targetPath = path.join(distDir, pathname);

  if (pathname === '/' || pathname === '') {
    targetPath = path.join(distDir, 'index.html');
  } else if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
    if (fs.existsSync(`${targetPath}.html`)) {
      targetPath = `${targetPath}.html`;
    } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
      targetPath = path.join(targetPath, 'index.html');
    }
  }

  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    const notFoundPath = path.join(distDir, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.end(fs.readFileSync(notFoundPath));
    } else {
      res.end('<h1>404 Not Found</h1>');
    }
    return;
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Apply Headers per netlify.toml and vercel.json rules
  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  if (pathname.startsWith('/assets/')) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else {
    headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
  }

  res.writeHead(200, headers);

  if (req.method === 'HEAD') {
    res.end();
  } else {
    const fileStream = fs.createReadStream(targetPath);
    fileStream.pipe(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

