/**
 * Poornachandra Goudar — Portfolio Script
 * Features: Particle Canvas, Custom Cursor, Scroll Animations,
 *           Nav behavior, Mobile Menu, Form Validation
 */

/* ─────────────────────────────────────────────
   1. PARTICLE CANVAS
───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 120;
  const GREEN  = [0, 255, 136];
  const CYAN   = [0, 212, 255];
  const VIOLET = [139, 92, 246];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomColor() {
    const palette = [GREEN, CYAN, VIOLET];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function createParticle() {
    const color = randomColor();
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      color: `rgba(${color[0]},${color[1]},${color[2]},`,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
    };
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseConnections() {
    const maxDist = 160;
    particles.forEach(p => {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.35;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    });
  }

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    frame++;

    particles.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Mouse repulsion (subtle)
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * 0.5;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Pulsating opacity
      const pulse = Math.sin(frame * p.pulseSpeed + p.pulseOffset);
      const alpha = p.opacity + pulse * 0.15;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0, Math.min(1, alpha)) + ')';
      ctx.fill();
    });

    drawConnections();
    drawMouseConnections();
  }

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  buildParticles();
  animate();
})();


/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let fx = 0, fy = 0, tx = 0, ty = 0;

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  // Smooth follower
  function animateFollower() {
    fx += (tx - fx) * 0.12;
    fy += (ty - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .project-card, .stat-card, .cert-card, .timeline-card, .pill');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
})();


/* ─────────────────────────────────────────────
   3. NAVIGATION — Scroll & Mobile
───────────────────────────────────────────── */
(function initNav() {
  const nav        = document.getElementById('nav');
  const toggle     = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky nav style on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
})();


/* ─────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATIONS
───────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger based on siblings
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = (idx % 4) * 100; // max 4 columns stagger

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   5. TIMELINE — Staggered entry animation
───────────────────────────────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index || 0);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
})();


/* ─────────────────────────────────────────────
   6. SKILL PILLS — Staggered entrance
───────────────────────────────────────────── */
(function initPills() {
  const pills = document.querySelectorAll('.pill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  pills.forEach(pill => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(12px) scale(0.9)';
    pill.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(pill);
  });
})();


/* ─────────────────────────────────────────────
   7. PROJECT CARD — Mouse tilt effect
───────────────────────────────────────────── */
(function initProjectTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * 6;
      const rotateX = ((cy - y) / cy) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

      // Move glow to cursor
      const glow = card.querySelector('.project-glow');
      if (glow) {
        glow.style.left   = (x - 100) + 'px';
        glow.style.top    = (y - 100) + 'px';
        glow.style.right  = 'auto';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glow = card.querySelector('.project-glow');
      if (glow) {
        glow.style.left  = 'auto';
        glow.style.top   = 'auto';
        glow.style.right = '-60px';
      }
    });
  });
})();


/* ─────────────────────────────────────────────
   8. CONTACT FORM — Validation
───────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  function validate(id, condition) {
    const group = document.getElementById(id).closest('.form-group');
    group.classList.toggle('error', !condition);
    return condition;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live validation on blur
  document.getElementById('name').addEventListener('blur', function() {
    validate('name', this.value.trim().length > 0);
  });
  document.getElementById('email').addEventListener('blur', function() {
    validate('email', isValidEmail(this.value.trim()));
  });
  document.getElementById('subject').addEventListener('blur', function() {
    validate('subject', this.value.trim().length > 0);
  });
  document.getElementById('message').addEventListener('blur', function() {
    validate('message', this.value.trim().length >= 10);
  });

  // Remove error on input
  ['name', 'email', 'subject', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
      this.closest('.form-group').classList.remove('error');
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const v1 = validate('name',    name.length > 0);
    const v2 = validate('email',   isValidEmail(email));
    const v3 = validate('subject', subject.length > 0);
    const v4 = validate('message', message.length >= 10);

    if (v1 && v2 && v3 && v4) {
      // Simulate submit
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.querySelector('.btn-text').textContent = 'Sending…';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 5000);
      }, 1200);
    }
  });
})();


/* ─────────────────────────────────────────────
   9. HERO — Typewriter for tag line
───────────────────────────────────────────── */
(function initTypewriter() {
  const el    = document.getElementById('hero-tag');
  const texts = [
    '// Aeronautical → DevOps → Data Analytics',
    '// Drone Pioneer & Startup Founder',
    '// Cloud Infrastructure | AWS Certified',
    '// Building the Future, One Layer at a Time',
  ];
  let textIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = texts[textIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = '// ' + current.slice(3, charIdx);
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2800);
        return;
      }
    } else {
      charIdx--;
      el.textContent = '// ' + current.slice(3, charIdx);
      if (charIdx === 3) {
        deleting = false;
        textIdx  = (textIdx + 1) % texts.length;
        setTimeout(type, 400);
        return;
      }
    }

    setTimeout(type, deleting ? 28 : 48);
  }

  // Start after hero animation
  setTimeout(type, 1600);
})();


/* ─────────────────────────────────────────────
   10. SMOOTH SCROLL — offset for fixed nav
───────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────────
   11. STAT COUNTER — animate numbers
───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el  = entry.target;
      const raw = el.textContent.replace(/[^0-9]/g, '');
      const end = parseInt(raw);
      const suffix = el.textContent.replace(/[0-9]/g, '');

      if (isNaN(end)) return;

      let start = 0;
      const duration = 1200;
      const step = duration / end;

      const timer = setInterval(() => {
        start++;
        el.textContent = start + suffix;
        if (start >= end) clearInterval(timer);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─────────────────────────────────────────────
   12. SECTION LABEL — subtle parallax text
───────────────────────────────────────────── */
(function initParallaxLabels() {
  window.addEventListener('scroll', () => {
    const labels = document.querySelectorAll('.section-label');
    labels.forEach(label => {
      const rect  = label.getBoundingClientRect();
      const delta = (window.innerHeight / 2 - rect.top) * 0.04;
      label.style.transform = `translateX(${delta}px)`;
    });
  }, { passive: true });
})();
