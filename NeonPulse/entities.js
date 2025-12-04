class Entity {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.markedForDeletion = false;
    }

    draw(ctx) {
        // Override in subclasses
    }

    update(deltaTime) {
        // Override in subclasses
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, '#0ff');
        this.radius = 15;
        this.baseSpeed = 5;
        this.speed = 5;
        this.health = 100;
        this.maxHealth = 100;
        this.velocity = { x: 0, y: 0 };

        // Trail effect
        this.trail = [];
        this.maxTrailLength = 10;

        // Upgrade system
        this.upgrades = {
            fireRate: 0,
            bulletDamage: 0,
            moveSpeed: 0,
            maxHealth: 0,
            regeneration: 0,
            multishot: 0,
            shield: 0
        };

        this.fireRateCooldown = 10;
        this.currentCooldown = 0;
        this.bulletDamage = 1;
        this.hasShield = false;
        this.regenTimer = 0;
    }

    applyUpgrade(upgradeType) {
        this.upgrades[upgradeType]++;

        switch (upgradeType) {
            case 'fireRate':
                this.fireRateCooldown = Math.max(3, 10 - this.upgrades.fireRate * 2);
                break;
            case 'bulletDamage':
                this.bulletDamage = 1 + this.upgrades.bulletDamage;
                break;
            case 'moveSpeed':
                this.speed = this.baseSpeed * (1 + this.upgrades.moveSpeed * 0.15);
                break;
            case 'maxHealth':
                this.maxHealth = 100 + this.upgrades.maxHealth * 25;
                this.health = Math.min(this.health + 25, this.maxHealth);
                break;
            case 'shield':
                this.hasShield = true;
                break;
        }
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    takeDamage(amount) {
        if (this.hasShield) {
            this.hasShield = false;
            return false;
        }
        this.health -= amount;
        return this.health <= 0;
    }

    draw(ctx) {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const alpha = (i / this.trail.length) * 0.5;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        ctx.restore();

        // Draw player
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-10, -10);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();

        // Shield indicator
        if (this.hasShield) {
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.stroke();
        }

        ctx.restore();
    }

    update(input, canvasWidth, canvasHeight) {
        const prevX = this.x;
        const prevY = this.y;

        // Movement
        if (input.keys['KeyW'] || input.keys['ArrowUp']) this.y -= this.speed;
        if (input.keys['KeyS'] || input.keys['ArrowDown']) this.y += this.speed;
        if (input.keys['KeyA'] || input.keys['ArrowLeft']) this.x -= this.speed;
        if (input.keys['KeyD'] || input.keys['ArrowRight']) this.x += this.speed;

        // Bounds
        this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));

        // Trail
        if (prevX !== this.x || prevY !== this.y) {
            this.trail.push({ x: prevX, y: prevY });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }

        // Regeneration
        if (this.upgrades.regeneration > 0) {
            this.regenTimer++;
            if (this.regenTimer >= 60) {
                this.heal(this.upgrades.regeneration);
                this.regenTimer = 0;
            }
        }

        // Cooldown
        if (this.currentCooldown > 0) this.currentCooldown--;
    }
}

class Bullet extends Entity {
    constructor(x, y, angle, damage = 1, isEnemy = false) {
        super(x, y, isEnemy ? '#f00' : '#ff0');
        this.velocity = {
            x: Math.cos(angle) * 15,
            y: Math.sin(angle) * 15
        };
        this.radius = 3;
        this.damage = damage;
        this.isEnemy = isEnemy;
        this.trail = [];
        this.maxTrailLength = 5;
    }

