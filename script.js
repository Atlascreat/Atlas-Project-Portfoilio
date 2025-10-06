// ===== NAVBAR OVALE =====
const navbarOval = document.querySelector('.navbar-oval');
const menuExpanded = document.querySelector('.menu-expanded');
const navLinks = document.querySelectorAll('.nav-link');
let isShrunk = false;

// Gestion du toggle de la navbar
if (navbarOval) {
  navbarOval.addEventListener('click', () => {
    menuExpanded.classList.toggle('show');
  });
}

// Test simple pour vérifier que les liens fonctionnent
console.log('Navigation links found:', navLinks.length);
navLinks.forEach((link, index) => {
  console.log(`Link ${index}:`, link.href, link.textContent);
  
  // Ajouter un événement de clic simple
  link.addEventListener('click', (e) => {
    console.log('Link clicked:', link.href, link.textContent);
    
    // Si c'est un lien vers une autre page, laisser faire
    if (link.href && !link.href.includes('#')) {
      console.log('External link, allowing navigation');
      return;
    }
    
    // Si c'est un lien interne, faire un scroll
    if (link.href && link.href.includes('#')) {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      console.log('Internal link, scrolling to:', targetId);
      
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    
    // Fermer le menu après avoir cliqué sur un lien
    if (menuExpanded && menuExpanded.classList.contains('show')) {
      menuExpanded.classList.remove('show');
    }
  });
});

// Fermer le menu en cliquant à l'extérieur
document.addEventListener('click', (e) => {
  if (menuExpanded && menuExpanded.classList.contains('show')) {
    if (!navbarOval.contains(e.target) && !menuExpanded.contains(e.target)) {
      menuExpanded.classList.remove('show');
    }
  }
});

// Fermer le menu lors du scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (menuExpanded && menuExpanded.classList.contains('show')) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      menuExpanded.classList.remove('show');
    }, 100);
  }
}, { passive: true });

// ===== BOUTON DEVIS =====
document.addEventListener('DOMContentLoaded', () => {
  const devisBtn = document.querySelector('.hero-cta-btn');
  const devisModal = document.getElementById('devisModal');
  const closeModal = document.getElementById('closeModal');
  
  if (devisBtn) {
    devisBtn.addEventListener('click', () => {
      devisModal.classList.add('show');
      document.body.classList.add('modal-open'); // Empêcher le scroll
    });
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      devisModal.classList.remove('show');
      document.body.classList.remove('modal-open'); // Réactiver le scroll
    });
  }
  
  // Fermer le modal en cliquant à l'extérieur
  if (devisModal) {
    devisModal.addEventListener('click', (e) => {
      if (e.target === devisModal) {
        devisModal.classList.remove('show');
        document.body.classList.remove('modal-open');
      }
    });
  }
  
  // Fermer le modal avec la touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && devisModal.classList.contains('show')) {
      devisModal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  });
  
  // Gestion de la soumission du formulaire
  const devisForm = document.getElementById('devisForm');
  if (devisForm) {
    devisForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validation basique
      const nom = document.getElementById('nom').value.trim();
      const email = document.getElementById('email').value.trim();
      const typeProjet = document.getElementById('type-projet').value;
      const description = document.getElementById('description').value.trim();
      
      if (!nom || !email || !typeProjet || !description) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      
      // Afficher un message de chargement
      const submitBtn = devisForm.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      submitBtn.disabled = true;
      
      // Envoyer le formulaire via Formspree
      fetch(devisForm.action, {
        method: 'POST',
        body: new FormData(devisForm),
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          alert('Votre demande de devis a été envoyée avec succès ! Nous vous répondrons dans les plus brefs délais.');
          // Fermer le modal
          devisModal.classList.remove('show');
          document.body.classList.remove('modal-open');
          // Réinitialiser le formulaire
          devisForm.reset();
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      })
      .catch(error => {
        alert('Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.');
        console.error('Erreur:', error);
      })
      .finally(() => {
        // Restaurer le bouton
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    });
  }
});

// Gestion du hover pour la navbar ovale
if (navbarOval) {
  navbarOval.addEventListener('mouseenter', () => {
    menuExpanded.style.opacity = '1';
    menuExpanded.style.visibility = 'visible';
    menuExpanded.style.transform = 'translateX(-50%) scale(1)';
  });

  navbarOval.addEventListener('mouseleave', () => {
    menuExpanded.style.opacity = '0';
    menuExpanded.style.visibility = 'hidden';
    menuExpanded.style.transform = 'translateX(-50%) scale(0.8)';
  });
}

