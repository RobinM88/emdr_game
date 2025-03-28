export class Character {
    constructor(canvas, position) {
        this.canvas = canvas;
        this.position = position; // 'left' or 'right'
        this.width = 40;
        this.height = 60;
        this.jumpForce = -15;
        this.gravity = 0.8;
        this.velocityY = 0;
        this.isJumping = false;
        this.color = position === 'left' ? '#FF6B6B' : '#4ECDC4';
        this.updatePosition(canvas);
    }

    updatePosition(canvas) {
        const groundY = canvas.height - canvas.height * 0.2;
        this.y = groundY - this.height;
        
        if (this.position === 'left') {
            this.x = 0; // Right at left wall
        } else {
            this.x = canvas.width - this.width; // Right at right wall
        }
    }

    reset() {
        this.velocityY = 0;
        this.isJumping = false;
        this.updatePosition(this.canvas);
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            return true;
        }
        return false;
    }

    update(gravity) {
        if (this.isJumping) {
            this.velocityY += gravity;
            this.y += this.velocityY;

            const groundY = this.canvas.height - this.canvas.height * 0.2;
            if (this.y >= groundY - this.height) {
                this.y = groundY - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }
    }

    draw(ctx) {
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.canvas.height - this.canvas.height * 0.2 + 5,
            this.width / 2,
            this.height / 4,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Draw character
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fill();

        // Draw perfect hit zone indicator
        const perfectZoneStart = this.y + (this.height / 3);
        const perfectZoneHeight = this.height / 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(this.x, perfectZoneStart, this.width, perfectZoneHeight);

        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        const eyeSize = 8;
        const eyeY = this.y + this.height * 0.3;
        
        // Draw eyes based on direction
        const leftEyeX = this.x + this.width * 0.3;
        const rightEyeX = this.x + this.width * 0.7;
        
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
    }

    checkCollision(ball) {
        // Basic collision detection
        const hasCollision = (
            ball.x < this.x + this.width &&
            ball.x + ball.radius * 2 > this.x &&
            ball.y < this.y + this.height &&
            ball.y + ball.radius * 2 > this.y
        );

        if (!hasCollision) {
            return { collision: false };
        }

        // Calculate perfect jump zone (middle third of character height)
        const perfectZoneStart = this.y + (this.height / 3);
        const perfectZoneEnd = this.y + (this.height * 2 / 3);
        
        // Check if ball center is in perfect zone
        const ballCenterY = ball.y + ball.radius;
        const isPerfect = ballCenterY >= perfectZoneStart && ballCenterY <= perfectZoneEnd;

        return {
            collision: true,
            isPerfect: isPerfect
        };
    }
} 