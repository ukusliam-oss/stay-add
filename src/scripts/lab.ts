import {defaults,sample,series,csv} from '../lib/model.ts';
import type {LabConfig} from '../lib/model.ts';
import {required,all,fitCanvas,sliderStyle} from '../lib/dom.ts';
import {isMotionPaused,setMotionPaused,onMotionChange} from '../lib/motion.ts';
import {icon} from '../lib/icons.ts';
export function mountLab(root:HTMLElement):void{
 const elements={
  '#time-output':required<HTMLElement>("#time-output",root),
  '#product-output':required<HTMLElement>("#product-output",root),
  '#relative-output':required<HTMLElement>("#relative-output",root),
  '#temperature-output':required<HTMLElement>("#temperature-output",root),
  '#concentration-output':required<HTMLElement>("#concentration-output",root),
  '#area-output':required<HTMLElement>("#area-output",root),
  '#temperature':required<HTMLInputElement>("#temperature",root),
  '#concentration':required<HTMLInputElement>("#concentration",root),
  '#area':required<HTMLInputElement>("#area",root),
  '#graph-point':required<SVGElement>("#graph-point",root),
  '#graph-cursor':required<SVGElement>("#graph-cursor",root),
  '#graph-description':required<HTMLElement>("#graph-description",root),
  '#graph-curve':required<SVGElement>("#graph-curve",root),
  '#graph-fill':required<SVGElement>("#graph-fill",root),
  '#graph-baseline':required<SVGElement>("#graph-baseline",root),
  '#graph-grid':required<SVGElement>("#graph-grid",root),
  '#run-lab':required<HTMLButtonElement>("#run-lab",root),
  '#lab-status':required<HTMLElement>("#lab-status",root),
  '#lab-controls':required<HTMLFormElement>("#lab-controls",root),
  '#catalyst':required<HTMLInputElement>("#catalyst",root),
  '#export-csv':required<HTMLButtonElement>("#export-csv",root)
 };
 const $=<K extends keyof typeof elements>(selector:K):typeof elements[K]=>elements[selector];
 const $$=(selector:string)=>all<HTMLInputElement>(selector,root);
// A deterministic quantitative model; particle positions are a separate visual aid.
let config:LabConfig={...defaults}, modelTime=0, running=false, graphMax=1, labVisible=false;
let labLast=0, phase=0;
const runButton=$('#run-lab');

$$('input[type=range]').forEach(sliderStyle);
function refreshLab(){
  const state=sample(config,modelTime);
  $('#time-output').innerHTML=`${modelTime.toFixed(1)} <small>s</small>`;
  $('#product-output').innerHTML=`${state.product.toFixed(3)} <small>mol dm⁻³</small>`;
  $('#relative-output').innerHTML=`${(sample(config,0).rate/sample(defaults,0).rate).toFixed(2)}<small>×</small>`;
  $('#temperature-output').textContent=`${config.temperature} °C`;
  $('#concentration-output').textContent=`${config.concentration.toFixed(2)} mol dm⁻³`;
  $('#area-output').textContent=`${config.area.toFixed(1)}×`;
  $('#temperature').setAttribute('aria-valuetext',`${config.temperature} degrees Celsius`);
  $('#concentration').setAttribute('aria-valuetext',`${config.concentration.toFixed(2)} moles per cubic decimetre`);
  $('#area').setAttribute('aria-valuetext',`${config.area.toFixed(1)} times the reference surface area`);
  const x=28+(modelTime/60)*560,y=181-state.product/graphMax*160;
  $('#graph-point').setAttribute('cx',String(x));$('#graph-point').setAttribute('cy',String(y));
  $('#graph-cursor').setAttribute('x1',String(x));$('#graph-cursor').setAttribute('x2',String(x));$('#graph-cursor').setAttribute('y1','20');$('#graph-cursor').setAttribute('y2','181');
  $('#graph-description').textContent=`Selected conditions: ${config.temperature} degrees Celsius, initial concentration ${config.concentration.toFixed(2)} moles per cubic decimetre, relative surface area ${config.area.toFixed(1)}, catalyst ${config.catalyst?'on':'off'}. At ${modelTime.toFixed(1)} seconds product concentration is ${state.product.toFixed(3)} moles per cubic decimetre. The dashed line uses default conditions.`;
}
function drawGraph(){
  graphMax=Math.max(1,config.concentration);
  const path=(conf:LabConfig)=>series(conf).map((p,i)=>`${i?'L':'M'}${(28+p.time/60*560).toFixed(2)},${(181-p.product/graphMax*160).toFixed(2)}`).join(' ');
  const selected=path(config);
  $('#graph-curve').setAttribute('d',selected);$('#graph-fill').setAttribute('d',`${selected} L588,181 L28,181 Z`);$('#graph-baseline').setAttribute('d',path(defaults));
  $('#graph-grid').innerHTML=Array.from({length:5},(_,i)=>{const y=181-i*40;return `<line x1="28" x2="588" y1="${y}" y2="${y}"/><text x="0" y="${y+3}">${(graphMax*i/4).toFixed(2)}</text>`;}).join('');
  refreshLab();
}
function setRunning(next:boolean,status?:string){
  running=next;labLast=performance.now();runButton.innerHTML=`${running?'Pause experiment':modelTime>=60?'Run again':modelTime>0?'Resume experiment':'Run experiment'} <span aria-hidden="true">${icon(running?'pause':'arrow-up-right')}</span>`;
  $('#lab-status').textContent=status||(running?'RUNNING · MODEL TIME IN SECONDS.':'PAUSED · OBSERVE, THEN CONTINUE.');
}
$('#lab-controls').addEventListener('input',()=>{
  config={temperature:+$('#temperature').value,concentration:+$('#concentration').value,area:+$('#area').value,catalyst:$('#catalyst').checked};
  modelTime=0;setRunning(false,'CONDITIONS UPDATED. READY FOR A FRESH RUN.');
  $$('#lab-controls input[type=range]').forEach(sliderStyle);drawGraph();drawParticles(0);
});
runButton.addEventListener('click',()=>{
  if(modelTime>=60){modelTime=0;refreshLab();}
  setRunning(!running);
});
$('#lab-controls').addEventListener('reset',()=>{
  config={...defaults};modelTime=0;setRunning(false,'RESET. MAKE A PREDICTION, THEN RUN.');
  requestAnimationFrame(()=>{$$('#lab-controls input[type=range]').forEach(sliderStyle);drawGraph();drawParticles(0);});
});
$('#export-csv').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([csv(config)],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');
  link.href=url;link.download='stay-add-reaction-rates-model.csv';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('#lab-status').textContent='MODEL CSV EXPORTED · 0–60 s, NOT MEASURED DATA.';
});
drawGraph();


 const particleCanvas=required<HTMLCanvasElement>('#particle-canvas',root),context=particleCanvas.getContext('2d');
 if(!context)return;const particleCtx=context;
 let particleSize=fitCanvas(particleCanvas),ambientPaused=isMotionPaused(),particleVisible=true;
 const motionButton=required<HTMLButtonElement>('[data-lab-motion]',root);
 function motionState():void{motionButton.setAttribute('aria-label',ambientPaused?'Play particle animation':'Pause particle animation');motionButton.setAttribute('aria-pressed',String(ambientPaused));motionButton.innerHTML=icon(ambientPaused?'play':'pause');}
 motionButton.addEventListener('click',()=>setMotionPaused(!ambientPaused));
 onMotionChange(value=>{ambientPaused=value;motionState();drawParticles(phase);});motionState();
 const resize=new ResizeObserver(()=>{particleSize=fitCanvas(particleCanvas);drawParticles(phase);});resize.observe(particleCanvas);
 all<HTMLInputElement|HTMLButtonElement>('input,button',root).forEach(control=>control.disabled=false);root.dataset.labState='ready';
