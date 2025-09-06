// Development panel functionality

let devMode = false;

export function setupDevPanel(currentRegion, updateRegion, isDevelopment) {
  if (!isDevelopment) return;

  console.log('Setting up dev panel for region:', currentRegion);

  const devPanel = document.getElementById('devPanel');
  const regionSelector = document.getElementById('regionSelector');
  const showBordersCheckbox = document.getElementById('showBorders');

  console.log('Dev panel elements:', { devPanel, regionSelector, showBordersCheckbox });

  if (!devPanel || !regionSelector) {
    console.error('Dev panel elements not found!');
    return;
  }

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