// Smooth scrolling pour les liens de navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      // Pour la section projets, on scroll directement au début
      if (targetId === '#projets') {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      } else {
        // Pour les autres sections, on garde l'ajustement de la navbar
        const navbarHeight = document.querySelector('.navbar-oval').offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight - 50;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Rétraction de la navbar au scroll (léger, sans animation lourde)
const SHRINK_SCROLL_Y = 100;

window.addEventListener('scroll', () => {
  if (!navbarOval) return;
  const shouldShrink = window.scrollY > SHRINK_SCROLL_Y;
  
  if (shouldShrink && !isShrunk) {
    navbarOval.classList.add('navbar-oval--shrink');
    isShrunk = true;
  } else if (!shouldShrink && isShrunk) {
    navbarOval.classList.remove('navbar-oval--shrink');
    isShrunk = false;
  }
});

// ===== CAROUSEL PROJETS INFINI =====
document.addEventListener('DOMContentLoaded', () => {
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  
  if (carouselSlides.length === 0) {
    console.log('Aucun carousel trouvé');
    return;
  }
  
  console.log('Carousel trouvé avec', carouselSlides.length, 'slides');
  
  let currentSlide = 0;
  let isTransitioning = false;
  let autoPlayInterval;
  
  // Fonction pour afficher une slide avec transition fluide
  function showSlide(index) {
    if (isTransitioning) return;
    
    console.log('Changement vers slide', index);
    isTransitioning = true;
    
    // Masquer toutes les slides
    carouselSlides.forEach((slide, i) => {
      slide.classList.remove('active');
      console.log('Slide', i, 'masquée');
    });
    
    // Afficher la slide actuelle
    if (carouselSlides[index]) {
      carouselSlides[index].classList.add('active');
      console.log('Slide', index, 'activée');
    }
    
    currentSlide = index;
    
    // Réactiver les transitions après l'animation
    setTimeout(() => {
      isTransitioning = false;
      console.log('Transition terminée');
    }, 800);
  }
  
  // Fonction pour passer à la slide suivante (infini)
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % carouselSlides.length;
    console.log('Passage à la slide suivante:', nextIndex);
    showSlide(nextIndex);
  }
  
  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    if (e.key === 'ArrowLeft') {
      const prevIndex = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
      showSlide(prevIndex);
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });
  
  // Auto-play automatique activé
  autoPlayInterval = setInterval(() => {
    if (!isTransitioning) {
      console.log('Auto-play: passage à la slide suivante');
      nextSlide();
    }
  }, 4000);
  
  // Navigation tactile (swipe) optimisée pour mobile
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    // Empêcher le scroll par défaut sur mobile
    carouselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: false });
    
    carouselContainer.addEventListener('touchmove', (e) => {
      // Empêcher le scroll vertical pendant le swipe horizontal
      const diffX = Math.abs(e.touches[0].clientX - startX);
      const diffY = Math.abs(e.touches[0].clientY - startY);
      
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    }, { passive: false });
    
    carouselContainer.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Seuil de swipe plus sensible sur mobile
      if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && !isTransitioning) {
          nextSlide(); // Swipe gauche
        } else if (diffX < 0 && !isTransitioning) {
          const prevIndex = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
          showSlide(prevIndex); // Swipe droite
        }
      }
    });
  }
  
  // Initialiser la première slide
  console.log('Initialisation du carousel');
  showSlide(0);
  
  // Debug: afficher toutes les slides
  carouselSlides.forEach((slide, i) => {
    console.log('Slide', i, ':', slide.classList.contains('active') ? 'ACTIVE' : 'inactive');
  });
});

// ===== CAROUSEL PLEIN ÉCRAN =====
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.project-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentSlide = 0;
  let autoPlayInterval;
  
  // Fonction pour afficher un slide
  function showSlide(index) {
    // Masquer tous les slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Désactiver tous les dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Afficher le slide actuel
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlide = index;
  }
  
  // Fonction pour passer au slide suivant
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }
  
  // Fonction pour passer au slide précédent
  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }
  
  // Fonction pour aller à un slide spécifique
  function goToSlide(index) {
    showSlide(index);
  }
  
  // Fonction pour mettre à jour les dots
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  // Démarrer la lecture automatique
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Change toutes les 5 secondes
  }
  
  // Arrêter la lecture automatique
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // Event listeners pour les boutons de navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay(); // Redémarrer le timer
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay(); // Redémarrer le timer
    });
  }
  
  // Event listeners pour les dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      stopAutoPlay();
      startAutoPlay(); // Redémarrer le timer
    });
  });
  
  // Pause au survol
  const carouselContainer = document.querySelector('.projects-table');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
  }
  
  // Initialiser le carousel
  showSlide(0);
  startAutoPlay();
  
  // Mettre à jour les dots au changement de slide
  updateDots();
});

