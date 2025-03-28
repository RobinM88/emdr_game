export class Controls {
    constructor(game) {
        if (!game) {
            console.error('Game instance is required for Controls');
            return;
        }

        this.game = game;
        this.speed = 5;
        this.direction = 1;
        this.gravity = 0.8;
        
        this.initializeControls();
    }

    initializeControls() {
        // Speed control
        const speedControl = document.getElementById('speedControl');
        if (speedControl) {
            speedControl.addEventListener('input', (e) => {
                this.speed = parseInt(e.target.value);
                if (this.game.audioManager) {
                    this.game.audioManager.updateHemisyncFrequency(this.speed);
                }
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', async (e) => {
            if (!this.game || !this.game.isRunning) return;

            switch (e.key.toLowerCase()) {
                case 'w':
                    if (this.game.leftCharacter && this.game.leftCharacter.jump()) {
                        await this.game.audioManager.playJumpSound();
                        this.game.visualEffects.addParticle(
                            this.game.leftCharacter.x + this.game.leftCharacter.width / 2,
                            this.game.leftCharacter.y + this.game.leftCharacter.height,
                            'jump'
                        );
                    }
                    break;
                case 'arrowup':
                    if (this.game.rightCharacter && this.game.rightCharacter.jump()) {
                        await this.game.audioManager.playJumpSound();
                        this.game.visualEffects.addParticle(
                            this.game.rightCharacter.x + this.game.rightCharacter.width / 2,
                            this.game.rightCharacter.y + this.game.rightCharacter.height,
                            'jump'
                        );
                    }
                    break;
            }
        });

        // Start/Stop button
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', async () => {
                if (this.game.isRunning) {
                    this.game.stop();
                } else {
                    await this.game.start();
                }
            });
        }

        // Hemisync toggle
        const hemisyncToggle = document.getElementById('hemisyncToggle');
        if (hemisyncToggle) {
            hemisyncToggle.addEventListener('change', async (e) => {
                this.game.hemisyncEnabled = e.target.checked;
                if (this.game.isRunning) {
                    if (this.game.hemisyncEnabled) {
                        await this.game.audioManager.startHemisync();
                    } else {
                        this.game.audioManager.stopHemisync();
                    }
                }
            });
        }
    }

    updateStartButton(text) {
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.textContent = text;
        }
    }
} 