import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '../../index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  const isProduction = process.env.NODE_ENV === 'production';
  const apiUrl = isProduction ? `https://${req.get('host')}/api/metrics` : 'http://localhost:8080/api/metrics';
  // Inject API key and url from environment
  html = html.replace('YOUR_API_URL_HERE', apiUrl);
  html = html.replace('YOUR_API_KEY_HERE', process.env.API_KEY || '');
  html = html.replace('YOUR_LOCAL_URL_HERE', isProduction ? 'false' : 'true');
  
  res.send(html);
});

export default router;
