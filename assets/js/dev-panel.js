// Development panel functionality

let devMode = false;

export function setupDevPanel(currentRegion, updateRegion, isDevelopment) {
  if (!isDevelopment) return;

  console.log('Setting up dev panel for region:', currentRegion);

  const devTrigger = document.getElementById('devTrigger');
  const devPanel = document.getElementById('devPanel');
  const regionSelector = document.getElementById('regionSelector');
  const showBordersCheckbox = document.getElementById('showBorders');

  console.log('Dev panel elements:', { devTrigger, devPanel, regionSelector, showBordersCheckbox });

  if (!devTrigger || !devPanel || !regionSelector) {
    console.error('Dev panel elements not found!');
    return;
  }

  // Show/hide panel on hover
  devTrigger.addEventListener('mouseenter', () => {
    console.log('Dev trigger hovered');
    devPanel.classList.add('show');
  });

  devPanel.addEventListener('mouseenter', () => {
    devPanel.classList.add('show');
  });

  devPanel.addEventListener('mouseleave', () => {
    devPanel.classList.remove('show');
  });

  devTrigger.addEventListener('mouseleave', () => {
    // Small delay to allow moving to panel
    setTimeout(() => {
      if (!devPanel.matches(':hover')) {
        devPanel.classList.remove('show');
      }
    }, 100);
  });

  // Initialize selector based on current region
  regionSelector.value = currentRegion;

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

  // Region selector handler
  regionSelector.addEventListener('change', (e) => {
    const newRegion = e.target.value;
    console.log('Region changed to:', newRegion);
    
    // Save region and reload
    localStorage.setItem('chockoWheel_region', newRegion);
    location.reload();
  });

  return { currentRegion };
}