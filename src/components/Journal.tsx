import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { supabase, type BlogPost } from '@/lib/supabase';

const ARTICLES = [
  {
    tag: 'Retiro · 6 min',
    title: 'La pregunta que conviene responder antes de elegir un plan de retiro',
    excerpt: 'No es cuanto quieres ahorrar. Es como quieres que se vea un martes cualquiera cuando dejes de trabajar.',
    paragraphs: [
      'Antes de comparar rendimientos, conviene imaginar la vida que quieres financiar. Un plan de retiro funciona mejor cuando nace de una escena concreta: el ritmo de tus días, las personas que quieres cuidar y las decisiones que quieres poder tomar con calma.',
      'A partir de ahi puedes estimar cuanto necesitaras, durante cuanto tiempo y que aportacion mensual es sostenible para ti. La cifra perfecta no existe; lo importante es construir una estrategia que puedas mantener incluso cuando cambien tus ingresos.',
      'Un buen plan combina constancia, proteccion y revisiones periodicas. Empieza con lo que hoy puedes apartar y ajustalo conforme avance tu vida.',
    ],
    testId: 'button-journal-retirement',
  },
  {
    tag: 'Proteccion · 4 min',
    title: 'Proteger ingresos tambien es cuidar a tu familia',
    excerpt: 'La conversacion que solemos posponer hasta que se vuelve urgente.',
    paragraphs: [
      'Cuando pensamos en proteger a la familia, solemos pensar primero en una casa, un auto o una cuenta de ahorro. Pero el activo que sostiene todos esos planes es tu capacidad de generar ingresos.',
      'Una enfermedad, un accidente o una pausa laboral pueden cambiar el presupuesto familiar de un dia para otro. Revisar tus coberturas permite que tus seres queridos mantengan estabilidad mientras se reorganizan.',
      'La proteccion adecuada no tiene que ser complicada. Empieza por calcular los gastos esenciales, las deudas y el tiempo que tu familia necesitaria para adaptarse.',
    ],
    testId: 'button-journal-protection',
  },
  {
    tag: 'Habitos · 3 min',
    title: 'La constancia le gana a la intencion',
    excerpt: 'Una forma mas amable de mirar tus metas financieras.',
    paragraphs: [
      'Ahorrar no depende solamente de tener fuerza de voluntad. Depende de diseñar un sistema que haga sencillo repetir una decision pequeña cada mes.',
      'Una aportacion automatica, aunque al principio parezca modesta, convierte una meta abstracta en un habito visible. Con el tiempo, la constancia permite que tus aportaciones y los rendimientos trabajen juntos.',
      'En lugar de esperar el momento ideal, elige una cantidad realista, revisala cada seis meses y aumenta gradualmente cuando tu presupuesto lo permita.',
    ],
    testId: 'button-journal-habits',
  },
];
type Article = (typeof ARTICLES)[number];

type JournalProps = {
  onContact: () => void;
};

export function Journal({ onContact }: JournalProps) {
  const [articles, setArticles] = useState(ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadPosts = async () => {
      const { data } = await supabase.from('blog_posts').select('id, tag, title, excerpt, content, published, created_at').eq('published', true).order('created_at', { ascending: false });
      if (!mounted || !data?.length) return;
      const publishedPosts = (data as BlogPost[]).map((post) => ({
        tag: `${post.tag} · lectura`,
        title: post.title,
        excerpt: post.excerpt,
        paragraphs: post.content.split(/\n+/).filter(Boolean),
        testId: `button-blog-${post.id}`,
      }));
      setArticles([...publishedPosts, ...ARTICLES]);
    };
    void loadPosts();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedArticle) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedArticle(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  return (
    <>
      <section id="ideas" className="section" style={{ background: 'var(--paper-warm)' }}>
        <div className="container-wide">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }} className="journal-top" data-testid="journal-top">
            <div>
     
<<<<<<< HEAD
            <span className="section-kicker" style={{ color: 'var(--amber)' }}>Ideas Ximnanzas</span>
=======
            <span className="section-kicker" style={{ color: 'var(--amber)' }}>Ideas Ximanzas</span>
>>>>>>> 692ea159 (modal)
            <span className="section-kicker" style={{ color: 'var(--amber)' }}>BLOG</span>
              <h2 className="display">Pensar bien<br />también es patrimonio.
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: '320px' }}>
            Lecturas breves para conversar sobre retiro, protección, inversión y las decisiones que sostienen una vida.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="journal-grid">
            {articles.map((article) => (
              <article key={article.title} className="journal-card">
                <small>{article.tag}</small>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <button className="arrow-link" onClick={() => setSelectedArticle(article)} data-testid={article.testId}>
                  Leer nota <ArrowRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {selectedArticle && (
        <div
          role="presentation"
          onClick={() => setSelectedArticle(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(10, 22, 40, 0.72)', backdropFilter: 'blur(6px)' }}
        >
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="fade-up"
            style={{ position: 'relative', width: '100%', maxWidth: '720px', maxHeight: '88vh', overflowY: 'auto', background: 'var(--paper)', borderRadius: '20px', padding: '36px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              aria-label="Cerrar articulo"
              style={{ position: 'absolute', top: '20px', right: '20px', display: 'grid', placeItems: 'center', width: '40px', height: '40px', border: '1px solid var(--line)', borderRadius: '50%', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <small className="section-kicker" style={{ marginBottom: '14px' }}>{selectedArticle.tag}</small>
            <h2 id="journal-modal-title" className="display" style={{ paddingRight: '48px', fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>{selectedArticle.title}</h2>
            <div style={{ display: 'grid', gap: '18px', marginTop: '28px', color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.75 }}>
              {selectedArticle.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <button
              onClick={() => { setSelectedArticle(null); onContact(); }}
              className="button button-primary"
              style={{ marginTop: '28px' }}
            >
              Hablar con un asesor <ArrowRight size={15} />
            </button>
          </article>
        </div>
      )}
    </>
  );
}
