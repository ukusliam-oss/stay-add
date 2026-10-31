import type { SubjectId } from './types.ts';
export const subjectMeta: Record<SubjectId,{slug:string;lesson:string;lessonTitle:string;category:string;code:string;description:string}> = {
  chemistry:{slug:'chemistry',lesson:'reaction-rates',lessonTitle:'Reaction rates',category:'Matter & transformation',code:'0620',description:'Structure, interaction and transformation. Look closely at how matter changes.'},
  biology:{slug:'biology',lesson:'diffusion',lessonTitle:'Diffusion',category:'Life & living systems',code:'0610',description:'Organisation, regulation and adaptation. Follow the processes that make life possible.'},
  physics:{slug:'physics',lesson:'motion-and-graphs',lessonTitle:'Motion and graphs',category:'Energy & the universe',code:'0625',description:'Force, energy, fields and change. Find the relationships behind what moves.'},
  mathematics:{slug:'additional-mathematics',lesson:'the-derivative',lessonTitle:'The derivative',category:'Patterns & possibilities',code:'0606',description:'Structure, abstraction and proof. Explore the mathematics that connects the sciences.'}
};
export const subjectIds=Object.keys(subjectMeta) as SubjectId[];
export function subjectPath(id:SubjectId):string { return `/subjects/${subjectMeta[id].slug}`; }
export function lessonPath(id:SubjectId):string { return `${subjectPath(id)}/${subjectMeta[id].lesson}`; }
export const connectionMeta: Record<import('./types.ts').ConnectionId,{slug:string;title:string;summary:string}>={
  rates:{slug:'rates-of-change',title:'Rates of change',summary:'A slope connects reaction rates, enzyme activity, velocity and the derivative.'},
  energy:{slug:'energy-transfer',title:'Energy transfer',summary:'Follow energy through chemical systems, living cells, physical balances and mathematical accumulation.'},
  feedback:{slug:'feedback-systems',title:'Feedback systems',summary:'Compare regulation, equilibrium responses and simple models of a return to balance.'}
};
