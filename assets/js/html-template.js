// HTML template generation
export function generateHTML(isDevelopment) {
  return `
  <div class="main-container">
    <!-- Page 1: Wheel Screen -->
    <div class="page" id="wheelPage">
      <div class="header">
        <div class="logo">
          <div class="logo1">
            <img src=./images/logo1-part1.png" alt="Logo1 Part 1" class="logo1-part1">
            <img src=./images/logo1-part2.png" alt="Logo1 Part 2" class="logo1-part2">
          </div>
        </div>
        <div class="nav-buttons">
          <button class="how-to-play-btn">How to play?</button>
          <div class="counter">627 154: 19</div>
          <button class="fullscreen-btn">⛶</button>
        </div>
      </div>
      
      <div class="main-box">
        <div class="box1">
          <div class="logo2">
            <img src=./images/logo2-part1.png" alt="Logo2 Part 1" class="logo2-part1">
            <img src=./images/logo2-part2.png" alt="Logo2 Part 2" class="logo2-part2">
          </div>
        </div>
        
        <div class="box2">
          <div class="chicken-container">
            <img src=./images/chicken-part1.png" alt="Chicken Part 1" class="chicken-part1">
            <img src=./images/chicken-part2.png" alt="Chicken Part 2" class="chicken-part2">
          </div>
        </div>
        
        <div class="game-box">
          <!-- Wheel and spin button will be here -->
        </div>
      </div>
    </div>
    
    <!-- Page 2: Road Screen -->
    <div class="page" id="roadPage" style="display: none;">
      <div class="header">
        <div class="logo">
          <div class="logo1">
            <img src=./images/logo1-part1.png" alt="Logo1 Part 1" class="logo1-part1">
            <img src=./images/logo1-part2.png" alt="Logo1 Part 2" class="logo1-part2">
          </div>
        </div>
        <div class="nav-buttons">
          <button class="how-to-play-btn">How to play?</button>
          <div class="counter">627 154: 19</div>
          <button class="fullscreen-btn">⛶</button>
        </div>
      </div>
      
      <div class="main-box">
        <!-- Road content will be here -->
      </div>
    </div>
    
    <!-- Page 3: Bank App Screen -->
    <div class="page" id="bankPage" style="display: none;">
      <!-- Bank app content will be here -->
    </div>
    
    <!-- Page 4: Download Screen -->
    <div class="page" id="downloadPage" style="display: none;">
      <!-- Download content will be here -->
    </div>
  </div>
  ${isDevelopment ? `
  <div class="dev-trigger" id="devTrigger"></div>
  <div class="dev-panel" id="devPanel">
    <div class="dev-section">
      <h4>Debug</h4>
      <label>
        <input type="checkbox" id="showBorders"> Показать рамки
      </label>
    </div>
  </div>
  ` : ''}
`;
}