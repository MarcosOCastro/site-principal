/**
 * Utilitários JavaScript
 * Funções auxiliares usadas em todo o site
 */

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ===== COPIAR PARA ÁREA DE TRANSFERÊNCIA =====
async function copyToClipboard(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (err) {
    // Fallback para navegadores antigos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showToast(successMessage);
    } catch (e) {
      console.error('Falha ao copiar:', e);
    }
    
    document.body.removeChild(textarea);
  }
}

// ===== THROTTLE =====
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== DEBOUNCE =====
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ===== ANO ATUAL =====
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===== LAZY LOADING DE IMAGENS =====
function initLazyLoading() {
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
    
    img.addEventListener('error', function() {
      console.warn(`Falha ao carregar imagem: ${this.src}`);
    });
  });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  updateCurrentYear();
  initLazyLoading();
});
