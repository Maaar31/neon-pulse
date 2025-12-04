const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Input handling
const input = {
    keys: {},
    mouse: { x: 0, y: 0, down: false }
};

window.addEventListener('keydown', e => {
    input.keys[e.code] = true;

    if (e.code === 'Escape' && currentState === STATE.PLAYING) {
        currentState = STATE.PAUSED;
        document.getElementById('pause-screen').classList.add('active');
    } else if (e.code === 'Escape' && currentState === STATE.PAUSED) {
        currentState = STATE.PLAYING;
        document.getElementById('pause-screen').classList.remove('active');
    }
});
window.addEventListener('keyup', e => input.keys[e.code] = false);
window.addEventListener('mousemove', e => {
    input.mouse.x = e.clientX;
    input.mouse.y = e.clientY;
});
window.addEventListener('mousedown', () => input.mouse.down = true);
window.addEventListener('mouseup', () => input.mouse.down = false);

// Game states
const STATE = {
    MENU: 0,
    PLAYING: 1,
    SHOP: 2,
    GAMEOVER: 3,
    PAUSED: 4
};

let currentState = STATE.MENU;
let score = 0;
let credits = 0;
let wave = 1;
let frames = 0;
let enemiesThisWave = 0;
let enemiesKilledThisWave = 0;
let highScore = localStorage.getItem('neonPulseHighScore') || 0;
let combo = 0;
let comboTimer = 0;
const COMBO_TIMEOUT = 180; // 3 seconds

// Screen shake
let screenShake = { x: 0, y: 0, intensity: 0 };

// Dash mechanic
let dashCooldown = 0;
const DASH_COOLDOWN_MAX = 120;
const DASH_DISTANCE = 100;
const DASH_DURATION = 10;

// Power-ups
let activePowerUps = {
    invincibility: 0,
    rapidfire: 0
};

// Background
let bgGrid = [];
for (let i = 0; i < 20; i++) {
    bgGrid.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 100 + 50,
        speed: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2
    });
}

// Managers
const soundManager = new SoundManager();
let player;
let projectiles = [];
let enemies = [];
let particles = [];
let creditOrbs = [];
let powerUps = [];
let damageNumbers = [];
let enemyBullets = [];

// UI Elements
const scoreEl = document.getElementById('score');
const creditsEl = document.getElementById('credits');
const waveEl = document.getElementById('wave');
const healthBar = document.getElementById('health-bar');
const dashIndicator = document.getElementById('dash-indicator');
const dashStatus = document.getElementById('dash-status');
const finalScoreEl = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const shopScreen = document.getElementById('shop-screen');
const shopCreditsEl = document.getElementById('shop-credits');
const upgradesContainer = document.getElementById('upgrades-container');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const continueBtn = document.getElementById('continue-btn');

// Upgrade Definitions
const upgradeDefinitions = [
    {
        id: 'fireRate',
        name: 'Cadence de Tir',
        description: 'Réduit le temps entre les tirs',
        baseCost: 50,
        maxLevel: 5,
        effect: (level) => `Cooldown: -${level * 2} frames`
    },
    {
        id: 'bulletDamage',
        name: 'Dégâts des Balles',
        description: 'Augmente les dégâts par balle',
        baseCost: 75,
        maxLevel: 10,
        effect: (level) => `Dégâts: +${level}`
    },
    {
        id: 'moveSpeed',
        name: 'Vitesse de Déplacement',
        description: 'Augmente la vitesse de mouvement',
        baseCost: 60,
        maxLevel: 5,
        effect: (level) => `Vitesse: +${(level * 15).toFixed(0)}%`
    },
    {
        id: 'maxHealth',
        name: 'Santé Maximale',
        description: 'Augmente les PV max et soigne',
        baseCost: 100,
        maxLevel: 8,
        effect: (level) => `Max HP: +${level * 25}`
    },
    {
        id: 'regeneration',
        name: 'Régénération',
        description: 'Régénère des PV par seconde',
        baseCost: 150,
        maxLevel: 3,
        effect: (level) => `+${level} HP/sec`
    },
    {
        id: 'multishot',
        name: 'Tir Multiple',
        description: 'Tire des balles supplémentaires',
        baseCost: 200,
        maxLevel: 3,
        effect: (level) => `+${level} balles`
    },
    {
        id: 'shield',
        name: 'Bouclier',
        description: 'Absorbe un coup',
        baseCost: 250,
        maxLevel: 1,
        effect: (level) => level > 0 ? 'Actif' : 'Inactif'
    }
];

