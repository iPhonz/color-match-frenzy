/**
 * Color Match Frenzy - UI Controller
 * Handles UI interactions and screen transitions.
 */

class UIController {
    constructor(game) {
        this.game = game;
        this.currentScreen = 'splash';
        
        // Bind methods
        this.init = this.init.bind(this);
        this.showScreen = this.showScreen.bind(this);
        this.handlePlayButton = this.handlePlayButton.bind(this);
        this.handleSpillLoginButton = this.handleSpillLoginButton.bind(this);
        this.handleStartGameButton = this.handleStartGameButton.bind(this);
        this.handleMenuButton = this.handleMenuButton.bind(this);
        this.handleShareButton = this.handleShareButton.bind(this);
        this.handleSpillFeedButton = this.handleSpillFeedButton.bind(this);
        this.handleNextLevelButton = this.handleNextLevelButton.bind(this);
        this.handleMainMenuButton = this.handleMainMenuButton.bind(this);
        this.handleWatchAdButton = this.handleWatchAdButton.bind(this);
        this.handleShareContinueButton = this.handleShareContinueButton.bind(this);
        this.handleRestartButton = this.handleRestartButton.bind(this);
        this.handleLeaderboardButton = this.handleLeaderboardButton.bind(this);
        this.handleSettingsButton = this.handleSettingsButton.bind(this);
        this.handleBackFromLeaderboard = this.handleBackFromLeaderboard.bind(this);
        this.handleBackFromSettings = this.handleBackFromSettings.bind(this);
        this.handleFriendsTab = this.handleFriendsTab.bind(this);
        this.handleGlobalTab = this.handleGlobalTab.bind(this);
        this.handleInviteFriendsButton = this.handleInviteFriendsButton.bind(this);
        this.handleChallengeButton = this.handleChallengeButton.bind(this);
        this.handleSpillButton = this.handleSpillButton.bind(this);
        this.handleLoginModalClose = this.handleLoginModalClose.bind(this);
        this.handleLoginConfirm = this.handleLoginConfirm.bind(this);
    }
    
    /**
     * Initialize UI and set up event listeners
     */
    init() {
        console.log('Initializing UI...');
        
        // Set up button event listeners
        
        // Splash screen
        document.getElementById('play-button').addEventListener('click', this.handlePlayButton);
        document.getElementById('spill-login-button').addEventListener('click', this.handleSpillLoginButton);
        
        // Main menu
        document.getElementById('start-game-button').addEventListener('click', this.handleStartGameButton);
        document.getElementById('leaderboard-button').addEventListener('click', this.handleLeaderboardButton);
        document.getElementById('settings-button').addEventListener('click', this.handleSettingsButton);
        document.getElementById('spill-button').addEventListener('click', this.handleSpillButton);
        
        // Game screen
        document.getElementById('menu-button').addEventListener('click', this.handleMenuButton);
        document.getElementById('share-button').addEventListener('click', this.handleShareButton);
        document.getElementById('spill-feed-button').addEventListener('click', this.handleSpillFeedButton);
        
        // Level complete screen
        document.getElementById('share-score-button').addEventListener('click', this.handleShareButton);
        document.getElementById('next-level-button').addEventListener('click', this.handleNextLevelButton);
        document.getElementById('main-menu-button').addEventListener('click', this.handleMainMenuButton);
        
        // Game over screen
        document.getElementById('watch-ad-button').addEventListener('click', this.handleWatchAdButton);
        document.getElementById('share-continue-button').addEventListener('click', this.handleShareContinueButton);
        document.getElementById('restart-button').addEventListener('click', this.handleRestartButton);
        
        // Leaderboard screen
        document.getElementById('back-from-leaderboard').addEventListener('click', this.handleBackFromLeaderboard);
        document.getElementById('friends-tab').addEventListener('click', this.handleFriendsTab);
        document.getElementById('global-tab').addEventListener('click', this.handleGlobalTab);
        document.getElementById('invite-friends-button').addEventListener('click', this.handleInviteFriendsButton);
        document.getElementById('challenge-button').addEventListener('click', this.handleChallengeButton);
        
        // Settings screen
        document.getElementById('back-from-settings').addEventListener('click', this.handleBackFromSettings);
        
        // Login modal
        document.querySelector('.close-modal').addEventListener('click', this.handleLoginModalClose);
        document.getElementById('login-confirm').addEventListener('click', this.handleLoginConfirm);
        
        console.log('UI initialized successfully!');
    }
    
    /**
     * Show a specific screen
     */
    showScreen(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        document.getElementById(screenId).classList.add('active');
        
        // Update current screen
        this.currentScreen = screenId;
        
        console.log(`Screen changed to: ${screenId}`);
    }
    
