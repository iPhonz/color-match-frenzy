/**
 * Color Match Frenzy - Game Core Logic
 * A mobile web match-3 puzzle game for the SPILL platform.
 */

class ColorMatchFrenzy {
    constructor() {
        // Game configuration
        this.config = {
            gridSize: 8,        // 8x8 grid
            colorVariants: 5,   // Number of different colors/tiles
            minMatchSize: 3,    // Minimum number of tiles for a match
            moveLimit: 15,      // Available moves per level
            goalPercentage: 66, // Percentage of score needed to clear level
            colors: ['red', 'yellow', 'green', 'blue', 'purple']
        };
        
        // Game state
        this.state = {
            level: 1,
            score: 0,
            movesMade: 0,
            movesLeft: this.config.moveLimit,
            goalProgress: 0,
            grid: [],
            selectedTile: null,
            gameStatus: 'ready', // ready, playing, paused, levelComplete, gameOver
            boosters: {
                lightning: 2,  // Clear a row
                hammer: 1,     // Remove single tile
                target: 3,     // Swap any two tiles
                star: 0,       // Random bonus points
                bomb: 1        // Clear an area
            },
            boosterActive: null,
            secondSelectedTile: null
        };
        
        // DOM elements
        this.elements = {
            gameBoard: document.getElementById('game-board'),
            levelDisplay: document.getElementById('level-display'),
            scoreDisplay: document.getElementById('score-display'),
            movesDisplay: document.getElementById('moves-display'),
            progressFill: document.getElementById('progress-fill'),
            finalScore: document.getElementById('final-score'),
            finalLevel: document.getElementById('final-level'),
            gameOverScore: document.getElementById('game-over-score'),
            gameOverLevel: document.getElementById('game-over-level'),
            boosterCounts: {
                lightning: document.getElementById('lightning-count'),
                hammer: document.getElementById('hammer-count'),
                target: document.getElementById('target-count'),
                star: document.getElementById('star-count'),
                bomb: document.getElementById('bomb-count')
            }
        };

        // Bind methods
        this.handleTileClick = this.handleTileClick.bind(this);
        this.handleBoosterClick = this.handleBoosterClick.bind(this);
    }
    
    /**
     * Initialize the game
     */
    init() {
        console.log("Initializing Color Match Frenzy...");
        
        // Create initial grid
        this.createNewGrid();
        
        // Set up tile click events
        this.elements.gameBoard.addEventListener('click', this.handleTileClick);
        
        // Set up booster click events
        const boosters = document.querySelectorAll('.booster');
        boosters.forEach(booster => {
            booster.addEventListener('click', this.handleBoosterClick);
        });
        
        // Update UI
        this.updateUI();
        
        console.log("Game initialized successfully!");
    }
    
    /**
     * Create a new game grid
     */
    createNewGrid() {
        console.log("Creating new game grid...");
        
        // Clear the game board
        this.elements.gameBoard.innerHTML = '';
        this.state.grid = [];
        
        // Create an 8x8 grid
        for (let row = 0; row < this.config.gridSize; row++) {
            const newRow = [];
            
            for (let col = 0; col < this.config.gridSize; col++) {
                // Generate a random color (0-4)
                const colorIndex = Math.floor(Math.random() * this.config.colorVariants);
                const color = this.config.colors[colorIndex];
                
                newRow.push({
                    color,
                    row,
                    col,
                    special: false, // For special tiles (like power-ups)
                    matched: false  // To mark matched tiles
                });
                
                // Create a tile element
                const tileElement = document.createElement('div');
                tileElement.className = `tile ${color}`;
                tileElement.dataset.row = row;
                tileElement.dataset.col = col;
                tileElement.classList.add('new'); // For animation
                
                // Add the tile to the game board
                this.elements.gameBoard.appendChild(tileElement);
            }
            
            this.state.grid.push(newRow);
        }
        
        // Check for initial matches and resolve them
        this.resolveInitialMatches();
        
        console.log("Game grid created successfully!");
    }
    