function getUpgradeCost(upgrade, currentLevel) {
    return Math.floor(upgrade.baseCost * (1 + currentLevel * 0.5));
}

function addScreenShake(intensity) {
    screenShake.intensity = Math.max(screenShake.intensity, intensity);
}

function updateScreenShake() {
    if (screenShake.intensity > 0) {
        screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
        screenShake.intensity *= 0.9;
        if (screenShake.intensity < 0.1) {
            screenShake.intensity = 0;
            screenShake.x = 0;
            screenShake.y = 0;
        }
    }
}

function performDash() {
    if (dashCooldown === 0) {
        const angle = Math.atan2(input.mouse.y - player.y, input.mouse.x - player.x);
        const dashVelX = Math.cos(angle) * DASH_DISTANCE / DASH_DURATION;
        const dashVelY = Math.sin(angle) * DASH_DISTANCE / DASH_DURATION;

        for (let i = 0; i < DASH_DURATION; i++) {
            player.x += dashVelX;
            player.y += dashVelY;
        }

        player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

        dashCooldown = DASH_COOLDOWN_MAX;
        soundManager.playPowerup();

        for (let i = 0; i < 15; i++) {
            particles.push(new Particle(player.x, player.y, player.color, {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            }));
        }
    }
}

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('neonPulseHighScore', highScore);
    }
}

function initGame() {
    player = new Player(canvas.width / 2, canvas.height / 2);
    projectiles = [];
    enemies = [];
    particles = [];
    creditOrbs = [];
    powerUps = [];
    damageNumbers = [];
    enemyBullets = [];
    score = 0;
    credits = 0;
    wave = 1;
    frames = 0;
    enemiesThisWave = 0;
    enemiesKilledThisWave = 0;
    combo = 0;
    comboTimer = 0;
    activePowerUps = { invincibility: 0, rapidfire: 0 };

    scoreEl.innerText = score;
    creditsEl.innerText = credits;
    waveEl.innerText = wave;
    healthBar.style.width = '100%';

    currentState = STATE.PLAYING;
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    shopScreen.classList.remove('active');

    startWave();
}

function startWave() {
    enemiesThisWave = 5 + wave * 3;
    enemiesKilledThisWave = 0;
}

function spawnEnemy() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    switch (edge) {
        case 0: x = Math.random() * canvas.width; y = -30; break;
        case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
        case 3: x = -30; y = Math.random() * canvas.height; break;
    }

    // Boss wave every 5 levels
    if (wave % 5 === 0 && enemies.length === 0 && enemiesKilledThisWave === 0) {
        enemies.push(new Enemy(x, y, 'boss', player, wave));
        enemiesThisWave = 1;
        return;
    }

    let type = 'chaser';
    if (wave > 2 && Math.random() < 0.3) type = 'shooter';
    if (wave > 4 && Math.random() < 0.1) type = 'tank';

    enemies.push(new Enemy(x, y, type, player, wave));
}

function spawnPowerUp(x, y) {
    if (Math.random() < 0.15) {
        const types = ['invincibility', 'rapidfire', 'nuke'];
        const type = types[Math.floor(Math.random() * types.length)];
        powerUps.push(new PowerUp(x, y, type));
    }
}

function createExplosion(x, y, color) {
    soundManager.playExplosion();
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color, {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        }));
    }
}

function openShop() {
    currentState = STATE.SHOP;
    shopScreen.classList.add('active');
    shopCreditsEl.innerText = credits;
    renderShop();
    soundManager.playWaveComplete();
}

function renderShop() {
    upgradesContainer.innerHTML = '';

    upgradeDefinitions.forEach(upgrade => {
        const currentLevel = player.upgrades[upgrade.id];
        const cost = getUpgradeCost(upgrade, currentLevel);
        const canAfford = credits >= cost;
        const isMaxed = currentLevel >= upgrade.maxLevel;

        const card = document.createElement('div');
        card.className = 'upgrade-card';
        if (!canAfford && !isMaxed) card.classList.add('locked');
        if (isMaxed) card.classList.add('maxed');

        card.innerHTML = `
            <div class="upgrade-name">${upgrade.name}</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-level">Niveau: ${currentLevel}/${upgrade.maxLevel}</div>
            <div class="upgrade-level">${upgrade.effect(currentLevel)}</div>
            <div class="upgrade-cost ${canAfford ? '' : 'expensive'}">
                ${isMaxed ? 'MAX' : `${cost} Crédits`}
            </div>
        `;

        if (!isMaxed && canAfford) {
            card.addEventListener('click', () => purchaseUpgrade(upgrade));
        }

        upgradesContainer.appendChild(card);
    });
}

