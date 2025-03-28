import { AudioManager } from './AudioManager.js';
import { VisualEffects } from './VisualEffects.js';
import { Character } from './Character.js';
import { Ball } from './Ball.js';
import { Controls } from './Controls.js';
import { Stats } from './Stats.js';

export class EMDRGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.scoreDisplay = document.getElementById('score');
        this.isRunning = false;
        this.hemisyncEnabled = false; // Set to false by default
        this.lastBallX = 0; // Track ball's last X position
        this.cycleCompleted = false; // Track if cycle is completed
        
        // Initialize game objects
        this.ball = new Ball(this.canvas);
        this.leftCharacter = new Character(this.canvas, 'left');
        this.rightCharacter = new Character(this.canvas, 'right');
        
        // Initialize managers and components
        this.audioManager = new AudioManager();
        this.visualEffects = new VisualEffects(this.canvas);
        this.controls = new Controls(this);
        this.stats = new Stats();
        
        // Set canvas size to be responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize score display with default values
        if (this.scoreDisplay) {
            const highScore = parseInt(localStorage.getItem('highScore')) || 0;
            this.scoreDisplay.textContent = `Score: ${this.score} | High Score: ${highScore}`;
            this.scoreDisplay.style.display = 'block';
            console.log('Score display initialized:', this.scoreDisplay.textContent);
        } else {
            console.error('Score display element not found!');
        }
        
        // Start the timing measurement
        this.lastTime = performance.now();
        this.cycleCount = 0;
        this.lastCycleTime = performance.now();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth - 40;
        this.canvas.height = Math.min(window.innerHeight * 0.4, 400);
        
        // Update positions
        if (this.ball) this.ball.updatePosition(this.canvas);
        if (this.leftCharacter) this.leftCharacter.updatePosition(this.canvas);
        if (this.rightCharacter) this.rightCharacter.updatePosition(this.canvas);
        
        // Redraw
        this.draw();
    }

    updateScoreDisplay() {
        if (this.scoreDisplay) {
            const highScore = parseInt(localStorage.getItem('highScore')) || 0;
            this.scoreDisplay.textContent = `Score: ${this.score} | High Score: ${Math.max(this.score, highScore)}`;
            this.scoreDisplay.style.display = 'block';
            console.log('Score updated:', this.scoreDisplay.textContent);
        } else {
            console.error('Score display element not found in updateScoreDisplay!');
        }
    }

    async start() {
        try {
            this.isRunning = true;
            this.score = 0;
            this.cycleCompleted = false;
            this.lastBallX = 0;
            this.updateScoreDisplay();
            
            this.stats.reset();
            if (this.ball) this.ball.reset(this.canvas);
            if (this.leftCharacter) this.leftCharacter.reset();
            if (this.rightCharacter) this.rightCharacter.reset();
            
            if (this.hemisyncEnabled) {
                await this.audioManager.startHemisync();
            }
            
            this.controls.updateStartButton('Stop Game');
            this.gameLoop();
        } catch (error) {
            console.error('Error starting game:', error);
            this.stop();
        }
    }

    stop() {
        this.isRunning = false;
        this.controls.updateStartButton('Start Game');
        this.audioManager.stopAll();
        this.visualEffects.clear();
        this.stats.display();
    }

    update() {
        if (!this.isRunning) return;

        const currentTime = Date.now();
        this.stats.updateSessionTime(currentTime);
        
        // Update game objects
        if (this.ball) {
            this.ball.update(this.controls.speed);
            
            // Check for cycle completion
            if (this.lastBallX > this.ball.x && this.ball.x < this.canvas.width * 0.1) {
                // Ball has moved from right to left side
                if (!this.cycleCompleted) {
                    this.cycleCompleted = true;
                    this.score += 10; // Add points for completing a cycle
                    this.updateScoreDisplay();
                    this.audioManager.playJumpSound();
                }
            } else if (this.ball.x > this.canvas.width * 0.9) {
                // Reset cycle completion flag when ball reaches right side
                this.cycleCompleted = false;
            }
            
            this.lastBallX = this.ball.x;
        }
        
        if (this.leftCharacter) this.leftCharacter.update(this.controls.gravity);
        if (this.rightCharacter) this.rightCharacter.update(this.controls.gravity);

        // Check for collisions
        if (this.checkCollision(this.leftCharacter) || this.checkCollision(this.rightCharacter)) {
            this.gameOver();
        }

        // Update visual effects
        this.visualEffects.update();
    }

    draw() {
        // Draw background and effects
        this.visualEffects.drawBackground(this.ctx);
        this.visualEffects.drawClouds(this.ctx);
        this.visualEffects.drawGround(this.ctx);
        
        // Draw game objects
        if (this.ball) this.ball.draw(this.ctx);
        if (this.leftCharacter) this.leftCharacter.draw(this.ctx);
        if (this.rightCharacter) this.rightCharacter.draw(this.ctx);
        
        // Draw effects
        this.visualEffects.drawParticles(this.ctx);
        this.visualEffects.drawBallTrail(this.ctx);
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        try {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        } catch (error) {
            console.error('Error in game loop:', error);
            this.stop();
        }
    }

    checkCollision(character) {
        if (!character || !this.ball) return false;
        const collision = character.checkCollision(this.ball);
        if (collision) {
            // Increment score and update display
            this.score += 50;
            this.updateScoreDisplay();
            
            // Play sound and visual effects
            this.audioManager.playJumpSound();
            this.visualEffects.createCollisionEffect(character.x, character.y);
            
            return true;
        }
        return false;
    }

    gameOver() {
        this.isRunning = false;
        this.controls.updateStartButton('Start Game');
        this.audioManager.playGameOverSound();
        
        // Update high score if needed
        const highScore = parseInt(localStorage.getItem('highScore')) || 0;
        if (this.score > highScore) {
            localStorage.setItem('highScore', this.score.toString());
        }
        
        // Update final score display
        this.updateScoreDisplay();
        this.stats.display();
    }
} 