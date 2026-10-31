import {subjectIds,subjectPath,lessonPath,connectionMeta} from './subjects.ts';
export const publicRoutes=[
  '/','/explore',...subjectIds.map(subjectPath),...subjectIds.map(lessonPath),
  '/labs','/labs/reaction-rates','/practice','/practice/chemistry/reaction-rates',
  '/connect',...Object.values(connectionMeta).map(c=>`/connect/${c.slug}`),
  '/index','/about','/accessibility','/design-system'
];
