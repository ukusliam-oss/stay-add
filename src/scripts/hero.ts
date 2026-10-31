import {required,fitCanvas,sliderStyle} from '../lib/dom.ts';
import {isMotionPaused,setMotionPaused,onMotionChange} from '../lib/motion.ts';
import {icon} from '../lib/icons.ts';
const root=document.querySelector<HTMLElement>('#home');
if(root)initialiseHero(root);
function initialiseHero(root:HTMLElement):void{
 const canvas=required<HTMLCanvasElement>('#hero-canvas',root),context=canvas.getContext('2d',{alpha:false});
 if(!context)return;const ctx=context;
 let heroSize={w:0,h:0},phase=0,heroFrequency=3,pointer={x:0,y:0},visible=true;
 const slider=required<HTMLInputElement>('#frequency',root),output=required<HTMLOutputElement>('#frequency-output',root),button=required<HTMLButtonElement>('#motion-toggle',root);
 let ambientPaused=isMotionPaused();
 function motionState():void{button.setAttribute('aria-label',ambientPaused?'Play ambient animation':'Pause ambient animation');button.setAttribute('aria-pressed',String(ambientPaused));button.innerHTML=icon(ambientPaused?'play':'pause');}
 button.addEventListener('click',()=>setMotionPaused(!ambientPaused));
 onMotionChange(value=>{ambientPaused=value;motionState();drawHero();});motionState();sliderStyle(slider);slider.disabled=false;button.disabled=false;
 slider.addEventListener('input',()=>{heroFrequency=Number(slider.value);output.textContent=heroFrequency.toFixed(1);sliderStyle(slider);drawHero();});
 canvas.addEventListener('pointermove',event=>{const b=canvas.getBoundingClientRect();pointer={x:(event.clientX-b.left)/b.width-.5,y:(event.clientY-b.top)/b.height-.5};if(ambientPaused)drawHero();});
 canvas.addEventListener('pointerleave',()=>{pointer={x:0,y:0};if(ambientPaused)drawHero();});
 const resize=new ResizeObserver(()=>{heroSize=fitCanvas(canvas);drawHero();});resize.observe(canvas);
 const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;});observer.observe(root);
 let previous=0;
 function frame(now:number):void{requestAnimationFrame(frame);if(document.hidden||now-previous<33)return;const dt=previous?Math.min((now-previous)/1000,.12):0;previous=now;if(!ambientPaused&&visible){phase+=dt;drawHero();}}
 requestAnimationFrame(frame);
function drawHero(){
  if(!ctx||!heroSize.w)return;
  const {w,h}=heroSize,cx=w*.49,cy=h*.5,r=Math.min(w*.43,h*.43);
  ctx.fillStyle='#111513';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#3c4b30';ctx.lineWidth=.55;
  ctx.beginPath();ctx.moveTo(cx,12);ctx.lineTo(cx,h-12);ctx.moveTo(12,cy);ctx.lineTo(w-12,cy);ctx.stroke();
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.38);ctx.beginPath();ctx.ellipse(0,0,r*1.18,r*.38,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  const dots=[], rotation=phase*.12+pointer.x*.5,tilt=-.28+pointer.y*.35;
  for(let row=1;row<49;row++){
    const lat=row/49*Math.PI;
    for(let col=0;col<70;col++){
      const lon=col/70*Math.PI*2;
      const ripple=1+.095*Math.sin(lon*heroFrequency+lat*4+phase*.7)*Math.sin(lat);
      let x=Math.sin(lat)*Math.cos(lon)*r*ripple,y=Math.cos(lat)*r*ripple,z=Math.sin(lat)*Math.sin(lon)*r*ripple;
      const xr=x*Math.cos(rotation)+z*Math.sin(rotation),zr=-x*Math.sin(rotation)+z*Math.cos(rotation);
      const yr=y*Math.cos(tilt)-zr*Math.sin(tilt),zz=y*Math.sin(tilt)+zr*Math.cos(tilt);
      const perspective=1+zz/(r*5);
      dots.push({x:cx+xr*perspective,y:cy+yr*perspective,z:zz,alpha:.17+.77*(zz/r+1)/2,size:.65+.7*(zz/r+1)/2});
    }
  }
  dots.sort((a,b)=>a.z-b.z);
  for(const p of dots){ctx.fillStyle=`rgba(201,255,97,${Math.max(.1,Math.min(1,p.alpha))})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle='#c9ff61';([[cx-r*.96,cy+r*.58],[cx+r*.9,cy-r*.55]] as [number,number][]).forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c9ff6140';ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.stroke();});
}

}
