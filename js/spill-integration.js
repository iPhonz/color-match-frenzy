/**
 * Color Match Frenzy - SPILL Platform Integration
 * Handles integration with SPILL social platform.
 */

class SpillIntegration {
    constructor() {
        this.isLoggedIn = false;
        this.username = '';
        this.userId = '';
        this.friendsList = [];
        this.userScores = {};
        this.achievements = [];
    }
    
    /**
     * Initialize SPILL integration
     */
    init() {
        console.log('Initializing SPILL integration...');
        
        // Check for existing login
        const savedUser = localStorage.getItem('spillUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            this.login(userData.username);
        }
        
        console.log('SPILL integration initialized successfully!');
    }
    
    /**
     * Log in to SPILL
     */
    login(username) {
        console.log(`Logging in to SPILL as ${username}...`);
        
        // In a real implementation, this would call the SPILL authentication API
        // For this demo, we'll just simulate a successful login
        
        this.isLoggedIn = true;
        this.username = username;
        this.userId = `user_${Date.now()}`;
        
        // Save login info
        localStorage.setItem('spillUser', JSON.stringify({
            username: this.username,
            userId: this.userId
        }));
        
        // Load user data
        this.loadUserData();
        
        console.log(`Successfully logged in as ${username}`);
        
        return true;
    }
    
    /**
     * Log out from SPILL
     */
    logout() {
        console.log('Logging out from SPILL...');
        
        // In a real implementation, this would call the SPILL logout API
        // For this demo, we'll just clear the saved data
        
        this.isLoggedIn = false;
        this.username = '';
        this.userId = '';
        this.friendsList = [];
        this.userScores = {};
        this.achievements = [];
        
        // Remove saved login info
        localStorage.removeItem('spillUser');
        
        console.log('Successfully logged out');
        
        return true;
    }
    
    /**
     * Load user data from SPILL
     */
    loadUserData() {
        console.log('Loading user data from SPILL...');
        
        // In a real implementation, this would call various SPILL APIs
        // For this demo, we'll load mock data
        
        // Load friends list
        this.friendsList = [
            { id: 'friend1', username: 'SpillMaster' },
            { id: 'friend2', username: 'ColorFrenzy' },
            { id: 'friend3', username: 'MatchKing' },
            { id: 'friend4', username: 'PuzzleQueen' },
            { id: 'friend5', username: 'GamerPro' }
        ];
        
        // Load user scores
        this.userScores = {
            highScore: 15000,
            level: 20
        };
        
        // Load achievements
        this.achievements = [
            { id: 'ach1', title: 'First Match', description: 'Complete your first match', unlocked: true },
            { id: 'ach2', title: 'Combo Master', description: 'Make a combo of 5 or more matches', unlocked: true },
            { id: 'ach3', title: 'Level 10', description: 'Reach level 10', unlocked: true },
            { id: 'ach4', title: 'Score 10,000', description: 'Score 10,000 points', unlocked: true },
            { id: 'ach5', title: 'Use All Boosters', description: 'Use all booster types', unlocked: false }
        ];
        
        console.log('User data loaded successfully!');
    }
    
    /**
     * Share score on SPILL
     */
    shareScore(score, level) {
        if (!this.isLoggedIn) {
            console.warn('Cannot share score: not logged in to SPILL');
            return false;
        }
        
        console.log(`Sharing score ${score} at level ${level} on SPILL...`);
        
        // In a real implementation, this would call the SPILL sharing API
        // For this demo, we'll just log the action
        
        // Update high score if needed
        if (score > this.userScores.highScore) {
            this.userScores.highScore = score;
        }
        
        // Update max level if needed
        if (level > this.userScores.level) {
            this.userScores.level = level;
        }
        
        console.log('Score shared successfully!');
        
        return true;
    }
    
    /**
     * Open SPILL feed
     */
    openSpillFeed() {
        console.log('Opening SPILL feed...');
        
        // In a real implementation, this would open the SPILL feed in the app or a webview
        // For this demo, we'll just log the action and open the SPILL website
        window.open('https://www.spill.com', '_blank');
        
        return true;
    }
    
    /**
     * Open SPILL app
     */
    openSpillApp() {
        console.log('Opening SPILL app...');
        
        // In a real implementation, this would use deep linking to open the SPILL app
        // For this demo, we'll just log the action and open the SPILL website
        window.open('https://www.spill.com', '_blank');
        
        return true;
    }
    
