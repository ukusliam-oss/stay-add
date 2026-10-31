let initialised=false,paused=false;
const listeners=new Set<(paused:boolean)=>void>();
function initialise():void{
  if(initialised)return;initialised=true;
  const query=matchMedia('(prefers-reduced-motion: reduce)');paused=query.matches;
  query.addEventListener('change',event=>{paused=event.matches;listeners.forEach(fn=>fn(paused));});
}
export function isMotionPaused():boolean{initialise();return paused;}
export function setMotionPaused(value:boolean):void{initialise();paused=value;listeners.forEach(fn=>fn(paused));}
export function onMotionChange(listener:(paused:boolean)=>void):()=>void{initialise();listeners.add(listener);return ()=>{listeners.delete(listener);};}