    /**
     * Show the loading overlay
     */
    showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
    
    /**
     * Hide the loading overlay
     */
    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }
    
    /**
     * Show the login modal
     */
    showLoginModal() {
        document.getElementById('login-modal').style.display = 'block';
    }
    
    /**
     * Hide the login modal
     */
    hideLoginModal() {
        document.getElementById('login-modal').style.display = 'none';
    }
    
    /**
     * Handle play button click on splash screen
     */
    handlePlayButton() {
        // If already logged in with SPILL, go to main menu
        if (window.spillIntegration && window.spillIntegration.isLoggedIn) {
            this.showScreen('main-menu');
        } else {
            // Otherwise, show the login modal
            this.showLoginModal();
        }
    }
    
    /**
     * Handle SPILL login button click
     */
    handleSpillLoginButton() {
        this.showLoginModal();
    }
    
    /**
     * Handle start game button click
     */
    handleStartGameButton() {
        // Start the game
        this.game.startGame();
        this.showScreen('game-screen');
    }
    
    /**
     * Handle menu button click in game
     */
    handleMenuButton() {
        // Pause the game and go to main menu
        this.game.state.gameStatus = 'paused';
        this.showScreen('main-menu');
    }
    
    /**
     * Handle share button click
     */
    handleShareButton() {
        // Call SPILL integration to share score
        if (window.spillIntegration) {
            window.spillIntegration.shareScore(this.game.state.score, this.game.state.level);
        }
        
        // Show share confirmation
        this.showShareConfirmation();
    }
    
    /**
     * Handle SPILL feed button click
     */
    handleSpillFeedButton() {
        // Open SPILL feed
        if (window.spillIntegration) {
            window.spillIntegration.openSpillFeed();
        }
    }
    
    /**
     * Handle next level button click
     */
    handleNextLevelButton() {
        // Start the next level
        this.game.nextLevel();
    }
    
    /**
     * Handle main menu button click
     */
    handleMainMenuButton() {
        this.showScreen('main-menu');
    }
    
    /**
     * Handle watch ad button click
     */
    handleWatchAdButton() {
        // Show loading overlay
        this.showLoading();
        
        // Simulate watching an ad
        setTimeout(() => {
            // Hide loading overlay
            this.hideLoading();
            
            // Add 5 more moves
            this.game.state.movesLeft += 5;
            
            // Update UI
            this.game.elements.movesDisplay.textContent = this.game.state.movesLeft;
            
            // Set game status back to playing
            this.game.state.gameStatus = 'playing';
            
            // Show game screen
            this.showScreen('game-screen');
        }, 2000);
    }
    
    /**
     * Handle share continue button click
     */
    handleShareContinueButton() {
        // Share score on SPILL
        if (window.spillIntegration) {
            window.spillIntegration.shareScore(this.game.state.score, this.game.state.level);
        }
        
        // Show share confirmation
        this.showShareConfirmation();
        
        // Add 3 more moves
        this.game.state.movesLeft += 3;
        
        // Update UI
        this.game.elements.movesDisplay.textContent = this.game.state.movesLeft;
        
        // Set game status back to playing
        this.game.state.gameStatus = 'playing';
        
        // Show game screen
        this.showScreen('game-screen');
    }
    
    /**
     * Handle restart button click
     */
    handleRestartButton() {
        // Restart the current level
        this.game.restartLevel();
    }
    
    /**
     * Handle leaderboard button click
     */
    handleLeaderboardButton() {
        // Load leaderboard data
        this.loadLeaderboardData('friends');
        
        // Show leaderboard screen
        this.showScreen('leaderboard-screen');
    }
    
    /**
     * Handle settings button click
     */
    handleSettingsButton() {
        this.showScreen('settings-screen');
    }
    
    /**
     * Handle back button click from leaderboard
     */
    handleBackFromLeaderboard() {
        this.showScreen('main-menu');
    }
    
    /**
     * Handle back button click from settings
     */
    handleBackFromSettings() {
        this.showScreen('main-menu');
    }
    
    /**
     * Handle friends tab click on leaderboard
     */
    handleFriendsTab() {
        // Update tab UI
        document.getElementById('friends-tab').classList.add('active');
        document.getElementById('global-tab').classList.remove('active');
        
        // Load friends leaderboard data
        this.loadLeaderboardData('friends');
    }
    
    /**
     * Handle global tab click on leaderboard
     */
    handleGlobalTab() {
        // Update tab UI
        document.getElementById('global-tab').classList.add('active');
        document.getElementById('friends-tab').classList.remove('active');
        
        // Load global leaderboard data
        this.loadLeaderboardData('global');
    }
    
    /**
     * Handle invite friends button click
     */
    handleInviteFriendsButton() {
        // Call SPILL integration to invite friends
        if (window.spillIntegration) {
            window.spillIntegration.inviteFriends();
        }
        
        // Show confirmation
        this.showShareConfirmation('Invitation sent!');
    }
    
    /**
     * Handle challenge button click
     */
    handleChallengeButton() {
        // Call SPILL integration to challenge friends
        if (window.spillIntegration) {
            window.spillIntegration.challengeFriends(this.game.state.score);
        }
        
        // Show confirmation
        this.showShareConfirmation('Challenge sent!');
    }
    
    /**
     * Handle SPILL button click
     */
    handleSpillButton() {
        // Open SPILL app
        if (window.spillIntegration) {
            window.spillIntegration.openSpillApp();
        } else {
            // If SPILL integration not available, open SPILL website
            window.open('https://www.spill.com', '_blank');
        }
    }
    
    /**
     * Handle login modal close button click
     */
    handleLoginModalClose() {
        this.hideLoginModal();
    }
    
    /**
     * Handle login confirm button click
     */
    handleLoginConfirm() {
        // Get username from input
        const username = document.getElementById('username-input').value;
        
        // Show loading overlay
        this.showLoading();
        
        // Simulate SPILL login
        setTimeout(() => {
            // Hide loading overlay
            this.hideLoading();
            
            // Hide login modal
            this.hideLoginModal();
            
            // Initialize SPILL integration with the username
            if (window.spillIntegration) {
                window.spillIntegration.login(username);
            }
            
            // Show main menu
            this.showScreen('main-menu');
        }, 1000);
    }
    
    /**
     * Load leaderboard data
     */
    loadLeaderboardData(type) {
        // Show loading overlay
        this.showLoading();
        
        // Get leaderboard container
        const leaderboardContainer = document.getElementById('leaderboard-container');
        
        // Clear existing entries
        leaderboardContainer.innerHTML = '';
        
        setTimeout(() => {
            // Get leaderboard data from SPILL integration
            let leaderboardData = [];
            
            if (window.spillIntegration) {
                if (type === 'friends') {
                    leaderboardData = window.spillIntegration.getFriendsLeaderboard();
                } else {
                    leaderboardData = window.spillIntegration.getGlobalLeaderboard();
                }
            } else {
                // Mock data if SPILL integration not available
                leaderboardData = [
                    { rank: 1, username: 'SpillMaster', avatar: 'user1.jpg', score: 25000 },
                    { rank: 2, username: 'ColorFrenzy', avatar: 'user2.jpg', score: 22500 },
                    { rank: 3, username: 'MatchKing', avatar: 'user3.jpg', score: 20800 },
                    { rank: 4, username: 'PuzzleQueen', avatar: 'user4.jpg', score: 19200 },
                    { rank: 5, username: 'GamerPro', avatar: 'user5.jpg', score: 18500 },
                    { rank: 6, username: 'TileSwiper', avatar: 'user6.jpg', score: 17600 },
                    { rank: 7, username: 'MatchMaster', avatar: 'user7.jpg', score: 16900 },
                    { rank: 8, username: 'ColorMatcher', avatar: 'user8.jpg', score: 15700 },
                    { rank: 9, username: 'PuzzleWiz', avatar: 'user9.jpg', score: 14500 },
                    { rank: 10, username: 'SwipeMaster', avatar: 'user10.jpg', score: 13200 }
                ];
            }
            
            // Create entries for each leaderboard item
            leaderboardData.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.className = 'leaderboard-entry';
                
                entryElement.innerHTML = `
                    <div class="entry-rank">${entry.rank}</div>
                    <div class="entry-user">
                        <div class="user-avatar" style="background-color: #${Math.floor(Math.random()*16777215).toString(16)}"></div>
                        <div class="user-name">${entry.username}</div>
                    </div>
                    <div class="entry-score">${entry.score.toLocaleString()}</div>
                `;
                
                leaderboardContainer.appendChild(entryElement);
            });
            
            // Hide loading overlay
            this.hideLoading();
        }, 1000);
    }
    
    /**
     * Show share confirmation
     */
    showShareConfirmation(message = 'Shared with SPILL!') {
        // Create a floating message element
        const confirmationElement = document.createElement('div');
        confirmationElement.className = 'share-confirm';
        confirmationElement.textContent = message;
        document.body.appendChild(confirmationElement);
        
        // Remove the element after animation completes
        setTimeout(() => {
            confirmationElement.remove();
        }, 2500);
    }
}

// Export the UI controller class
window.UIController = UIController;