const particles=Array.from({length:112},(_,i)=>({x:((i*73+19)%127)/127,y:((i*41+7)%113)/113,vx:Math.sin(i*8.3)*.6,vy:Math.cos(i*4.7)*.6}));
function reflect(v:number){return 1-Math.abs(((v%2)+2)%2-1);}
function drawParticles(t:number){
  if(!particleCtx||!particleSize.w)return;
  const {w,h}=particleSize;particleCtx.clearRect(0,0,w,h);
  const count=Math.round(30+config.concentration*38),converted=Math.round(count*sample(config,modelTime).fraction),speed=Math.sqrt((config.temperature+273.15)/298.15);
  for(let i=0;i<count;i++){
    const p=particles[i]!,x=14+reflect(p.x+t*.027*p.vx*speed)*(w-28),y=40+reflect(p.y+t*.027*p.vy*speed)*(h-65),product=i<converted;
    particleCtx.beginPath();particleCtx.arc(x,y,product?2.5:3.2,0,Math.PI*2);
    if(product){particleCtx.fillStyle='#c9ff61';particleCtx.fill();}else{particleCtx.strokeStyle='#c1a6f6';particleCtx.lineWidth=1.1;particleCtx.stroke();}
  }
}

 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target===particleCanvas)particleVisible=entry.isIntersecting;else{labVisible=entry.isIntersecting;if(!labVisible&&running)setRunning(false,'AUTO-PAUSED OFFSCREEN. RESUME TO CONTINUE.');}}});observer.observe(root);observer.observe(particleCanvas);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)setRunning(false,'TAB HIDDEN. EXPERIMENT PAUSED.');});
 let previousFrame=0;
 function animate(now:number):void{
  requestAnimationFrame(animate);if(document.hidden||now-previousFrame<33)return;
  const dt=previousFrame?Math.min((now-previousFrame)/1000,.12):0;previousFrame=now;
  if(!ambientPaused&&labVisible&&particleVisible)phase+=dt;
  if(running){modelTime=Math.min(60,modelTime+Math.min((now-labLast)/1000,.15));labLast=now;refreshLab();if(modelTime>=60)setRunning(false,'COMPLETE · 60 s OF MODEL TIME. RUN AGAIN OR RESET.');}
  if(labVisible&&particleVisible&&(!ambientPaused||running))drawParticles(phase);
 }
 drawParticles(0);requestAnimationFrame(animate);
}
