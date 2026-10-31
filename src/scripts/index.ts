import {required,all} from '../lib/dom.ts';
const form=required<HTMLFormElement>('#index-form'),input=required<HTMLInputElement>('#index-query'),rows=all<HTMLLIElement>('#index-results li'),status=required<HTMLElement>('#index-status'),empty=required<HTMLElement>('#index-empty');
required<HTMLButtonElement>('button',form).disabled=false;
function filter():void{const query=input.value.trim().toLocaleLowerCase('en');let count=0;for(const row of rows){const match=(row.dataset.searchText??'').includes(query);row.hidden=!match;if(match)count++;}status.textContent=`${count} ${count===1?'entry':'entries'} available.`;empty.hidden=count!==0;}
input.value=new URLSearchParams(location.search).get('q')??'';filter();input.addEventListener('input',filter);
form.addEventListener('submit',event=>{event.preventDefault();const url=new URL(location.href);if(input.value.trim())url.searchParams.set('q',input.value.trim());else url.searchParams.delete('q');history.replaceState(null,'',url);filter();});
