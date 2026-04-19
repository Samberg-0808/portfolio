// Animated background — Impression, Sunrise after Monet
// Blue-grey mist dominant, vivid orange sun upper-right,
// hazy background ships left side, two foreground rowboats,
// shimmering orange reflection, horizontal brushstroke water.

(function () {
  const GW = 200, GH = 120;
  const HORIZON = 54; // row where sky meets water
  const SUN_X = 130, SUN_Y = 30, SUN_R = 5;

  let canvas, ctx, offscreen, octx, t = 0;

  // ── Palette ───────────────────────────────────────────────────────────────
  const C = {
    // Sky — cold blue-grey mist base
    skyBase:   [168, 182, 196],
    skyMid:    [158, 172, 188],
    skyDark:   [138, 154, 172],
    skyWarm:   [210, 176, 148], // near sun
    skyWarm2:  [188, 152, 118],
    skyStroke: [144, 160, 178],
    // Water
    waterBase: [128, 148, 166],
    waterDark: [108, 128, 148],
    waterMid:  [118, 138, 158],
    waterLight:[152, 170, 184],
    waterDash: [136, 154, 170],
    // Sun
    sun:       [255, 52, 20],
    sunHalo:   [240, 110, 60],
    sunHalo2:  [220, 148, 90],
    // Reflection
    refl1:     [230, 100, 40],
    refl2:     [200, 72, 28],
    refl3:     [165, 50, 20],
    refl4:     [130, 40, 16],
    // Background ships — very muted blue-grey
    shipFar:   [118, 136, 154],  // almost sky
    shipMid:   [98,  116, 136],
    shipNear:  [78,  96,  118],
    // Boats
    boat1:     [24,  30,  44],   // near foreground — dark navy
    boat2:     [56,  72,  92],   // far boat — bluer/lighter
    boat2f:    [72,  88, 108],   // far boat lighter variant
  };

  function px(pixels, x, y, col, alpha=1) {
    if (x<0||x>=GW||y<0||y>=GH) return;
    const i=(y*GW+x)*3;
    pixels[i]   = (pixels[i]  *(1-alpha) + col[0]*alpha)|0;
    pixels[i+1] = (pixels[i+1]*(1-alpha) + col[1]*alpha)|0;
    pixels[i+2] = (pixels[i+2]*(1-alpha) + col[2]*alpha)|0;
  }

  // Paint a blurry "blob" — impressionist far element
  // The larger the blur radius, the more it dissolves into background
  function blob(pixels, cx, cy, w, h, col, alpha, blur=1) {
    for (let dy=-h;dy<=h;dy++) for (let dx=-w;dx<=w;dx++) {
      const dist = Math.sqrt((dx/w)*(dx/w)+(dy/h)*(dy/h));
      if (dist > 1) continue;
      const a = alpha * (1 - Math.pow(dist, blur));
      px(pixels, cx+dx, cy+dy, col, a);
    }
  }

  // Smear a vertical line upward with decreasing alpha (mast/crane)
  function smearMast(pixels, x, baseY, height, col, alpha, blur=1.5) {
    for (let dy=0;dy<height;dy++) {
      const a = alpha * Math.pow(1 - dy/height, blur);
      // slight horizontal smear for impressionist feel
      px(pixels, x,   baseY-dy, col, a);
      if (dy % 2 === 0) px(pixels, x-1, baseY-dy, col, a*0.4);
      if (dy % 3 === 0) px(pixels, x+1, baseY-dy, col, a*0.35);
    }
  }

  // ── Sky ───────────────────────────────────────────────────────────────────
  function drawSky(pixels) {
    for (let y=0;y<HORIZON;y++) {
      const f = y/HORIZON; // 0=top, 1=horizon
      for (let x=0;x<GW;x++) {
        // Warm zone near sun — radial gradient
        const dx = x - SUN_X, dy = y - SUN_Y;
        const distSun = Math.sqrt(dx*dx*0.7 + dy*dy);
        const warmth = Math.max(0, 1 - distSun/52);
        // base sky
        const base = [C.skyBase[0]*(1-f)+C.skyDark[0]*f,
                      C.skyBase[1]*(1-f)+C.skyDark[1]*f,
                      C.skyBase[2]*(1-f)+C.skyDark[2]*f];
        // mix in warm
        const c = [
          base[0]*(1-warmth) + C.skyWarm[0]*warmth,
          base[1]*(1-warmth) + C.skyWarm[1]*warmth,
          base[2]*(1-warmth) + C.skyWarm[2]*warmth,
        ];
        px(pixels, x, y, c, 1);
      }
    }

    // Impressionist sky brushstrokes — short horizontal dashes of varying tone
    for (let i=0;i<320;i++) {
      const x = (Math.random()*GW)|0;
      const y = (Math.random()*(HORIZON-4))|0;
      const len = 3 + (Math.random()*6)|0;
      const warm = Math.abs(x-SUN_X) < 30 && Math.abs(y-SUN_Y) < 20;
      const stroke = warm ? C.skyWarm2 : C.skyStroke;
      for (let dx=0;dx<len;dx++) px(pixels, x+dx, y, stroke, 0.18 + Math.random()*0.12);
    }
  }

  // ── Sun ───────────────────────────────────────────────────────────────────
  function drawSun(pixels) {
    // Soft halo
    for (let dy=-12;dy<=12;dy++) for (let dx=-12;dx<=12;dx++) {
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d > 12) continue;
      const a = Math.max(0, 0.28 - d/44);
      px(pixels, SUN_X+dx, SUN_Y+dy, C.sunHalo2, a);
    }
    for (let dy=-8;dy<=8;dy++) for (let dx=-8;dx<=8;dx++) {
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d > 8) continue;
      const a = Math.max(0, 0.45 - d/18);
      px(pixels, SUN_X+dx, SUN_Y+dy, C.sunHalo, a);
    }
    // Disc
    for (let dy=-SUN_R;dy<=SUN_R;dy++) for (let dx=-SUN_R;dx<=SUN_R;dx++) {
      if (dx*dx+dy*dy<=SUN_R*SUN_R) px(pixels, SUN_X+dx, SUN_Y+dy, C.sun, 0.97);
    }
  }

  // ── Background ships — LEFT heavy, RIGHT lighter, very hazy ──────────────
  function drawBgShips(pixels) {
    // LEFT cluster — large industrial cranes/masts, very hazy
    // Main hull left
    blob(pixels, 22, HORIZON-4, 22, 6, C.shipFar, 0.45, 1.8);
    blob(pixels, 32, HORIZON-6, 16, 5, C.shipMid, 0.35, 2.0);
    // Left masts (tall, very blurred)
    smearMast(pixels, 14, HORIZON-8, 32, C.shipFar, 0.38, 2.2);
    smearMast(pixels, 22, HORIZON-8, 40, C.shipMid, 0.42, 2.0);
    smearMast(pixels, 32, HORIZON-8, 36, C.shipFar, 0.36, 2.4);
    smearMast(pixels, 42, HORIZON-8, 28, C.shipFar, 0.30, 2.5);
    // Cross-beams — hazy horizontals
    for (let dx=-10;dx<=10;dx++) {
      px(pixels, 22+dx, HORIZON-26, C.shipMid, 0.25);
      px(pixels, 32+dx, HORIZON-20, C.shipFar, 0.20);
    }
    // Second left cluster
    blob(pixels, 55, HORIZON-3, 12, 4, C.shipFar, 0.30, 2.0);
    smearMast(pixels, 52, HORIZON-6, 22, C.shipFar, 0.28, 2.5);
    smearMast(pixels, 58, HORIZON-6, 28, C.shipFar, 0.25, 2.8);

    // RIGHT cluster — lighter, more distant
    blob(pixels, 158, HORIZON-3, 16, 5, C.shipFar, 0.28, 2.2);
    blob(pixels, 172, HORIZON-3, 12, 4, C.shipFar, 0.22, 2.5);
    smearMast(pixels, 155, HORIZON-6, 18, C.shipFar, 0.22, 2.8);
    smearMast(pixels, 163, HORIZON-6, 24, C.shipFar, 0.24, 2.5);
    smearMast(pixels, 174, HORIZON-6, 16, C.shipFar, 0.18, 3.0);
    // Right horizontal arm
    for (let dx=-6;dx<=6;dx++) px(pixels, 163+dx, HORIZON-18, C.shipFar, 0.16);
  }

  // ── Water — horizontal brushstroke dashes ─────────────────────────────────
  function drawWater(pixels, t) {
    for (let y=HORIZON;y<GH;y++) {
      const depth = (y-HORIZON)/(GH-HORIZON);
      // base water — slight gradient, darker near horizon
      const base = [
        C.waterBase[0]*(1-depth*0.15),
        C.waterBase[1]*(1-depth*0.12),
        C.waterBase[2]*(1-depth*0.10),
      ];
      for (let x=0;x<GW;x++) {
        px(pixels, x, y, base, 1);
      }
    }

    // Horizontal brushstroke dashes — the Monet water texture
    // Each row has short dashes of varying tone; they shift slightly with time
    for (let y=HORIZON;y<GH;y++) {
      const depth = (y-HORIZON)/(GH-HORIZON);
      const speed = 0.18 + depth*0.55; // near rows move faster
      const dashLen = 2 + (depth*3)|0;

      // Multiple passes of dashes at different phases
      for (let pass=0;pass<3;pass++) {
        const phase = pass * 2.2 + t * speed + depth * 4.5;
        const spacing = 5 + (pass*3)|0;
        let x = ((phase * 13.7) % spacing)|0;
        while (x < GW) {
          const len = dashLen + ((Math.sin(x*0.7+pass)*1.5)|0);
          const pick = pass===0 ? C.waterDark : pass===1 ? C.waterLight : C.waterDash;
          for (let dx=0;dx<len;dx++) px(pixels, x+dx, y, pick, 0.28+pass*0.06);
          x += spacing + ((Math.sin(x*0.3+y*0.1)*2)|0);
        }
      }
    }

    // Orange reflection — zigzag column below sun, widens toward viewer
    for (let y=HORIZON;y<GH;y++) {
      const depth = (y-HORIZON)/(GH-HORIZON);
      const reflW = 1.5 + depth * 9;
      // wiggle side to side with wave motion
      const wobble = Math.sin(t * 1.4 + depth * 6) * 2.2
                   + Math.sin(t * 0.8 + depth * 3.5 + 1.1) * 1.4;
      const cx = SUN_X + wobble;

      for (let dx=-reflW;dx<=reflW;dx++) {
        const dist = Math.abs(dx);
        const ripple = Math.sin(t * 2.2 + depth * 7 + dx * 0.5) * 0.5 + 0.5;
        const alpha = (1 - dist/reflW) * (0.55 + ripple * 0.35) * (0.5 + depth * 0.55);
        const col = depth < 0.3 ? C.refl1 : depth < 0.55 ? C.refl2 : depth < 0.78 ? C.refl3 : C.refl4;
        px(pixels, (cx+dx)|0, y, col, alpha);
      }
    }

    // Horizon haze — soft blend line
    for (let x=0;x<GW;x++) {
      px(pixels, x, HORIZON,   C.skyBase, 0.55);
      px(pixels, x, HORIZON+1, C.skyBase, 0.28);
    }
  }

  // ── Far small boat — left center, blurry ─────────────────────────────────
  function drawFarBoat(pixels, t) {
    const bob = Math.sin(t*0.72 + 1.1)*0.8;
    const bx = 38, by = (HORIZON + 9 + bob)|0;
    // Blurry — paint as soft blob
    blob(pixels, bx+4, by, 7, 2, C.boat2, 0.55, 1.6);
    blob(pixels, bx+4, by-1, 5, 1, C.boat2, 0.45, 1.8);
    // Hazy figure
    blob(pixels, bx+4, by-4, 2, 3, C.boat2, 0.40, 2.0);
    // Soft oar stroke
    for (let dx=-4;dx<=6;dx++) px(pixels, bx+4+dx, by-2, C.boat2f, 0.22);
  }

  // ── Near foreground boat — dark, defined, two figures ─────────────────────
  function drawNearBoat(pixels, t) {
    const bob = Math.sin(t*0.88)*1.1 + Math.sin(t*0.55)*0.5;
    const bx = 86, by = (HORIZON + 22 + bob)|0;

    // Hull — solid dark pixels, slight taper
    for (let dx=0;dx<18;dx++) {
      const taper = dx===0||dx===17 ? 1 : dx<2||dx>15 ? 0 : -1;
      for (let dy=0;dy<3;dy++) {
        if (dy===2 && (dx<2||dx>15)) continue;
        px(pixels, bx+dx, by+dy+taper, C.boat1, 0.97);
      }
    }
    // Deck
    for (let dx=2;dx<16;dx++) px(pixels, bx+dx, by-1, C.boat1, 0.92);

    // Figure 1 (left — oarsman, slightly leaning)
    for (let dy=-5;dy<=-1;dy++) px(pixels, bx+5, by+dy, C.boat1, 0.95);
    for (let dy=-6;dy<=-5;dy++) px(pixels, bx+6, by+dy, C.boat1, 0.85); // lean
    px(pixels, bx+5, by-7, C.boat1, 0.92); // head
    px(pixels, bx+6, by-7, C.boat1, 0.72);
    // Oar (sweeping)
    for (let dx=-5;dx<=8;dx++) px(pixels, bx+5+dx, by-3+(dx<0?1:0), C.boat1, 0.70);

    // Figure 2 (right — standing/seated taller)
    for (let dy=-7;dy<=-1;dy++) px(pixels, bx+11, by+dy, C.boat1, 0.97);
    for (let dy=-7;dy<=-6;dy++) px(pixels, bx+12, by+dy, C.boat1, 0.75);
    px(pixels, bx+11, by-8, C.boat1, 0.90); // head
    // Slight shoulder width
    px(pixels, bx+10, by-6, C.boat1, 0.65);
    px(pixels, bx+12, by-6, C.boat1, 0.55);

    // Reflection of boat (dark wavering smear below)
    for (let dx=1;dx<17;dx++) {
      const skip = Math.sin(t*2.4+dx*0.45) > 0.4;
      if (!skip) continue;
      const ry = by+3 + ((Math.sin(t*1.9+dx*0.55)*1.8)|0);
      px(pixels, bx+dx, ry, C.boat1, 0.32);
    }
    // Figure reflections
    for (let dy=0;dy<5;dy++) {
      px(pixels, bx+5,  by+3+dy, C.boat1, 0.20*(1-dy/5));
      px(pixels, bx+11, by+3+dy, C.boat1, 0.22*(1-dy/5));
    }
  }

  // ── Frame ─────────────────────────────────────────────────────────────────
  function frame() {
    t += 0.016;

    const imgd = octx.createImageData(GW, GH);
    const d = imgd.data;
    const pixels = new Uint8Array(GW * GH * 3);

    drawSky(pixels);
    drawSun(pixels);
    drawBgShips(pixels);
    drawWater(pixels, t);
    drawFarBoat(pixels, t);
    drawNearBoat(pixels, t);

    for (let i=0;i<GW*GH;i++) {
      d[i*4]=pixels[i*3]; d[i*4+1]=pixels[i*3+1];
      d[i*4+2]=pixels[i*3+2]; d[i*4+3]=255;
    }
    octx.putImageData(imgd, 0, 0);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(frame);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  window.initBgCanvas = function () {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    offscreen = document.createElement('canvas');
    offscreen.width = GW; offscreen.height = GH;
    octx = offscreen.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  };
})();
