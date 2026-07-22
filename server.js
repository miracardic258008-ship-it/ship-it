/**
 * server.js – RadarNav Express sunucusu
 * Render'da uyku moduna girmemesi için kendi kendine ping atar
 */

const express = require('express');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 3001;

// Statik dosyaları sun
app.use(express.static(path.join(__dirname)));

// Her isteği index.html'e yönlendir (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`RadarNav sunucu çalışıyor: port ${PORT}`);

  // ── Uyku moduna girme — her 14 dakikada kendi kendine ping ──
  const RENDER_URL = process.env.RENDER_URL || '';
  if (RENDER_URL) {
    setInterval(() => {
      https.get(RENDER_URL, res => {
        console.log(`[ping] ${new Date().toISOString()} – ${res.statusCode}`);
      }).on('error', err => {
        console.warn('[ping] hata:', err.message);
      });
    }, 14 * 60 * 1000); // 14 dakika
  }
});