    /**
     * Check and resolve any matches that exist in the initial grid
     */
    resolveInitialMatches() {
        console.log("Resolving initial matches...");
        
        let matchesFound = true;
        
        // Continue resolving matches until no more are found
        while (matchesFound) {
            // Find all matches in the grid
            const matches = this.findAllMatches();
            
            if (matches.length > 0) {
                matchesFound = true;
                
                // Replace matched tiles with new ones
                this.replaceMatchedTiles(matches);
            } else {
                matchesFound = false;
            }
        }
        
        // Render the grid
        this.renderGrid();
        
        console.log("Initial matches resolved!");
    }
    
    /**
     * Find all matches in the current grid
     */
    findAllMatches() {
        const matches = [];
        
        // Check horizontal matches
        for (let row = 0; row < this.config.gridSize; row++) {
            for (let col = 0; col < this.config.gridSize - 2; col++) {
                const tile1 = this.state.grid[row][col];
                const tile2 = this.state.grid[row][col + 1];
                const tile3 = this.state.grid[row][col + 2];
                
                if (tile1.color === tile2.color && tile2.color === tile3.color) {
                    // Found a horizontal match of at least 3 tiles
                    const matchedTiles = [tile1, tile2, tile3];
                    
                    // Check if the match extends further
                    let nextCol = col + 3;
                    while (nextCol < this.config.gridSize && 
                           this.state.grid[row][nextCol].color === tile1.color) {
                        matchedTiles.push(this.state.grid[row][nextCol]);
                        nextCol++;
                    }
                    
                    matches.push(matchedTiles);
                    
                    // Skip the columns we've already matched
                    col = nextCol - 3;
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.config.gridSize; col++) {
            for (let row = 0; row < this.config.gridSize - 2; row++) {
                const tile1 = this.state.grid[row][col];
                const tile2 = this.state.grid[row + 1][col];
                const tile3 = this.state.grid[row + 2][col];
                
                if (tile1.color === tile2.color && tile2.color === tile3.color) {
                    // Found a vertical match of at least 3 tiles
                    const matchedTiles = [tile1, tile2, tile3];
                    
                    // Check if the match extends further
                    let nextRow = row + 3;
                    while (nextRow < this.config.gridSize && 
                           this.state.grid[nextRow][col].color === tile1.color) {
                        matchedTiles.push(this.state.grid[nextRow][col]);
                        nextRow++;
                    }
                    
                    matches.push(matchedTiles);
                    
                    // Skip the rows we've already matched
                    row = nextRow - 3;
                }
            }
        }
        
        return matches;
    }
    
    /**
     * Replace matched tiles with new ones and drop tiles from above
     */
    replaceMatchedTiles(matches) {
        // Mark all matched tiles
        matches.forEach(match => {
            match.forEach(tile => {
                this.state.grid[tile.row][tile.col].matched = true;
                
                // Add matched class to the tile element for animation
                const tileElement = document.querySelector(`.tile[data-row="${tile.row}"][data-col="${tile.col}"]`);
                if (tileElement) {
                    tileElement.classList.add('matched');
                }
            });
        });
        
        // Calculate score based on matches
        this.calculateScore(matches);
        
        // For each column, drop tiles from above to fill gaps
        for (let col = 0; col < this.config.gridSize; col++) {
            // Count matched tiles in this column
            let matchedCount = 0;
            
            for (let row = this.config.gridSize - 1; row >= 0; row--) {
                if (this.state.grid[row][col].matched) {
                    matchedCount++;
                } else if (matchedCount > 0) {
                    // Drop this tile down by the number of matched tiles below it
                    const newRow = row + matchedCount;
                    this.state.grid[newRow][col] = { ...this.state.grid[row][col], row: newRow };
                    this.state.grid[row][col].matched = true; // Mark the original position as matched
                }
            }
            
            // Fill the top of the column with new tiles
            for (let row = 0; row < matchedCount; row++) {
                const colorIndex = Math.floor(Math.random() * this.config.colorVariants);
                const color = this.config.colors[colorIndex];
                
                this.state.grid[row][col] = {
                    color,
                    row,
                    col,
                    special: false,
                    matched: false
                };
            }
        }
        
        // Reset the matched flag for all tiles
        for (let row = 0; row < this.config.gridSize; row++) {
            for (let col = 0; col < this.config.gridSize; col++) {
                this.state.grid[row][col].matched = false;
            }
        }
    }
    
    /**
     * Calculate score based on matches
     */
    calculateScore(matches) {
        let scoreGain = 0;
        
        matches.forEach(match => {
            // Base points for each match
            const basePoints = 100;
            
            // Bonus for matches larger than the minimum size
            const sizeBonus = Math.pow(2, match.length - this.config.minMatchSize);
            
            // Points for this match
            const matchPoints = basePoints * sizeBonus;
            
            scoreGain += matchPoints;
            
            // Check if any special tiles were matched
            const hasSpecialTile = match.some(tile => tile.special);
            if (hasSpecialTile) {
                scoreGain += matchPoints; // Double points for special tiles
            }
        });
        
        // Update the score
        this.state.score += scoreGain;
        
        // Update goal progress
        this.updateGoalProgress();
    }
    
    /**
     * Update the goal progress based on the current score
     */
    updateGoalProgress() {
        // Calculate the score needed to complete the level
        const goalScore = this.state.level * 1000;
        
        // Calculate progress as a percentage
        this.state.goalProgress = Math.min(100, Math.floor((this.state.score / goalScore) * 100));
        
        // Update UI
        this.elements.scoreDisplay.textContent = this.state.score;
        this.elements.progressFill.style.width = `${this.state.goalProgress}%`;
        
        // Check if the level is complete
        if (this.state.goalProgress >= this.config.goalPercentage) {
            this.levelComplete();
        }
    }
    
    /**
     * Render the current grid state to the DOM
     */
    renderGrid() {
        // Clear the game board
        this.elements.gameBoard.innerHTML = '';
        
        // Create a document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Add all tiles to the fragment
        for (let row = 0; row < this.config.gridSize; row++) {
            for (let col = 0; col < this.config.gridSize; col++) {
                const tile = this.state.grid[row][col];
                
                const tileElement = document.createElement('div');
                tileElement.className = `tile ${tile.color}`;
                tileElement.dataset.row = row;
                tileElement.dataset.col = col;
                tileElement.classList.add('new'); // For animation
                
                if (tile.special) {
                    tileElement.classList.add('special');
                }
                
                fragment.appendChild(tileElement);
            }
        }
        
        // Add the fragment to the game board
        this.elements.gameBoard.appendChild(fragment);
    }
    
    /**
     * Handle tile click event
     */
    handleTileClick(event) {
        if (this.state.gameStatus !== 'playing') {
            return;
        }
        
        // Get the clicked tile
        const tileElement = event.target.closest('.tile');
        if (!tileElement) return;
        
        const row = parseInt(tileElement.dataset.row);
        const col = parseInt(tileElement.dataset.col);
        
        // If a booster is active, handle booster action
        if (this.state.boosterActive) {
            this.handleBoosterAction(this.state.boosterActive, row, col);
            return;
        }
        
        // Handle normal tile selection
        this.selectTile(row, col);
    }
    
    /**
     * Select a tile for potential swap
     */
    selectTile(row, col) {
        // If no tile is selected, select this one
        if (!this.state.selectedTile) {
            this.state.selectedTile = { row, col };
            
            // Add selected class to the tile
            const tileElement = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
            if (tileElement) {
                tileElement.classList.add('selected');
            }
        } else {
            // Second tile selected, attempt to swap
            const selectedRow = this.state.selectedTile.row;
            const selectedCol = this.state.selectedTile.col;
            
            // Remove selected class from first tile
            const firstTileElement = document.querySelector(`.tile[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
            if (firstTileElement) {
                firstTileElement.classList.remove('selected');
            }
            
            // Check if the tiles are adjacent
            const isAdjacent = (
                (Math.abs(row - selectedRow) === 1 && col === selectedCol) ||
                (Math.abs(col - selectedCol) === 1 && row === selectedRow)
            );
            
            if (isAdjacent) {
                this.swapTiles(selectedRow, selectedCol, row, col);
            } else {
                // Not adjacent, select this new tile instead
                this.state.selectedTile = { row, col };
                
                // Add selected class to the new tile
                const tileElement = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
                if (tileElement) {
                    tileElement.classList.add('selected');
                }
            }
        }
    }
    
    /**
     * Swap two tiles and check for matches
     */
    swapTiles(row1, col1, row2, col2) {
        // Swap the tiles in the grid
        const temp = { ...this.state.grid[row1][col1] };
        this.state.grid[row1][col1] = { ...this.state.grid[row2][col2], row: row1, col: col1 };
        this.state.grid[row2][col2] = { ...temp, row: row2, col: col2 };
        
        // Reset selected tile
        this.state.selectedTile = null;
        
        // Check if the swap created any matches
        const matches = this.findAllMatches();
        
        if (matches.length > 0) {
            // Valid move - reduce move count
            this.state.movesMade++;
            this.state.movesLeft--;
            
            // Update moves display
            this.elements.movesDisplay.textContent = this.state.movesLeft;
            
            // Resolve matches
            this.replaceMatchedTiles(matches);
            
            // Render the grid
            this.renderGrid();
            
            // Check for additional matches
            setTimeout(() => {
                this.checkForCascadingMatches();
            }, 500);
        } else {
            // Invalid move - swap back
            const temp = { ...this.state.grid[row1][col1] };
            this.state.grid[row1][col1] = { ...this.state.grid[row2][col2], row: row1, col: col1 };
            this.state.grid[row2][col2] = { ...temp, row: row2, col: col2 };
            
            // Render the grid
            this.renderGrid();
        }
        
        // Check if game is over
        if (this.state.movesLeft <= 0 && this.state.goalProgress < this.config.goalPercentage) {
            this.gameOver();
        }
    }
    
    /**
     * Check for additional matches after tiles have dropped
     */
    checkForCascadingMatches() {
        const matches = this.findAllMatches();
        
        if (matches.length > 0) {
            // Found cascading matches
            console.log("Cascading matches found!");
            
            // Resolve the matches
            this.replaceMatchedTiles(matches);
            
            // Render the grid
            this.renderGrid();
            
            // Check for even more matches
            setTimeout(() => {
                this.checkForCascadingMatches();
            }, 500);
        }
    }
    
    /**
     * Handle booster click event
     */
    handleBoosterClick(event) {
        if (this.state.gameStatus !== 'playing') {
            return;
        }
        
        const boosterElement = event.currentTarget;
        const boosterType = boosterElement.dataset.booster;
        
        // Check if player has this booster
        if (this.state.boosters[boosterType] <= 0) {
            return;
        }
        
        // If another booster is active, deactivate it
        if (this.state.boosterActive && this.state.boosterActive !== boosterType) {
            document.querySelector(`.booster[data-booster="${this.state.boosterActive}"]`).classList.remove('active');
        }
        
        // Toggle active state
        if (this.state.boosterActive === boosterType) {
            this.state.boosterActive = null;
            boosterElement.classList.remove('active');
        } else {
            this.state.boosterActive = boosterType;
            boosterElement.classList.add('active');
        }
    }
    
    /**
     * Handle a booster action on a specific tile
     */
    handleBoosterAction(boosterType, row, col) {
        // Deactivate the booster
        document.querySelector(`.booster[data-booster="${boosterType}"]`).classList.remove('active');
        
        // Use the booster
        switch (boosterType) {
            case 'lightning':
                this.useLightningBooster(row);
                break;
            case 'hammer':
                this.useHammerBooster(row, col);
                break;
            case 'target':
                this.useTargetBooster(row, col);
                break;
            case 'star':
                this.useStarBooster();
                break;
            case 'bomb':
                this.useBombBooster(row, col);
                break;
        }
        
        // Reset booster active state
        this.state.boosterActive = null;
    }
    
    /**
     * Lightning booster - clear a row
     */
    useLightningBooster(row) {
        // Mark all tiles in the row as matched
        for (let col = 0; col < this.config.gridSize; col++) {
            this.state.grid[row][col].matched = true;
        }
        
        // Decrement booster count
        this.state.boosters.lightning--;
        this.elements.boosterCounts.lightning.textContent = this.state.boosters.lightning;
        
        // Replace matched tiles
        const matches = [this.state.grid[row]];
        this.replaceMatchedTiles(matches);
        
        // Render the grid
        this.renderGrid();
        
        // Check for cascading matches
        setTimeout(() => {
            this.checkForCascadingMatches();
        }, 500);
    }
    
    /**
     * Hammer booster - remove a single tile
     */
    useHammerBooster(row, col) {
        // Mark the selected tile as matched
        this.state.grid[row][col].matched = true;
        
        // Decrement booster count
        this.state.boosters.hammer--;
        this.elements.boosterCounts.hammer.textContent = this.state.boosters.hammer;
        
        // Replace matched tile
        const matches = [[this.state.grid[row][col]]];
        this.replaceMatchedTiles(matches);
        
        // Render the grid
        this.renderGrid();
        
        // Check for cascading matches
        setTimeout(() => {
            this.checkForCascadingMatches();
        }, 500);
    }
    
    /**
     * Target booster - swap any two tiles
     */
    useTargetBooster(row, col) {
        // If this is the first tile selection
        if (!this.state.selectedTile) {
            this.state.selectedTile = { row, col };
            
            // Add selected class to the tile
            const tileElement = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
            if (tileElement) {
                tileElement.classList.add('selected');
            }
            
            return;
        }
        
        // This is the second tile selection, swap the tiles
        const selectedRow = this.state.selectedTile.row;
        const selectedCol = this.state.selectedTile.col;
        
        // Remove selected class from first tile
        const firstTileElement = document.querySelector(`.tile[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
        if (firstTileElement) {
            firstTileElement.classList.remove('selected');
        }
        
        // Swap the tiles in the grid (without checking for matches)
        const temp = { ...this.state.grid[selectedRow][selectedCol] };
        this.state.grid[selectedRow][selectedCol] = { ...this.state.grid[row][col], row: selectedRow, col: selectedCol };
        this.state.grid[row][col] = { ...temp, row, col };
        
        // Decrement booster count
        this.state.boosters.target--;
        this.elements.boosterCounts.target.textContent = this.state.boosters.target;
        
        // Reset selected tile
        this.state.selectedTile = null;
        
        // Render the grid
        this.renderGrid();
        
        // Check for matches
        setTimeout(() => {
            this.checkForCascadingMatches();
        }, 500);
    }
    
    /**
     * Star booster - random bonus points
     */
    useStarBooster() {
        // Award random bonus points
        const bonusPoints = Math.floor(Math.random() * 1000) + 500;
        this.state.score += bonusPoints;
        
        // Decrement booster count
        this.state.boosters.star--;
        this.elements.boosterCounts.star.textContent = this.state.boosters.star;
        
        // Show bonus points message
        this.showBonusMessage(bonusPoints);
        
        // Update goal progress
        this.updateGoalProgress();
    }
    
    /**
     * Bomb booster - clear an area
     */
    useBombBooster(row, col) {
        // Mark tiles in a 3x3 area as matched
        const matchedTiles = [];
        
        for (let r = Math.max(0, row - 1); r <= Math.min(this.config.gridSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.config.gridSize - 1, col + 1); c++) {
                this.state.grid[r][c].matched = true;
                matchedTiles.push(this.state.grid[r][c]);
            }
        }
        
        // Decrement booster count
        this.state.boosters.bomb--;
        this.elements.boosterCounts.bomb.textContent = this.state.boosters.bomb;
        
        // Replace matched tiles
        const matches = [matchedTiles];
        this.replaceMatchedTiles(matches);
        
        // Render the grid
        this.renderGrid();
        
        // Check for cascading matches
        setTimeout(() => {
            this.checkForCascadingMatches();
        }, 500);
    }
    
    /**
     * Show bonus points message
     */
    showBonusMessage(points) {
        // Create a floating message element
        const message = document.createElement('div');
        message.className = 'share-confirm';
        message.textContent = `+${points} bonus points!`;
        document.body.appendChild(message);
        
        // Remove the message after animation completes
        setTimeout(() => {
            message.remove();
        }, 2500);
    }
    
    /**
     * Handle level completion
     */
    levelComplete() {
        if (this.state.gameStatus === 'levelComplete') {
            return; // Already handling level completion
        }
        
        this.state.gameStatus = 'levelComplete';
        
        // Update final score and level
        this.elements.finalScore.textContent = this.state.score;
        this.elements.finalLevel.textContent = this.state.level;
        
        // Show level complete screen
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('level-complete').classList.add('active');
    }
    
    /**
     * Handle game over
     */
    gameOver() {
        if (this.state.gameStatus === 'gameOver') {
            return; // Already handling game over
        }
        
        this.state.gameStatus = 'gameOver';
        
        // Update game over score and level
        this.elements.gameOverScore.textContent = this.state.score;
        this.elements.gameOverLevel.textContent = this.state.level;
        
        // Show game over screen
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('game-over').classList.add('active');
    }
    
    /**
     * Start next level
     */
    nextLevel() {
        // Increment level
        this.state.level++;
        
        // Reset moves
        this.state.movesMade = 0;
        this.state.movesLeft = this.config.moveLimit;
        
        // Update UI
        this.elements.levelDisplay.textContent = this.state.level;
        this.elements.movesDisplay.textContent = this.state.movesLeft;
        this.elements.progressFill.style.width = '0%';
        
        // Create new grid
        this.createNewGrid();
        
        // Set game status to playing
        this.state.gameStatus = 'playing';
        
        // Show game screen
        document.getElementById('level-complete').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
    }
    
    /**
     * Restart current level
     */
    restartLevel() {
        // Reset moves
        this.state.movesMade = 0;
        this.state.movesLeft = this.config.moveLimit;
        
        // Reset score for the level
        const previousLevelsScore = (this.state.level - 1) * 1000 * (this.config.goalPercentage / 100);
        this.state.score = Math.max(0, previousLevelsScore);
        
        // Update UI
        this.elements.scoreDisplay.textContent = this.state.score;
        this.elements.movesDisplay.textContent = this.state.movesLeft;
        this.elements.progressFill.style.width = '0%';
        
        // Create new grid
        this.createNewGrid();
        
        // Set game status to playing
        this.state.gameStatus = 'playing';
        
        // Show game screen
        document.getElementById('game-over').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
    }
    
    /**
     * Update the game UI
     */
    updateUI() {
        // Update level, score, and moves
        this.elements.levelDisplay.textContent = this.state.level;
        this.elements.scoreDisplay.textContent = this.state.score;
        this.elements.movesDisplay.textContent = this.state.movesLeft;
        
        // Update progress bar
        this.elements.progressFill.style.width = `${this.state.goalProgress}%`;
        
        // Update booster counts
        for (const booster in this.state.boosters) {
            this.elements.boosterCounts[booster].textContent = this.state.boosters[booster];
        }
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.state.gameStatus = 'playing';
        document.getElementById('main-menu').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
    }
}

// Export the game class
window.ColorMatchFrenzy = ColorMatchFrenzy;