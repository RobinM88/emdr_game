export class VisualEffects {
    constructor(canvas) {
        this.canvas = canvas;
        this.colors = {
            sky: '#87CEEB',
            periwinkle: '#CCCCFF',
            lavender: '#E6E6FA',
            ground: '#90EE90',
            shadow: 'rgba(0, 0, 0, 0.1)'
        };

        // Initialize arrays
        this.clouds = [];
        this.particles = [];
        this.ballTrail = [];
        
        // Visual effect settings
        this.maxParticles = 50;
        this.maxTrailLength = 20;
        this.cloudCount = 5;
        
        this.initializeClouds();
    }

    initializeClouds() {
        this.clouds = [];
        for (let i = 0; i < this.cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height * 0.4),
                size: 30 + Math.random() * 40,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }

    update() {
        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width) {
                cloud.x = -cloud.size;
                cloud.y = Math.random() * (this.canvas.height * 0.4);
            }
        });

        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            return particle.life > 0;
        });

        // Update ball trail
        if (this.ballTrail.length > this.maxTrailLength) {
            this.ballTrail.shift();
        }
    }

    addParticle(x, y, type) {
        if (this.particles.length >= this.maxParticles) return;

        const particle = {
            x,
            y,
            life: 1,
            type
        };

        switch (type) {
            case 'jump':
                particle.vx = (Math.random() - 0.5) * 2;
                particle.vy = -Math.random() * 2;
                particle.size = 3;
                particle.color = '#FFFFFF';
                break;
            case 'trail':
                particle.vx = 0;
                particle.vy = 0;
                particle.size = 2;
                particle.color = 'rgba(255, 255, 255, 0.5)';
                break;
        }

        this.particles.push(particle);
    }

    addBallTrail(x, y) {
        this.ballTrail.push({ x, y, life: 1 });
    }

    drawBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.colors.sky);
        gradient.addColorStop(0.5, this.colors.periwinkle);
        gradient.addColorStop(1, this.colors.lavender);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGround(ctx) {
        const groundHeight = this.canvas.height * 0.2;
        const groundY = this.canvas.height - groundHeight;
        
        // Draw ground shadow
        ctx.fillStyle = this.colors.shadow;
        ctx.fillRect(0, groundY, this.canvas.width, groundHeight);
        
        // Draw ground
        const groundGradient = ctx.createLinearGradient(0, groundY, 0, this.canvas.height);
        groundGradient.addColorStop(0, this.colors.ground);
        groundGradient.addColorStop(1, '#7CCD7C');
        
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, groundY, this.canvas.width, groundHeight);
    }

    drawClouds(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.clouds.forEach(cloud => {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawParticles(ctx) {
        this.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    drawBallTrail(ctx) {
        this.ballTrail.forEach((point, index) => {
            const alpha = point.life * (index / this.ballTrail.length);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    clear() {
        this.particles = [];
        this.ballTrail = [];
    }

    createCollisionEffect(x, y) {
        // Create multiple particles for a burst effect
        for (let i = 0; i < 10; i++) {
            this.addParticle(x, y, 'jump');
        }
    }
} 