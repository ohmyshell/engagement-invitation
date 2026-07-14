
  /* ============================================================
     BACKGROUND IMAGE (provided bg.jpg, loaded from file)
     ============================================================ */
  const BG_URL='bg.jpg';

  document.documentElement.style.setProperty('--bg-url',`url("${BG_URL}")`);
  document.getElementById('bg').style.backgroundImage=`url("${BG_URL}")`;

  /* ============================================================
     FALLING FLOWERS — real SVG flower sprites (split from petals.svg)
     drift gently down the page background
     ============================================================ */
  const FLOWERS=["flowers/path1.svg","flowers/path17.svg","flowers/path18.svg","flowers/path2.svg","flowers/path26.svg","flowers/path27.svg","flowers/path55.svg","flowers/path56.svg"];
  (function(){
    const layer=document.getElementById('petals');
    const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduce){return;}
    const COUNT=innerWidth<600?10:15;
    const items=[];
    function spawn(initial){
      const f=FLOWERS[Math.floor(Math.random()*FLOWERS.length)];
      const el=document.createElement('img');
      el.src=f;el.className='flower';el.alt='';el.setAttribute('aria-hidden','true');
      const baseSize=1+Math.random()*1.75; // vh, gives 1-2.75vh tall flowers (75% smaller)
      const size=baseSize;
      const state={
        el, size,
        x:Math.random()*100,                      // vw
        y:initial?Math.random()*100:-20-Math.random()*40, // vh
        vy:1.4+Math.random()*2.4,                 // vh per second
        sway:Math.random()*Math.PI*2,
        swayAmp:1.6+Math.random()*3.0,            // vw
        swaySp:0.4+Math.random()*0.6,
        rot:Math.random()*360,
        vr:(Math.random()-0.5)*10,                // deg per second
        op:0.32+Math.random()*0.4,
      };
      el.style.width='auto';el.style.height=size+'vh';el.style.opacity=state.op;
      layer.appendChild(el);
      items.push(state);
    }
    for(let i=0;i<COUNT;i++)spawn(true);
    let last=performance.now(),RAF=null,visible=true;
    function respawn(s){
      const f=FLOWERS[Math.floor(Math.random()*FLOWERS.length)];
      s.el.src=f;
      s.x=Math.random()*100; s.y=-20-Math.random()*30; // above the top edge
      s.vy=1.4+Math.random()*2.4;
      s.op=0.32+Math.random()*0.4; s.el.style.opacity=s.op;
    }
    function tick(now){
      const dt=Math.min(0.05,(now-last)/1000);last=now;
      const pad=15; // vw/vh of slack before considering a flower off-screen
      items.forEach((s)=>{
        s.y+=s.vy*dt; s.sway+=s.swaySp*dt; s.rot+=s.vr*dt;
        const x=s.x+Math.sin(s.sway)*s.swayAmp;
        s.el.style.transform=`translate3d(${x}vw,${s.y}vh,0) rotate(${s.rot}deg)`;
        // respawn if it leaves any edge of the screen
        if(s.y>100+pad||x<-pad||x>100+pad) respawn(s);
      });
      if(visible)RAF=requestAnimationFrame(tick);
    }
    RAF=requestAnimationFrame(tick);
    document.addEventListener('visibilitychange',()=>{
      visible=!document.hidden;
      if(visible&&!RAF){last=performance.now();RAF=requestAnimationFrame(tick);}
      else if(!visible&&RAF){cancelAnimationFrame(RAF);RAF=null;}
    });
  })();

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ============================================================
     COUNTDOWN
     ============================================================ */
  const target=new Date('2026-08-09T20:00:00+03:00').getTime();
  const elD=document.getElementById('cd-d'),elH=document.getElementById('cd-h'),elM=document.getElementById('cd-m'),elS=document.getElementById('cd-s');
  const pad=n=>n<10?'0'+n:''+n;
  let lastSec=-1;
  function tick(){
    let diff=target-Date.now();if(diff<0)diff=0;
    const s=Math.floor((diff%60000)/1000);
    elD.textContent=Math.floor(diff/86400000);
    elH.textContent=pad(Math.floor((diff%86400000)/3600000));
    elM.textContent=pad(Math.floor((diff%3600000)/60000));
    elS.textContent=pad(s);
    if(s!==lastSec){elS.classList.remove('pulse');void elS.offsetWidth;elS.classList.add('pulse');lastSec=s;}
  }
  tick();setInterval(tick,1000);
  