// node generate.js
// Microsoft Edge TTS — tr-TR-EmelNeural (Türkçe kadın sesi)
// Gereksinim: npm install msedge-tts (zaten yüklü)

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs   = require('fs');
const path = require('path');

const VOICE = 'tr-TR-EmelNeural';
const OUT   = __dirname; // audio/ klasörü

const FILES = [
  // ROTA
  ['rota_hesaplaniyor',   'Rota hesaplanıyor.'],
  ['rota_basladi',        'Rota başlatıldı.'],
  ['rota_iptal',          'Rota iptal edildi.'],
  ['rota_yeniden',        'Rota yeniden hesaplanıyor.'],
  ['hedefe_ulastiniz',    'Hedefinize ulaştınız.'],

  // MESAFE + YÖN
  ['50m_saga',            '50 metre sonra sağa dönünüz.'],
  ['50m_sola',            '50 metre sonra sola dönünüz.'],
  ['100m_saga',           '100 metre sonra sağa dönünüz.'],
  ['100m_sola',           '100 metre sonra sola dönünüz.'],
  ['200m_saga',           '200 metre sonra sağa dönünüz.'],
  ['200m_sola',           '200 metre sonra sola dönünüz.'],
  ['500m_saga',           '500 metre sonra sağa dönünüz.'],
  ['500m_sola',           '500 metre sonra sola dönünüz.'],
  ['1km_saga',            '1 kilometre sonra sağa dönünüz.'],
  ['1km_sola',            '1 kilometre sonra sola dönünüz.'],

  ['50m_duz',             '50 metre sonra düz devam ediniz.'],
  ['100m_duz',            '100 metre sonra düz devam ediniz.'],
  ['200m_duz',            '200 metre sonra düz devam ediniz.'],
  ['500m_duz',            '500 metre sonra düz devam ediniz.'],
  ['1km_duz',             '1 kilometre sonra düz devam ediniz.'],

  ['50m_geri',            '50 metre sonra geri dönünüz.'],
  ['100m_geri',           '100 metre sonra geri dönünüz.'],
  ['200m_geri',           '200 metre sonra geri dönünüz.'],

  ['50m_kavsak',          '50 metre sonra dönel kavşaktan çıkınız.'],
  ['100m_kavsak',         '100 metre sonra dönel kavşaktan çıkınız.'],
  ['200m_kavsak',         '200 metre sonra dönel kavşaktan çıkınız.'],
  ['500m_kavsak',         '500 metre sonra dönel kavşaktan çıkınız.'],

  ['50m_keskin_saga',     '50 metre sonra keskin sağa dönünüz.'],
  ['50m_keskin_sola',     '50 metre sonra keskin sola dönünüz.'],
  ['100m_keskin_saga',    '100 metre sonra keskin sağa dönünüz.'],
  ['100m_keskin_sola',    '100 metre sonra keskin sola dönünüz.'],
  ['200m_keskin_saga',    '200 metre sonra keskin sağa dönünüz.'],
  ['200m_keskin_sola',    '200 metre sonra keskin sola dönünüz.'],
  ['500m_keskin_saga',    '500 metre sonra keskin sağa dönünüz.'],
  ['500m_keskin_sola',    '500 metre sonra keskin sola dönünüz.'],

  ['50m_hafif_saga',      '50 metre sonra hafif sağa dönünüz.'],
  ['50m_hafif_sola',      '50 metre sonra hafif sola dönünüz.'],
  ['100m_hafif_saga',     '100 metre sonra hafif sağa dönünüz.'],
  ['100m_hafif_sola',     '100 metre sonra hafif sola dönünüz.'],
  ['200m_hafif_saga',     '200 metre sonra hafif sağa dönünüz.'],
  ['200m_hafif_sola',     '200 metre sonra hafif sola dönünüz.'],
  ['500m_hafif_saga',     '500 metre sonra hafif sağa dönünüz.'],
  ['500m_hafif_sola',     '500 metre sonra hafif sola dönünüz.'],

  // RADAR
  ['radar_sabit_1km',     'Dikkat! 1 kilometre ileride sabit radar.'],
  ['radar_sabit_200m',    'Dikkat! 200 metre ileride sabit radar.'],
  ['radar_seyyar_1km',    'Dikkat! 1 kilometre ileride seyyar radar.'],
  ['radar_seyyar_200m',   'Dikkat! 200 metre ileride seyyar radar.'],
  ['radar_polis_1km',     'Dikkat! 1 kilometre ileride polis çevirme.'],
  ['radar_polis_200m',    'Dikkat! 200 metre ileride polis çevirme.'],
  ['radar_kaza_1km',      'Dikkat! 1 kilometre ileride kaza var.'],
  ['radar_kaza_200m',     'Dikkat! 200 metre ileride kaza var.'],
  ['radar_trafik_1km',    'Dikkat! 1 kilometre ileride trafik sıkışıklığı.'],
  ['radar_trafik_200m',   'Dikkat! 200 metre ileride trafik sıkışıklığı.'],

  // KAYIT
  ['ev_kaydedildi',       'Ev konumu kaydedildi.'],
  ['arac_kaydedildi',     'Araç konumu kaydedildi.'],
  ['eve_gidiliyor',       'Eve gidiliyor.'],
  ['araca_gidiliyor',     'Araç konumuna gidiliyor.'],
];

function makeOne(tts, name, text) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(OUT, name + '.mp3');
    if(fs.existsSync(outPath) && fs.statSync(outPath).size > 0) {
      console.log(`  ✓ var  ${name}.mp3`);
      return resolve();
    }
    try {
      const { audioStream } = tts.toStream(text);
      const ws = fs.createWriteStream(outPath);
      audioStream.pipe(ws);
      ws.on('finish', () => { console.log(`  ✅ ${name}.mp3`); resolve(); });
      ws.on('error', e => { try{fs.unlinkSync(outPath)}catch{} reject(e); });
      audioStream.on('error', e => { try{fs.unlinkSync(outPath)}catch{} reject(e); });
    } catch(e) { reject(e); }
  });
}

async function run() {
  console.log(`\n🎙  ${FILES.length} ses üretiliyor — ses: ${VOICE}\n`);
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  let ok=0, fail=0;
  for(const [name, text] of FILES) {
    try {
      await makeOne(tts, name, text);
      ok++;
    } catch(e) {
      console.error(`  ❌ ${name}: ${e.message}`);
      fail++;
    }
    await new Promise(r => setTimeout(r, 250));
  }
  console.log(`\n✔ Tamamlandı: ${ok} başarılı${fail?' | '+fail+' hatalı':''}\n`);
}

run().catch(e => { console.error('HATA:', e.message); process.exit(1); });
