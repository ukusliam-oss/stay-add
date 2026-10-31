import {subjects} from './content.ts';
import {subjectIds,subjectMeta,lessonPath,connectionMeta} from './subjects.ts';
import type {SubjectId,ConnectionId} from './types.ts';
export interface SearchEntry {id:string;title:string;kind:string;keywords:string;path:string;subject?:SubjectId}
export const searchIndex:SearchEntry[]=[
  ...subjectIds.map(id=>({id:`preview-${id}`,title:`${subjects[id].name}: ${subjectMeta[id].lessonTitle}`,kind:'CONCEPT PREVIEW',keywords:subjects[id].question+' '+subjects[id].definition,path:lessonPath(id),subject:id})),
  {id:'lab-rates',title:'Reaction rates laboratory',kind:'INTERACTIVE LAB',keywords:'temperature concentration catalyst surface area Arrhenius experiment data simulation',path:'/labs/reaction-rates',subject:'chemistry'},
  ...(Object.keys(connectionMeta) as ConnectionId[]).map(id=>({id:`connection-${id}`,title:connectionMeta[id].title,kind:'CROSS-SUBJECT CONNECTION',keywords:connectionMeta[id].summary,path:`/connect/${connectionMeta[id].slug}`})),
  {id:'practice-rates',title:'A first-order thought experiment',kind:'ORIGINAL PRACTICE QUESTION',keywords:'practice reasoning concentration rate constant',path:'/practice/chemistry/reaction-rates',subject:'chemistry'}
];
export function filterSearch(query:string):SearchEntry[]{const normalised=query.trim().toLocaleLowerCase('en');return searchIndex.filter(item=>(item.title+' '+item.keywords).toLocaleLowerCase('en').includes(normalised));}
