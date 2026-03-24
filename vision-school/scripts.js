/* ====================================================
   Vision International School – scripts.js
   ==================================================== */

'use strict';

// ───────────── DOM Ready ─────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initHamburger();
  initAOS();
  initCounters();
  initTestimonials();
  initScrollTop();
  initForms();
  initActiveNav();
});

/* ══════════════════════════════════════
   1. HERO PARTICLES
══════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    Object.assign(p.style, {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      '--dur': (6 + Math.random() * 10) + 's',
      '--delay': (Math.random() * 8) + 's',
      width: (2 + Math.random() * 3) + 'px',
      height: (2 + Math.random() * 3) + 'px',
      background: Math.random() > 0.5 ? '#38BDF8' : '#818CF8',
    });
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════
   2. NAVBAR SCROLL
══════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════
   3. HAMBURGER MENU
══════════════════════════════════════ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ══════════════════════════════════════
   4. SIMPLE AOS (Animate On Scroll)
══════════════════════════════════════ */
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  // Apply transition delays
  items.forEach(el => {
    const delay = el.getAttribute('data-delay') || 0;
    el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   5. COUNTER ANIMATION
══════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(current);
    }, 16);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   6. TESTIMONIAL SLIDER
══════════════════════════════════════ */
function initTestimonials() {
  const slider = document.getElementById('testiSlider');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');
  if (!slider) return;

  const cards = slider.querySelectorAll('.testi-card');
  let current = 0;
  let autoInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getCardWidth() {
    // Cards in slider
    const card = cards[0];
    if (!card) return 0;
    const sliderStyle = window.getComputedStyle(slider);
    const gap = parseFloat(sliderStyle.columnGap || sliderStyle.gap || 0);
    return card.getBoundingClientRect().width + gap;
  }

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    const offset = current * getCardWidth();
    slider.scrollTo({ left: offset, behavior: 'smooth' });
    updateDots();
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }

  // Auto play
  autoInterval = setInterval(() => goTo(current + 1), 5000);

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  });

  slider.addEventListener('scroll', () => {
    const width = getCardWidth();
    if (!width) return;
    const next = Math.round(slider.scrollLeft / width);
    if (next !== current) {
      current = next;
      updateDots();
    }
  }, { passive: true });

  // Re-align on resize
  window.addEventListener('resize', () => goTo(current));
}

/* ══════════════════════════════════════
   7. SCROLL TO TOP BUTTON
══════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════
   8. FORM HANDLING
══════════════════════════════════════ */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function initForms() {
  // Enrollment Form
  const bookForm = document.getElementById('bookForm');
  if (bookForm) {
    bookForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = bookForm.querySelector('#submitBtn');
      const origContent = btn.innerHTML;
      btn.innerHTML = '<span>Submitting...</span>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<span>✅ Submitted!</span>';
        showToast('🎉 Your enrollment request has been submitted! We\'ll contact you within 24 hours.');
        bookForm.reset();
        setTimeout(() => {
          btn.innerHTML = origContent;
          btn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('📧 You\'ve been subscribed to our newsletter!');
      newsletterForm.reset();
    });
  }
}

/* ══════════════════════════════════════
   9. ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════
   10. SMOOTH HOVER TILT ON CLASS CARDS
══════════════════════════════════════ */
document.querySelectorAll('.class-card, .facility-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    setTimeout(() => card.style.transition = '', 500);
  });
});
