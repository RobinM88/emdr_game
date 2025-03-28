export class Ball {
    constructor(canvas) {
        this.canvas = canvas;
        this.size = 20;
        this.speed = 5;
        this.direction = 1; // 1 for right, -1 for left
        this.updatePosition(canvas);
    }

    updatePosition(canvas) {
        const groundY = canvas.height - canvas.height * 0.2;
        this.y = groundY - this.size;
        this.x = canvas.width / 2 - this.size / 2;
    }

    reset(canvas) {
        this.updatePosition(canvas);
        this.direction = 1;
        this.speed = 5;
    }

    update(speed) {
        // Update speed from controls
        if (speed !== undefined) this.speed = speed;

        // Move ball
        const nextX = this.x + (this.speed * this.direction);
        
        // Check bounds and bounce at walls
        if (nextX <= 0) { // Bounce at left wall
            this.x = 0;
            this.direction = 1; // Bounce right
        } else if (nextX >= this.canvas.width - this.size) { // Bounce at right wall
            this.x = this.canvas.width - this.size;
            this.direction = -1; // Bounce left
        } else {
            this.x = nextX;
        }
    }

    draw(ctx) {
        // Draw glow effect
        const gradient = ctx.createRadialGradient(
            this.x + this.size / 2,
            this.y + this.size / 2,
            0,
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size * 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size * 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw ball
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            this.x + this.size / 2,
            this.y + this.size / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.size / 2,
            this.canvas.height - this.canvas.height * 0.2 + 5,
            this.size / 2,
            this.size / 4,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
} 