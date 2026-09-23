// Spectra @ NYU — small progressive enhancements. The site works without JS.

(function () {
  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Nav border once scrolled
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Nav "Join us": hidden while the hero's own join button is on screen.
  // When that scrolls away, the old nav fades out and the new one fades in.
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  const heroJoin = document.getElementById('hero-join');
  if (navLinks && navCta && heroJoin && 'IntersectionObserver' in window) {
    let shown = false;
    const swap = (show) => {
      if (show === shown) return;
      shown = show;
      navLinks.classList.add('fading');
      setTimeout(() => {
        navCta.hidden = !show;
        navLinks.classList.remove('fading');
      }, 220);
    };
    new IntersectionObserver(([e]) => swap(!e.isIntersecting), { threshold: 0 }).observe(heroJoin);
  } else if (navCta) {
    navCta.hidden = false;
  }

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(menu.hidden));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 760) setOpen(false); });
  }

  // Reveal-on-scroll for section content
  const targets = document.querySelectorAll(
    '.section-head, .about-grid, .values li, .event, .card, .links li, .join-inner'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('in'));
  }

  // "~read more!" nudge: appears bottom-right after 5s with no mouse movement,
  // only while the top of the page is still in view. Any activity hides it.
  const nudge = document.querySelector('.read-more');
  const hero = document.querySelector('.hero');
  if (nudge && hero) {
    let timer = 0;
    const hide = () => { nudge.classList.remove('show'); nudge.setAttribute('aria-hidden', 'true'); };
    const arm = () => {
      clearTimeout(timer);
      hide();
      timer = setTimeout(() => {
        const heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom > window.innerHeight * 0.4) { nudge.classList.add('show'); nudge.removeAttribute('aria-hidden'); }
      }, 5000);
    };
    ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, arm, { passive: true })
    );
    nudge.addEventListener('click', hide);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nudge.querySelectorAll('animate').forEach((a) => a.remove());
    }
    arm();
  }

  // Mailing list form. No backend yet: validate and confirm locally.
  // Point this at a real endpoint (Google Form, Buttondown, Mailchimp, etc.) when ready.
  const form = document.getElementById('join-form');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        form.email.focus();
        return;
      }
      status.textContent = `Thanks! We'll be in touch at ${email}.`;
      form.reset();
    });
  }
})();

