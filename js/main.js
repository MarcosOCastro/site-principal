/**
 * Script Principal
 * Inicialização e configurações globais
 */

(function() {
  'use strict';

  // ===== THEME MANAGEMENT =====
  const ThemeManager = {
    init() {
      // Verificar preferência salva
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Aplicar tema
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Botão de toggle
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', () => this.toggle());
      }
    },

    toggle() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      // Disparar evento para outros scripts
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme: isDark ? 'dark' : 'light' } 
      }));
    }
  };

  // ===== TYPING EFFECT =====
  function initTypingEffect() {
    const heroTitle = document.querySelector('h1');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.classList.add('typing-text');

    let i = 0;
    function type() {
      if (i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(type, 80);
      } else {
        setTimeout(() => {
          heroTitle.classList.remove('typing-text');
        }, 2000);
      }
    }

    setTimeout(type, 500);
  }

  // ===== ACTIVE NAVIGATION =====
  function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('text-primary');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('text-primary');
        }
      });
    });
  }

  // ===== PERFORMANCE MONITORING =====
  function initPerformanceMonitoring() {
    // Reportar Core Web Vitals (opcional)
    if ('web-vitals' in window) {
      // Métricas seriam reportadas aqui
    }

    // Log de erros
    window.addEventListener('error', (e) => {
      console.error('Erro capturado:', e.error);
    });
  }

  // ===== INICIALIZAÇÃO =====
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    initTypingEffect();
    initActiveNavigation();
    initPerformanceMonitoring();

    console.log('🚀 Site carregado com sucesso!');
  });

  // ===== EXPORTS =====
  window.SiteApp = {
    ThemeManager
  };
})();
