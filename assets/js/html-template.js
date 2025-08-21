// HTML template generation
export function generateHTML(isDevelopment) {
  return `
  <div class="bg-container">
    <div class="main-container">
    </div>
  </div>
  ${isDevelopment ? `
  <div class="dev-panel" id="devPanel" style="display: none;">
    <div class="dev-section">
      <h4>Game Mode</h4>
      <div class="mode-switcher">
        <span class="mode-label">Click</span>
        <label class="switch">
          <input type="checkbox" id="modeSwitcher">
          <span class="slider"></span>
        </label>
        <span class="mode-label">Auto</span>
      </div>
    </div>
    <div class="dev-section">
      <h4>Debug</h4>
      <label>
        <input type="checkbox" id="showBorders"> Показать рамки
      </label>
    </div>
  </div>
  <button class="dev-toggle" id="devToggle">DEV</button>
  ` : ''}
`;
}