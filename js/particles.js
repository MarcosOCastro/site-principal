/**
 * Sistema de Partículas Interativo
 * Canvas animado com interação de cursor
 */

(function() {
  'use strict';

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Configurações
  const CONFIG = {
    particleCount: 80,
    connectionDistance: 100,
    mouseDistance: 150,
    baseColor: '59, 130, 246',
    opacity: 0.6
  };

  // Estado
  let particles = [];
  let animationId;
  let isAnimating = true;
  let mouse = { x: null, y: null, radius: CONFIG.mouseDistance };

  // Classe Particle
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = `rgba(${CONFIG.baseColor}, ${this.opacity})`;
      this.velocity = {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      };
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      // Brilho
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      // Movimento base
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Interação com cursor
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * this.density * 0.6;
          const directionY = forceDirectionY * force * this.density * 0.6;

          this.x += directionX;
          this.y += directionY;
          this.color = `rgba(${CONFIG.baseColor}, ${Math.min(this.opacity + 0.3, 1)})`;
        } else {
          this.color = `rgba(${CONFIG.baseColor}, ${this.opacity})`;
        }
      }

      // Retornar à posição base
      if (this.x !== this.baseX) {
        this.x -= (this.x - this.baseX) / 50;
      }
      if (this.y !== this.baseY) {
        this.y -= (this.y - this.baseY) / 50;
      }

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
  }

  // Inicializar partículas
  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Desenhar conexões
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      // Conectar partículas próximas
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.connectionDistance) {
          const opacity = 1 - (distance / CONFIG.connectionDistance);
          ctx.strokeStyle = `rgba(${CONFIG.baseColor}, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Conectar com cursor
      if (mouse.x != null && mouse.y != null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const opacity = 1 - (distance / mouse.radius);
          ctx.strokeStyle = `rgba(${CONFIG.baseColor}, ${opacity * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Loop de animação
  function animate() {
    if (!isAnimating) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Redimensionar canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  // Event Listeners
  window.addEventListener('resize', resize);
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Pausar quando aba não está visível
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isAnimating = false;
      cancelAnimationFrame(animationId);
    } else {
      isAnimating = true;
      animate();
    }
  });

  // Inicializar
  resize();
  initParticles();
  animate();
})();
