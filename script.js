/* ============================================================
   JEAN CLAUDE SOMDA — Portfolio
   script.js  |  Version complète & propre
   ============================================================

   Modules :
    1.  Canvas — fond particules animées
    2.  Barre de progression de lecture
    3.  Curseur personnalisé
    4.  Reveal au scroll (IntersectionObserver)
    5.  Compteurs de statistiques animés
    6.  Barres de compétences animées
    7.  Lien actif dans la navigation
    8.  Bouton scroll-to-top
    9.  Menu hamburger (mobile)
   10.  Thème clair / sombre (localStorage)
   11.  Langue FR / EN
   12.  Filtre des projets par catégorie
   13.  Formulaire de contact → backend Flask
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. CANVAS — FOND PARTICULES ANIMÉES
  ============================================================ */
  (function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const COUNT  = 70;
    const MAX_D  = 140;
    let W, H, pts = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x:  Math.random() * 2000,
        y:  Math.random() * 1200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.5 + 0.5,
      });
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Particules
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,166,35,.6)';
        ctx.fill();
      });

      // Lignes de connexion
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < MAX_D) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(232,166,35,${0.12 * (1 - d / MAX_D)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  })();


  /* ============================================================
     2. BARRE DE PROGRESSION DE LECTURE
  ============================================================ */
  const progressBar = document.getElementById('progress-bar');

  function updateProgress() {
    if (!progressBar) return;
    const pct = window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ============================================================
     3. CURSEUR PERSONNALISÉ
  ============================================================ */
  const cursorDot  = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (cursorDot)  { cursorDot.style.left  = (mx - 4) + 'px'; cursorDot.style.top  = (my - 4) + 'px'; }    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.style.transform  = 'scale(2.5)';
      if (cursorRing) cursorRing.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.style.transform  = 'scale(1)';
      if (cursorRing) cursorRing.style.transform = 'scale(1)';
    });
  });


  /* ============================================================
     4. REVEAL AU SCROLL (IntersectionObserver)
     + 5. COMPTEURS STATS
     + 6. BARRES DE COMPÉTENCES
  ============================================================ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      // Barres de compétences
      el.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.level || '0%';
      });

      // Compteurs animés
      el.querySelectorAll('.stat-num[data-target]').forEach(num => {
        const target = +num.dataset.target;
        let count = 0;
        const step  = target / 40;
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          num.textContent = Math.floor(count);
          if (count >= target) {
            num.textContent = target + '+';
            clearInterval(timer);
          }
        }, 30);
      });
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ============================================================
     7. LIEN ACTIF DANS LA NAVIGATION
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY + 160 >= s.offsetTop) current = s.id;
    });
    allNavLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ============================================================
     8. BOUTON SCROLL-TO-TOP
  ============================================================ */
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ============================================================
     9. MENU HAMBURGER (MOBILE)
  ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }


  /* ============================================================
     10. THÈME CLAIR / SOMBRE
  ============================================================ */
  const themeBtn = document.getElementById('theme-toggle');
  const htmlEl   = document.documentElement;

  const savedTheme = localStorage.getItem('jcs-theme');
  if (savedTheme) htmlEl.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('jcs-theme', next);
    });
  }


  /* ============================================================
     11. LANGUE FR / EN
  ============================================================ */
  let currentLang = 'fr';
  const langBtn   = document.getElementById('lang-switch');

  function applyLang(lang) {
    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
      // On ne traduit que les éléments portant la classe .lang
      if (el.classList.contains('lang')) {
        el.innerHTML = el.getAttribute('data-' + lang);
      }
    });
    if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    htmlEl.setAttribute('lang', lang);
    currentLang = lang;
  }

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyLang(currentLang === 'fr' ? 'en' : 'fr');
    });
  }


  /* ============================================================
     12. FILTRE DES PROJETS PAR CATÉGORIE
  ============================================================ */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const cats = card.dataset.category.split(' ');
          card.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });


  /* ============================================================
     13. FORMULAIRE DE CONTACT → BACKEND FLASK
  ============================================================ */

  // ⚙️  URL du backend :
  //     Développement : http://localhost:5000/api/contact
  //     Production    : https://votre-domaine.com/api/contact
  const API_URL = 'http://localhost:5000/api/contact';

  const form       = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success');
  const errorBox   = document.getElementById('form-error');
  const submitBtn  = form ? form.querySelector('.form-submit') : null;

  if (form) {

    // Retirer la bordure rouge quand l'utilisateur corrige un champ
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Masquer les retours précédents
      hideFeedback();

      // Validation client rapide (les champs required)
      const requiredFields = form.querySelectorAll('[required]');
      let clientOk = true;
      requiredFields.forEach(f => {
        if (!f.value.trim()) {
          f.style.borderColor = 'rgba(239,68,68,.5)';
          clientOk = false;
        }
      });
      if (!clientOk) return;

      // Récupération des valeurs
      const payload = {
        name:    form.querySelector('[name="name"]')?.value.trim()    || '',
        email:   form.querySelector('[name="email"]')?.value.trim()   || '',
        subject: form.querySelector('[name="subject"]')?.value.trim() || '',
        message: form.querySelector('[name="message"]')?.value.trim() || '',
      };

      // État de chargement
      setLoading(true);

      try {
        const response = await fetch(API_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          form.reset();
          showSuccess(result.message || 'Message envoyé ! Je vous répondrai dans les plus bref délai.');
        } else {
          showError(result.error || 'Une erreur est survenue. Réessayez plus tard.');
        }

      } catch (networkErr) {
        console.error('[Contact] Erreur réseau :', networkErr);
        showError('Impossible de joindre le serveur. Contactez-moi via WhatsApp si le problème persiste.');
      } finally {
        setLoading(false);
      }
    });
  }

  // Helpers formulaire
  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled  = on;
    submitBtn.innerHTML = on
      ? '<i class="fas fa-spinner fa-spin"></i>&nbsp;Envoi...'
      : '<i class="fas fa-paper-plane"></i>&nbsp;<span class="lang" data-fr="Envoyer" data-en="Send">Envoyer</span>';
  }

  function hideFeedback() {
    if (successBox) successBox.style.display = 'none';
    if (errorBox)   errorBox.style.display   = 'none';
  }

  function showSuccess(msg) {
    if (!successBox) return;
    const t = successBox.querySelector('.fb-text');
    if (t) t.textContent = msg;
    successBox.style.display = 'flex';
    setTimeout(() => { successBox.style.display = 'none'; }, 8000);
  }

  function showError(msg) {
    if (!errorBox) return;
    const t = errorBox.querySelector('.fb-text');
    if (t) t.textContent = msg;
    errorBox.style.display = 'flex';
  }

}); // fin DOMContentLoaded
