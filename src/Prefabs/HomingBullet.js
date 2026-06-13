class HomingBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target) {
        // Reuse the rocket bullet image, tinted orange and scaled up for the boss
        super(scene, x, y, "bullet");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(1);
        this.setTint(0xff4400);
        this.setScale(1.5);

        // Small hitbox so bullets don't clip on wall edges
        this.body.setSize(4, 4);
        this.body.setOffset(10, 10);

        // Store reference to the player so the bullet can track them
        this.target = target;
        this.lifespan = 1200; // Bullet disappears after 1.2 seconds
        this.speed = 110;
        this.tracking = true;
    }

    // Set initial position, velocity, and rotation
    fire(x, y, angle) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        const speed = this.speed;
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        this.rotation = angle + Math.PI / 2;
    }

    update(time, delta) {
        // Destroy the bullet when its lifespan runs out
        this.lifespan -= delta;
        if (this.lifespan <= 0) {
            this.destroy();
            return;
        }

        // Every frame, steer toward the player's current position
        if (this.tracking && this.target && this.target.active) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
            this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
            this.rotation = angle + Math.PI / 2;
        }
    }
}