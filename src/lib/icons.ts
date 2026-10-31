/** Shapes are shared by server-rendered HTML and enhanced controls. No emoji glyphs. */
export const iconPaths = {
  'arrow-up-right': 'M6 18 18 6M6 6h12v12',
  'arrow-down-right': 'M6 6 18 18M6 18h12V6',
  'arrow-down-left': 'M18 6 6 18M6 6v12h12',
  'arrow-down': 'M12 4v16M5 13l7 7 7-7',
  'arrow-up': 'M12 20V4M5 11l7-7 7 7',
  'corner-down-right': 'M5 4v8a4 4 0 0 0 4 4h11m-6-6 6 6-6 6',
  reset: 'M4 10a8 8 0 1 1 1 8M4 4v6h6',
  play: 'm8 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14'
} as const;
export type IconName = keyof typeof iconPaths;
export const iconNames = Object.freeze(Object.keys(iconPaths) as IconName[]);
export function icon(name: IconName): string {
  if (!Object.hasOwn(iconPaths, name)) throw new RangeError(`Unknown UI icon: ${name}`);
  return `<svg class="ui-icon" data-icon="${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}