function purchaseUpgrade(upgrade) {
    const currentLevel = player.upgrades[upgrade.id];
    const cost = getUpgradeCost(upgrade, currentLevel);

    if (credits >= cost && currentLevel < upgrade.maxLevel) {
        credits -= cost;
        creditsEl.innerText = credits;
        shopCreditsEl.innerText = credits;
        player.applyUpgrade(upgrade.id);
        soundManager.playPurchase();
        renderShop();
    }
}

function continueToNextWave() {
    wave++;
    waveEl.innerText = wave;
    shopScreen.classList.remove('active');
    currentState = STATE.PLAYING;
    startWave();
}

function update() {
    if (currentState !== STATE.PLAYING) return;

    updateScreenShake();

    // Update power-ups
    if (activePowerUps.invincibility > 0) activePowerUps.invincibility--;
    if (activePowerUps.rapidfire > 0) activePowerUps.rapidfire--;

    // Dash cooldown
    if (dashCooldown > 0) {
        dashCooldown--;
        dashStatus.innerText = `${Math.ceil(dashCooldown / 60)}s`;
        dashIndicator.classList.add('cooldown');
    } else {
        dashStatus.innerText = 'READY';
        dashIndicator.classList.remove('cooldown');
    }

    if (input.keys['Space'] && dashCooldown === 0) {
        performDash();
    }

    player.update(input, canvas.width, canvas.height);

    // Shooting
    const fireRate = activePowerUps.rapidfire > 0 ? 2 : player.fireRateCooldown;
    if (input.mouse.down && player.currentCooldown === 0) {
        const angle = Math.atan2(input.mouse.y - player.y, input.mouse.x - player.x);
        const multishotCount = 1 + player.upgrades.multishot;
        const spreadAngle = 0.2;

        for (let i = 0; i < multishotCount; i++) {
            let bulletAngle = angle;
            if (multishotCount > 1) {
                bulletAngle = angle + (i - (multishotCount - 1) / 2) * spreadAngle;
            }
            projectiles.push(new Bullet(player.x, player.y, bulletAngle, player.bulletDamage));
        }

        player.currentCooldown = fireRate;
        soundManager.playShoot();
    }

    // Spawning
    if (enemies.length < enemiesThisWave && frames % (100 - Math.min(50, wave * 5)) === 0) {
        spawnEnemy();
    }

    // Combo timer
    if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer === 0) combo = 0;
    }

    // Projectiles
    projectiles.forEach(p => {
        p.update();
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            p.markedForDeletion = true;
        }
    });

    // Enemy bullets
    enemyBullets.forEach(b => {
        b.update();
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            b.markedForDeletion = true;
        }

        // Collision with player
        const dist = Math.hypot(player.x - b.x, player.y - b.y);
        if (dist < player.radius + b.radius) {
            if (activePowerUps.invincibility === 0) {
                const died = player.takeDamage(b.damage);
                healthBar.style.width = `${(player.health / player.maxHealth) * 100}%`;
                createExplosion(player.x, player.y, '#f00');
                soundManager.playHit();
                addScreenShake(10);
                if (died) endGame();
            }
            b.markedForDeletion = true;
        }
    });

    // Enemies
    enemies.forEach(enemy => {
        enemy.update();

        // Enemy shooting
        if (enemy.shouldShoot()) {
            const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemyBullets.push(new Bullet(enemy.x, enemy.y, angle, enemy.damage / 2, true));
        }

        // Player collision
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1) {
            if (activePowerUps.invincibility === 0) {
                const died = player.takeDamage(enemy.damage);
                healthBar.style.width = `${(player.health / player.maxHealth) * 100}%`;
                createExplosion(player.x, player.y, '#f00');
                enemy.markedForDeletion = true;
                soundManager.playHit();
                addScreenShake(10);
                if (died) endGame();
            }
        }

        // Bullet collision
        projectiles.forEach(projectile => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                enemy.health -= projectile.damage;
                damageNumbers.push(new DamageNumber(enemy.x, enemy.y, projectile.damage));
                createExplosion(enemy.x, enemy.y, enemy.color);
                projectile.markedForDeletion = true;
                addScreenShake(3);

                if (enemy.health <= 0) {
                    enemy.markedForDeletion = true;
                    const comboBonus = Math.floor(enemy.scoreValue * (1 + combo * 0.1));
                    score += comboBonus;
                    scoreEl.innerText = score;
                    enemiesKilledThisWave++;
                    combo++;
                    comboTimer = COMBO_TIMEOUT;
                    addScreenShake(5);

                    creditOrbs.push(new CreditOrb(enemy.x, enemy.y, enemy.creditValue));
                    spawnPowerUp(enemy.x, enemy.y);
                }
            }
        });
    });

    // Power-ups
    powerUps.forEach(powerUp => {
        powerUp.update();

        const dist = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);
        if (dist < player.radius + powerUp.radius + 20) {
            if (powerUp.type === 'invincibility') {
                activePowerUps.invincibility = 300;
            } else if (powerUp.type === 'rapidfire') {
                activePowerUps.rapidfire = 300;
            } else if (powerUp.type === 'nuke') {
                enemies.forEach(e => {
                    e.markedForDeletion = true;
                    score += e.scoreValue;
                    creditOrbs.push(new CreditOrb(e.x, e.y, e.creditValue));
                    createExplosion(e.x, e.y, e.color);
                });
                enemiesKilledThisWave = enemiesThisWave;
                addScreenShake(30);
            }
            powerUp.markedForDeletion = true;
            soundManager.playPowerup();
        }
    });

    // Credit Orbs
    creditOrbs.forEach(orb => {
        orb.update();

        const dist = Math.hypot(player.x - orb.x, player.y - orb.y);
        if (dist < player.radius + orb.radius + 20) {
            credits += orb.value;
            creditsEl.innerText = credits;
            orb.markedForDeletion = true;
            soundManager.playCollect();
        }
    });

    // Particles & Damage Numbers
    particles.forEach(particle => particle.update());
    damageNumbers.forEach(dn => dn.update());

    // Cleanup
    projectiles = projectiles.filter(p => !p.markedForDeletion);
    enemies = enemies.filter(e => !e.markedForDeletion);
    particles = particles.filter(p => !p.markedForDeletion);
    creditOrbs = creditOrbs.filter(o => !o.markedForDeletion);
    powerUps = powerUps.filter(p => !p.markedForDeletion);
    damageNumbers = damageNumbers.filter(d => !d.markedForDeletion);
    enemyBullets = enemyBullets.filter(b => !b.markedForDeletion);

    // Wave completion
    if (enemiesKilledThisWave >= enemiesThisWave && enemies.length === 0) {
        openShop();
    }

    frames++;
}