    draw(ctx) {
        // Draw trail
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const alpha = (i / this.trail.length) * 0.7;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        ctx.restore();

        // Draw bullet
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy extends Entity {
    constructor(x, y, type, player, wave = 1) {
        super(x, y, '#f00');
        this.type = type;
        this.player = player;
        this.radius = 15;
        this.speed = 2;
        this.wave = wave;
        this.shootCooldown = 0;

        const scaleFactor = 1 + (wave - 1) * 0.15;

        if (type === 'chaser') {
            this.color = '#f00';
            this.speed = 3 * scaleFactor;
            this.health = Math.ceil(1 * scaleFactor);
            this.damage = Math.ceil(10 * scaleFactor);
            this.scoreValue = 10;
            this.creditValue = 5;
        } else if (type === 'shooter') {
            this.color = '#ff0';
            this.speed = 1.5 * scaleFactor;
            this.health = Math.ceil(2 * scaleFactor);
            this.damage = Math.ceil(15 * scaleFactor);
            this.scoreValue = 20;
            this.creditValue = 10;
            this.shootCooldown = 60;
        } else if (type === 'tank') {
            this.color = '#f0f';
            this.speed = 1 * scaleFactor;
            this.radius = 25;
            this.health = Math.ceil(5 * scaleFactor);
            this.damage = Math.ceil(20 * scaleFactor);
            this.scoreValue = 50;
            this.creditValue = 25;
        } else if (type === 'boss') {
            this.color = '#f0f';
            this.speed = 2 * scaleFactor;
            this.radius = 40;
            this.health = Math.ceil(50 * scaleFactor);
            this.damage = Math.ceil(30 * scaleFactor);
            this.scoreValue = 500;
            this.creditValue = 200;
            this.shootCooldown = 30;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        if (this.type === 'chaser') {
            ctx.rect(-10, -10, 20, 20);
        } else if (this.type === 'shooter') {
            ctx.moveTo(0, -15);
            ctx.lineTo(12, 10);
            ctx.lineTo(-12, 10);
        } else if (this.type === 'tank') {
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(20 * Math.cos(i * Math.PI / 3), 20 * Math.sin(i * Math.PI / 3));
            }
        } else if (this.type === 'boss') {
            // Star shape
            for (let i = 0; i < 10; i++) {
                const radius = i % 2 === 0 ? 35 : 20;
                const angle = (i * Math.PI) / 5;
                ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
            }
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.type === 'boss' ? 20 : 10;
        ctx.shadowColor = this.color;
        ctx.fill();

        ctx.restore();
    }

    update() {
        const angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);

        if (this.type === 'shooter' || this.type === 'boss') {
            const dist = Math.hypot(this.player.x - this.x, this.player.y - this.y);
            if (dist > 200) {
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        } else {
            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;
        }
    }

    shouldShoot() {
        if (this.type === 'shooter' || this.type === 'boss') {
            this.shootCooldown--;
            if (this.shootCooldown <= 0) {
                this.shootCooldown = this.type === 'boss' ? 30 : 60;
                return true;
            }
        }
        return false;
    }
}

class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y, '#0ff');
        this.type = type; // 'invincibility', 'rapidfire', 'nuke'
        this.radius = 10;
        this.lifetime = 600; // 10 seconds
        this.pulseTimer = 0;

        if (type === 'invincibility') {
            this.color = '#0ff';
        } else if (type === 'rapidfire') {
            this.color = '#ff0';
        } else if (type === 'nuke') {
            this.color = '#f0f';
        }
    }

    draw(ctx) {
        this.pulseTimer += 0.1;
        const pulse = Math.sin(this.pulseTimer) * 3 + 10;

        ctx.beginPath();
        ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fill();

        // Icon
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icon = this.type === 'invincibility' ? '⚡' : this.type === 'rapidfire' ? '⚡⚡' : '💣';
        ctx.fillText(icon, this.x, this.y);
    }

    update() {
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.markedForDeletion = true;
        }
    }
}

class DamageNumber extends Entity {
    constructor(x, y, damage) {
        super(x, y, '#f00');
        this.damage = damage;
        this.lifetime = 60;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: -2 };
        this.alpha = 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText(this.damage, this.x, this.y);
        ctx.fillText(this.damage, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.lifetime--;
        this.alpha = this.lifetime / 60;
        if (this.lifetime <= 0) {
            this.markedForDeletion = true;
        }
    }
}

class CreditOrb extends Entity {
    constructor(x, y, value) {
        super(x, y, '#0f0');
        this.value = value;
        this.radius = 5;
        this.lifetime = 300;
        this.pulseTimer = 0;
    }

    draw(ctx) {
        this.pulseTimer += 0.1;
        const pulse = Math.sin(this.pulseTimer) * 2 + 5;

        ctx.beginPath();
        ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
    }

    update() {
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.markedForDeletion = true;
        }
    }
}

class Particle extends Entity {
    constructor(x, y, color, velocity) {
        super(x, y, color);
        this.velocity = velocity;
        this.alpha = 1;
        this.friction = 0.95;
        this.radius = Math.random() * 3 + 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
        if (this.alpha <= 0) this.markedForDeletion = true;
    }
}
