import {all,required} from '../lib/dom.ts';
import {filterSearch} from '../data/search.ts';
import {subjects} from '../data/content.ts';
import {subjectIds,lessonPath} from '../data/subjects.ts';
import type {SubjectId} from '../data/types.ts';
import {href} from '../lib/paths.ts';
import {icon} from '../lib/icons.ts';

const triggers=new WeakMap<HTMLDialogElement,HTMLElement>();
function openDialog(dialog:HTMLDialogElement,trigger:HTMLElement):void{triggers.set(dialog,trigger);if(!dialog.open)dialog.showModal();}
all<HTMLDialogElement>('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{const trigger=triggers.get(dialog);if(trigger?.isConnected)trigger.focus({preventScroll:true});});
});
all<HTMLButtonElement>('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog')?.close()));
all<HTMLElement>('[data-open]').forEach(trigger=>trigger.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const dialog=document.getElementById(trigger.dataset.open??'');if(!(dialog instanceof HTMLDialogElement))return;
  event.preventDefault();if(dialog.id==='search-dialog')renderSearch('');openDialog(dialog,trigger);
  if(dialog.id==='search-dialog')required<HTMLInputElement>('#concept-search').focus();
}));

const menu=required<HTMLButtonElement>('.menu-toggle'),nav=required<HTMLElement>('#main-nav');
function closeMenu():void{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.innerHTML='MENU <span aria-hidden="true">+</span>';}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menu.innerHTML=`${open?'CLOSE':'MENU'} <span aria-hidden="true">${open?'−':'+'}</span>`;});
all<HTMLAnchorElement>('#main-nav a').forEach(link=>link.addEventListener('click',()=>{if(!link.dataset.open)closeMenu();}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'&&!document.querySelector('dialog[open]')){closeMenu();menu.focus();}});
matchMedia('(min-width: 601px)').addEventListener('change',closeMenu);
menu.closest<HTMLElement>('.site-header')!.dataset.enhanced='true';

function renderSearch(query:string):void{
  const entries=filterSearch(query),list=required<HTMLUListElement>('#search-results');list.replaceChildren();
  for(const entry of entries){const li=document.createElement('li'),link=document.createElement('a'),label=document.createElement('span'),kind=document.createElement('small'),arrow=document.createElement('span');link.href=href(entry.path);kind.textContent=entry.kind;label.append(kind,document.createTextNode(entry.title));arrow.innerHTML=icon('arrow-up-right');arrow.setAttribute('aria-hidden','true');link.append(label,arrow);li.append(link);list.append(li);}
  required<HTMLElement>('#search-status').textContent=entries.length?`${entries.length} ${entries.length===1?'result':'results'} in this prototype.`:'No matches. Try “reaction”, “energy” or a subject name.';
}
required<HTMLInputElement>('#concept-search').addEventListener('input',event=>renderSearch((event.currentTarget as HTMLInputElement).value));
required<HTMLDialogElement>('#search-dialog').addEventListener('close',()=>{required<HTMLInputElement>('#concept-search').value='';});

all<HTMLAnchorElement>('[data-subject]').forEach(trigger=>trigger.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const id=trigger.dataset.subject as SubjectId;if(!subjectIds.includes(id))return;
  event.preventDefault();const item=subjects[id],dialog=required<HTMLDialogElement>('#subject-dialog');
  required<HTMLElement>('#lesson-content').innerHTML=`<p class="lesson-topline mono">${item.number} / ${item.name.toUpperCase()} · ORIGINAL CONCEPT PREVIEW</p><h2 id="lesson-title">${item.title}</h2><p class="lesson-question">${item.question}</p><p class="lesson-definition">${item.definition}</p><div class="lesson-footer"><a class="button" href="${href(lessonPath(id))}">Read the full preview ${icon('arrow-up-right')}</a><a class="text-link" href="${item.source}" target="_blank" rel="noopener noreferrer">${item.sourceName} ${icon('arrow-up-right')}</a></div><p class="lesson-status mono">DRAFT · NOT INDEPENDENTLY REVIEWED · SYLLABUS MAPPING PENDING</p>`;
  openDialog(dialog,trigger);
}));
