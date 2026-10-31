export type SubjectId = 'chemistry' | 'biology' | 'physics' | 'mathematics';
export type ConnectionId = 'rates' | 'energy' | 'feedback';
export interface SubjectPreview {
  name:string; number:string; title:string; question:string; definition:string;
  formula:string; units:string; deeper:string; action:string; target:string;
  related:ConnectionId; source:string; sourceName:string;
}
export interface ConnectionView {
  label:string; title:string; equation:string; text:string; note:string;
  link:string; action:string; subject?:SubjectId;
}
