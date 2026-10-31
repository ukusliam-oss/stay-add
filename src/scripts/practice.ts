import {required,all} from '../lib/dom.ts';
for(const form of all<HTMLFormElement>('[data-practice]')){
  const hint=required<HTMLElement>('#hint',form),hintButton=required<HTMLButtonElement>('#hint-button',form);
  all<HTMLButtonElement>('button',form).forEach(button=>button.disabled=false);
  hintButton.addEventListener('click',()=>{const open=hint.hidden;hint.hidden=!open;hintButton.setAttribute('aria-expanded',String(open));hintButton.textContent=open?'Hide hint −':'A little hint +';});
  form.addEventListener('submit',event=>{event.preventDefault();const answer=new FormData(form).get('answer'),feedback=required<HTMLElement>('#practice-feedback',form);feedback.dataset.result=answer==='rate'?'correct':'retry';feedback.textContent=!answer?'Choose an explanation above, then check your reasoning.':answer==='rate'?'Exactly. Initial rate = k[A]₀, so doubling [A]₀ doubles the initial rate. k stays unchanged, and the final product concentration doubles in this irreversible 1:1 model.':answer==='k'?'Look again: k depends on the model’s temperature, catalyst and surface area settings. With those fixed, k stays constant. Try the rate = k[A] relationship.':'In this closed 1:1 model, more starting reactant gives more final product. Doubling [A]₀ doubles the final product concentration. Try again with rate = k[A].';});
}
