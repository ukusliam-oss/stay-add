import {all,required} from '../lib/dom.ts';
import {subjects,connections} from '../data/content.ts';
import {connectionMeta,subjectIds} from '../data/subjects.ts';
import type {ConnectionId,SubjectId} from '../data/types.ts';
import {href} from '../lib/paths.ts';
import {icon} from '../lib/icons.ts';
for(const root of all<HTMLElement>('[data-connect]')){
  let theme=root.dataset.connectionId as ConnectionId,current:SubjectId='chemistry';
  function render():void{
    const view=connections[theme][current];
    all<HTMLAnchorElement>('[data-connection]',root).forEach(link=>{if(link.dataset.connection===theme)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    all<HTMLButtonElement>('[data-discipline]',root).forEach(button=>{const id=button.dataset.discipline as SubjectId;button.setAttribute('aria-pressed',String(id===current));required<HTMLElement>('strong',button).textContent=connections[theme][id].label;});
    required<HTMLElement>('.connection-detail',root).innerHTML=`<p class="eyebrow mono">${subjects[current].number} / ${subjects[current].name.toUpperCase()}</p><h3>${view.title}</h3><p class="connection-equation">${view.equation}</p><p>${view.text}</p><p class="connection-note">${view.note}</p><a class="text-link" href="${href(view.link)}">${view.action} ${icon('arrow-up-right')}</a>`;
    for(const id of subjectIds){const article=required<HTMLElement>(`#perspective-${id}`,root),item=connections[theme][id];article.innerHTML=`<p class="mono">${subjects[id].name.toUpperCase()}</p><h3>${item.title}</h3><p>${item.text}</p><p class="perspective-equation">${item.equation}</p><p class="mono">${item.note}</p><a class="text-link" href="${href(item.link)}">${item.action} ${icon('arrow-up-right')}</a>`;}
  }
  all<HTMLAnchorElement>('[data-connection]',root).forEach(link=>link.addEventListener('click',event=>{if(root.dataset.mode!=='inline'||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const next=link.dataset.connection as ConnectionId;if(!Object.hasOwn(connectionMeta,next))return;event.preventDefault();theme=next;render();}));
  all<HTMLButtonElement>('[data-discipline]',root).forEach(button=>{button.addEventListener('click',()=>{current=button.dataset.discipline as SubjectId;render();});button.disabled=false;});
}
