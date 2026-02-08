/**
 * Sistema de Slideshow de Projetos
 * Navegação automática e manual
 */

(function() {
  'use strict';

  const slideshows = document.querySelectorAll('.project-slideshow');
  if (!slideshows.length) return;

  slideshows.forEach(slideshow => {
    const images = slideshow.querySelectorAll('img');
    const indicators = slideshow.querySelectorAll('.slideshow-indicator');
    const interval = parseInt(slideshow.dataset.interval) || 2000;

    if (images.length <= 1) return;

    let currentIndex = 0;
    let isPaused = false;
    let slideshowInterval;

    // Mostrar imagem específica
    function showImage(index) {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });

      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });

      currentIndex = index;
    }

    // Próxima imagem
    function nextImage() {
      if (isPaused) return;
      const nextIndex = (currentIndex + 1) % images.length;
      showImage(nextIndex);
    }

    // Navegação por indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showImage(index);
        // Resetar intervalo
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(nextImage, interval);
      });
    });

    // Pause on hover
    slideshow.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    slideshow.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - próxima
          const nextIndex = (currentIndex + 1) % images.length;
          showImage(nextIndex);
        } else {
          // Swipe right - anterior
          const prevIndex = (currentIndex - 1 + images.length) % images.length;
          showImage(prevIndex);
        }
        
        // Resetar intervalo
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(nextImage, interval);
      }
    }

    // Iniciar slideshow
    slideshowInterval = setInterval(nextImage, interval);
  });
})();
