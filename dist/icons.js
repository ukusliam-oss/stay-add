/** Decorative UI icons use geometry, never OS-dependent text/emoji glyphs. */
export const iconNames = Object.freeze(['arrow-up-right', 'arrow-down-right', 'arrow-down-left', 'arrow-down', 'arrow-up', 'corner-down-right', 'reset', 'play', 'pause']);
export function icon(name) {
  if (!iconNames.includes(name)) throw new RangeError(`Unknown UI icon: ${name}`);
  return `<svg class="ui-icon" data-icon="${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
}
