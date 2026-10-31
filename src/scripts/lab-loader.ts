import {all} from '../lib/dom.ts';
const mounted=new WeakSet<HTMLElement>();
async function load(section:HTMLElement):Promise<void>{
  if(mounted.has(section))return;mounted.add(section);
  try{const {mountLab}=await import('./lab.ts');mountLab(section);}
  catch{const status=section.querySelector<HTMLElement>('#lab-status');if(status)status.textContent='The interactive experiment could not load. Reload to retry; the reference graph and model remain available.';section.dataset.labState='error';}
}
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);void load(entry.target as HTMLElement);}},{rootMargin:'300px'});
  all<HTMLElement>('[data-lab]').forEach(section=>observer.observe(section));
}else all<HTMLElement>('[data-lab]').forEach(section=>void load(section));
