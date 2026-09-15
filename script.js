  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const siteHeader = document.querySelector('header.site');
  const onScroll = () => siteHeader.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  const themeToggle = document.getElementById('themeToggle');
  const rootEl = document.documentElement;
  themeToggle.addEventListener('click', () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    if (isLight){
      rootEl.removeAttribute('data-theme');
    } else {
      rootEl.setAttribute('data-theme', 'light');
    }
    try { localStorage.setItem('jlmv-theme', isLight ? 'dark' : 'light'); } catch (e) {}
  });

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maenwoao';

  const form = document.getElementById('contactForm');
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = document.getElementById('submitLabel');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: if this hidden field got filled, it was very likely a bot — drop silently.
    const honeypot = document.getElementById('website').value;
    if (honeypot) return;

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();

    formSuccess.style.display = 'none';
    if (!nome || !telefone){
      formError.textContent = 'Preencha nome e telefone para enviar o cadastro.';
      formError.style.display = 'block';
      (!nome ? document.getElementById('nome') : document.getElementById('telefone')).focus();
      return;
    }
    formError.style.display = 'none';

    submitBtn.disabled = true;
    submitLabel.textContent = 'Enviando...';

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (response.ok){
        form.reset();
        formSuccess.style.display = 'block';
      } else {
        throw new Error('resposta não ok');
      }
    } catch (err){
      formError.textContent = 'Não foi possível enviar agora. Tente novamente ou fale direto pelo WhatsApp acima.';
      formError.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Enviar cadastro';
    }
  });

  const navAnchors = document.querySelectorAll('nav.links a');
  const sections = Array.from(navAnchors)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length){
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const id = '#' + entry.target.id;
          navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(sec => spy.observe(sec));
  }
