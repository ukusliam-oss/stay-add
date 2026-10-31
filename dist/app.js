import { defaults, sample, series, csv } from './model.js';
import { subjects, connections, searchIndex } from './content.js';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let ambientPaused = reducedMotion.matches;
let currentConnection = 'rates';
let currentDiscipline = 'chemistry';
let lastDialogTrigger;

// Native dialogs preserve modal semantics, focus containment, and Escape support.
function openDialog(dialog, trigger = document.activeElement) {
  lastDialogTrigger = trigger;
  dialog.showModal();
}
function closeDialog(dialog) {
  dialog.close();
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(dialog);
    }
  });
  dialog.addEventListener('close', () => { if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus({preventScroll:true}); });
});
$$('[data-open]').forEach(button => button.addEventListener('click', () => {
  if(button.dataset.open === 'search-dialog') renderSearch('');
  openDialog(document.getElementById(button.dataset.open), button);
  if(button.dataset.open === 'search-dialog') $('#concept-search').focus();
}));
$$('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
$$('[data-dismiss]').forEach(link => link.addEventListener('click', () => closeDialog(link.closest('dialog'))));

const menuToggle = $('.menu-toggle');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');$('#main-nav').classList.remove('is-open');menuToggle.innerHTML='MENU <span aria-hidden="true">+</span>';}
menuToggle.addEventListener('click', () => {
  const open=menuToggle.getAttribute('aria-expanded')!=='true';
  menuToggle.setAttribute('aria-expanded',String(open));$('#main-nav').classList.toggle('is-open',open);
  menuToggle.innerHTML=`${open?'CLOSE':'MENU'} <span aria-hidden="true">${open?'−':'+'}</span>`;
});
$$('#main-nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){closeMenu();menuToggle.focus();}});
matchMedia('(min-width: 601px)').addEventListener('change',closeMenu);

function openSubject(id, trigger) {
  const s=subjects[id];
  $('#lesson-content').className=id;
  $('#lesson-content').innerHTML=`<p class="lesson-topline mono">${s.number} / ${s.name.toUpperCase()} · ORIGINAL CONCEPT PREVIEW</p><h2 id="lesson-title">${s.title}</h2><p class="lesson-question">${s.question}</p><p class="lesson-definition">${s.definition}</p><div class="lesson-formula">${s.formula}<small>${s.units}</small></div><details class="lesson-deeper"><summary>A closer look +</summary><p>${s.deeper}</p></details><div class="lesson-footer"><a class="button" href="${s.target}" data-lesson-action>${s.action} ↗</a><a class="text-link" href="${s.source}" target="_blank" rel="noopener noreferrer">${s.sourceName} ↗</a></div><p class="lesson-status mono">DRAFT PREVIEW · NO EXAM-BOARD OR YEAR MAPPING · NOT A FULL LESSON</p>`;
  $('#lesson-content [data-lesson-action]').addEventListener('click',()=>{setConnection(s.related);closeDialog($('#subject-dialog'));});
  openDialog($('#subject-dialog'),trigger);
}
$$('[data-subject]').forEach(button=>button.addEventListener('click',()=>openSubject(button.dataset.subject,button)));

function renderSearch(query) {
  const normalised=query.trim().toLowerCase();
  const matches=searchIndex.filter(item=>(item.title+' '+item.keywords).toLowerCase().includes(normalised));
  const list=$('#search-results');list.replaceChildren();
  matches.forEach(item=>{
    const li=document.createElement('li'), button=document.createElement('button'), span=document.createElement('span'), small=document.createElement('small'), arrow=document.createElement('span');
    button.type='button';small.textContent=item.kind;span.append(small,document.createTextNode(item.title));arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');button.append(span,arrow);li.append(button);list.append(li);
    button.addEventListener('click',()=>{
      closeDialog($('#search-dialog'));
      // Wait for native focus restoration before opening a second modal.
      if(item.subject) requestAnimationFrame(()=>openSubject(item.subject,$('.search-button')));
      else {if(item.connection)setConnection(item.connection);location.hash=item.target;requestAnimationFrame(()=>document.querySelector(item.target).scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'}));}
    });
  });
  $('#search-status').textContent=matches.length?`${matches.length} ${matches.length===1?'result':'results'} in this prototype.`:'No matches. Try “reaction”, “energy” or a subject name.';
}
$('#concept-search').addEventListener('input',event=>renderSearch(event.target.value));
$('#search-dialog').addEventListener('close',()=>{$('#concept-search').value='';});

function setConnection(id) {
  currentConnection=id;
  $$('[data-connection]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.connection===id)));
  $$('[data-discipline]').forEach(button=>{button.querySelector('strong').textContent=connections[id][button.dataset.discipline].label;});
  renderConnection();
}
function renderConnection(){
  const c=connections[currentConnection][currentDiscipline], s=subjects[currentDiscipline];
  $$('[data-discipline]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.discipline===currentDiscipline)));
  $('#connection-detail').innerHTML=`<p class="eyebrow mono">${s.number} / ${s.name.toUpperCase()}</p><h3>${c.title}</h3><p class="connection-equation">${c.equation}</p><p>${c.text}</p><p class="connection-note">${c.note}</p><a class="text-link" href="${c.link}">${c.action} ↗</a>`;
  if(c.subject) $('#connection-detail a').addEventListener('click',event=>{event.preventDefault();openSubject(c.subject,event.currentTarget);});
}
$$('[data-connection]').forEach(button=>button.addEventListener('click',()=>setConnection(button.dataset.connection)));
$$('[data-discipline]').forEach(button=>button.addEventListener('click',()=>{currentDiscipline=button.dataset.discipline;renderConnection();}));
renderConnection();

$('#hint-button').addEventListener('click',()=>{const open=$('#hint').hidden;$('#hint').hidden=!open;$('#hint-button').setAttribute('aria-expanded',String(open));$('#hint-button').textContent=open?'Hide hint −':'A little hint +';});
$('#practice-form').addEventListener('submit',event=>{
  event.preventDefault();
  const value=new FormData(event.currentTarget).get('answer'),feedback=$('#practice-feedback');
  feedback.dataset.result=value==='rate'?'correct':'retry';
  feedback.textContent=!value?'Choose an explanation above, then check your reasoning.':value==='rate'?'Exactly. Initial rate = k[A]₀, so doubling [A]₀ doubles the initial rate. k stays unchanged, and the final product concentration doubles in this irreversible 1:1 model.':value==='k'?'Look again: k depends on the model’s temperature, catalyst and surface area settings. With those fixed, k stays constant. Try the rate = k[A] relationship.':'In this closed 1:1 model, more starting reactant gives more final product. Doubling [A]₀ doubles the final product concentration. Try again with rate = k[A].';
});

// A deterministic quantitative model; particle positions are a separate visual aid.
let config={...defaults}, modelTime=0, running=false, graphMax=1, labVisible=false, heroVisible=true;
let labLast=0, phase=0, heroFrequency=3;
const runButton=$('#run-lab');
function sliderStyle(input){input.style.setProperty('--range',`${(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100}%`);}
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
  $('#graph-point').setAttribute('cx',x);$('#graph-point').setAttribute('cy',y);
  $('#graph-cursor').setAttribute('x1',x);$('#graph-cursor').setAttribute('x2',x);$('#graph-cursor').setAttribute('y1',20);$('#graph-cursor').setAttribute('y2',181);
  $('#graph-description').textContent=`Selected conditions: ${config.temperature} degrees Celsius, initial concentration ${config.concentration.toFixed(2)} moles per cubic decimetre, relative surface area ${config.area.toFixed(1)}, catalyst ${config.catalyst?'on':'off'}. At ${modelTime.toFixed(1)} seconds product concentration is ${state.product.toFixed(3)} moles per cubic decimetre. The dashed line uses default conditions.`;
}
function drawGraph(){
  graphMax=Math.max(1,config.concentration);
  const path=conf=>series(conf).map((p,i)=>`${i?'L':'M'}${(28+p.time/60*560).toFixed(2)},${(181-p.product/graphMax*160).toFixed(2)}`).join(' ');
  const selected=path(config);
  $('#graph-curve').setAttribute('d',selected);$('#graph-fill').setAttribute('d',`${selected} L588,181 L28,181 Z`);$('#graph-baseline').setAttribute('d',path(defaults));
  $('#graph-grid').innerHTML=Array.from({length:5},(_,i)=>{const y=181-i*40;return `<line x1="28" x2="588" y1="${y}" y2="${y}"/><text x="0" y="${y+3}">${(graphMax*i/4).toFixed(2)}</text>`;}).join('');
  refreshLab();
}
function setRunning(next,status){
  running=next;labLast=performance.now();runButton.innerHTML=`${running?'Pause experiment':modelTime>0?'Resume experiment':'Run experiment'} <span aria-hidden="true">${running?'Ⅱ':'↗'}</span>`;
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

// Responsive, dependency-free Canvas rendering, capped at 2× pixel density / 30 fps.
const heroCanvas=$('#hero-canvas'),heroCtx=heroCanvas.getContext('2d',{alpha:false});
const particleCanvas=$('#particle-canvas'),particleCtx=particleCanvas.getContext('2d');
let heroSize={w:0,h:0}, particleSize={w:0,h:0};
let pointer={x:0,y:0};
function fitCanvas(canvas){const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);canvas.getContext('2d').setTransform(ratio,0,0,ratio,0,0);return {w:box.width,h:box.height};}
const sizeObserver=new ResizeObserver(()=>{heroSize=fitCanvas(heroCanvas);particleSize=fitCanvas(particleCanvas);drawHero();drawParticles(phase);});
sizeObserver.observe(heroCanvas);sizeObserver.observe(particleCanvas);
heroCanvas.addEventListener('pointermove',event=>{const b=heroCanvas.getBoundingClientRect();pointer={x:(event.clientX-b.left)/b.width-.5,y:(event.clientY-b.top)/b.height-.5};if(ambientPaused)drawHero();});
heroCanvas.addEventListener('pointerleave',()=>{pointer={x:0,y:0};if(ambientPaused)drawHero();});
$('#frequency').addEventListener('input',event=>{heroFrequency=+event.target.value;sliderStyle(event.target);$('#frequency-output').textContent=heroFrequency.toFixed(1);drawHero();});
function motionState(){const button=$('#motion-toggle');button.setAttribute('aria-label',ambientPaused?'Play ambient animation':'Pause ambient animation');button.setAttribute('aria-pressed',String(ambientPaused));button.innerHTML=`<span aria-hidden="true">${ambientPaused?'▷':'Ⅱ'}</span>`;}
$('#motion-toggle').addEventListener('click',()=>{ambientPaused=!ambientPaused;motionState();drawHero();drawParticles(phase);});
reducedMotion.addEventListener('change',()=>{ambientPaused=reducedMotion.matches;motionState();drawHero();drawParticles(phase);});
motionState();
function drawHero(){
  if(!heroCtx||!heroSize.w)return;
  const {w,h}=heroSize,cx=w*.49,cy=h*.5,r=Math.min(w*.43,h*.43);
  heroCtx.fillStyle='#111513';heroCtx.fillRect(0,0,w,h);
  heroCtx.strokeStyle='#3c4b30';heroCtx.lineWidth=.55;
  heroCtx.beginPath();heroCtx.moveTo(cx,12);heroCtx.lineTo(cx,h-12);heroCtx.moveTo(12,cy);heroCtx.lineTo(w-12,cy);heroCtx.stroke();
  heroCtx.save();heroCtx.translate(cx,cy);heroCtx.rotate(-.38);heroCtx.beginPath();heroCtx.ellipse(0,0,r*1.18,r*.38,0,0,Math.PI*2);heroCtx.stroke();heroCtx.restore();
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
  for(const p of dots){heroCtx.fillStyle=`rgba(201,255,97,${Math.max(.1,Math.min(1,p.alpha))})`;heroCtx.beginPath();heroCtx.arc(p.x,p.y,p.size,0,Math.PI*2);heroCtx.fill();}
  heroCtx.fillStyle='#c9ff61';[[cx-r*.96,cy+r*.58],[cx+r*.9,cy-r*.55]].forEach(([x,y])=>{heroCtx.beginPath();heroCtx.arc(x,y,3,0,Math.PI*2);heroCtx.fill();heroCtx.strokeStyle='#c9ff6140';heroCtx.beginPath();heroCtx.arc(x,y,9,0,Math.PI*2);heroCtx.stroke();});
}
const particles=Array.from({length:112},(_,i)=>({x:((i*73+19)%127)/127,y:((i*41+7)%113)/113,vx:Math.sin(i*8.3)*.6,vy:Math.cos(i*4.7)*.6}));
function reflect(v){return 1-Math.abs(((v%2)+2)%2-1);}
function drawParticles(t){
  if(!particleCtx||!particleSize.w)return;
  const {w,h}=particleSize;particleCtx.clearRect(0,0,w,h);
  const count=Math.round(30+config.concentration*38),converted=Math.round(count*sample(config,modelTime).fraction),speed=Math.sqrt((config.temperature+273.15)/298.15);
  for(let i=0;i<count;i++){
    const p=particles[i],x=14+reflect(p.x+t*.027*p.vx*speed)*(w-28),y=40+reflect(p.y+t*.027*p.vy*speed)*(h-65),product=i<converted;
    particleCtx.beginPath();particleCtx.arc(x,y,product?2.5:3.2,0,Math.PI*2);
    if(product){particleCtx.fillStyle='#c9ff61';particleCtx.fill();}else{particleCtx.strokeStyle='#c1a6f6';particleCtx.lineWidth=1.1;particleCtx.stroke();}
  }
}
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.target.id==='home')heroVisible=e.isIntersecting;else {labVisible=e.isIntersecting;if(!labVisible&&running)setRunning(false,'AUTO-PAUSED OFFSCREEN. RESUME TO CONTINUE.');}}},{threshold:0});
observer.observe($('#home'));observer.observe($('#lab'));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)setRunning(false,'TAB HIDDEN. EXPERIMENT PAUSED.');});
let previousFrame=0;
function animate(now){
  requestAnimationFrame(animate);
  if(document.hidden||now-previousFrame<33)return;
  const dt=previousFrame?Math.min((now-previousFrame)/1000,.12):0;previousFrame=now;
  if(!ambientPaused){phase+=dt;if(heroVisible)drawHero();}
  if(running){modelTime=Math.min(60,modelTime+Math.min((now-labLast)/1000,.15));labLast=now;refreshLab();if(modelTime>=60)setRunning(false,'COMPLETE · 60 s OF MODEL TIME. RUN AGAIN OR RESET.');}
  if(labVisible&&(!ambientPaused||running))drawParticles(ambientPaused?0:phase);
}
requestAnimationFrame(animate);
