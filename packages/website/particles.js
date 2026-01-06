class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Two velocity components: drift (constant, tiny) and velocity (dynamic, decays)
        this.drift = {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        
        this.size = Math.random() * 3 + 1;
        this.type = Math.random() > 0.5 ? 'triangle' : 'circle';
        this.color = this.getRandomColor();
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.friction = 0.98; // Decays velocity by 2% per frame
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, 0.6)', 
            'rgba(255, 255, 255, 0.4)', 
            'rgba(147, 197, 253, 0.5)', // Light blue
            'rgba(167, 139, 250, 0.5)'  // Light purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse) {
        // Apply interaction force
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // Push away strongly
            this.velocity.x -= forceDirectionX * force * 1.5;
            this.velocity.y -= forceDirectionY * force * 1.5;
        }

        // Apply friction to dynamic velocity
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update position (Drift + Dynamic Velocity)
        this.x += this.drift.x + this.velocity.x;
        this.y += this.drift.y + this.velocity.y;
        this.angle += this.spin;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) {
            this.velocity.x *= -1; // Reflect dynamic velocity
            this.drift.x *= -1;    // Reflect drift
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.velocity.y *= -1;
            this.drift.y *= -1;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.fillStyle = this.color;

        if (this.type === 'triangle') {
            this.ctx.beginPath();
            this.ctx.moveTo(0, -this.size * 2);
            this.ctx.lineTo(this.size, this.size);
            this.ctx.lineTo(-this.size, this.size);
            this.ctx.closePath();
            this.ctx.fill();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }
}

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('reactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 100;
        this.mouse = { x: -1000, y: -1000 }; // Initialize off-screen

        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    init() {
        this.updateDimensions();
        this.createParticles();
    }

    updateDimensions() {
        if (this.canvas.parentElement) {
            this.canvas.width = this.canvas.parentElement.offsetWidth;
            this.canvas.height = this.canvas.parentElement.offsetHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    createParticles() {
        this.particles = [];
        const density = (this.canvas.width * this.canvas.height) / 15000;
        this.numberOfParticles = Math.min(density, 150);

        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas, this.ctx));
        }
    }

    resize() {
        this.updateDimensions();
        this.createParticles();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw();
        });

        this.connectParticles();

        requestAnimationFrame(this.animate.bind(this));
    }

    connectParticles() {
        const maxDistance = 150;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();
});
