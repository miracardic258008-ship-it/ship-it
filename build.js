const fs=require("fs");const nav=fs.readFileSync("bana-navigasyon/web/nav_src.js","utf8");fs.writeFileSync("bana-navigasyon/web/nav.js",nav,"utf8");console.log("ok",nav.split("\n").length,"lines");
