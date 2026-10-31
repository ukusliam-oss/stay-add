export function required<T extends Element>(selector:string,root:ParentNode=document):T {
  const element=root.querySelector<T>(selector);
  if(!element)throw new Error(`Required interface element is missing: ${selector}`);
  return element;
}
export function all<T extends Element>(selector:string,root:ParentNode=document):T[]{return [...root.querySelectorAll<T>(selector)];}
export function fitCanvas(canvas:HTMLCanvasElement):{w:number;h:number}{
  const box=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);
  canvas.getContext('2d')?.setTransform(ratio,0,0,ratio,0,0);
  return {w:box.width,h:box.height};
}
export function sliderStyle(input:HTMLInputElement):void{input.style.setProperty('--range',`${(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100}%`);}
