// nav.js v4 — tam navigasyon
let map,userMk,routeLayer,destMk,curTile;
// Tema başlangıçta localStorage'dan oku
const _savedTheme=localStorage.getItem('theme')||'dark';
let curTileKey=_savedTheme==='light'?'light':'dark';
if(_savedTheme==='light')document.body.classList.add('light');
let curPos=null,curHeading=0,curSpeed=0;
let route=null,altRoutes=[],selRoute=0,stepIdx=0,isNav=false,prevAnn=99999,lastReroute=0;
let radarPts=[],radarMks=[],radarTmo=null,_rt={};
let srTimer=null,_fetching=false,_lastBounds=null,_lastGpsFetch=0;
let _aq=[],_ap=false;
// Kamera modu: 0=üst(varsayılan) 1=arkadan 2=önden 3=çapraz
let _camMode=0;

const TILES={
  dark:      {url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',attr:'CartoDB',max:20},
  osm:       {url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',attr:'OSM',max:19},
  satellite: {url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',attr:'Esri',max:19},
  light:     {url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',attr:'CartoDB',max:19},
  topo:      {url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',attr:'OpenTopoMap',max:17},
  // Ek açık kaynak haritalar — boş bölgeleri doldurur
  cycle:     {url:'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png',attr:'Waymarked',max:19,base:'osm'},
  transport: {url:'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=a5dd6a2f0b4443279ed1d1b73b3e58c3',attr:'Thunderforest',max:19},
};
const RMETA={
  fixed_radar:{e:'📷',c:'#ef4444'},mobile_radar:{e:'🚔',c:'#f97316'},
  police:{e:'👮',c:'#a855f7'},accident:{e:'💥',c:'#f59e0b'},
  traffic_jam:{e:'🚗',c:'#6366f1'},hazard:{e:'⚠️',c:'#f59e0b'}
};
const RLBL={fixed_radar:'Sabit Radar',mobile_radar:'Seyyar Radar',police:'Polis Çevirme',accident:'Kaza',traffic_jam:'Trafik',hazard:'Tehlike'};
const MMOD={left:'sola',right:'sağa','sharp left':'keskin sola','sharp right':'keskin sağa','slight left':'hafif sola','slight right':'hafif sağa',straight:'düz',uturn:'geri dön'};

function hvs(a1,o1,a2,o2){const R=6371000,dl=(a2-a1)*Math.PI/180,dlo=(o2-o1)*Math.PI/180,a=Math.sin(dl/2)**2+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(dlo/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function fS(m){return m>=1000?(m/1e3).toFixed(1)+' km':Math.round(m)+' m';}
function fD(s){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h?h+'s '+m+'dk':m+' dk';}
function mm(t,mod){
  const m=mod?(MMOD[mod]||''):'';
  switch(t){
    case 'turn':return m?m+' dön':'dön';
    case 'depart':return 'başlıyoruz';
    case 'arrive':return 'hedefe ulaştınız';
    case 'new name':case 'continue':return m?m+' devam et':'düz devam et';
    case 'roundabout':case 'rotary':case 'exit roundabout':return 'dönel kavşaktan çık';
    case 'uturn':return 'geri dön';
    default:return m?m+' dön':'düz devam et';
  }
}
function mi(t,m){
  if(t==='arrive')return'🏁';
  if(t==='roundabout'||t==='rotary')return'↻';
  if(m==='left'||m==='sharp left')return'←';
  if(m==='right'||m==='sharp right')return'→';
  if(m==='slight left')return'↖';
  if(m==='slight right')return'↗';
  if(m==='uturn'||t==='uturn')return'↩';
  return'↑';
}

// ── HARİTA ──
function initMap(lat,lng){
  map=L.map('map',{center:[lat,lng],zoom:17,zoomControl:false,attributionControl:true});
  const T=TILES[curTileKey]||TILES.dark;
  curTile=L.tileLayer(T.url,{maxZoom:T.max,attribution:'© '+T.attr}).addTo(map);
  L.control.zoom({position:'bottomright'}).addTo(map);
  userMk=L.marker([lat,lng],{icon:arrowIco(0),zIndexOffset:1000}).addTo(map);
  map.on('moveend zoomend',schedFetch);
  // Layer panel'de aktif olanı işaretle
  document.querySelectorAll('.lp-item').forEach(el=>el.classList.remove('active'));
  const lel=document.getElementById('lp-'+curTileKey);if(lel)lel.classList.add('active');
  setTimeout(loadRadars,800);
}
function arrowIco(deg){
  return L.divIcon({
    html:'<div style="transform:rotate('+deg+'deg);width:28px;height:28px;display:flex;align-items:center;justify-content:center"><svg width="28" height="28" viewBox="0 0 28 28"><polygon points="14,2 23,24 14,19 5,24" fill="#6366f1" stroke="#fff" stroke-width="1.5" style="filter:drop-shadow(0 0 6px rgba(99,102,241,.9))"/></svg></div>',
    iconSize:[28,28],
    iconAnchor:[14,14],  // SVG merkezi
    className:''
  });
}
function setLayer(key){
  if(!map||key===curTileKey)return;
  if(curTile)map.removeLayer(curTile);
  const T=TILES[key]||TILES.dark;
  curTile=L.tileLayer(T.url,{maxZoom:T.max,attribution:'© '+T.attr}).addTo(map);
  curTile.bringToBack();
  document.querySelectorAll('.lp-item').forEach(el=>el.classList.remove('active'));
  const el=document.getElementById('lp-'+key);if(el)el.classList.add('active');
  curTileKey=key;closeLayer();
}
function flyTo(lat,lng,z){if(map)map.setView([lat,lng],z||14);closeSettings();}
function toggleTheme(){
  const wasLight=document.documentElement.classList.contains('light');
  const isLight=!wasLight;
  document.documentElement.classList.toggle('light',isLight);
  localStorage.setItem('theme',isLight?'light':'dark');
  const lbl=document.getElementById('theme-lbl');
  const ico=document.getElementById('theme-ico');
  if(lbl)lbl.textContent=isLight?'Koyu Mod':'Açık Mod';
  if(ico)ico.textContent=isLight?'🌙':'☀️';
  // Harita tile'ını güncelle — auto switch
  if(isLight && (curTileKey==='dark'))  setLayer('light');
  if(!isLight && (curTileKey==='light')) setLayer('dark');
  closeSettings();
}

// ── GPS — konum düzleştirme ──
let _posBuffer=[];
function startGPS(){
  // Haritayı HER ZAMAN hemen aç — GPS bekleme yok
  if(!map) initMap(41.0082, 28.9784);

  // GPS mesajını gizle — harita çalışıyor
  const gEl=document.getElementById('gps-msg');
  if(gEl) gEl.style.display='none';

  if(!navigator.geolocation) return;

  // GPS gelince haritayı güncelle
  navigator.geolocation.getCurrentPosition(
    onPos,
    ()=>{}, // hata olsa bile sessiz geç
    {enableHighAccuracy:false, timeout:5000, maximumAge:60000}
  );

  navigator.geolocation.watchPosition(
    onPos,
    ()=>{}, // hata olsa bile sessiz geç
    {enableHighAccuracy:true, maximumAge:3000, timeout:30000}
  );
}

function onPos(p){
  const lat=p.coords.latitude;
  const lng=p.coords.longitude;
  const heading=p.coords.heading||curHeading;
  const speed=p.coords.speed||0;

  curPos={lat,lng};
  curHeading=heading;
  curSpeed=Math.round(Math.max(0, speed*3.6));

  // Hız göstergesi — birden fazla id'yi destekle
  ['spd-val','spd-v','spd-ring-v'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=curSpeed;});

  // GPS mesajını gizle
  const gpsEl=document.getElementById('gps-msg');
  if(gpsEl) gpsEl.style.display='none';

  // Harita yoksa oluştur, varsa güncelle
  if(!map){
    initMap(lat,lng);
    return;
  }

  userMk.setLatLng([lat,lng]);
  userMk.setIcon(arrowIco(curHeading));

  if(isNav) map.setView([lat,lng],17);
  if(isNav && route) updateNav(lat,lng);
  checkRadar(lat,lng);

  const now=Date.now();
  if(now-_lastGpsFetch>120000){_lastGpsFetch=now;fetchAround(lat,lng);}
}

function onErr(e){
  if(!map) initMap(41.0082,28.9784);
  const el=document.getElementById('gps-msg');
  if(!el) return;
  if(e.code===1){
    el.textContent='⚠️ Konum izni verilmedi — adres çubuğundaki kilit ikonuna tıklayın';
  } else if(e.code===2){
    el.textContent='📡 GPS konumu alınamadı — tekrar denenecek';
    setTimeout(()=>navigator.geolocation.getCurrentPosition(onPos,()=>{},
      {enableHighAccuracy:false,timeout:10000,maximumAge:60000}),5000);
  } else {
    el.textContent='⏱️ GPS zaman aşımı';
  }
  el.style.display='block';
}
function locateMe(){
  if(curPos && map){
    map.setView([curPos.lat, curPos.lng], 17);
    return;
  }
  // curPos yoksa GPS'ten al
  if(!navigator.geolocation){ alert('GPS desteklenmiyor'); return; }
  navigator.geolocation.getCurrentPosition(
    p => {
      const lat=p.coords.latitude, lng=p.coords.longitude;
      curPos={lat,lng};
      if(!map) initMap(lat,lng);
      else map.setView([lat,lng], 17);
    },
    e => alert('Konum alınamadı: '+e.message),
    {enableHighAccuracy:true, timeout:10000, maximumAge:0}
  );
}

// ── ROTA — alternatif rotalar ──
async function fetchRoute(flat,flng,tlat,tlng){
  try{
    // OSRM'den 3 alternatif rota iste
    const url=`https://router.project-osrm.org/route/v1/driving/${flng},${flat};${tlng},${tlat}?steps=true&geometries=geojson&overview=full&alternatives=3`;
    const r=await(await fetch(url)).json();
    if(r.code!=='Ok'||!r.routes.length)return null;
    return r.routes.map(rt=>({
      steps:rt.legs[0].steps.map(s=>({
        text:mm(s.maneuver?.type,s.maneuver?.modifier),
        type:s.maneuver?.type||'',mod:s.maneuver?.modifier||'',
        dist:s.distance,dur:s.duration,
        lat:s.maneuver.location[1],lng:s.maneuver.location[0]
      })),
      poly:rt.geometry.coordinates.map(c=>[c[1],c[0]]),
      dist:rt.distance,dur:rt.duration
    }));
  }catch{return null;}
}
function drawRoute(poly,color,opacity){
  if(routeLayer)map.removeLayer(routeLayer);
  routeLayer=L.polyline(poly,{color:color||'#6366f1',weight:5,opacity:opacity||.95,lineCap:'round',lineJoin:'round'}).addTo(map);
}
let altLayers=[];
function drawAltRoutes(routes,selectedIdx){
  altLayers.forEach(l=>map.removeLayer(l));altLayers=[];
  routes.forEach((r,i)=>{
    if(i===selectedIdx)return;
    const l=L.polyline(r.poly,{color:'#64748b',weight:4,opacity:.5,lineCap:'round',dashArray:'8,6'}).addTo(map);
    l.on('click',()=>selectRoute(i));
    altLayers.push(l);
  });
}
function drawDest(lat,lng){
  if(destMk)map.removeLayer(destMk);
  destMk=L.marker([lat,lng],{icon:L.divIcon({html:'<div style="font-size:24px;margin-top:-24px">📍</div>',iconSize:[24,24],iconAnchor:[12,24],className:''})}).addTo(map);
}

// ── ALTERNATİF ROTA SEÇİM PANELİ ──
function showRoutePicker(routes,destLat,destLng,destName){
  let panel=document.getElementById('route-picker');
  if(!panel){
    panel=document.createElement('div');panel.id='route-picker';
    panel.style.cssText='position:absolute;bottom:0;left:0;right:0;z-index:40;background:var(--bg);border-top:1px solid var(--border);padding:12px 14px 24px;';
    document.getElementById('content').appendChild(panel);
  }
  const labels=['En Hızlı','Daha Hızlı','Alternatif'];
  panel.innerHTML='<div style="font-size:11px;color:var(--txt3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Rota Seç</div>'+
    routes.map((r,i)=>`
      <div onclick="selectRoute(${i},'${destName}',${destLat},${destLng})"
        style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;margin-bottom:6px;border-radius:10px;cursor:pointer;border:2px solid ${i===0?'var(--accent)':'var(--border2)'};background:${i===0?'var(--accent3)':'var(--bg3)'};transition:all .15s;">
        <div>
          <div style="color:var(--txt);font-size:13px;font-weight:600">${labels[i]||'Seçenek '+(i+1)}</div>
          <div style="color:var(--txt3);font-size:11px;margin-top:2px">${fS(r.dist)} · ${fD(r.dur)}</div>
        </div>
        <div style="color:${i===0?'var(--accent)':'var(--txt3)'};font-size:18px">${i===0?'★':'☆'}</div>
      </div>`).join('')+
    '<div onclick="closeRoutePicker()" style="text-align:center;padding:8px;color:var(--txt3);font-size:12px;cursor:pointer;margin-top:4px">İptal</div>';
  panel.style.display='block';
}
function selectRoute(idx,destName,destLat,destLng){
  selRoute=idx;
  route=altRoutes[idx];
  stepIdx=0;prevAnn=99999;
  drawRoute(route.poly);
  drawAltRoutes(altRoutes,idx);
  closeRoutePicker();
  if(destLat&&destLng)_beginNav(destName,destLat,destLng,false);
}
function closeRoutePicker(){
  const p=document.getElementById('route-picker');if(p)p.style.display='none';
}

// ── NAVİGASYON BAŞLAT/DURDUR ──
async function startNav(name,lat,lng){
  if(!curPos){alert('GPS konumu yok');return;}
  closeRoutePicker();
  // Arama butonunu gizle
  const sb=document.getElementById('search-bar')||document.getElementById('search-float');
  if(sb)sb.style.display='none';
  hideEl('hud');
  // Reroute banner göster
  const rb=document.getElementById('reroute');
  if(rb){rb.textContent='↻ Hesaplanıyor...';rb.classList.add('on');}
  playAudio('rota_hesaplaniyor');

  const routes=await fetchRoute(curPos.lat,curPos.lng,lat,lng);
  hideEl('reroute');
  if(!routes||!routes.length){alert('Rota bulunamadı');_restoreUI();return;}

  altRoutes=routes;selRoute=0;
  route=routes[0];stepIdx=0;prevAnn=99999;

  drawDest(lat,lng);
  drawRoute(routes[0].poly);
  drawAltRoutes(routes,0);
  map.fitBounds(L.polyline(routes[0].poly).getBounds(),{padding:[60,60]});
  setTimeout(()=>{if(curPos)map.setView([curPos.lat,curPos.lng],17);},1800);

  // Alternatif rota seçim paneli göster
  showRoutePicker(routes,lat,lng,name);
  saveRecent(name,lat,lng);
}

function _beginNav(name,lat,lng,announce){
  isNav=true;
  const fs=route.steps[0];
  document.getElementById('hud-turn').textContent=mi(fs?.type,fs?.mod);
  // hud-street veya hud-txt — hangisi varsa
  const streetEl=document.getElementById('hud-street')||document.getElementById('hud-txt');
  if(streetEl)streetEl.textContent=fs?.text||'';
  document.getElementById('hud-dist').textContent=fS(fs?.dist||0);
  document.getElementById('bar-dist').textContent=fS(route.dist);
  document.getElementById('bar-eta').textContent=fD(route.dur);
  showEl('hud');showEl('nav-bar');
  document.body.classList.add('nav-mode');
  if(announce!==false){
    playAudio('rota_basladi');
    if(fs&&fs.dist>0)setTimeout(()=>playNavAudio(fs.dist,fs.type,fs.mod),3500);
  }
}

function stopNav(){
  isNav=false;route=null;altRoutes=[];stepIdx=0;prevAnn=99999;
  if(routeLayer){map.removeLayer(routeLayer);routeLayer=null;}
  if(destMk){map.removeLayer(destMk);destMk=null;}
  if(typeof altLayers!=='undefined')altLayers.forEach(l=>map.removeLayer(l));
  hideEl('hud');hideEl('nav-bar');closeRoutePicker();
  // Arama butonunu geri getir
  const sb=document.getElementById('search-bar')||document.getElementById('search-float');
  if(sb)sb.style.display='';
  document.body.classList.remove('nav-mode');
  playAudio('rota_iptal');
}
  document.body.classList.remove('nav-mode');
}
function _restoreUI(){
  const sb=document.getElementById('search-bar')||document.getElementById('search-float');
  if(sb)sb.style.display='';
}

// ── NAVİGASYON GÜNCELLEME ──
function updateNav(lat,lng){
  if(!route)return;
  const steps=route.steps;if(stepIdx>=steps.length)return;
  const step=steps[stepIdx];
  const d=hvs(lat,lng,step.lat,step.lng);
  const dEnd=hvs(lat,lng,steps[steps.length-1].lat,steps[steps.length-1].lng);

  document.getElementById('hud-dist').textContent=fS(d);
  const streetEl=document.getElementById('hud-street')||document.getElementById('hud-txt');
  if(streetEl)streetEl.textContent=step.text;
  document.getElementById('bar-dist').textContent=fS(dEnd);
  document.getElementById('bar-eta').textContent=fD(route.dur);
  const ns=steps[stepIdx+1];
  document.getElementById('next-txt').textContent=ns?ns.text:'—';

  if(dEnd<30){playAudio('hedefe_ulastiniz');stopNav();return;}

  if(d<20&&stepIdx<steps.length-1){
    stepIdx++;prevAnn=99999;
    const s2=steps[stepIdx];
    playNavAudio(d,s2.type,s2.mod);
    const turnEl=document.getElementById('hud-turn')||document.getElementById('hud-arrow');
    if(turnEl)turnEl.textContent=mi(s2.type,s2.mod);
    return;
  }
  for(const lvl of[1000,500,200,100,50]){
    if(d<=lvl&&prevAnn>lvl){playNavAudio(d,step.type,step.mod);prevAnn=d;break;}
  }
  const now=Date.now();
  if(d>80&&now-lastReroute>15000){lastReroute=now;doReroute(lat,lng);}
}
async function doReroute(lat,lng){
  showEl('reroute','↻ Rota yeniden hesaplanıyor...');hideEl('hud');
  playAudio('rota_yeniden');
  const dest=route.steps[route.steps.length-1];
  const routes=await fetchRoute(lat,lng,dest.lat,dest.lng);
  if(routes&&routes.length){
    altRoutes=routes;route=routes[0];stepIdx=0;prevAnn=99999;
    drawRoute(route.poly);drawAltRoutes(routes,0);
  }
  hideEl('reroute');showEl('hud');
}

// ── SES ──
const AUDIO_BASE='audio/';
function playAudio(key){_aq.push(key);_pn();}
function _pn(){
  if(_ap||_aq.length===0)return;
  _ap=true;const key=_aq.shift();
  const a=new Audio(AUDIO_BASE+key+'.mp3');
  a.onended=()=>{_ap=false;_pn();};
  a.onerror=()=>{_ap=false;_pn();};
  a.play().catch(()=>{_ap=false;_pn();});
}
function playNavAudio(dist,type,mod){
  const d=dist>=900?'1km':dist>=400?'500m':dist>=150?'200m':dist>=75?'100m':'50m';
  const modMap={'sharp left':'keskin_sola','sharp right':'keskin_saga','slight left':'hafif_sola','slight right':'hafif_saga',left:'sola',right:'saga',uturn:'geri'};
  let dir=mod?(modMap[mod]||'duz'):'duz';
  if(type==='roundabout'||type==='rotary')dir='kavsak';
  playAudio(d+'_'+dir);
}
function testSpeak(){_aq=[];_ap=false;playAudio('500m_saga');}
function beep(type){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.setValueAtTime(type==='police'?880:type==='mobile_radar'?660:520,ctx.currentTime);
    o.type='square';g.gain.setValueAtTime(0.25,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+0.4);
  }catch{}
}

// ── RADAR ──
function loadRadars(){
  if(window.RADAR_DB){
    window.RADAR_DB.forEach(p=>{if(!radarPts.find(r=>r.id===p.id)){radarPts.push(p);drawRadar(p);}});
  }
  schedFetch();
}
// Overpass: son fetch zamanı — 429'dan kaçınmak için minimum 90sn aralık
let _lastOverpassTime=0;
const OVERPASS_MIN_INTERVAL=90000; // 90 saniye
const OVERPASS_MIRRORS=[
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
let _mirrorIdx=0;

// Harita kaydırılınca 5sn bekle (çok sık tetiklenmesin)
function schedFetch(){clearTimeout(window._ft);window._ft=setTimeout(doFetch,5000);}

async function fetchAround(lat,lng){
  const d=0.045;
  await _overpass((lat-d).toFixed(5),(lng-d).toFixed(5),(lat+d).toFixed(5),(lng+d).toFixed(5));
}

async function doFetch(){
  if(_fetching||!map)return;
  const now=Date.now();
  // Son Overpass sorgusundan 90sn geçmemişse atla
  if(now-_lastOverpassTime<OVERPASS_MIN_INTERVAL)return;
  const b=map.getBounds();
  if(_lastBounds&&_lastBounds.equals(b,0.01))return;
  _lastBounds=b;_fetching=true;
  await _overpass(b.getSouth().toFixed(4),b.getWest().toFixed(4),b.getNorth().toFixed(4),b.getEast().toFixed(4));
  _fetching=false;
}

async function _overpass(s,w,n,e){
  const now=Date.now();
  if(now-_lastOverpassTime<OVERPASS_MIN_INTERVAL){_fetching=false;return;}
  _lastOverpassTime=now;
  const q=`[out:json][timeout:25];(node["highway"="speed_camera"](${s},${w},${n},${e});node["enforcement"="maxspeed"](${s},${w},${n},${e});node["enforcement"="average_speed"](${s},${w},${n},${e});node["police"="checkpoint"](${s},${w},${n},${e});node["amenity"="police"](${s},${w},${n},${e}););out body;`;
  const mirror=OVERPASS_MIRRORS[_mirrorIdx%OVERPASS_MIRRORS.length];
  try{
    const res=await fetch(mirror,{method:'POST',body:'data='+encodeURIComponent(q),signal:AbortSignal.timeout(30000)});
    // 429 Too Many Requests — farklı mirror dene, bir sonraki çağrıya bırak
    if(res.status===429){
      console.warn('Overpass 429 — mirror değiştiriliyor, 2dk bekleniyor');
      _mirrorIdx++;
      _lastOverpassTime=Date.now()+120000; // 2dk daha bekleme cezası
      _fetching=false;return;
    }
    const data=await res.json();
    let added=0;
    (data.elements||[]).forEach(el=>{
      const id='osm_'+el.id;
      if(radarPts.find(r=>r.id===id))return;
      const tags=el.tags||{},enf=(tags.enforcement||'').toLowerCase();
      let type='fixed_radar';
      if(tags.amenity==='police'||tags.police==='checkpoint')type='police';
      else if(enf==='average_speed')type='mobile_radar';
      const spd=parseInt(tags.maxspeed||0)||0;
      const p={id,type,lat:el.lat,lng:el.lon,speedLimit:spd,region:tags.name||''};
      radarPts.push(p);if(map)drawRadar(p);added++;
    });
    if(added>0)console.log('Radar +'+added+' (toplam '+radarPts.length+', mirror: '+_mirrorIdx+')');
  }catch(e){
    console.warn('Overpass hata:',e.message);
    _mirrorIdx++; // Hatalı mirror'dan geç
  }
  _fetching=false;
}
function drawRadar(p){
  if(!map)return;
  const meta=RMETA[p.type]||{e:'⚠️',c:'#f59e0b'};
  const spd=p.speedLimit?'<div style="font-size:8px;color:#fff;background:'+meta.c+';border-radius:3px;padding:0 2px;margin-top:1px;text-align:center;line-height:14px">'+p.speedLimit+'</div>':'';
  radarMks.push(L.marker([p.lat,p.lng],{
    icon:L.divIcon({html:'<div style="text-align:center;line-height:1.1;font-size:18px">'+meta.e+spd+'</div>',iconSize:[24,30],iconAnchor:[12,15],className:''}),
    title:(p.region||'')+(p.speedLimit?' '+p.speedLimit+'km/h':'')
  }).addTo(map));
}
const _radarTrig={};
function checkRadar(lat,lng){
  radarPts.forEach(r=>{
    const d=hvs(lat,lng,r.lat,r.lng);
    if(!_radarTrig[r.id])_radarTrig[r.id]=new Set();
    const tr=_radarTrig[r.id];
    [1000,800,600,400,200].forEach(step=>{
      if(d<=step&&!tr.has(step)){
        tr.add(step);
        const suffix=step<=200?'_200m':'_1km';
        const km={fixed_radar:'radar_sabit',mobile_radar:'radar_seyyar',police:'radar_polis',accident:'radar_kaza',traffic_jam:'radar_trafik'}[r.type];
        if(km)playAudio(km+suffix);
        beep(r.type);
        if(step===1000)showRadarBanner(r.type,RLBL[r.type]||r.type,r.speedLimit);
      }
    });
    if(d>2000)_radarTrig[r.id]=new Set();
  });
}
function showRadarBanner(type,label,spd){
  const meta=RMETA[type]||{e:'⚠️',c:'#f59e0b'};
  const el=document.getElementById('radar-warn');
  el.style.background=meta.c;
  document.getElementById('rw-ico').textContent=meta.e;
  document.getElementById('rw-lbl').textContent=label;
  document.getElementById('rw-spd').textContent=spd?'Limit: '+spd+' km/h':'';
  el.classList.add('on');
  clearTimeout(radarTmo);radarTmo=setTimeout(()=>el.classList.remove('on'),5000);
}

// ── ARAMA ──
function openSearch(){
  document.getElementById('search-panel').classList.add('on');
  document.getElementById('sr-input').focus();
}
function closeSearch(){
  document.getElementById('search-panel').classList.remove('on');
  document.getElementById('sr-input').value='';
  document.getElementById('sr-results').innerHTML='';
}
document.getElementById('sr-input').addEventListener('input',function(){
  clearTimeout(srTimer);
  const q=this.value.trim();
  if(q.length<3){document.getElementById('sr-results').innerHTML='';return;}
  srTimer=setTimeout(()=>doSearch(q),500);
});
async function doSearch(q){
  document.getElementById('sr-loading').style.display='block';
  try{
    const data=await(await fetch(
      'https://nominatim.openstreetmap.org/search?q='+encodeURIComponent(q)+'&format=json&limit=5&accept-language=tr',
      {headers:{'User-Agent':'BanaNav/4'}}
    )).json();
    renderResults(data);
  }catch{}
  document.getElementById('sr-loading').style.display='none';
}
function renderResults(items){
  const c=document.getElementById('sr-results');
  c.innerHTML='';
  if(!items.length){
    c.innerHTML='<div style="padding:12px;color:var(--txt3);text-align:center;font-size:12px">Sonuç bulunamadı</div>';
    return;
  }
  items.forEach(item=>{
    const pts=item.display_name.split(', ');
    const title=pts.slice(0,2).join(', ');
    const sub=pts.slice(2,4).join(', ');
    const d=document.createElement('div');
    d.className='sr-item';
    d.innerHTML='<div class="sr-pin">📍</div><div><div class="sr-title">'+title+'</div>'+(sub?'<div class="sr-sub">'+sub+'</div>':'')+'</div>';
    d.onclick=()=>{
      closeSearch();
      startNav(title,parseFloat(item.lat),parseFloat(item.lon));
    };
    c.appendChild(d);
  });
}

// ── KAYITLI KONUMLAR ──
async function rgeo(lat,lng){
  try{
    const d=await(await fetch(
      'https://nominatim.openstreetmap.org/reverse?lat='+lat+'&lon='+lng+'&format=json&accept-language=tr',
      {headers:{'User-Agent':'BanaNav/4'}}
    )).json();
    return d.display_name||'Bilinmeyen';
  }catch{return 'Bilinmeyen';}
}
function saveHome(){
  if(!curPos){alert('GPS yok');return;}
  rgeo(curPos.lat,curPos.lng).then(a=>{
    localStorage.setItem('home',JSON.stringify({lat:curPos.lat,lng:curPos.lng,addr:a}));
    alert('✅ Ev kaydedildi');
    playAudio('ev_kaydedildi');
  });
}
function saveCar(){
  if(!curPos){alert('GPS yok');return;}
  rgeo(curPos.lat,curPos.lng).then(a=>{
    localStorage.setItem('car',JSON.stringify({lat:curPos.lat,lng:curPos.lng,addr:a}));
    alert('✅ Park yeri kaydedildi');
    playAudio('arac_kaydedildi');
  });
}
function goHome(){
  const h=localStorage.getItem('home');
  if(!h){if(confirm('Ev kaydedilmedi. Şu anki konumu ev olarak kaydet?'))saveHome();return;}
  const d=JSON.parse(h);
  playAudio('eve_gidiliyor');
  startNav('Evim',d.lat,d.lng);
}
function goToCar(){
  const c=localStorage.getItem('car');
  if(!c){if(confirm('Park yeri kaydedilmedi. Şu anki konumu kaydet?'))saveCar();return;}
  const d=JSON.parse(c);
  playAudio('araca_gidiliyor');
  startNav('Araç',d.lat,d.lng);
}
function saveRecent(name,lat,lng){
  let r=JSON.parse(localStorage.getItem('recents')||'[]');
  r=r.filter(x=>!(Math.abs(x.lat-lat)<.001&&Math.abs(x.lng-lng)<.001));
  r.unshift({name,lat,lng});
  localStorage.setItem('recents',JSON.stringify(r.slice(0,10)));
}

// ── UI YARDIMCILARI ──
function showEl(id,txt){
function showEl(id,txt){
  const el=document.getElementById(id);if(!el)return;
  if(txt!==undefined)el.textContent=txt;
  el.classList.add('on');el.style.display='';
}
function hideEl(id){
  const el=document.getElementById(id);if(!el)return;
  el.classList.remove('on');
  if(['search-bar','search-float','search-wrap','nav-bar','hud'].includes(id))el.style.display='none';
}
function toggleLayer(){
  const lp=document.getElementById('layer-panel');if(lp)lp.classList.toggle('on');
  const sp=document.getElementById('settings-panel');if(sp)sp.classList.remove('on');
}
function closeLayer(){const lp=document.getElementById('layer-panel');if(lp)lp.classList.remove('on');}
function toggleSettings(){
  const sp=document.getElementById('settings-panel');if(sp)sp.classList.toggle('on');
  const lp=document.getElementById('layer-panel');if(lp)lp.classList.remove('on');
}
function closeSettings(){const sp=document.getElementById('settings-panel');if(sp)sp.classList.remove('on');}
function openMenu(){
  // mp veya menu-panel
  const mp=document.getElementById('mp')||document.getElementById('menu-panel');if(mp)mp.classList.add('on');
  const mo=document.getElementById('mo')||document.getElementById('menu-overlay');if(mo)mo.classList.add('on');
}
function closeMenu(){
  const mp=document.getElementById('mp')||document.getElementById('menu-panel');if(mp)mp.classList.remove('on');
  const mo=document.getElementById('mo')||document.getElementById('menu-overlay');if(mo)mo.classList.remove('on');
}

// Sayfa geçişleri — boş butonları kaldırdık, sadece çalışanlar
function switchPage(page){
  document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('active'));
  if(event&&event.currentTarget)event.currentTarget.classList.add('active');
  if(page==='map')locateMe();
  else if(page==='rota')openSearch();
}

// Panellerin dışına tıklayınca kapat
document.addEventListener('click',e=>{
  ['layer-panel','settings-panel'].forEach(id=>{
    const p=document.getElementById(id);
    if(!p||!p.classList.contains('on'))return;
    if(!p.contains(e.target)&&!e.target.closest('[onclick*="toggleLayer"],[onclick*="toggleSettings"]'))
      p.classList.remove('on');
  });
});

// ── KAMERA AÇILARI — zoom tabanlı (CSS transform yok — Leaflet koordinat sistemi bozulur) ──
const CAM_MODES=[
  {name:'Genel', zoom:15, label:'🌍'},
  {name:'Yakın',  zoom:17, label:'🔍'},
  {name:'Çok Yakın', zoom:19, label:'👁️'},
  {name:'Uzak',  zoom:13, label:'🗺️'},
];
function setCamMode(idx){
  _camMode=idx%CAM_MODES.length;
  const m=CAM_MODES[_camMode];
  if(map && curPos) map.setView([curPos.lat, curPos.lng], m.zoom);
  const btn=document.getElementById('cam-btn');
  if(btn) btn.textContent=m.label;
}
function nextCam(){setCamMode(_camMode+1);}

// Kamera butonu — navigasyon HUD'una eklenecek
function _addCamBtn(){
  if(document.getElementById('cam-btn'))return;
  const btn=document.createElement('button');
  btn.id='cam-btn';
  btn.title='Kamera Açısı';
  btn.textContent='⬆️';
  btn.style.cssText='position:absolute;top:12px;right:12px;z-index:21;'
    +'background:none;border:none;font-size:22px;cursor:pointer;'
    +'opacity:.85;padding:4px;line-height:1;';
  btn.onclick=nextCam;
  document.getElementById('content').appendChild(btn);
}

// ── BAŞLAT ──
// Tema butonunu güncelle
(function initTheme(){
  const light=document.body.classList.contains('light');
  const lbl=document.getElementById('theme-lbl');
  const ico=document.getElementById('theme-ico');
  if(lbl)lbl.textContent=light?'Koyu Mod':'Açık Mod';
  if(ico)ico.textContent=light?'🌙':'☀️';
  // Layer seçim aktifini güncelle
  const activeKey=_savedTheme==='light'?'light':'dark';
  document.querySelectorAll('.lp-item').forEach(el=>el.classList.remove('active'));
  const el=document.getElementById('lp-'+activeKey);if(el)el.classList.add('active');
})();

startGPS();

// ── YAKINDAKI YERLER — Nominatim (API key yok, ücretsiz) ──
// Her kategori için Nominatim'e gönderilecek arama terimi
const PLACE_TYPES=[
  {key:'hospital',   label:'Hastane',    icon:'🏥', q:'hastane'},
  {key:'pharmacy',   label:'Eczane',     icon:'💊', q:'eczane'},
  {key:'fuel',       label:'Benzinlik',  icon:'⛽', q:'benzin istasyonu'},
  {key:'restaurant', label:'Restoran',   icon:'🍽️', q:'restoran'},
  {key:'market',     label:'Market',     icon:'🛒', q:'market süpermarket bakkal'},
  {key:'bakkal',     label:'Bakkal',     icon:'🏪', q:'bakkal'},
  {key:'cafe',       label:'Kafe',       icon:'☕', q:'kafe'},
  {key:'atm',        label:'ATM',        icon:'🏧', q:'ATM bankamatik'},
  {key:'parking',    label:'Otopark',    icon:'🅿️', q:'otopark'},
  {key:'police',     label:'Polis',      icon:'👮', q:'polis karakolu'},
  {key:'mosque',     label:'Cami',       icon:'🕌', q:'cami'},
  {key:'school',     label:'Okul',       icon:'🏫', q:'okul'},
  {key:'bank',       label:'Banka',      icon:'🏦', q:'banka'},
  {key:'hotel',      label:'Otel',       icon:'🏨', q:'otel'},
  {key:'car_repair', label:'Oto Tamir',  icon:'🔧', q:'oto tamirci servis'},
  {key:'car_wash',   label:'Oto Yıkama', icon:'🚿', q:'oto yıkama'},
];
let nearbyMarkers=[];

function openNearby(){
  let panel=document.getElementById('nearby-panel');
  if(!panel){
    panel=document.createElement('div');
    panel.id='nearby-panel';
    panel.style.cssText='position:absolute;inset:0;z-index:45;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;';
    document.getElementById('content').appendChild(panel);
  }
  panel.innerHTML=`
    <div style="display:flex;align-items:center;gap:10px;padding:14px 14px 10px;border-bottom:1px solid var(--border2);flex-shrink:0">
      <div style="font-size:14px;font-weight:600;color:var(--txt);flex:1">Yakındaki Yerler</div>
      <button onclick="closeNearby()" style="background:none;border:none;color:var(--txt3);font-size:18px;cursor:pointer;line-height:1">✕</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;flex-shrink:0">
      ${PLACE_TYPES.map(p=>`
        <div onclick="searchNearby('${p.key}','${p.label}','${p.q}')"
          style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:10px 4px;text-align:center;cursor:pointer;transition:background .15s"
          onmouseover="this.style.background='var(--accent3)'" onmouseout="this.style.background='var(--bg3)'">
          <div style="font-size:22px">${p.icon}</div>
          <div style="color:var(--txt2);font-size:9px;margin-top:3px">${p.label}</div>
        </div>`).join('')}
    </div>
    <div id="nearby-results" style="flex:1;overflow-y:auto;padding:0 12px 16px"></div>
  `;
  panel.style.display='flex';
}

function closeNearby(){
  const p=document.getElementById('nearby-panel');
  if(p)p.style.display='none';
  nearbyMarkers.forEach(m=>map&&map.removeLayer(m));
  nearbyMarkers=[];
}

// Nominatim tabanlı yakın yer arama — API key yok, tamamen ücretsiz
async function searchNearby(key,label,searchQ){
  if(!curPos){alert('GPS yok');return;}
  const res=document.getElementById('nearby-results');
  if(!res)return;
  // Buton vurgula
  document.querySelectorAll('#nearby-panel [onclick*="searchNearby"]').forEach(el=>el.style.borderColor='');
  const btn=document.querySelector('#nearby-panel [onclick*="\''+key+'\'"]');
  if(btn)btn.style.borderColor='var(--accent)';

  res.innerHTML='<div style="padding:14px;text-align:center;color:var(--txt3);font-size:12px">🔍 Aranıyor...</div>';

  try{
    // Nominatim: konuma yakın yerleri ara
    const url='https://nominatim.openstreetmap.org/search'
      +'?q='+encodeURIComponent(searchQ)
      +'&format=json&limit=20&addressdetails=1&extratags=1'
      +'&viewbox='+(curPos.lng-0.05)+','+(curPos.lat+0.05)+','+(curPos.lng+0.05)+','+(curPos.lat-0.05)
      +'&bounded=1&accept-language=tr';

    const items=await(await fetch(url,{headers:{'User-Agent':'BanaNav/4'}})).json();

    // Mesafe hesapla ve sırala
    const withDist=items.map(item=>({
      ...item,
      dist:Math.round(hvs(curPos.lat,curPos.lng,parseFloat(item.lat),parseFloat(item.lon)))
    })).sort((a,b)=>a.dist-b.dist);

    // Haritada göster
    nearbyMarkers.forEach(m=>map&&map.removeLayer(m));nearbyMarkers=[];
    const found=PLACE_TYPES.find(p=>p.key===key);
    withDist.slice(0,15).forEach(item=>{
      const mk=L.marker([parseFloat(item.lat),parseFloat(item.lon)],{
        icon:L.divIcon({
          html:'<div style="font-size:20px;text-shadow:0 1px 3px #000">'+(found?.icon||'📍')+'</div>',
          iconSize:[24,24],iconAnchor:[12,12],className:''
        }),
        title:item.display_name
      }).addTo(map);
      nearbyMarkers.push(mk);
    });
    if(nearbyMarkers.length>0)
      map.fitBounds(L.featureGroup(nearbyMarkers).getBounds(),{padding:[40,40],maxZoom:16});

    if(!withDist.length){
      res.innerHTML='<div style="padding:14px;text-align:center;color:var(--txt3);font-size:12px">Yakında '+label+' bulunamadı</div>';
      return;
    }

    res.innerHTML=withDist.slice(0,15).map(item=>{
      const pts=item.display_name.split(', ');
      const name=pts[0]||(found?.label||label);
      const addr=pts.slice(1,3).join(', ');
      const distTxt=item.dist<1000?item.dist+' m':(item.dist/1000).toFixed(1)+' km';
      const safeName=name.replace(/'/g,'\\\'');
      return '<div onclick="startNav(\''+safeName+'\','+item.lat+','+item.lon+');closeNearby()" '
        +'style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--border2);cursor:pointer">'
        +'<div style="font-size:20px">'+(found?.icon||'📍')+'</div>'
        +'<div style="flex:1;min-width:0">'
          +'<div style="color:var(--txt);font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+name+'</div>'
          +(addr?'<div style="color:var(--txt3);font-size:10px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+addr+'</div>':'')
        +'</div>'
        +'<div style="text-align:right;flex-shrink:0">'
          +'<div style="color:var(--accent);font-size:12px;font-weight:600">'+distTxt+'</div>'
          +'<div style="color:var(--txt3);font-size:10px">→</div>'
        +'</div>'
        +'</div>';
    }).join('');

  }catch(e){
    res.innerHTML='<div style="padding:12px;color:#ef4444;font-size:12px">Hata: '+e.message+'</div>';
  }
}

// ── EV/ARAÇ SİL ──
function deleteHome(){
  if(confirm('Ev konumunu silmek istiyor musunuz?')){localStorage.removeItem('home');alert('Ev konumu silindi.');}
}
function deleteCar(){
  if(confirm('Araç konumunu silmek istiyor musunuz?')){localStorage.removeItem('car');alert('Araç konumu silindi.');}
}
