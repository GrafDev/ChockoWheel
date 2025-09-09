// Development panel functionality

let devMode = false;

export function setupDevPanel(currentRegion, updateRegion, isDevelopment) {
  if (!isDevelopment) return;

  const devPanel = document.getElementById('devPanel');
  const showBordersCheckbox = document.getElementById('showBorders');

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
}