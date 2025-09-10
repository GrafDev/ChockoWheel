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
    console.log(`Switched to page: ${pageId}`);
  } else {
    console.error(`Page not found: ${pageId}`);
  }
}