// ===== OPTIMISATIONS MOBILE ET RESPONSIVE =====

// Variables globales pour les optimisations mobile
let isMobile = false;
let isLandscape = false;
let touchStartX = 0;
let touchStartY = 0;
let isScrolling = false;

// Détection automatique du type d'appareil
function detectDevice() {
  isMobile = window.innerWidth <= 768;
  isLandscape = window.innerHeight < window.innerWidth;
  
  // Optimisations spécifiques par appareil
  if (isMobile) {
    document.body.classList.add('mobile-device');
    
    // Désactiver les particules sur mobile pour les performances
    const particles = document.querySelector('.particles');
    if (particles) {
      particles.style.display = 'none';
    }
    
    // Optimiser les transitions
    document.documentElement.style.setProperty('--transition-duration', '0.3s');
  } else {
    document.body.classList.remove('mobile-device');
    document.documentElement.style.setProperty('--transition-duration', '0.5s');
  }
}

// Gestion de l'orientation et du redimensionnement
function handleResize() {
  detectDevice();
  optimizeForMobile();
}

// Optimisations spécifiques pour mobile
function optimizeForMobile() {
  if (!isMobile) return;
  
  // Réduire la hauteur du carousel sur mobile
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    if (isLandscape) {
      carousel.style.height = '35vh';
    } else {
      carousel.style.height = '50vh';
    }
  }
  
  // Optimiser la navbar sur mobile
  const navbar = document.querySelector('.navbar-oval');
  if (navbar) {
    navbar.style.top = isLandscape ? '5px' : '10px';
  }
  
  // Ajuster les espacements sur mobile
  const sections = document.querySelectorAll('.about-section, .contact-section');
  sections.forEach(section => {
    if (isLandscape) {
      section.style.padding = '30px 15px';
    } else {
      section.style.padding = '50px 20px';
    }
  });
}

// Gestion des événements tactiles pour le carousel
function initTouchEvents() {
  const carousel = document.querySelector('.carousel-container');
  if (!carousel) return;
  
  // Détection du début du toucher
  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isScrolling = false;
  }, { passive: false });
  
  // Détection du mouvement du toucher
  carousel.addEventListener('touchmove', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const diffX = touchStartX - touchX;
    const diffY = touchStartY - touchY;
    
    // Détecter si c'est un scroll vertical ou un swipe horizontal
    if (Math.abs(diffY) > Math.abs(diffX)) {
      isScrolling = true;
    }
    
    // Empêcher le scroll par défaut si c'est un swipe horizontal
    if (!isScrolling && Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Gestion de la fin du toucher
  carousel.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY || isScrolling) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: false });
}

