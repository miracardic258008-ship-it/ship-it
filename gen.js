const fs=require('fs');
const OUT='bana-navigasyon/web/nav.js';
const lines=[];
const L=s=>lines.push(s);

L('// nav.js - Navigation Engine');
L("let map,userMk,routeLayer,destMk,curTile,curTileKey='dark';");
L("let curPos=null,curHeading=0,curSpeed=0;");
L("let route=null,altRoutes=[],selRoute=0,stepIdx=0,isNav=false,prevAnn=99999,lastReroute=0;");
L("let radarPts=[],radarMks=[],radarTmo=null,_rt={};");
L("let srTimer=null,_fetching=false,_lastBounds=null,_lastGpsFetch=0;");
L("let _aq=[],_ap=false;");
L("if(localStorage.getItem('theme')==='light')document.body.classList.add('light');");
L('');
L('const TILES={');
L("  dark:{url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',attr:'CartoDB',max:20},");
L("  osm:{url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',attr:'OSM',max:19},");
L("  satellite:{url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',attr:'Esri',max:19},");
L("  light:{url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',attr:'CartoDB',max:19},");
L("  topo:{url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',attr:'OpenTopoMap',max:17}");
L('};');
L("const RMETA={fixed_radar:{e:'📷',c:'#ef4444'},mobile_radar:{e:'🚔',c:'#f97316'},police:{e:'👮',c:'#a855f7'},accident:{e:'��',c:'#f59e0b'},traffic_jam:{e:'🚗',c:'#6366f1'},hazard:{e:'⚠️',c:'#f59e0b'}};");
L("const RLBL={fixed_radar:'Sabit Radar',mobile_radar:'Seyyar Radar',police:'Polis Çevirme',accident:'Kaza',traffic_jam:'Trafik',hazard:'Tehlike'};");
L("const MMOD={left:'sola',right:'sağa','sharp left':'keskin sola','sharp right':'keskin sağa','slight left':'hafif sola','slight right':'hafif sağa',straight:'düz',uturn:'geri dön'};");

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log('Part1 written:', fs.statSync(OUT).size, 'bytes');
