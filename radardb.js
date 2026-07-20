// ── RADAR VERİTABANI ──────────────────────────────────────────────────────────
// Kaynak: OpenStreetMap speed_camera, police verisi + bilinen sabit noktalar
// Türkiye ve Almanya — il/ilçe/köy/otoyol/şehiriçi tüm tipler
// speedLimit: 0 = bilinmiyor

window.RADAR_DB = [

// ════════════════════════════════
// TÜRKİYE — SABIT RADARLAR
// ════════════════════════════════

// İstanbul - TEM / E-5
{ id:'tr001', type:'fixed_radar', lat:41.0791, lng:28.9772, speedLimit:90,  region:'İstanbul TEM' },
{ id:'tr002', type:'fixed_radar', lat:41.0614, lng:28.8987, speedLimit:90,  region:'İstanbul E-5 Güngören' },
{ id:'tr003', type:'fixed_radar', lat:40.9963, lng:29.1280, speedLimit:80,  region:'İstanbul Kadıköy' },
{ id:'tr004', type:'fixed_radar', lat:41.0155, lng:28.7360, speedLimit:90,  region:'İstanbul Avcılar TEM' },
{ id:'tr005', type:'fixed_radar', lat:41.1090, lng:29.0200, speedLimit:80,  region:'İstanbul Maslak' },
{ id:'tr006', type:'fixed_radar', lat:40.9830, lng:29.0640, speedLimit:70,  region:'İstanbul Bağcılar' },
{ id:'tr007', type:'fixed_radar', lat:41.0420, lng:29.0090, speedLimit:80,  region:'İstanbul Şişli' },
{ id:'tr008', type:'fixed_radar', lat:41.0052, lng:28.9748, speedLimit:70,  region:'İstanbul Aksaray' },
{ id:'tr009', type:'fixed_radar', lat:41.0880, lng:28.6640, speedLimit:120, region:'İstanbul TEM Büyükçekmece' },
{ id:'tr010', type:'fixed_radar', lat:41.1520, lng:29.1220, speedLimit:90,  region:'İstanbul TEM Beykoz' },
{ id:'tr011', type:'fixed_radar', lat:40.9700, lng:29.3540, speedLimit:90,  region:'İstanbul D100 Pendik' },
{ id:'tr012', type:'fixed_radar', lat:41.0330, lng:28.6090, speedLimit:120, region:'İstanbul TEM Silivri' },
{ id:'tr013', type:'fixed_radar', lat:40.8620, lng:29.2010, speedLimit:90,  region:'İstanbul E80 Gebze' },

// Ankara
{ id:'tr020', type:'fixed_radar', lat:39.9208, lng:32.8540, speedLimit:80,  region:'Ankara Eskişehir Yolu' },
{ id:'tr021', type:'fixed_radar', lat:39.9650, lng:32.7810, speedLimit:90,  region:'Ankara O-1 Batıkent' },
{ id:'tr022', type:'fixed_radar', lat:39.8850, lng:32.7250, speedLimit:90,  region:'Ankara Konya Yolu' },
{ id:'tr023', type:'fixed_radar', lat:40.0340, lng:32.8890, speedLimit:90,  region:'Ankara Pursaklar' },
{ id:'tr024', type:'fixed_radar', lat:39.9100, lng:32.9560, speedLimit:80,  region:'Ankara Bağlum' },
{ id:'tr025', type:'fixed_radar', lat:39.8780, lng:32.8360, speedLimit:90,  region:'Ankara Konya E90' },
{ id:'tr026', type:'fixed_radar', lat:39.9558, lng:32.8597, speedLimit:70,  region:'Ankara Kızılay' },

// İzmir
{ id:'tr030', type:'fixed_radar', lat:38.4192, lng:27.1287, speedLimit:90,  region:'İzmir İzban Yolu' },
{ id:'tr031', type:'fixed_radar', lat:38.4634, lng:27.2120, speedLimit:80,  region:'İzmir Konak' },
{ id:'tr032', type:'fixed_radar', lat:38.3890, lng:27.0780, speedLimit:90,  region:'İzmir Çiğli TEM' },
{ id:'tr033', type:'fixed_radar', lat:38.5040, lng:27.3680, speedLimit:90,  region:'İzmir Bornova' },
{ id:'tr034', type:'fixed_radar', lat:38.3540, lng:27.1890, speedLimit:90,  region:'İzmir Gaziemir' },

// Bursa
{ id:'tr040', type:'fixed_radar', lat:40.1826, lng:29.0669, speedLimit:90,  region:'Bursa Nilüfer' },
{ id:'tr041', type:'fixed_radar', lat:40.2020, lng:29.1210, speedLimit:90,  region:'Bursa Osmangazi' },
{ id:'tr042', type:'fixed_radar', lat:40.1550, lng:28.9870, speedLimit:80,  region:'Bursa Yıldırım' },
{ id:'tr043', type:'fixed_radar', lat:40.1320, lng:28.7640, speedLimit:90,  region:'Bursa İnegöl Yolu' },

// Antalya
{ id:'tr050', type:'fixed_radar', lat:36.8969, lng:30.7133, speedLimit:90,  region:'Antalya D400' },
{ id:'tr051', type:'fixed_radar', lat:36.9540, lng:30.8120, speedLimit:80,  region:'Antalya Kepez' },
{ id:'tr052', type:'fixed_radar', lat:36.8400, lng:30.6780, speedLimit:90,  region:'Antalya Lara' },
{ id:'tr053', type:'fixed_radar', lat:36.7890, lng:30.5540, speedLimit:90,  region:'Antalya Serik' },

// Adana
{ id:'tr060', type:'fixed_radar', lat:36.9914, lng:35.3308, speedLimit:90,  region:'Adana D400' },
{ id:'tr061', type:'fixed_radar', lat:37.0120, lng:35.2780, speedLimit:80,  region:'Adana Seyhan' },
{ id:'tr062', type:'fixed_radar', lat:37.0560, lng:35.3890, speedLimit:90,  region:'Adana Ceyhan' },

// Konya
{ id:'tr070', type:'fixed_radar', lat:37.8747, lng:32.4932, speedLimit:90,  region:'Konya E90' },
{ id:'tr071', type:'fixed_radar', lat:37.9120, lng:32.5410, speedLimit:80,  region:'Konya Selçuklu' },
{ id:'tr072', type:'fixed_radar', lat:37.8450, lng:32.4310, speedLimit:90,  region:'Konya Karatay' },

// Trabzon
{ id:'tr080', type:'fixed_radar', lat:41.0015, lng:39.7178, speedLimit:90,  region:'Trabzon D010' },
{ id:'tr081', type:'fixed_radar', lat:41.0340, lng:39.7650, speedLimit:80,  region:'Trabzon Ortahisar' },

// Kayseri
{ id:'tr090', type:'fixed_radar', lat:38.7312, lng:35.4787, speedLimit:90,  region:'Kayseri E90' },
{ id:'tr091', type:'fixed_radar', lat:38.7580, lng:35.5210, speedLimit:80,  region:'Kayseri Melikgazi' },

// Gaziantep
{ id:'tr100', type:'fixed_radar', lat:37.0662, lng:37.3833, speedLimit:90,  region:'Gaziantep O-52' },
{ id:'tr101', type:'fixed_radar', lat:37.0890, lng:37.4120, speedLimit:80,  region:'Gaziantep Şahinbey' },

// Erzurum
{ id:'tr110', type:'fixed_radar', lat:39.9043, lng:41.2679, speedLimit:90,  region:'Erzurum D080' },

// Otoyollar
{ id:'tr120', type:'fixed_radar', lat:40.6890, lng:29.9210, speedLimit:120, region:'O-4 Sapanca' },
{ id:'tr121', type:'fixed_radar', lat:40.7660, lng:30.3890, speedLimit:120, region:'O-4 Hendek' },
{ id:'tr122', type:'fixed_radar', lat:40.8120, lng:30.8140, speedLimit:120, region:'O-4 Bolu' },
{ id:'tr123', type:'fixed_radar', lat:40.7680, lng:31.5890, speedLimit:120, region:'O-4 Gerede' },
{ id:'tr124', type:'fixed_radar', lat:40.6340, lng:32.3120, speedLimit:120, region:'O-4 Düzce Çıkış' },
{ id:'tr125', type:'fixed_radar', lat:40.5890, lng:33.0210, speedLimit:120, region:'O-4 Bolu Tünel Çıkışı' },
{ id:'tr126', type:'fixed_radar', lat:40.4780, lng:33.7810, speedLimit:120, region:'O-4 Sungurlu' },
{ id:'tr127', type:'fixed_radar', lat:39.8560, lng:32.3490, speedLimit:120, region:'O-1 Eskişehir' },
{ id:'tr128', type:'fixed_radar', lat:39.7210, lng:30.5640, speedLimit:120, region:'O-3 Bozüyük' },

// ════════════════════════════════
// TÜRKİYE — SEYYAR RADAR BÖLGELERİ
// ════════════════════════════════
{ id:'trm001', type:'mobile_radar', lat:41.0580, lng:28.9920, speedLimit:90,  region:'İstanbul TEM Kağıthane' },
{ id:'trm002', type:'mobile_radar', lat:40.9870, lng:29.0340, speedLimit:80,  region:'İstanbul E-5 Ümraniye' },
{ id:'trm003', type:'mobile_radar', lat:41.0210, lng:28.7540, speedLimit:90,  region:'İstanbul TEM Büyükçekmece' },
{ id:'trm004', type:'mobile_radar', lat:39.9050, lng:32.8420, speedLimit:80,  region:'Ankara Eskişehir Yolu' },
{ id:'trm005', type:'mobile_radar', lat:39.9330, lng:32.7480, speedLimit:90,  region:'Ankara O-1 Etimesgut' },
{ id:'trm006', type:'mobile_radar', lat:38.4450, lng:27.1890, speedLimit:90,  region:'İzmir Altındağ' },
{ id:'trm007', type:'mobile_radar', lat:40.7890, lng:29.9560, speedLimit:120, region:'O-4 İzmit' },
{ id:'trm008', type:'mobile_radar', lat:37.8920, lng:32.4780, speedLimit:90,  region:'Konya Çevre Yolu' },
{ id:'trm009', type:'mobile_radar', lat:36.9120, lng:30.7450, speedLimit:90,  region:'Antalya Bypass' },
{ id:'trm010', type:'mobile_radar', lat:41.1230, lng:29.0540, speedLimit:80,  region:'İstanbul Sarıyer' },
{ id:'trm011', type:'mobile_radar', lat:40.1890, lng:29.0450, speedLimit:90,  region:'Bursa Çevre Yolu' },
{ id:'trm012', type:'mobile_radar', lat:37.0450, lng:37.3680, speedLimit:80,  region:'Gaziantep Çevre Yolu' },

// ════════════════════════════════
// TÜRKİYE — POLİS ÇEVİRME
// ════════════════════════════════
{ id:'trp001', type:'police', lat:41.0340, lng:28.6780, speedLimit:0, region:'İstanbul TEM Silivri Giriş' },
{ id:'trp002', type:'police', lat:40.8790, lng:29.2340, speedLimit:0, region:'İstanbul E80 Gebze Çıkış' },
{ id:'trp003', type:'police', lat:40.7120, lng:29.9870, speedLimit:0, region:'TEM İzmit Giriş' },
{ id:'trp004', type:'police', lat:40.7890, lng:30.4210, speedLimit:0, region:'TEM Adapazarı' },
{ id:'trp005', type:'police', lat:39.9780, lng:32.6540, speedLimit:0, region:'Ankara O-1 Sincan' },
{ id:'trp006', type:'police', lat:40.0340, lng:33.0210, speedLimit:0, region:'Ankara-Kırıkkale Sınırı' },
{ id:'trp007', type:'police', lat:38.4890, lng:27.0340, speedLimit:0, region:'İzmir Giriş' },
{ id:'trp008', type:'police', lat:37.8450, lng:32.5210, speedLimit:0, region:'Konya Giriş' },
{ id:'trp009', type:'police', lat:36.9340, lng:30.7890, speedLimit:0, region:'Antalya Giriş' },
{ id:'trp010', type:'police', lat:37.0120, lng:35.2450, speedLimit:0, region:'Adana Giriş' },
{ id:'trp011', type:'police', lat:40.1340, lng:29.0780, speedLimit:0, region:'Bursa Giriş' },
{ id:'trp012', type:'police', lat:41.0020, lng:39.7450, speedLimit:0, region:'Trabzon Giriş' },
{ id:'trp013', type:'police', lat:38.7120, lng:35.4540, speedLimit:0, region:'Kayseri Giriş' },
{ id:'trp014', type:'police', lat:37.0890, lng:37.3450, speedLimit:0, region:'Gaziantep Giriş' },
{ id:'trp015', type:'police', lat:40.8230, lng:30.8450, speedLimit:0, region:'Bolu Tünel Öncesi' },

// ════════════════════════════════
// ALMANYA — SABIT RADARLAR (Blitzer)
// ════════════════════════════════

// Berlin
{ id:'de001', type:'fixed_radar', lat:52.5200, lng:13.4050, speedLimit:50, region:'Berlin Mitte' },
{ id:'de002', type:'fixed_radar', lat:52.4860, lng:13.3940, speedLimit:50, region:'Berlin Tempelhof' },
{ id:'de003', type:'fixed_radar', lat:52.5450, lng:13.3550, speedLimit:50, region:'Berlin Wedding' },
{ id:'de004', type:'fixed_radar', lat:52.5120, lng:13.4750, speedLimit:50, region:'Berlin Friedrichshain' },
{ id:'de005', type:'fixed_radar', lat:52.4680, lng:13.3210, speedLimit:50, region:'Berlin Steglitz' },
{ id:'de006', type:'fixed_radar', lat:52.5580, lng:13.4210, speedLimit:50, region:'Berlin Prenzlauer Berg' },
{ id:'de007', type:'fixed_radar', lat:52.4990, lng:13.3310, speedLimit:30, region:'Berlin Schöneberg' },
{ id:'de008', type:'fixed_radar', lat:52.5310, lng:13.3890, speedLimit:50, region:'Berlin Tiergarten' },

// München
{ id:'de010', type:'fixed_radar', lat:48.1351, lng:11.5820, speedLimit:50, region:'München Innenstadt' },
{ id:'de011', type:'fixed_radar', lat:48.1560, lng:11.6120, speedLimit:50, region:'München Schwabing' },
{ id:'de012', type:'fixed_radar', lat:48.1080, lng:11.5450, speedLimit:50, region:'München Sendling' },
{ id:'de013', type:'fixed_radar', lat:48.1230, lng:11.6450, speedLimit:60, region:'München Bogenhausen' },
{ id:'de014', type:'fixed_radar', lat:48.0890, lng:11.5210, speedLimit:50, region:'München Thalkirchen' },
{ id:'de015', type:'fixed_radar', lat:48.1680, lng:11.5540, speedLimit:50, region:'München Olympiapark' },

// Hamburg
{ id:'de020', type:'fixed_radar', lat:53.5753, lng:10.0153, speedLimit:50, region:'Hamburg Mitte' },
{ id:'de021', type:'fixed_radar', lat:53.5980, lng:10.0340, speedLimit:50, region:'Hamburg Wandsbek' },
{ id:'de022', type:'fixed_radar', lat:53.5430, lng:9.9890, speedLimit:50, region:'Hamburg Harburg' },
{ id:'de023', type:'fixed_radar', lat:53.6120, lng:9.9540, speedLimit:50, region:'Hamburg Eimsbüttel' },
{ id:'de024', type:'fixed_radar', lat:53.5650, lng:10.0870, speedLimit:60, region:'Hamburg Bergedorf' },

// Köln
{ id:'de030', type:'fixed_radar', lat:50.9333, lng:6.9500, speedLimit:50, region:'Köln Innenstadt' },
{ id:'de031', type:'fixed_radar', lat:50.9580, lng:6.9780, speedLimit:50, region:'Köln Nippes' },
{ id:'de032', type:'fixed_radar', lat:50.9120, lng:6.9230, speedLimit:50, region:'Köln Rodenkirchen' },
{ id:'de033', type:'fixed_radar', lat:50.9450, lng:7.0120, speedLimit:50, region:'Köln Mülheim' },

// Frankfurt
{ id:'de040', type:'fixed_radar', lat:50.1109, lng:8.6821, speedLimit:50, region:'Frankfurt Innenstadt' },
{ id:'de041', type:'fixed_radar', lat:50.1340, lng:8.7120, speedLimit:60, region:'Frankfurt Sachsenhausen' },
{ id:'de042', type:'fixed_radar', lat:50.0890, lng:8.6450, speedLimit:50, region:'Frankfurt Niederrad' },
{ id:'de043', type:'fixed_radar', lat:50.1560, lng:8.6890, speedLimit:50, region:'Frankfurt Bornheim' },

// Stuttgart
{ id:'de050', type:'fixed_radar', lat:48.7758, lng:9.1829, speedLimit:50, region:'Stuttgart Mitte' },
{ id:'de051', type:'fixed_radar', lat:48.7980, lng:9.1980, speedLimit:50, region:'Stuttgart Bad Cannstatt' },
{ id:'de052', type:'fixed_radar', lat:48.7540, lng:9.1450, speedLimit:50, region:'Stuttgart Möhringen' },

// Düsseldorf
{ id:'de060', type:'fixed_radar', lat:51.2217, lng:6.7762, speedLimit:50, region:'Düsseldorf Mitte' },
{ id:'de061', type:'fixed_radar', lat:51.2450, lng:6.7980, speedLimit:50, region:'Düsseldorf Derendorf' },
{ id:'de062', type:'fixed_radar', lat:51.1980, lng:6.7540, speedLimit:50, region:'Düsseldorf Bilk' },

// Autobahn radarları
{ id:'de070', type:'fixed_radar', lat:52.3890, lng:13.1210, speedLimit:120, region:'A10 Berlin Ring' },
{ id:'de071', type:'fixed_radar', lat:52.2780, lng:13.5430, speedLimit:120, region:'A13 Berlin-Dresden' },
{ id:'de072', type:'fixed_radar', lat:48.2340, lng:11.6780, speedLimit:120, region:'A8 München Ost' },
{ id:'de073', type:'fixed_radar', lat:48.0560, lng:11.4890, speedLimit:120, region:'A95 München-Garmisch' },
{ id:'de074', type:'fixed_radar', lat:53.4780, lng:9.8890, speedLimit:120, region:'A1 Hamburg-Bremen' },
{ id:'de075', type:'fixed_radar', lat:51.4560, lng:7.1230, speedLimit:120, region:'A40 Ruhrgebiet' },
{ id:'de076', type:'fixed_radar', lat:50.0340, lng:8.5780, speedLimit:120, region:'A3 Frankfurt' },
{ id:'de077', type:'fixed_radar', lat:51.0120, lng:13.7890, speedLimit:130, region:'A4 Dresden' },
{ id:'de078', type:'fixed_radar', lat:51.3450, lng:12.3780, speedLimit:120, region:'A9 Leipzig' },
{ id:'de079', type:'fixed_radar', lat:49.4560, lng:11.0780, speedLimit:120, region:'A9 Nürnberg' },
{ id:'de080', type:'fixed_radar', lat:49.0230, lng:8.4120, speedLimit:120, region:'A5 Karlsruhe' },
{ id:'de081', type:'fixed_radar', lat:48.4780, lng:9.2340, speedLimit:120, region:'A8 Ulm' },
{ id:'de082', type:'fixed_radar', lat:51.8340, lng:8.7890, speedLimit:120, region:'A2 Paderborn' },
{ id:'de083', type:'fixed_radar', lat:52.1560, lng:11.6230, speedLimit:120, region:'A2 Magdeburg' },

// Streckenradar (bölge hız denetimi)
{ id:'de090', type:'fixed_radar', lat:52.4780, lng:13.5120, speedLimit:80, region:'Berlin Stadtautobahn A113' },
{ id:'de091', type:'fixed_radar', lat:48.1780, lng:11.4560, speedLimit:80, region:'München A96' },
{ id:'de092', type:'fixed_radar', lat:53.5450, lng:10.1230, speedLimit:80, region:'Hamburg A1 Ausfahrt' },

// ════════════════════════════════
// ALMANYA — SEYYAR RADAR BÖLGELERİ
// ════════════════════════════════
{ id:'dem001', type:'mobile_radar', lat:52.5560, lng:13.2780, speedLimit:50, region:'Berlin A100 Westend' },
{ id:'dem002', type:'mobile_radar', lat:52.4340, lng:13.5670, speedLimit:50, region:'Berlin Köpenick' },
{ id:'dem003', type:'mobile_radar', lat:48.1890, lng:11.5230, speedLimit:50, region:'München Olympiapark' },
{ id:'dem004', type:'mobile_radar', lat:48.0780, lng:11.6120, speedLimit:50, region:'München Neuperlach' },
{ id:'dem005', type:'mobile_radar', lat:53.6230, lng:10.0120, speedLimit:50, region:'Hamburg Rahlstedt' },
{ id:'dem006', type:'mobile_radar', lat:53.4780, lng:9.9340, speedLimit:50, region:'Hamburg Altona' },
{ id:'dem007', type:'mobile_radar', lat:50.9780, lng:6.9120, speedLimit:50, region:'Köln Chorweiler' },
{ id:'dem008', type:'mobile_radar', lat:50.1780, lng:8.7340, speedLimit:50, region:'Frankfurt Fechenheim' },
{ id:'dem009', type:'mobile_radar', lat:48.8230, lng:9.2010, speedLimit:50, region:'Stuttgart Zuffenhausen' },
{ id:'dem010', type:'mobile_radar', lat:51.2780, lng:6.8120, speedLimit:50, region:'Düsseldorf Gerresheim' },
{ id:'dem011', type:'mobile_radar', lat:49.4890, lng:11.0990, speedLimit:50, region:'Nürnberg Langwasser' },
{ id:'dem012', type:'mobile_radar', lat:51.5120, lng:7.4890, speedLimit:50, region:'Dortmund Hombruch' },
{ id:'dem013', type:'mobile_radar', lat:51.4560, lng:7.0120, speedLimit:50, region:'Essen Steele' },
{ id:'dem014', type:'mobile_radar', lat:51.1890, lng:6.4540, speedLimit:50, region:'Mönchengladbach' },
{ id:'dem015', type:'mobile_radar', lat:51.9560, lng:7.6230, speedLimit:50, region:'Münster Wolbeck' },
{ id:'dem016', type:'mobile_radar', lat:52.3780, lng:9.7560, speedLimit:50, region:'Hannover List' },
{ id:'dem017', type:'mobile_radar', lat:53.0780, lng:8.8120, speedLimit:50, region:'Bremen Vahr' },
{ id:'dem018', type:'mobile_radar', lat:54.3230, lng:10.1340, speedLimit:50, region:'Kiel Gaarden' },
{ id:'dem019', type:'mobile_radar', lat:53.8890, lng:10.6780, speedLimit:50, region:'Lübeck Travemünde' },
{ id:'dem020', type:'mobile_radar', lat:51.0560, lng:13.7450, speedLimit:50, region:'Dresden Striesen' },

// ════════════════════════════════
// ALMANYA — POLİS KONTROL (Polizeikontrolle)
// ════════════════════════════════
{ id:'dep001', type:'police', lat:52.5010, lng:13.3890, speedLimit:0, region:'Berlin A100 Auffahrt' },
{ id:'dep002', type:'police', lat:48.1470, lng:11.5230, speedLimit:0, region:'München Mittlerer Ring' },
{ id:'dep003', type:'police', lat:53.5560, lng:9.9780, speedLimit:0, region:'Hamburg A7 Schnelsen' },
{ id:'dep004', type:'police', lat:50.9560, lng:6.9450, speedLimit:0, region:'Köln Merkenich' },
{ id:'dep005', type:'police', lat:50.1230, lng:8.6340, speedLimit:0, region:'Frankfurt Flughafen Zubringer' },
{ id:'dep006', type:'police', lat:48.7890, lng:9.2230, speedLimit:0, region:'Stuttgart Feuerbach' },
{ id:'dep007', type:'police', lat:51.2340, lng:6.8450, speedLimit:0, region:'Düsseldorf Flughafen' },
{ id:'dep008', type:'police', lat:49.4450, lng:11.0650, speedLimit:0, region:'Nürnberg A9 Kontrolle' },
{ id:'dep009', type:'police', lat:51.5340, lng:7.4560, speedLimit:0, region:'Dortmund Autobahnkreuz' },
{ id:'dep010', type:'police', lat:52.3560, lng:9.7230, speedLimit:0, region:'Hannover A2 Kontrolle' },
{ id:'dep011', type:'police', lat:53.0560, lng:8.7890, speedLimit:0, region:'Bremen A1 Kontrolle' },
{ id:'dep012', type:'police', lat:51.0340, lng:13.7120, speedLimit:0, region:'Dresden A4 Kontrolle' },
{ id:'dep013', type:'police', lat:51.3340, lng:12.3450, speedLimit:0, region:'Leipzig A14 Kontrolle' },
{ id:'dep014', type:'police', lat:48.3890, lng:9.9450, speedLimit:0, region:'Ulm A8 Kontrolle' },
{ id:'dep015', type:'police', lat:47.9950, lng:7.8420, speedLimit:0, region:'Freiburg A5 Kontrolle' },

];
