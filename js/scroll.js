/**
 * Funcionalidades de Scroll
 * Navegação suave, reveal animations, progress bar
 */

(function() {
  'use strict';

  // ===== SCROLL REVEAL =====
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => observer.observe(el));

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + 
                              window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Highlight animation
        targetElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        targetElement.style.opacity = '0.7';
        targetElement.style.transform = 'scale(0.98)';

        setTimeout(() => {
          targetElement.style.opacity = '1';
          targetElement.style.transform = 'scale(1)';
        }, 300);
      }
    });
  });

  // ===== READING PROGRESS BAR =====
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // ===== BACK TO TOP =====
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
  }

  // ===== NAVBAR SHADOW =====
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        nav.classList.add('shadow-lg');
      } else {
        nav.classList.remove('shadow-lg');
      }
    });
  }

  // ===== BUTTON LOADING STATES =====
  document.querySelectorAll('a[href^="http"], button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!this.classList.contains('cursor-not-allowed') && 
          href && href.startsWith('http')) {
        this.classList.add('btn-loading');
        setTimeout(() => {
          this.classList.remove('btn-loading');
        }, 1000);
      }
    });
  });
})();
