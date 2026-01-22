// ===================================
// EMOTIONAL THERAPIST WEBSITE
// Interactive Functionality
// ===================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

  // === RIVER VIDEO HANDLING ===
  const riverVideo = document.querySelector('.river-video');

  if (riverVideo) {
    // Ensure video plays on mobile devices
    riverVideo.play().catch(function (error) {
      console.log('Video autoplay prevented:', error);
      // Fallback to CSS animation is already in place
    });

    // Handle video loading errors
    riverVideo.addEventListener('error', function () {
      console.log('Video failed to load, using CSS animation fallback');
      riverVideo.style.display = 'none';
    });
  }

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // === SMOOTH SCROLL FOR NAVIGATION LINKS ===
  const navLinks = document.querySelectorAll('.nav-links a, .btn-primary, .btn-outline');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only apply smooth scroll for anchor links
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // === INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(element => {
    observer.observe(element);
  });

  // === CONTACT FORM HANDLING ===
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      // In a real implementation, you would send this data to a server
      console.log('Form submitted:', formData);

      // Show success message
      alert('Thank you for reaching out. I will respond within 24-48 hours.');

      // Reset form
      contactForm.reset();
    });
  }

  // === PARALLAX EFFECT FOR RIVER BACKGROUND ===
  const riverBackground = document.querySelector('.river-background');

  if (riverBackground) {
    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset;
      const homeSection = document.getElementById('home');

      if (homeSection && scrolled < homeSection.offsetHeight) {
        const parallaxSpeed = 0.5;
        riverBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    });
  }

  // === ADD STAGGER DELAY TO FADE-IN ELEMENTS IN GRIDS ===
  const grids = document.querySelectorAll('.methods-grid, .services-grid, .blog-grid');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.fade-in');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // === SMOOTH REVEAL FOR CREDENTIALS ===
  const credentialItems = document.querySelectorAll('.credential-item');
  credentialItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
  });

  // === PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER IT ===
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--transition-smooth', 'none');
    document.documentElement.style.setProperty('--transition-fast', 'none');
  }

});

// === UTILITY: DEBOUNCE FUNCTION FOR SCROLL PERFORMANCE ===
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Console message for developers
console.log('%c✦ Flow Therapy', 'color: #F2C94C; font-size: 24px; font-weight: bold;');
console.log('%cConscious transformation flows naturally', 'color: #2F5D50; font-size: 14px;');
