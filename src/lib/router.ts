export type Route =
  | { name: 'home' }
  | { name: 'service'; slug: string }
  | { name: 'prospectos' };

export function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (window.location.pathname === '/prospectos' || hash === 'prospectos') return { name: 'prospectos' };
  if (!hash) return { name: 'home' };
  const parts = hash.split('/');
  if (parts[0] === 'servicios' && parts[1]) {
    return { name: 'service', slug: parts[1] };
  }
  return { name: 'home' };
}

export function navigate(path: string) {
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function routeToPath(route: Route): string {
  if (route.name === 'home') return '/';
  if (route.name === 'prospectos') return '/prospectos';
  return `/servicios/${route.slug}`;
}