// Amélioration de l'accessibilité mobile
function enhanceMobileAccessibility() {
  if (!isMobile) return;
  
  // Augmenter la zone de clic pour les boutons
  const buttons = document.querySelectorAll('.hero-cta-btn, .cta-button, .submit-btn, .nav-link');
  buttons.forEach(button => {
    button.style.minHeight = '44px';
    button.style.minWidth = '44px';
  });
  
  // Améliorer la navigation tactile
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    link.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Optimisation des performances sur mobile
function optimizeMobilePerformance() {
  if (!isMobile) return;
  
  // Réduire la fréquence des animations
  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach(card => {
    card.style.animationDuration = '4s';
  });
  
  // Optimiser le scroll
  document.body.style.webkitOverflowScrolling = 'touch';
  
  // Réduire les effets visuels lourds
  const elements = document.querySelectorAll('.projet-overlay, .contact-card, .expertise-card');
  elements.forEach(element => {
    element.style.backdropFilter = 'none';
    element.style.webkitBackdropFilter = 'none';
  });
}

// Gestion de l'orientation sur mobile
function handleOrientation() {
  if (!isMobile) return;
  
  isLandscape = window.innerHeight < window.innerWidth;
  optimizeForMobile();
  
  // Ajuster les hauteurs pour l'orientation paysage
  if (isLandscape) {
    document.documentElement.style.setProperty('--mobile-landscape-height', '100vh');
  } else {
    document.documentElement.style.setProperty('--mobile-landscape-height', 'auto');
  }
}

// ===== CODE EXISTANT OPTIMISÉ =====

document.addEventListener('DOMContentLoaded', function() {
  const devisForm = document.getElementById('devisForm');
  const navbarOval = document.querySelector('.navbar-oval');
  const menuExpanded = document.querySelector('.menu-expanded');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Formulaire de devis
  if (devisForm) {
    devisForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      
      // État de chargement
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;
      
      // Envoi via Formspree
      fetch('https://formspree.io/f/xgvzqnew', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
          this.reset();
        } else {
          throw new Error('Erreur lors de l\'envoi');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }
  
  // ===== NAVBAR RESPONSIVE SIMPLIFIÉE =====
  
  // Toggle du menu navbar
  if (navbarOval && menuExpanded) {
    // Gestion du clic sur le bouton menu
    navbarOval.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Menu clicked!'); // Debug
      
      // Toggle de la classe show
      menuExpanded.classList.toggle('show');
      
      console.log('Menu expanded class:', menuExpanded.classList.contains('show')); // Debug
      
      // Gestion de l'état du bouton
      const menuButton = this.querySelector('.menu-button');
      if (menuExpanded.classList.contains('show')) {
        menuButton.style.background = '#333';
        document.body.style.overflow = 'hidden';
      } else {
        menuButton.style.background = '#000000';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
      if (!navbarOval.contains(e.target) && !menuExpanded.contains(e.target)) {
        menuExpanded.classList.remove('show');
        const menuButton = navbarOval.querySelector('.menu-button');
        if (menuButton) {
          menuButton.style.background = '#000000';
        }
        document.body.style.overflow = 'auto';
      }
    });
    
    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuExpanded.classList.contains('show')) {
        menuExpanded.classList.remove('show');
        const menuButton = navbarOval.querySelector('.menu-button');
        if (menuButton) {
          menuButton.style.background = '#000000';
        }
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  // Navigation des liens avec fermeture automatique sur mobile
  if (navLinks.length > 0) {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Fermer le menu sur mobile après clic
        if (window.innerWidth <= 768 && menuExpanded) {
          menuExpanded.classList.remove('show');
          const menuButton = navbarOval.querySelector('.menu-button');
          if (menuButton) {
            menuButton.style.background = '#000000';
          }
          document.body.style.overflow = 'auto';
        }
        
        // Gestion des liens internes vs externes
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Scroll smooth avec offset pour la navbar
            const navbarHeight = navbarOval.offsetHeight + 20;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
        // Les liens externes se comportent normalement
      });
    });
  }
  
  // Carousel
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    let isTransitioning = false;
    
    function showSlide(index) {
      if (isTransitioning) return;
      
      isTransitioning = true;
      
      // Retirer la classe active de tous les slides
      slides.forEach(slide => slide.classList.remove('active'));
      
      // Ajouter la classe active au slide actuel
      slides[index].classList.add('active');
      
      // Réinitialiser l'index si nécessaire
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }
      
      // Permettre la transition après un délai
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    }
    
    function nextSlide() {
      showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
      showSlide(currentSlide - 1);
    }
    
    // Auto-play avec pause au survol
    let autoPlayInterval = setInterval(nextSlide, 4000);
    
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 4000);
    });
    
    // Navigation clavier
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Initialisation du premier slide
    showSlide(0);
  }
});

// ===== FONCTIONS UTILITAIRES MOBILE =====

// Détection du support tactile
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Optimisation des images sur mobile
function optimizeImagesForMobile() {
  if (!isMobile) return;
  
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Ajouter lazy loading sur mobile
    img.loading = 'lazy';
    
    // Optimiser le rendu des images
    img.style.imageRendering = 'optimizeQuality';
  });
}

// Gestion de la mémoire sur mobile
function optimizeMemoryUsage() {
  if (!isMobile) return;
  
  // Nettoyer les intervalles inutilisés
  const intervals = window.setInterval(() => {}, 999999);
  for (let i = 1; i <= intervals; i++) {
    window.clearInterval(i);
  }
  
  // Optimiser les animations CSS
  const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
  animatedElements.forEach(element => {
    element.style.willChange = 'auto';
  });
}

// Appel des optimisations après un délai
setTimeout(() => {
  if (isMobile) {
    optimizeImagesForMobile();
    optimizeMemoryUsage();
  }
}, 2000);