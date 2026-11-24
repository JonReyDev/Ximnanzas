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
  dialog.className = 'm-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#f7f5f0] p-8 text-[#102238] shadow-2xl md:p-12';
  dialog.setAttribute('aria-labelledby', 'published-idea-title');
  const heading = document.createElement('h2');
  heading.id = 'published-idea-title';
  heading.className = template.querySelector('h3').className;
  const body = document.createElement('div');
  body.className = 'mt-4 whitespace-pre-wrap';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'mt-7 underline';
  close.textContent = 'Cerrar nota';
  close.addEventListener('click', () => dialog.close());
  dialog.append(heading, body, close);

  for (const post of posts) {
    const card = template.cloneNode(true);
    card.setAttribute('data-testid', `published-idea-${post.id}`);
    card.type = 'button';
    const [category, excerpt] = card.querySelectorAll('p');
    category.textContent = post.tag;
    card.querySelector('h3').textContent = post.title;
    excerpt.textContent = post.excerpt;
    card.addEventListener('click', () => {
      heading.textContent = post.title;
      body.textContent = post.content;
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
