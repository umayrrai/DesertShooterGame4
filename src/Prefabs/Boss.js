class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use the tank sprite scaled up 3x to represent the boss
        super(scene, x, y, "tank");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(1);
        this.setScale(3);

        // Small circular hitbox centered on the sprite
        this.body.setCircle(10, 2, 2);

        this.health = 35;
        this.speed = 30;
        this.shootCooldown = 0;
        this.shootInterval = 2000; // Fire every 2 seconds
    }

    update(player, enemyBullets) {
        if (!this.active) return;

        // Move directly toward the player
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );

        // Flip sprite to face the player
        if (player.x < this.x) this.setFlipX(true);
        else this.setFlipX(false);

        // Count down the shoot cooldown and fire two homing bullets when ready
        this.shootCooldown -= this.scene.game.loop.delta;
        if (this.shootCooldown <= 0) {
            const spread = 1.0;
            [-spread, spread].forEach(offset => {
                // Spawn each bullet slightly offset from the boss center
                const bullet = new HomingBullet(this.scene, this.x + offset * 10, this.y, player);
                enemyBullets.add(bullet);
                bullet.fire(this.x + offset * 10, this.y, angle + offset);
            });
            this.shootCooldown = this.shootInterval;
        }
    }

    // Reduce health by 1 and destroy the boss when it reaches 0
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}