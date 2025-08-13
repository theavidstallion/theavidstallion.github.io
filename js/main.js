document.addEventListener('DOMContentLoaded', () => {
  // Footer year update
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#year, #year2, #year3, #year4')
    .forEach(span => span.textContent = currentYear);

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close mobile nav when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }

  const modal = document.getElementById('projectModal');
  const mTitle = document.getElementById('mTitle');
  const mDesc = document.getElementById('mDesc');
  const mImages = document.getElementById('mImages');
  const closeBtn = document.querySelector('.modal-close');

  if (modal) {
    // Open modal on card click
    document.querySelectorAll('.proj-card.clickable').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent modal from opening if a link is clicked
        if (e.target.tagName === 'A') {
          return;
        }
        
        const title = card.dataset.title || card.querySelector('h3,h4')?.innerText || '';
        const desc = card.dataset.desc || '';
        const images = (card.dataset.images || '').split(',')
          .map(img => img.trim())
          .filter(Boolean);

        mTitle.textContent = title;
        mDesc.textContent = desc;
        mImages.innerHTML = '';

        // Load images into modal with improved loading
        if (images.length > 0) {
          images.forEach((src, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'position: relative; overflow: hidden; border-radius: 12px; cursor: pointer;';
            
            const imgEl = document.createElement('img');
            imgEl.src = src;
            imgEl.alt = `${title} - Image ${index + 1}`;
            imgEl.loading = "lazy";
            imgEl.style.cssText = 'width: 100%; height: 180px; object-fit: cover; transition: transform 0.3s ease;';
            
            // Add loading state
            imgEl.addEventListener('load', () => {
              imgContainer.classList.add('loaded');
            });
            
            // Add click handler for full-screen view
            imgContainer.addEventListener('click', (e) => {
              e.stopPropagation();
              openFullscreenImage(src, `${title} - Image ${index + 1}`);
            });
            
            // Add hover effect
            imgContainer.addEventListener('mouseenter', () => {
              imgEl.style.transform = 'scale(1.05)';
            });
            
            imgContainer.addEventListener('mouseleave', () => {
              imgEl.style.transform = 'scale(1)';
            });
            
            imgContainer.appendChild(imgEl);
            mImages.appendChild(imgContainer);
          });
        } else {
          const fallback = document.createElement('div');
          fallback.style.cssText = 'text-align: center; padding: 40px; color: var(--muted);';
          fallback.innerHTML = '<p>📷 No images available for this project.</p>';
          mImages.appendChild(fallback);
        }

        // Show modal with enhanced animation
        modal.classList.remove('hidden');
        modal.classList.remove('modal-closing');
        modal.classList.add('modal-opening');
        document.body.style.overflow = 'hidden';
      });
    });

    // Enhanced close modal function
    const closeModal = () => {
      modal.classList.remove('modal-opening');
      modal.classList.add('modal-closing');
      
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('modal-closing');
        document.body.style.overflow = '';
      }, 200);
    };

    closeBtn?.addEventListener('click', closeModal);

    // Click outside modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // Full-screen image functionality
  function openFullscreenImage(src, alt) {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(10px);
    `;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 20px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      z-index: 10001;
    `;

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
      closeBtn.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
      closeBtn.style.transform = 'scale(1)';
    });

    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    `;

    // Create image
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transform: scale(0.9);
      transition: transform 0.3s ease;
    `;

    // Close overlay function
    const closeOverlay = () => {
      overlay.style.opacity = '0';
      img.style.transform = 'scale(0.9)';
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }, 300);
    };

    // Add event listeners
    closeBtn.addEventListener('click', closeOverlay);
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeOverlay();
      }
    });

    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeOverlay();
        document.removeEventListener('keydown', escapeHandler);
      }
    });

    // Add elements to overlay
    imgContainer.appendChild(img);
    overlay.appendChild(closeBtn);
    overlay.appendChild(imgContainer);
    
    // Add to body and show
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Trigger animations
    setTimeout(() => {
      overlay.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 10);
  }
});