    /**
     * Get friends leaderboard
     */
    getFriendsLeaderboard() {
        if (!this.isLoggedIn) {
            console.warn('Cannot get friends leaderboard: not logged in to SPILL');
            return [];
        }
        
        console.log('Getting friends leaderboard from SPILL...');
        
        // In a real implementation, this would call the SPILL leaderboard API
        // For this demo, we'll return mock data
        
        const leaderboardData = [
            { rank: 1, username: 'SpillMaster', avatar: 'user1.jpg', score: 25000 },
            { rank: 2, username: 'ColorFrenzy', avatar: 'user2.jpg', score: 22500 },
            { rank: 3, username: 'MatchKing', avatar: 'user3.jpg', score: 20800 },
            { rank: 4, username: 'PuzzleQueen', avatar: 'user4.jpg', score: 19200 },
            { rank: 5, username: 'GamerPro', avatar: 'user5.jpg', score: 18500 },
            { rank: 6, username: this.username, avatar: 'user6.jpg', score: 15000 }
        ];
        
        return leaderboardData;
    }
    
    /**
     * Get global leaderboard
     */
    getGlobalLeaderboard() {
        console.log('Getting global leaderboard from SPILL...');
        
        // In a real implementation, this would call the SPILL leaderboard API
        // For this demo, we'll return mock data
        
        const leaderboardData = [
            { rank: 1, username: 'GlobalChamp', avatar: 'user1.jpg', score: 45000 },
            { rank: 2, username: 'MasterMatcher', avatar: 'user2.jpg', score: 42800 },
            { rank: 3, username: 'ColorGuru', avatar: 'user3.jpg', score: 39500 },
            { rank: 4, username: 'PuzzleWizard', avatar: 'user4.jpg', score: 36200 },
            { rank: 5, username: 'SwipeLegend', avatar: 'user5.jpg', score: 35000 },
            { rank: 6, username: 'TileKing', avatar: 'user6.jpg', score: 33800 },
            { rank: 7, username: 'MatchPro', avatar: 'user7.jpg', score: 32600 },
            { rank: 8, username: 'FrenzyMaster', avatar: 'user8.jpg', score: 30400 },
            { rank: 9, username: 'ColorNinja', avatar: 'user9.jpg', score: 28700 },
            { rank: 10, username: 'PuzzleQueen', avatar: 'user10.jpg', score: 27500 }
        ];
        
        // Add the current user if they're not in the top 10
        if (!leaderboardData.some(entry => entry.username === this.username)) {
            leaderboardData.push({
                rank: 125,
                username: this.username,
                avatar: 'user.jpg',
                score: this.userScores.highScore || 15000
            });
        }
        
        return leaderboardData;
    }
    
    /**
     * Invite friends to play the game
     */
    inviteFriends() {
        if (!this.isLoggedIn) {
            console.warn('Cannot invite friends: not logged in to SPILL');
            return false;
        }
        
        console.log('Inviting friends to play Color Match Frenzy...');
        
        // In a real implementation, this would open the SPILL friend picker UI
        // For this demo, we'll just log the action
        
        console.log('Invitation sent successfully!');
        
        return true;
    }
    
    /**
     * Challenge friends to beat a score
     */
    challengeFriends(score) {
        if (!this.isLoggedIn) {
            console.warn('Cannot challenge friends: not logged in to SPILL');
            return false;
        }
        
        console.log(`Challenging friends to beat score ${score}...`);
        
        // In a real implementation, this would open the SPILL friend picker UI
        // For this demo, we'll just log the action
        
        console.log('Challenge sent successfully!');
        
        return true;
    }
    
    /**
     * Unlock an achievement
     */
    unlockAchievement(achievementId) {
        if (!this.isLoggedIn) {
            console.warn('Cannot unlock achievement: not logged in to SPILL');
            return false;
        }
        
        console.log(`Unlocking achievement ${achievementId}...`);
        
        // Find the achievement
        const achievement = this.achievements.find(ach => ach.id === achievementId);
        
        if (!achievement) {
            console.warn(`Achievement ${achievementId} not found`);
            return false;
        }
        
        // Check if already unlocked
        if (achievement.unlocked) {
            console.log(`Achievement ${achievementId} already unlocked`);
            return true;
        }
        
        // Unlock the achievement
        achievement.unlocked = true;
        
        // In a real implementation, this would call the SPILL achievements API
        // For this demo, we'll just log the action
        
        console.log(`Achievement "${achievement.title}" unlocked successfully!`);
        
        return true;
    }
}

// Initialize SPILL integration
window.spillIntegration = new SpillIntegration();
document.addEventListener('DOMContentLoaded', () => {
    window.spillIntegration.init();
});