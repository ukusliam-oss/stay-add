import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, rateConstant, sample, series, csv } from '../src/lib/model.ts';
test('reference rate constant matches the declared calibration',()=>assert.ok(Math.abs(rateConstant(defaults)-.035)<1e-12));
test('mass is conserved and progress is bounded at all UI extremes',()=>{
  for(const temperature of [10,25,60])for(const concentration of [.25,1,2])for(const area of [1,4])for(const catalyst of [false,true]){
    const config={temperature,concentration,area,catalyst};let previous=-1;
    for(const time of [0,.1,1,30,60,1e5]){const p=sample(config,time);assert.ok(Math.abs(p.remaining+p.product-concentration)<1e-12);assert.ok(p.fraction>=0&&p.fraction<=1);assert.ok(p.product>=previous);assert.ok(p.rate>=0);previous=p.product;}
  }
});
test('concentration changes initial rate and yield, not k or fractional half-life',()=>{
  const doubled={...defaults,concentration:2};
  assert.equal(rateConstant(doubled),rateConstant(defaults));
  assert.equal(sample(doubled,0).rate,2*sample(defaults,0).rate);
  assert.equal(sample(doubled,60).product,2*sample(defaults,60).product);
  const halfTime=Math.log(2)/rateConstant(defaults);assert.ok(Math.abs(sample(defaults,halfTime).fraction-.5)<1e-12);
});
test('higher temperature, area and lower activation barrier have declared effects',()=>{
  assert.ok(rateConstant({...defaults,temperature:60})>rateConstant(defaults));
  assert.ok(rateConstant({...defaults,temperature:10})<rateConstant(defaults));
  assert.equal(rateConstant({...defaults,area:4}),4*rateConstant(defaults));
  assert.ok(rateConstant({...defaults,catalyst:true})>rateConstant(defaults));
});
test('zero time produces zero product and CSV agrees with the computational model',()=>{
  assert.equal(sample(defaults,0).product,0);assert.equal(series(defaults).length,61);
  const lines=csv(defaults).split('\n');assert.match(lines[0],/not experimental measurements/);assert.match(lines[2],/time_s/);
  const last=lines.at(-1).split(',').map(Number);assert.equal(last[0],60);assert.ok(Math.abs(last[1]-sample(defaults,60).product)<1e-8);
});
test('invalid physical inputs cannot produce silently invalid output',()=>{
  assert.throws(()=>rateConstant({...defaults,temperature:-273.15}),RangeError);
  assert.throws(()=>rateConstant({...defaults,area:0}),RangeError);
  assert.throws(()=>sample(defaults,-1),RangeError);
  assert.throws(()=>sample({...defaults,concentration:-1},0),RangeError);
});
