/* NextStep Admissions - Custom Interactive Logic Script */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Drawer Toggle
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Sticky Header Scroll Transition
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Scroll Spy (Active menu link indicator)
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');

  const scrollSpyOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  // 4. Double Campus Photo Carousel Handler (SRM & Acharya)
  const initCarousel = (carouselId) => {
    const container = document.getElementById(carouselId);
    if (!container) return;

    const slides = container.querySelectorAll('.carousel-slide');
    const prevBtn = container.querySelector('.carousel-btn.prev');
    const nextBtn = container.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let autoPlayTimer;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      
      // Wrap around bounds
      if (index >= slides.length) currentIndex = 0;
      else if (index < 0) currentIndex = slides.length - 1;
      else currentIndex = index;

      slides[currentIndex].classList.add('active');
    };

    const nextSlide = () => {
      showSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      showSlide(currentIndex - 1);
    };

    // Button controls
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        resetTimer();
      });
    }

    // Auto play every 6 seconds
    const startTimer = () => {
      autoPlayTimer = setInterval(nextSlide, 6000);
    };

    const resetTimer = () => {
      clearInterval(autoPlayTimer);
      startTimer();
    };

    startTimer();
  };

  // Initialize all four carousels
  initCarousel('srm-carousel');
  initCarousel('vit-carousel');
  initCarousel('acharya-carousel');
  initCarousel('rvce-carousel');

  // 5. College Application Button Actions
  const applyCollegeButtons = document.querySelectorAll('.apply-college-btn');
  const collegeSelectField = document.getElementById('form-college');

  applyCollegeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCollege = btn.getAttribute('data-college');
      
      if (collegeSelectField) {
        collegeSelectField.value = selectedCollege;
      }
      
      // Smooth scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 6. Free Consultation Callback Modal Handlers
  const openModalBtn = document.getElementById('hero-free-consultation');
  const closeModalBtn = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('consultation-modal');

  if (openModalBtn && modalOverlay && closeModalBtn) {
    openModalBtn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop page scroll
    });

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close on overlay backing click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // 7. WhatsApp Integration Form Submissions
  const whatsappNumber = '918089124409';

  // Contact Form Submission (Main Form)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const college = document.getElementById('form-college').value || 'Not Decided';
      const course = document.getElementById('form-course').value.trim() || 'General';
      const message = document.getElementById('form-message').value.trim() || 'No message provided';

      // Construct WhatsApp message template
      const template = `Hello NextStep Admissions!%0A%0A*New Admission Enquiry*%0A------------------------%0A• *Name:* ${encodeURIComponent(name)}%0A• *Phone:* ${encodeURIComponent(phone)}%0A• *College:* ${encodeURIComponent(college)}%0A• *Course:* ${encodeURIComponent(course)}%0A• *Message:* ${encodeURIComponent(message)}%0A------------------------%0APlease check and callback as soon as possible.`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${template}`;
      
      // Open link in new tab
      window.open(whatsappURL, '_blank');
      
      // Reset form
      contactForm.reset();
    });
  }

  // Modal Request Callback Form Submission
  const modalForm = document.getElementById('modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('modal-name').value.trim();
      const phone = document.getElementById('modal-phone').value.trim();
      const college = document.getElementById('modal-college').value || 'Not Decided';
      const query = document.getElementById('modal-message').value.trim() || 'Requested free admission consultation callback.';

      // Construct WhatsApp message template
      const template = `Hello NextStep Admissions!%0A%0A*Free Consultation Request*%0A------------------------%0A• *Name:* ${encodeURIComponent(name)}%0A• *Phone:* ${encodeURIComponent(phone)}%0A• *College Choice:* ${encodeURIComponent(college)}%0A• *Query:* ${encodeURIComponent(query)}%0A------------------------%0APlease arrange a callback scheduler.`;

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${template}`;
      
      // Close modal
      if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      // Open WhatsApp Link
      window.open(whatsappURL, '_blank');
      
      // Reset Form
      modalForm.reset();
    });
  }

  // 8. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animation triggered to prevent re-triggering on scroll back
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
});
