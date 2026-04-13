/* ═══════════════════════════════════════════════════════════════
   SHREE VINAYAK SOLAR & CONSTRUCTION — main script.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Wait for DOM ───
document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════
  //  PRELOADER
  // ═══════════════════════════════════
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger hero animations after preloader
      document.querySelectorAll('.animate-fade-up').forEach(el => {
        el.style.animationPlayState = 'running';
      });
    }, 900);
  });

  // Fallback: hide preloader after 3.5s no matter what
  setTimeout(() => preloader.classList.add('hidden'), 3500);


  // ═══════════════════════════════════
  //  PARTICLE CANVAS
  // ═══════════════════════════════════
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resizeCanvas() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.6 - 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset();
        // Twinkle
        this.opacity = (0.3 + 0.25 * Math.sin(this.life * 0.04)) * (1 - this.life / this.maxLife);
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `rgba(74, 222, 128, 1)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < 70; i++) {
      const p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife); // stagger starts
      particles.push(p);
    }

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }


  // ═══════════════════════════════════
  //  NAVBAR
  // ═══════════════════════════════════
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  // Scroll → sticky style
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    updateScrollTop();
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav on overlay click
  navOverlay.addEventListener('click', closeNav);

  // Close nav on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  function closeNav() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Active link highlight on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], div[id="home"]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }


  // ═══════════════════════════════════
  //  SCROLL REVEAL (Intersection Observer)
  // ═══════════════════════════════════
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });


  // ═══════════════════════════════════
  //  ANIMATED COUNTERS
  // ═══════════════════════════════════
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-num').forEach(el => {
    counterObserver.observe(el);
  });

  function animateCounter(el, target) {
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('en-IN');

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('en-IN');
    }

    requestAnimationFrame(update);
  }


  // ═══════════════════════════════════
  //  GALLERY FILTER
  // ═══════════════════════════════════
  const filterBtns = document.querySelectorAll('.gf-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // ═══════════════════════════════════
  //  LIGHTBOX
  // ═══════════════════════════════════
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

  document.querySelectorAll('.gallery-zoom').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      const caption = btn.getAttribute('data-caption');
      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  // ═══════════════════════════════════
  //  TESTIMONIALS SLIDER
  // ═══════════════════════════════════
  const track = document.getElementById('testimonialTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('tdots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');

  if (track && cards.length > 0) {
    let currentSlide = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = Math.ceil(cards.length / slidesPerView);
    let autoPlayTimer = null;

    function getSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    // Build dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `tdot${i === currentSlide ? ' active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.tdot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    function goToSlide(index) {
      slidesPerView = getSlidesPerView();
      totalSlides = Math.ceil(cards.length / slidesPerView);
      currentSlide = Math.max(0, Math.min(index, totalSlides - 1));

      const cardWidth = cards[0].offsetWidth + 24; // gap = 24px
      const offset = currentSlide * slidesPerView * cardWidth;
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    function nextSlide() { goToSlide((currentSlide + 1) % totalSlides); }
    function prevSlide() { goToSlide((currentSlide - 1 + totalSlides) % totalSlides); }

    nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 4500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetAutoPlay();
      }
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    // Responsive
    window.addEventListener('resize', () => {
      const newSPV = getSlidesPerView();
      if (newSPV !== slidesPerView) {
        slidesPerView = newSPV;
        totalSlides = Math.ceil(cards.length / slidesPerView);
        currentSlide = 0;
        buildDots();
        goToSlide(0);
      }
    });

    buildDots();
    startAutoPlay();
  }


  // ═══════════════════════════════════
  //  CONTACT FORM
  // ═══════════════════════════════════
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = `
        <svg class="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;animation:spin-anim 1s linear infinite">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;

      // Simulate submission (no backend)
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        formSuccess.classList.add('visible');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      }, 1800);
    });
  }


  // ═══════════════════════════════════
  //  SCROLL TO TOP BUTTON
  // ═══════════════════════════════════
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  function updateScrollTop() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ═══════════════════════════════════
  //  DARK MODE TOGGLE
  // ═══════════════════════════════════
  const darkToggle = document.getElementById('darkModeToggle');
  const html = document.documentElement;

  // Check saved preference
  const savedTheme = localStorage.getItem('sv-theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);

  darkToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sv-theme', next);
  });


  // ═══════════════════════════════════
  //  BUTTON RIPPLE EFFECT
  // ═══════════════════════════════════
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        left:${x}px;
        top:${y}px;
        background:rgba(255,255,255,0.25);
        border-radius:50%;
        transform:scale(0);
        animation:ripple-anim 0.6s linear;
        pointer-events:none;
      `;

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframes
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(1); opacity: 0; }
    }
    @keyframes spin-anim {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(rippleStyle);


  // ═══════════════════════════════════
  //  SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  // ═══════════════════════════════════
  //  INITIAL TRIGGER
  // ═══════════════════════════════════
  updateScrollTop();
  updateActiveLink();

  // Trigger visibility for elements already in viewport
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(() => el.classList.add('visible'), 200);
    }
  });

});
