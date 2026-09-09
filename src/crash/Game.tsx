import { useEffect, useRef, useState } from 'react';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const keys = useRef({ left:false, right:false, gas:false, brake:false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0, x = 0, vx = 0, enemyX = 0.15, enemyV = 1, s = 0, health = 100;
    const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); };
    resize(); addEventListener('resize', resize);
    const loop = () => {
      const w=innerWidth,h=innerHeight; ctx.clearRect(0,0,w,h);
      ctx.fillStyle='#0b0d10'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#25282d'; ctx.fillRect(w*.08,0,w*.84,h);
      ctx.strokeStyle='#555'; ctx.lineWidth=4; ctx.setLineDash([28,30]); ctx.lineDashOffset=-(s%58); ctx.beginPath(); ctx.moveTo(w*.5,0); ctx.lineTo(w*.5,h); ctx.stroke(); ctx.setLineDash([]);
      if(playing){
        if(keys.current.left) vx-=.35; if(keys.current.right) vx+=.35; if(!keys.current.left&&!keys.current.right) vx*=.9; vx=Math.max(-5,Math.min(5,vx)); x+=vx; x=Math.max(-w*.3,Math.min(w*.3,x));
        if(keys.current.gas) s+=4; else s+=1.2; enemyX += enemyV*.004; if(Math.abs(enemyX)>.3) enemyV*=-1;
        const px=w*.5+x, ex=w*.5+enemyX*w;
        ctx.fillStyle='#e86b2d'; ctx.fillRect(px-28,h-170,56,95); ctx.fillStyle='#111'; [px-34,px+24].forEach(q=>{ctx.fillRect(q,h-145,10,22);ctx.fillRect(q,h-92,10,22)});
        ctx.fillStyle='#4b78d1'; ctx.fillRect(ex-26,h-310,52,88); ctx.fillStyle='#111'; [ex-32,ex+22].forEach(q=>{ctx.fillRect(q,h-290,10,20);ctx.fillRect(q,h-240,10,20)});
        if(Math.abs(px-ex)<60){ health-=.15; setHp(Math.max(0,health)); s+=5; }
        setScore(Math.floor(s)); if(health<=0) setPlaying(false);
      }
      ctx.fillStyle='white';ctx.font='bold 22px sans-serif';ctx.fillText(`امتیاز ${Math.floor(s)}`,18,34);ctx.fillText(`سلامت ${Math.max(0,Math.floor(health))}%`,18,62); raf=requestAnimationFrame(loop);
    }; loop();
    const kd=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')keys.current.left=true;if(k==='d'||k==='arrowright')keys.current.right=true;if(k==='w'||k==='arrowup')keys.current.gas=true;if(k==='s'||k==='arrowdown')keys.current.brake=true;};
    const ku=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')keys.current.left=false;if(k==='d'||k==='arrowright')keys.current.right=false;if(k==='w'||k==='arrowup')keys.current.gas=false;if(k==='s'||k==='arrowdown')keys.current.brake=false;};
    addEventListener('keydown',kd);addEventListener('keyup',ku);
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);removeEventListener('keydown',kd);removeEventListener('keyup',ku)};
  },[playing]);
  const press=(k:'left'|'right'|'gas'|'brake',v:boolean)=>{keys.current[k]=v};
  return <div className="fixed inset-0 bg-black select-none" style={{touchAction:'none'}}><canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    {!playing && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 text-white gap-4"><h1 className="text-5xl font-black">CRASH <span className="text-orange-500">DERBY</span></h1><p className="text-white/60">دربی تخریب — نسخه موبایل</p><button onClick={()=>{setScore(0);setHp(100);setPlaying(true)}} className="px-10 py-4 rounded-xl bg-orange-500 text-black font-black text-xl">شروع بازی</button></div>}
    {playing && <><button onPointerDown={()=>press('left',true)} onPointerUp={()=>press('left',false)} onPointerCancel={()=>press('left',false)} className="absolute bottom-8 left-6 w-20 h-20 rounded-full bg-white/15 border border-white/30 text-3xl text-white">◀</button><button onPointerDown={()=>press('right',true)} onPointerUp={()=>press('right',false)} onPointerCancel={()=>press('right',false)} className="absolute bottom-8 left-28 w-20 h-20 rounded-full bg-white/15 border border-white/30 text-3xl text-white">▶</button><button onPointerDown={()=>press('gas',true)} onPointerUp={()=>press('gas',false)} onPointerCancel={()=>press('gas',false)} className="absolute bottom-8 right-6 w-24 h-24 rounded-full bg-emerald-500/35 border border-emerald-300/50 text-white font-bold">گاز</button><button onPointerDown={()=>press('brake',true)} onPointerUp={()=>press('brake',false)} onPointerCancel={()=>press('brake',false)} className="absolute bottom-9 right-32 w-20 h-20 rounded-full bg-red-500/25 border border-red-300/40 text-white font-bold">ترمز</button></>}
  </div>;
}