function drawBackground() {
    // Animated grid
    bgGrid.forEach(cell => {
        cell.pulse += 0.02;
        const alpha = (Math.sin(cell.pulse) + 1) * 0.05;

        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.x, cell.y, cell.size, cell.size);

        cell.y += cell.speed;
        if (cell.y > canvas.height) {
            cell.y = -cell.size;
            cell.x = Math.random() * canvas.width;
        }
    });
}

function draw() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (currentState === STATE.PLAYING || currentState === STATE.SHOP) {
        drawBackground();

        ctx.save();
        ctx.translate(screenShake.x, screenShake.y);

        const angle = Math.atan2(input.mouse.y - player.y, input.mouse.x - player.x);
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(angle);
        ctx.translate(-player.x, -player.y);
        player.draw(ctx);
        ctx.restore();

        projectiles.forEach(p => p.draw(ctx));
        enemyBullets.forEach(b => b.draw(ctx));
        enemies.forEach(e => e.draw(ctx));
        creditOrbs.forEach(o => o.draw(ctx));
        powerUps.forEach(p => p.draw(ctx));
        particles.forEach(p => p.draw(ctx));
        damageNumbers.forEach(d => d.draw(ctx));

        // Combo display
        if (combo > 1) {
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#ff0';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.strokeText(`COMBO x${combo}`, canvas.width / 2, 100);
            ctx.fillText(`COMBO x${combo}`, canvas.width / 2, 100);
        }

        // Power-up indicators
        let yOffset = 100;
        if (activePowerUps.invincibility > 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#0ff';
            ctx.fillText(`⚡ INVINCIBLE: ${Math.ceil(activePowerUps.invincibility / 60)}s`, canvas.width - 150, yOffset);
            yOffset += 25;
        }
        if (activePowerUps.rapidfire > 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#ff0';
            ctx.fillText(`⚡⚡ RAPID FIRE: ${Math.ceil(activePowerUps.rapidfire / 60)}s`, canvas.width - 150, yOffset);
        }

        ctx.restore();
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function endGame() {
    currentState = STATE.GAMEOVER;
    saveHighScore();
    finalScoreEl.innerText = score;
    document.getElementById('high-score').innerText = highScore;
    gameOverScreen.classList.add('active');
}

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
continueBtn.addEventListener('click', continueToNextWave);

loop();
