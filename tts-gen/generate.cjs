/**
 * generate.cjs — Microsoft Emel (tr-TR) sesiyle 103 navigasyon sesi üretir
 * Kullanım: node generate.cjs
 */

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const OUT = join(__dirname, '..', 'audio');
if(!existsSync(OUT)) mkdirSync(OUT, { recursive:true });

const VOICE = 'tr-TR-EmelNeural'; // Microsoft Emel — Türkçe kadın sesi

const VOICES = [
  // Navigasyon sistem
  ['nav_start',         'Navigasyon başladı. İyi yolculuklar.'],
  ['nav_start2',        'Yola çıkıyoruz. Güvenli yolculuklar.'],
  ['nav_stop',          'Navigasyon durduruldu.'],
  ['nav_stop2',         'Navigasyon iptal edildi.'],
  ['nav_arrived',       'Hedefe ulaştınız. İyi günler.'],
  ['nav_arrived2',      'Varış noktasına geldiniz. Yolculuğunuz tamamlandı.'],
  ['nav_arrived3',      'Yolculuğunuz sona erdi.'],
  ['nav_calculating',   'Rota hesaplanıyor. Lütfen bekleyin.'],
  ['nav_ready',         'Rotanız hazır.'],
  ['nav_reroute',       'Rotadan çıkıldı. Yeniden hesaplanıyor.'],
  ['nav_reroute2',      'Rota güncelleniyor.'],
  ['nav_no_route',      'Rota bulunamadı. Lütfen tekrar deneyin.'],
  // Sağa dön
  ['turn_right_50m',    'Elli metre sonra sağa dönün.'],
  ['turn_right_100m',   'Yüz metre sonra sağa dönün.'],
  ['turn_right_200m',   'İki yüz metre sonra sağa dönün.'],
  ['turn_right_300m',   'Üç yüz metre sonra sağa dönün.'],
  ['turn_right_500m',   'Beş yüz metre sonra sağa dönün.'],
  ['turn_right_1km',    'Bir kilometre sonra sağa dönün.'],
  ['turn_right_now',    'Şimdi sağa dönün.'],
  // Sola dön
  ['turn_left_50m',     'Elli metre sonra sola dönün.'],
  ['turn_left_100m',    'Yüz metre sonra sola dönün.'],
  ['turn_left_200m',    'İki yüz metre sonra sola dönün.'],
  ['turn_left_300m',    'Üç yüz metre sonra sola dönün.'],
  ['turn_left_500m',    'Beş yüz metre sonra sola dönün.'],
  ['turn_left_1km',     'Bir kilometre sonra sola dönün.'],
  ['turn_left_now',     'Şimdi sola dönün.'],
  // Hafif
  ['slight_right_100m', 'Yüz metre sonra hafif sağa dönün.'],
  ['slight_right_200m', 'İki yüz metre sonra hafif sağa dönün.'],
  ['slight_right_500m', 'Beş yüz metre sonra hafif sağa dönün.'],
  ['slight_right_now',  'Hafif sağa dönün.'],
  ['slight_left_100m',  'Yüz metre sonra hafif sola dönün.'],
  ['slight_left_200m',  'İki yüz metre sonra hafif sola dönün.'],
  ['slight_left_500m',  'Beş yüz metre sonra hafif sola dönün.'],
  ['slight_left_now',   'Hafif sola dönün.'],
  // Keskin
  ['sharp_right_100m',  'Yüz metre sonra keskin sağa dönün.'],
  ['sharp_right_200m',  'İki yüz metre sonra keskin sağa dönün.'],
  ['sharp_right_now',   'Keskin sağa dönün.'],
  ['sharp_left_100m',   'Yüz metre sonra keskin sola dönün.'],
  ['sharp_left_200m',   'İki yüz metre sonra keskin sola dönün.'],
  ['sharp_left_now',    'Keskin sola dönün.'],
  // Düz
  ['straight_500m',     'Beş yüz metre düz devam edin.'],
  ['straight_1km',      'Bir kilometre düz devam edin.'],
  ['straight_now',      'Düz devam edin.'],
  // Kavşak
  ['roundabout_1',      'Dönel kavşakta birinci çıkıştan çıkın.'],
  ['roundabout_2',      'Dönel kavşakta ikinci çıkıştan çıkın.'],
  ['roundabout_3',      'Dönel kavşakta üçüncü çıkıştan çıkın.'],
  ['roundabout_4',      'Dönel kavşakta dördüncü çıkıştan çıkın.'],
  ['roundabout_exit',   'Kavşaktan çıkın.'],
  ['roundabout_100m',   'Yüz metre sonra dönel kavşaktan çıkın.'],
  ['roundabout_200m',   'İki yüz metre sonra dönel kavşaktan çıkın.'],
  // Rampa
  ['ramp_right',        'Sağdan rampaya girin.'],
  ['ramp_left',         'Soldan rampaya girin.'],
  ['ramp_exit_right',   'Sağdan rampadan çıkın.'],
  ['ramp_exit_left',    'Soldan rampadan çıkın.'],
  // Geri dön
  ['uturn_now',         'Mümkün olan ilk yerde geri dönün.'],
  ['uturn_100m',        'Yüz metre sonra geri dönün.'],
  ['uturn_200m',        'İki yüz metre sonra geri dönün.'],
  // Varış
  ['arrive_left',       'Varış noktanız solunuzda.'],
  ['arrive_right',      'Varış noktanız sağınızda.'],
  // Radar
  ['radar_fixed_250m',  'Dikkat! İki yüz elli metre sonra sabit hız kamerası.'],
  ['radar_fixed_500m',  'Dikkat! Beş yüz metre sonra sabit hız kamerası.'],
  ['radar_fixed_1km',   'Dikkat! Bir kilometre sonra sabit hız kamerası.'],
  ['radar_avg_500m',    'Dikkat! Beş yüz metre sonra bölge hız radarı başlıyor.'],
  ['radar_mobile_250m', 'Dikkat! İki yüz elli metre sonra seyyar radar bildirimi.'],
  ['radar_mobile_500m', 'Dikkat! Beş yüz metre sonra seyyar radar bildirimi.'],
  ['radar_police_250m', 'Dikkat! İki yüz elli metre sonra bildirilen polis kontrol noktası.'],
  ['radar_police_500m', 'Dikkat! Beş yüz metre sonra bildirilen polis kontrol noktası.'],
  ['radar_police_1km',  'Dikkat! Bir kilometre sonra bildirilen polis kontrol noktası.'],
  ['radar_redlight',    'Dikkat! Yüz metre sonra kırmızı ışık kamerası.'],
  ['radar_accident',    'Dikkat! İleride kaza var. Yavaşlayın.'],
  ['radar_traffic',     'Dikkat! İleride trafik sıkışıklığı var.'],
  ['radar_hazard',      'Dikkat! İleride tehlikeli nokta.'],
  // Hız
  ['speed_warn',        'Dikkat! Hız limitini aştınız. Yavaşlayın.'],
  // GPS
  ['gps_lost',          'GPS sinyali kayboldu.'],
  ['gps_found',         'GPS sinyali yeniden alındı.'],
  // Trafik
  ['traffic_on',        'Trafik yoğunluk katmanı açıldı.'],
  ['traffic_off',       'Trafik katmanı kapatıldı.'],
  // Kamera
  ['cam_drive',         'Sürüş modu. Araç önünden görüş.'],
  ['cam_top',           'Üstten kuş bakışı görünüm.'],
  ['cam_back',          'Arkadan görüş modu etkin.'],
  ['cam_side',          'Yandan görüş modu etkin.'],
  ['cam_free',          'Serbest kamera modu.'],
  // Harita
  ['layer_light',       'Açık harita görünümü seçildi.'],
  ['layer_dark',        'Koyu harita görünümü seçildi.'],
  ['layer_satellite',   'Uydu görünümü seçildi.'],
  // Ev/Araba/Diğer
  ['home_saved',        'Ev konumunuz kaydedildi.'],
  ['car_saved',         'Araç park konumunuz kaydedildi.'],
  ['going_home',        'Eve gidiliyor.'],
  ['going_car',         'Park edilen araca gidiliyor.'],
  ['fav_saved',         'Favorilere eklendi.'],
  ['report_saved',      'Bildiriminiz kaydedildi. Teşekkürler.'],
  ['toll_approach',     'Paralı geçişe yaklaşıyorsunuz. Geçiş kartınızı hazırlayın.'],
  ['toll_on',           'Paralı geçiş noktaları gösteriliyor.'],
  ['toll_off',          'Paralı geçiş noktaları gizlendi.'],
  ['location_found',    'Konumunuz alındı.'],
  ['no_gps',            'GPS konumu alınamadı. Lütfen bekleyin.'],
  ['voice_on',          'Sesli yönlendirme açıldı.'],
  ['voice_off',         'Sesli yönlendirme kapatıldı.'],
  ['km_5_left',         'Hedefe beş kilometre kaldı.'],
  ['km_3_left',         'Hedefe üç kilometre kaldı.'],
  ['km_1_left',         'Hedefe bir kilometre kaldı.'],
  ['alt_route',         'Alternatif rota bulundu.'],
  ['alt_route_used',    'Alternatif rotaya geçildi.'],
];

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main(){
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  console.log(`\n🎙️  ${VOICE} — ${VOICES.length} ses üretiliyor...\n📁 ${OUT}\n`);
  let ok=0, fail=0;

  for(const [name, text] of VOICES){
    process.stdout.write(`  [${String(ok+fail+1).padStart(3)}/${VOICES.length}] ${name}... `);
    try{
      const readable = tts.toStream(text);
      const chunks = [];
      await new Promise((resolve, reject) => {
        readable.audioStream.on('data', d => chunks.push(d));
        readable.audioStream.on('end', resolve);
        readable.audioStream.on('error', reject);
      });
      writeFileSync(join(OUT, name+'.mp3'), Buffer.concat(chunks));
      console.log('✅');
      ok++;
      await delay(150);
    }catch(e){
      console.log('❌', String(e.message||e).slice(0,80));
      fail++;
      await delay(400);
    }
  }
  console.log(`\n✅ Bitti: ${ok}/${VOICES.length} başarılı${fail>0?' | '+fail+' hatalı':''}`);
}

main().catch(e => { console.error(e); process.exit(1); });
