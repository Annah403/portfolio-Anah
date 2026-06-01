/**
 * Annah Mwanza Portfolio — script.js
 * Handles: navbar scroll, mobile menu, back-to-top,
 *          active nav links, skill bar animation,
 *          scroll-reveal, contact form feedback.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Init Lucide Icons ---- */
  if (window.lucide) lucide.createIcons();

  /* ---- Elements ---- */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');
  const backToTop  = document.getElementById('back-to-top');
  const sections   = document.querySelectorAll('section[id]');
  const allLinks   = document.querySelectorAll('.nav-link');
  const skillFills = document.querySelectorAll('.skill-fill');
  const form       = document.getElementById('contact-form');
  const formSuccess= document.getElementById('form-success');

  /* ================================================
     NAVBAR — scroll state
  ================================================ */
  function updateNavbar() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ================================================
     MOBILE MENU — hamburger toggle
  ================================================ */
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ================================================
     ACTIVE NAV LINK — highlight current section
  ================================================ */
  function updateActiveLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ================================================
     BACK TO TOP button
  ================================================ */
  function updateBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================================================
     SKILL BAR ANIMATION
     Animate bars when they scroll into view
  ================================================ */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--pct');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Initially collapse bars to 0 so they can animate in
  skillFills.forEach(fill => {
    const pct = fill.style.getPropertyValue('--pct') || getComputedStyle(fill).getPropertyValue('--pct');
    fill.style.width = '0';
    skillObserver.observe(fill);
  });

  /* ================================================
     SCROLL REVEAL — fade in cards on scroll
  ================================================ */
  const revealItems = document.querySelectorAll(
    '.skill-card, .project-card, .service-card, .stat, .about-tags .tag'
  );

  // Set initial state via JS (so non-JS users still see content)
  revealItems.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(el => revealObserver.observe(el));

  /* ================================================
     CONTACT FORM — fake submit with feedback
  ================================================ */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) return;

      // Simulate sending
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        formSuccess.classList.add('show');
        form.reset();

        // Hide success after 5s
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1200);
    });
  }

  /* ================================================
     SMOOTH SCROLL OFFSET — account for fixed navbar
  ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});