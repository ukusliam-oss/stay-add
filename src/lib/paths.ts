import { BASE_PATH, SITE_ORIGIN } from '../config/site.ts';

/** One base-path policy for static HTML, controls, search results and asset URLs. */
export function href(path = '/'): string {
  const [pathname = '', fragment] = path.split('#', 2);
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  const target = clean ? `${BASE_PATH}/${clean}/` : `${BASE_PATH}/`;
  return fragment ? `${target}#${fragment}` : target;
}
export function asset(path: string): string {
  return `${BASE_PATH}/${path.replace(/^\/+/, '')}`;
}
export function canonical(path = '/'): string { return SITE_ORIGIN + href(path); }
