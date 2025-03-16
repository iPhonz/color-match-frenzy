/**
 * Color Match Frenzy - Main Application
 * Initializes and manages the game, UI, and SPILL integration.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Color Match Frenzy...');
    
    // Create game instance
    const game = new ColorMatchFrenzy();
    
    // Create UI controller instance
    const ui = new UIController(game);
    
    // Initialize UI
    ui.init();
    
    // Initialize game
    game.init();
    
    // Expose instances to the window for debugging
    window.gameInstance = game;
    window.uiInstance = ui;
    
    console.log('Color Match Frenzy initialized successfully!');
});

// Handle service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}