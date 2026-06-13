class Shooter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use the fly enemy image for the shooter
        super(scene, x, y, "shooter");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(1);

        // Circular hitbox slightly offset to match the sprite
        this.body.setCircle(8, 4, 4);

        this.health = 2;
        this.speed = 40;
        this.shootCooldown = 0;
        this.shootInterval = 2000; // Fire every 2 seconds
        this.preferredDistance = 80; // Try to stay 80px away from the player
    }

    update(player, bulletGroup) {
        if (!this.active) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

        // Move away if too close to the player
        if (dist < this.preferredDistance) {
            this.setVelocity(
                -Math.cos(angle) * this.speed,
                -Math.sin(angle) * this.speed
            );
        } else if (dist > this.preferredDistance + 20) {
            // Move closer if too far from the player
            this.setVelocity(
                Math.cos(angle) * this.speed,
                Math.sin(angle) * this.speed
            );
        } else {
            // Hold position at preferred distance
            this.setVelocity(0, 0);
        }

        // Flip sprite to face the player
        if (player.x < this.x) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }

        // Count down the shoot cooldown and fire a bullet at the player when ready
        this.shootCooldown -= this.scene.game.loop.delta;
        if (this.shootCooldown <= 0) {
            const bullet = new EnemyBullet(this.scene, this.x, this.y);
            bulletGroup.add(bullet);
            bullet.fire(this.x, this.y, angle);
            this.shootCooldown = this.shootInterval;
        }
    }

    // Reduce health by 1 and destroy when it reaches 0
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}