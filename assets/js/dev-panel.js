// Development panel functionality

let devMode = false;

export function setupDevPanel(currentRegion, updateRegion, isDevelopment) {
  if (!isDevelopment) return;

  const devPanel = document.getElementById('devPanel');
  const showBordersCheckbox = document.getElementById('showBorders');
  const startPageSelect = document.getElementById('startPage');

  if (!devPanel) {
    console.error('Dev panel not found!');
    return;
  }

  // Borders checkbox handler (if exists)
  if (showBordersCheckbox) {
    showBordersCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('dev-borders');
      } else {
        document.body.classList.remove('dev-borders');
      }
    });
  }

  // Page switching functionality
  if (startPageSelect) {
    // Load saved start page from localStorage
    const savedStartPage = localStorage.getItem('devStartPage');
    if (savedStartPage) {
      startPageSelect.value = savedStartPage;
    }

    // Auto-switch on select change
    startPageSelect.addEventListener('change', () => {
      const selectedPage = startPageSelect.value;
      localStorage.setItem('devStartPage', selectedPage);
      switchToPage(selectedPage);
    });

    // Apply saved start page on load
    if (savedStartPage) {
      switchToPage(savedStartPage);
    }
  }
}

export function switchToPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.display = 'none';
  });

  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'block';
    
    // Add entrance animation for roadPage
    if (pageId === 'roadPage') {
      targetPage.classList.add('page-entering');
      // Remove class after animation completes
      setTimeout(() => {
        targetPage.classList.remove('page-entering');
      }, 1500);
    }
    
    console.log(`Switched to page: ${pageId}`);
    
    // Stop/start animations based on page
    if (pageId !== 'wheelPage') {
      // Stop all background animations for non-wheel pages
      const fireLayer = document.querySelector('.fire-sparks-layer');
      const bgAnimated = document.querySelector('.bg-part1-animated');
      
      if (fireLayer) {
        fireLayer.style.display = 'none';
        // Kill all canvas animations
        const canvases = fireLayer.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.display = 'none';
        });
      }
      
      if (bgAnimated) {
        bgAnimated.style.display = 'none';
        bgAnimated.style.animation = 'none';
      }
      
      // Force stop JS animations
      if (window.fireSparksAnimation && window.fireSparksAnimation.destroy) {
        window.fireSparksAnimation.destroy();
      }
      if (window.persistentAnimations && window.persistentAnimations.stop) {
        window.persistentAnimations.stop();
      }
      
    } else {
      // Restore animations for wheel page
      const fireLayer = document.querySelector('.fire-sparks-layer');
      const bgAnimated = document.querySelector('.bg-part1-animated');
      
      if (fireLayer) fireLayer.style.display = 'block';
      if (bgAnimated) bgAnimated.style.display = 'block';
    }
  } else {
    console.error(`Page not found: ${pageId}`);
  }
}