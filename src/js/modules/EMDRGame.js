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
        this.isRunning = false;
        this.hemisyncEnabled = true;
        
        // Initialize game objects first
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

    async start() {
        try {
            this.isRunning = true;
            this.score = 0;
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
        if (this.ball) this.ball.update(this.controls.speed);
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
        return character.checkCollision(this.ball);
    }

    gameOver() {
        this.isRunning = false;
        this.controls.updateStartButton('Start Game');
        this.audioManager.playGameOverSound();
    }
} 