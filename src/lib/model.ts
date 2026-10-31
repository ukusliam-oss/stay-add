export interface LabConfig {temperature:number;concentration:number;area:number;catalyst:boolean}
/** Illustrative heterogeneous first-order proxy, A → B. Not fitted to a real reaction. */
export const defaults = Object.freeze({ temperature: 25, concentration: 1, area: 1, catalyst: false });
export const R = 8.314;
export const REFERENCE_K = 0.035;
export function rateConstant({ temperature, area, catalyst }: LabConfig) {
  const kelvin = temperature + 273.15;
  if (!Number.isFinite(kelvin) || kelvin <= 0 || !Number.isFinite(area) || area <= 0) throw new RangeError('Positive absolute temperature and area are required.');
  const activationEnergy = catalyst ? 35000 : 40000;
  return REFERENCE_K * Math.exp(40000 / (R * 298.15) - activationEnergy / (R * kelvin)) * area;
}
export function sample(config:LabConfig, time:number) {
  if (!Number.isFinite(time) || time < 0 || !Number.isFinite(config.concentration) || config.concentration < 0) throw new RangeError('Nonnegative time and concentration are required.');
  const k = rateConstant(config);
  const remaining = config.concentration * Math.exp(-k * time);
  return { k, product: config.concentration - remaining, remaining, rate: k * remaining, fraction: -Math.expm1(-k * time) };
}
export function series(config:LabConfig, duration = 60) {
  return Array.from({ length: duration + 1 }, (_, time) => ({ time, ...sample(config, time) }));
}
export function csv(config:LabConfig) {
  const metadata = `# STAY ADD. illustrative first-order model; not experimental measurements\n# temperature_C=${config.temperature}; C0_mol_dm-3=${config.concentration}; relative_area=${config.area}; catalyst=${config.catalyst}\n`;
  return metadata + 'time_s,product_mol_dm-3,reactant_mol_dm-3,rate_mol_dm-3_s-1,k_s-1\n' + series(config).map(p => [p.time, p.product, p.remaining, p.rate, p.k].map(v => typeof v === 'number' ? +v.toFixed(8) : v).join(',')).join('\n');
}
