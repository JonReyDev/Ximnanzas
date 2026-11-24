import { supabaseUrl, supabaseAnonKey } from './published-ideas-config.js';

async function loadPublishedIdeas() {
  if (!supabaseUrl || !supabaseAnonKey) return;

  const url = new URL('/rest/v1/blog_posts', supabaseUrl);
  url.search = new URLSearchParams({
    select: 'id,tag,title,excerpt,content',
    published: 'eq.true',
    order: 'created_at.desc,id.desc',
  });

  const response = await fetch(url, { headers: { apikey: supabaseAnonKey }, cache: 'no-store' });
  if (!response.ok) throw new Error(`Supabase respondió ${response.status}`);
  const posts = await response.json();
  if (!posts.length) return;

  const template = document.querySelector('#ideas [data-testid="idea-card-0"]');
  if (!template) return;

  const grid = document.createElement('div');
  grid.className = template.parentElement.className;
  const dialog = document.createElement('dialog');
  dialog.className = 'm-auto max-h-[90vh] max-w-2xl overflow-y-auto bg-[#f7f5f0] p-8 text-[#102238] shadow-2xl md:p-12';
  dialog.setAttribute('aria-labelledby', 'published-idea-title');
  const heading = document.createElement('h2');
  heading.id = 'published-idea-title';
  heading.className = 'mt-5 max-w-xl font-editorial text-4xl leading-tight tracking-[-.05em] md:text-5xl';
  const label = document.createElement('p');
  label.className = 'eyebrow text-[#003781]';
  const body = document.createElement('div');
  body.className = 'mt-7 whitespace-pre-wrap text-base font-light leading-relaxed text-[#526276]';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'absolute right-5 top-5 p-2 text-[#526276] hover:text-[#003781]';
  close.setAttribute('aria-label', 'Cerrar nota');
  close.textContent = '✕';
  close.autofocus = true;
  close.addEventListener('click', () => dialog.close());
  const cover = document.createElement('img');
  cover.alt = '';
  cover.referrerPolicy = 'no-referrer';
  cover.style.cssText = 'width:100%;max-height:320px;object-fit:contain;margin-top:1rem';
  cover.addEventListener('error', () => { cover.hidden = true; });
  const footer = document.createElement('div');
  footer.className = 'mt-10 border-t border-[#102238]/15 pt-7';
  const prompt = document.createElement('p');
  prompt.className = 'text-sm font-light text-[#526276]';
  prompt.textContent = '¿Quieres llevar esta idea a tu propio plan?';
  const appointment = document.createElement('button');
  appointment.type = 'button';
  appointment.className = 'star-border mt-4 inline-flex items-center gap-3 bg-[#003781] px-6 py-4 text-[10px] font-semibold uppercase tracking-[.16em] text-white transition-colors hover:bg-[#102238]';
  appointment.textContent = 'Hablemos de tu caso ↗';
  appointment.addEventListener('click', () => {
    dialog.close();
    document.querySelector('[data-testid="header-agenda-button"]')?.click();
  });
  footer.append(prompt, appointment);
  dialog.style.width = 'calc(100% - 2rem)';
  dialog.classList.add('published-idea-dialog');
  dialog.addEventListener('click', (event) => { if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  } });
  dialog.append(close, label, heading, cover, body, footer);

  for (const post of posts) {
    const card = template.cloneNode(true);
    card.setAttribute('data-testid', `published-idea-${post.id}`);
    card.type = 'button';
    const [category, excerpt] = card.querySelectorAll('p');
    category.textContent = post.tag;
    card.querySelector('h3').textContent = post.title;
    excerpt.textContent = post.excerpt;
    const image = post.content.match(/^!\[Portada\]\(((?:https:\/\/[^\s]+|data:image\/jpeg;base64,[A-Za-z0-9+/=]+))\)\r?\n/);
    if (image) {
      const thumbnail = document.createElement('img');
      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      thumbnail.referrerPolicy = 'no-referrer';
      thumbnail.style.cssText = 'width:100%;aspect-ratio:16/9;object-fit:cover;margin-block:1rem;border-radius:.5rem';
      thumbnail.addEventListener('error', () => thumbnail.remove(), { once: true });
      thumbnail.src = image[1];
      card.insertBefore(thumbnail, card.children[1]);
    }
    card.addEventListener('click', () => {
      const content = image ? post.content.slice(image[0].length) : post.content;
      const minutes = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
      label.textContent = `${post.tag} · ${minutes} min`;
      heading.textContent = post.title;
      cover.hidden = !image;
      if (image) cover.src = image[1];
      else cover.removeAttribute('src');
      body.textContent = content;
      dialog.showModal();
    });
    grid.append(card);
  }
  template.parentElement.before(grid);
  document.body.append(dialog);
}

function start() {
  const renderWhenReady = () => {
    if (!document.querySelector('#ideas [data-testid="idea-card-0"]')) return false;
    observer.disconnect();
    void loadPublishedIdeas().catch((error) => console.error('Ideas de Ximnanzas:', error));
    return true;
  };
  const observer = new MutationObserver(renderWhenReady);
  const root = document.getElementById('root');
  if (root && !renderWhenReady()) observer.observe(root, { childList: true, subtree: true });
}

// The panel is a separate Vercel entry point and needs a full navigation.
document.addEventListener('click', (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element && event.target.closest('a[data-testid="footer-admin-link"]');
  if (!link) return;
  event.preventDefault();
  event.stopPropagation();
  window.location.assign(link.href);
}, { capture: true });

start();
