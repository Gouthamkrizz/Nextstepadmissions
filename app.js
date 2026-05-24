/* NextStep Admissions - Custom Interactive Logic Script */

document.addEventListener('DOMContentLoaded', () => {
  
  // Visitor Tracking Logic (Stored locally in localStorage)
  let totalViews = localStorage.getItem('nextstep_total_views');
  if (totalViews === null || parseInt(totalViews, 10) >= 1000) {
    totalViews = 0; // Reset seeded values to start fresh
  } else {
    totalViews = parseInt(totalViews, 10);
  }
  totalViews += 1;
  localStorage.setItem('nextstep_total_views', totalViews);

  let uniqueVisitors = localStorage.getItem('nextstep_unique_visitors');
  if (uniqueVisitors === null || parseInt(uniqueVisitors, 10) >= 500) {
    uniqueVisitors = 0; // Reset seeded values to start fresh
  } else {
    uniqueVisitors = parseInt(uniqueVisitors, 10);
  }
  
  if (!sessionStorage.getItem('nextstep_session_active')) {
    uniqueVisitors += 1;
    sessionStorage.setItem('nextstep_session_active', 'true');
    localStorage.setItem('nextstep_unique_visitors', uniqueVisitors);
  }

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

  // Lead Capturing Function
  const saveLead = (leadData) => {
    try {
      const storedLeads = localStorage.getItem('nextstep_leads');
      const leads = storedLeads ? JSON.parse(storedLeads) : [];
      
      const newLead = {
        id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...leadData
      };
      
      leads.unshift(newLead);
      localStorage.setItem('nextstep_leads', JSON.stringify(leads));
      
      // If admin dashboard is active, update the dashboard view immediately
      const dashboard = document.getElementById('admin-dashboard');
      if (dashboard && dashboard.classList.contains('active')) {
        renderAdminDashboard();
      }
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

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

      // Save lead locally
      saveLead({
        name,
        phone,
        college,
        course,
        message,
        source: 'Contact Form'
      });

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

      // Save lead locally
      saveLead({
        name,
        phone,
        college,
        course: 'N/A (Callback)',
        message: query,
        source: 'Callback Modal'
      });

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

  // ==========================================================================
  // Admin Portal & Lead Management Controller
  // ==========================================================================

  // Admin Elements
  const navAdminBtn = document.getElementById('nav-admin-btn');
  const footerAdminBtn = document.getElementById('footer-admin-btn');
  const adminLoginModal = document.getElementById('admin-login-modal');
  const adminLoginClose = document.getElementById('admin-login-close');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLoginError = document.getElementById('admin-login-error');
  const adminDashboard = document.getElementById('admin-dashboard');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');
  
  const adminSearch = document.getElementById('admin-search');
  const adminFilterCollege = document.getElementById('admin-filter-college');
  const adminExportBtn = document.getElementById('admin-export-btn');
  const adminClearBtn = document.getElementById('admin-clear-btn');
  const adminLeadsTbody = document.getElementById('admin-leads-tbody');
  const adminEmptyState = document.getElementById('admin-empty-state');

  // Admin Credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'nextstep2026'
  };

  // Helper: Escape HTML strings to prevent XSS
  const escapeHTML = (str) => {
    if (!str) return '';
    return str.toString().replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };

  // Open Admin Login Modal
  const openLoginModal = (e) => {
    if (e) e.preventDefault();
    
    // If already logged in, bypass login and show dashboard
    if (sessionStorage.getItem('nextstep_admin_logged') === 'true') {
      showDashboard();
      return;
    }
    
    if (adminLoginModal) {
      adminLoginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Admin Login Modal
  const closeLoginModal = () => {
    if (adminLoginModal) {
      adminLoginModal.classList.remove('active');
      document.body.style.overflow = '';
      if (adminLoginForm) adminLoginForm.reset();
      if (adminLoginError) adminLoginError.style.display = 'none';
    }
  };

  // Show Admin Dashboard
  const showDashboard = () => {
    if (adminDashboard) {
      adminDashboard.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderAdminDashboard();
    }
  };

  // Hide Admin Dashboard
  const hideDashboard = () => {
    if (adminDashboard) {
      adminDashboard.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Render Dashboard Table and Stats
  const renderAdminDashboard = () => {
    if (!adminLeadsTbody) return;

    const storedLeads = localStorage.getItem('nextstep_leads');
    const leads = storedLeads ? JSON.parse(storedLeads) : [];

    // 1. Calculate and Update Stats
    const totalCount = leads.length;
    const srmCount = leads.filter(l => l.college === 'SRM Institute of Science and Technology').length;
    const acharyaCount = leads.filter(l => l.college === 'Acharya Institutes').length;
    const otherCount = totalCount - srmCount - acharyaCount;

    const totalEl = document.getElementById('stat-total-leads');
    const srmEl = document.getElementById('stat-srm-leads');
    const acharyaEl = document.getElementById('stat-acharya-leads');
    const otherEl = document.getElementById('stat-other-leads');
    const viewsEl = document.getElementById('stat-total-views');
    const uniqueEl = document.getElementById('stat-unique-visitors');

    if (totalEl) totalEl.textContent = totalCount;
    if (srmEl) srmEl.textContent = srmCount;
    if (acharyaEl) acharyaEl.textContent = acharyaCount;
    if (otherEl) otherEl.textContent = otherCount;
    if (viewsEl) viewsEl.textContent = localStorage.getItem('nextstep_total_views') || '0';
    if (uniqueEl) uniqueEl.textContent = localStorage.getItem('nextstep_unique_visitors') || '0';

    // 2. Filter Leads
    const searchQuery = adminSearch ? adminSearch.value.trim().toLowerCase() : '';
    const collegeFilter = adminFilterCollege ? adminFilterCollege.value : 'all';

    const filteredLeads = leads.filter(lead => {
      // Apply Search Filter
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery) ||
        lead.phone.toLowerCase().includes(searchQuery) ||
        (lead.course && lead.course.toLowerCase().includes(searchQuery)) ||
        (lead.message && lead.message.toLowerCase().includes(searchQuery));

      // Apply College Filter
      let matchesCollege = true;
      if (collegeFilter !== 'all') {
        if (collegeFilter === 'other') {
          // Check if it's NOT in the main listed colleges
          const mainColleges = [
            'SRM Institute of Science and Technology',
            'VIT University, Vellore',
            'Acharya Institutes',
            'RV College of Engineering'
          ];
          matchesCollege = !mainColleges.includes(lead.college);
        } else {
          matchesCollege = lead.college === collegeFilter;
        }
      }

      return matchesSearch && matchesCollege;
    });

    // 3. Render Table rows
    adminLeadsTbody.innerHTML = '';
    
    const tableEl = document.querySelector('.admin-leads-table');
    if (filteredLeads.length === 0) {
      if (adminEmptyState) adminEmptyState.style.display = 'flex';
      if (tableEl) tableEl.style.display = 'none';
    } else {
      if (adminEmptyState) adminEmptyState.style.display = 'none';
      if (tableEl) tableEl.style.display = 'table';

      filteredLeads.forEach(lead => {
        const dateObj = new Date(lead.timestamp);
        const dateStr = isNaN(dateObj.getTime()) 
          ? 'N/A' 
          : dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td data-label="Date & Time" class="lead-date">${dateStr}</td>
          <td data-label="Name" style="font-weight: 600;">${escapeHTML(lead.name)}</td>
          <td data-label="Phone" class="lead-phone"><a href="tel:${lead.phone}" style="color: var(--color-neon-lime); text-decoration: underline;">${escapeHTML(lead.phone)}</a></td>
          <td data-label="College Preference">${escapeHTML(lead.college)}</td>
          <td data-label="Course">${escapeHTML(lead.course)}</td>
          <td data-label="Message"><div class="lead-message-text">${escapeHTML(lead.message)}</div></td>
          <td data-label="Source"><span class="source-badge ${lead.source === 'Contact Form' ? 'contact-form' : 'callback-modal'}">${lead.source}</span></td>
          <td data-label="Actions">
            <button class="btn-delete" data-id="${lead.id}" title="Delete Lead">✕</button>
          </td>
        `;
        adminLeadsTbody.appendChild(tr);
      });

      // Add delete click handlers
      const deleteButtons = adminLeadsTbody.querySelectorAll('.btn-delete');
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const leadId = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this lead?')) {
            deleteLead(leadId);
          }
        });
      });
    }
  };

  // Delete Individual Lead
  const deleteLead = (leadId) => {
    try {
      const storedLeads = localStorage.getItem('nextstep_leads');
      if (!storedLeads) return;

      let leads = JSON.parse(storedLeads);
      leads = leads.filter(l => l.id !== leadId);
      localStorage.setItem('nextstep_leads', JSON.stringify(leads));
      renderAdminDashboard();
    } catch (e) {
      console.error('Error deleting lead:', e);
    }
  };

  // Bind Login Trigger Click Events
  if (navAdminBtn) navAdminBtn.addEventListener('click', openLoginModal);
  if (footerAdminBtn) footerAdminBtn.addEventListener('click', openLoginModal);
  
  if (adminLoginClose) adminLoginClose.addEventListener('click', closeLoginModal);
  
  // Close Login Modal on background click
  if (adminLoginModal) {
    adminLoginModal.addEventListener('click', (e) => {
      if (e.target === adminLoginModal) {
        closeLoginModal();
      }
    });
  }

  // Admin Login Form Submit
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const usernameInput = document.getElementById('admin-username').value.trim();
      const passwordInput = document.getElementById('admin-password').value.trim();

      if (usernameInput === ADMIN_CREDENTIALS.username && passwordInput === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('nextstep_admin_logged', 'true');
        closeLoginModal();
        showDashboard();
      } else {
        if (adminLoginError) adminLoginError.style.display = 'block';
      }
    });
  }

  // Logout Click Event
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('nextstep_admin_logged');
      hideDashboard();
    });
  }

  // Live Search Input Event
  if (adminSearch) {
    adminSearch.addEventListener('input', renderAdminDashboard);
  }

  // College Filter Dropdown Change Event
  if (adminFilterCollege) {
    adminFilterCollege.addEventListener('change', renderAdminDashboard);
  }

  // Clear All Leads Event
  if (adminClearBtn) {
    adminClearBtn.addEventListener('click', () => {
      if (confirm('WARNING: Are you sure you want to clear ALL captured leads? This action cannot be undone.')) {
        localStorage.setItem('nextstep_leads', JSON.stringify([]));
        renderAdminDashboard();
      }
    });
  }

  // Export CSV Action
  if (adminExportBtn) {
    adminExportBtn.addEventListener('click', () => {
      try {
        const storedLeads = localStorage.getItem('nextstep_leads');
        const leads = storedLeads ? JSON.parse(storedLeads) : [];
        
        if (leads.length === 0) {
          alert('No leads available to export.');
          return;
        }

        const csvRows = [
          ['Date', 'Name', 'Phone', 'Preferred College', 'Course', 'Message/Query', 'Source']
        ];

        leads.forEach(lead => {
          const dateObj = new Date(lead.timestamp);
          const dateStr = isNaN(dateObj.getTime()) ? 'N/A' : dateObj.toLocaleString();
          
          csvRows.push([
            dateStr,
            lead.name,
            lead.phone,
            lead.college,
            lead.course || 'N/A',
            lead.message || '',
            lead.source
          ].map(val => `"${val.toString().replace(/"/g, '""')}"`));
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `nextstep_leads_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error('Error exporting CSV:', e);
        alert('Failed to export CSV file.');
      }
    });
  }

  // Check login state on page load
  if (sessionStorage.getItem('nextstep_admin_logged') === 'true') {
    setTimeout(showDashboard, 100);
  }
});
